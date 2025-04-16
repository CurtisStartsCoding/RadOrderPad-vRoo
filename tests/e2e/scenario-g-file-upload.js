/**
 * Scenario G: File Upload
 * 
 * This test scenario covers:
 * 1. Register Organization and Admin
 * 2. Login as Admin
 * 3. Call /uploads/presigned-url to get an S3 upload URL
 * 4. Use external tool to upload file to S3 (simulated)
 * 5. Call /uploads/confirm to confirm the upload
 * 6. Verify document_uploads record
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');

// Scenario name for logging
const SCENARIO = 'Scenario-G';

// Test data
const testData = {
  organization: {
    orgName: 'Test Practice G',
    orgType: 'referring',
    admin: {
      firstName: 'William',
      lastName: 'Garcia',
      email: 'admin-g@example.com',
      password: 'Password123!'
    }
  },
  file: {
    name: 'test-document.pdf',
    type: 'application/pdf',
    category: 'patient_record',
    description: 'Test patient record document'
  }
};

// Create a test file
function createTestFile() {
  const testFilePath = path.join(helpers.config.resultsDir, testData.file.name);
  const content = 'This is a test PDF file content';
  fs.writeFileSync(testFilePath, content);
  return testFilePath;
}

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Step 1: Register Organization and Admin
    helpers.log('Step 1: Register Organization and Admin', SCENARIO);
    const registerResponse = await helpers.registerOrganization(
      testData.organization.orgName,
      testData.organization.orgType,
      testData.organization.admin.firstName,
      testData.organization.admin.lastName,
      testData.organization.admin.email,
      testData.organization.admin.password
    );
    
    // Store organization and admin data
    const orgId = helpers.storeTestData('orgId', registerResponse.organization.id, SCENARIO);
    const adminId = helpers.storeTestData('adminId', registerResponse.user.id, SCENARIO);
    helpers.log(`Organization created with ID: ${orgId}`, SCENARIO);
    helpers.log(`Admin user created with ID: ${adminId}`, SCENARIO);
    
    // Step 2: Login as Admin
    helpers.log('Step 2: Login as Admin', SCENARIO);
    const adminToken = await helpers.login(
      testData.organization.admin.email,
      testData.organization.admin.password
    );
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    
    // Step 3: Call /uploads/presigned-url to get an S3 upload URL
    helpers.log('Step 3: Get Presigned URL for File Upload', SCENARIO);
    const presignedUrlResponse = await helpers.apiRequest(
      'post',
      '/uploads/presigned-url',
      {
        fileName: testData.file.name,
        fileType: testData.file.type,
        category: testData.file.category
      },
      adminToken
    );
    
    // Verify presigned URL was generated
    if (!presignedUrlResponse.uploadUrl) {
      throw new Error('Failed to get presigned URL');
    }
    
    const uploadUrl = presignedUrlResponse.uploadUrl;
    const fileKey = presignedUrlResponse.fileKey;
    helpers.storeTestData('uploadUrl', uploadUrl, SCENARIO);
    helpers.storeTestData('fileKey', fileKey, SCENARIO);
    helpers.log(`Got presigned URL: ${uploadUrl}`, SCENARIO);
    helpers.log(`File key: ${fileKey}`, SCENARIO);
    
    // Step 4: Use external tool to upload file to S3 (simulated)
    helpers.log('Step 4: Upload File to S3', SCENARIO);
    
    // Create a test file
    const testFilePath = createTestFile();
    helpers.log(`Created test file: ${testFilePath}`, SCENARIO);
    
    // In a real test, we would use axios to upload the file to the presigned URL
    // For this test, we'll simulate the upload
    
    // Simulated upload success
    helpers.log('File upload to S3 simulated (success)', SCENARIO);
    
    // Step 5: Call /uploads/confirm to confirm the upload
    helpers.log('Step 5: Confirm File Upload', SCENARIO);
    const confirmResponse = await helpers.apiRequest(
      'post',
      '/uploads/confirm',
      {
        fileKey,
        fileName: testData.file.name,
        fileType: testData.file.type,
        category: testData.file.category,
        description: testData.file.description
      },
      adminToken
    );
    
    // Verify confirmation was successful
    if (!confirmResponse.success) {
      throw new Error('Upload confirmation failed');
    }
    
    const documentId = confirmResponse.documentId;
    helpers.storeTestData('documentId', documentId, SCENARIO);
    helpers.log(`Upload confirmed with document ID: ${documentId}`, SCENARIO);
    
    // Step 6: Verify document_uploads record
    helpers.log('Step 6: Verify Document Upload Record', SCENARIO);
    
    // Get document details
    const documentResponse = await helpers.apiRequest(
      'get',
      `/uploads/${documentId}`,
      null,
      adminToken
    );
    
    // Verify document details
    if (documentResponse.id !== documentId) {
      throw new Error('Document ID mismatch');
    }
    
    if (documentResponse.fileName !== testData.file.name) {
      throw new Error('File name mismatch');
    }
    
    if (documentResponse.fileType !== testData.file.type) {
      throw new Error('File type mismatch');
    }
    
    if (documentResponse.category !== testData.file.category) {
      throw new Error('Category mismatch');
    }
    
    if (documentResponse.description !== testData.file.description) {
      throw new Error('Description mismatch');
    }
    
    if (documentResponse.uploadedBy !== adminId) {
      throw new Error('Uploaded by user ID mismatch');
    }
    
    if (documentResponse.organizationId !== orgId) {
      throw new Error('Organization ID mismatch');
    }
    
    if (!documentResponse.fileUrl) {
      throw new Error('File URL is missing');
    }
    
    helpers.log('Document upload record verified successfully', SCENARIO);
    
    // Step 7: Verify document appears in organization uploads list
    helpers.log('Step 7: Verify Document in Organization Uploads List', SCENARIO);
    
    // Get organization uploads
    const uploadsResponse = await helpers.apiRequest(
      'get',
      '/uploads',
      null,
      adminToken
    );
    
    // Find the document in the list
    const documentInList = uploadsResponse.documents.some(d => d.id === documentId);
    if (!documentInList) {
      throw new Error(`Document ${documentId} not found in organization uploads list`);
    }
    
    helpers.log('Document found in organization uploads list', SCENARIO);
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    helpers.log(`Deleted test file: ${testFilePath}`, SCENARIO);
    
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    throw error;
  }
}

// Run the test
runTest().catch(error => {
  helpers.log(`Test failed: ${error.message}`, SCENARIO);
  process.exit(1);
});