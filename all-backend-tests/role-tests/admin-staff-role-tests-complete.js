/**
 * Complete Test Suite for Admin Staff with Full File Upload
 * This version includes actual S3 file upload
 */

const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

// Base URL for API requests
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Test data
const testAdminStaff = {
  email: process.env.ADMIN_STAFF_EMAIL || 'test.admin_staff@example.com',
  password: process.env.ADMIN_STAFF_PASSWORD || 'password123',
  firstName: 'Admin',
  lastName: 'Staff'
};

// Sample patient data
const testPatientInfo = {
  first_name: "John",
  last_name: "Smith",
  date_of_birth: "1975-01-15",
  gender: "male",
  address_line1: "123 Main Street, Apt 4B",
  city: "Boston",
  state: "MA",
  zip_code: "02115",
  phone_number: "(617) 555-1234",
  email: "john.smith@example.com"
};

// Sample insurance data
const testInsuranceInfo = {
  insurerName: "Blue Cross Blue Shield",
  policyNumber: "XYZ123456789",
  groupNumber: "BCBS-GROUP-12345",
  policyHolderName: "John Smith",
  policyHolderRelationship: "self"
};

// Sample supplemental text
const testSupplementalText = `
SUPPLEMENTAL INFORMATION
-----------------------
Prior Imaging: MRI of lumbar spine performed 6 months ago showed mild disc bulging at L4-L5.
Relevant Lab Results: CBC and CMP within normal limits.
Additional Clinical Notes: Patient reports worsening pain with physical activity.
`;

console.log('Using admin staff email:', testAdminStaff.email);

// Test the admin staff login endpoint
async function testAdminStaffLogin() {
  console.log(chalk.blue('Testing admin staff login endpoint...'));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      {
        email: testAdminStaff.email,
        password: testAdminStaff.password
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    console.log(chalk.green('Admin staff logged in successfully'));
    console.log('Response status:', response.status);
    console.log('Token received:', !!response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.log(chalk.red('Error logging in admin staff:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Test admin order queue retrieval
async function testAdminOrderQueue(token) {
  console.log(chalk.blue('Testing admin order queue retrieval...'));
  
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/orders/queue`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Admin order queue retrieved successfully'));
    console.log('Response status:', response.status);
    console.log('Number of orders:', response.data.orders ? response.data.orders.length : 0);
    
    if (response.data.orders && response.data.orders.length > 0) {
      console.log('First order in queue:');
      console.log('- Order ID:', response.data.orders[0].id);
      console.log('- Status:', response.data.orders[0].status);
      console.log('- Created At:', response.data.orders[0].created_at);
      
      return response.data.orders[0].id;
    } else {
      console.log('No orders found in the queue');
      return null;
    }
  } catch (error) {
    console.log(chalk.red('Error retrieving admin order queue:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return null;
  }
}

// Complete document upload test with actual S3 upload
async function testCompleteDocumentUpload(token, orderId) {
  console.log(chalk.blue(`Testing COMPLETE document upload for order ${orderId}...`));
  
  try {
    // Create a test file content
    const testFileContent = `Test Document for Order ${orderId}\n\nThis is a test supplemental document.\nCreated at: ${new Date().toISOString()}\n\nPatient supplemental information:\n${testSupplementalText}`;
    
    // Step 1: Get presigned URL
    console.log('Step 1: Getting presigned URL...');
    const presignedResponse = await axios.post(
      `${API_URL}/api/uploads/presigned-url`,
      {
        fileName: "test-document.txt",
        contentType: "text/plain",
        fileType: "supplemental",
        orderId: orderId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!presignedResponse.data.uploadUrl || !presignedResponse.data.fileKey) {
      console.log(chalk.red('Failed to get presigned URL'));
      return false;
    }
    
    console.log(chalk.green('Presigned URL obtained successfully'));
    console.log('File Key:', presignedResponse.data.fileKey);
    
    // Step 2: Actually upload to S3
    console.log('Step 2: Uploading file to S3...');
    console.log('Upload URL structure:', presignedResponse.data.uploadUrl.split('?')[0]);
    
    try {
      // Try with minimal headers that match what was requested
      const uploadResponse = await axios.put(
        presignedResponse.data.uploadUrl,
        testFileContent,
        {
          headers: {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(testFileContent).toString()
          },
          maxRedirects: 0 // Prevent redirects
        }
      );
      
      console.log(chalk.green('File uploaded to S3 successfully'));
      console.log('S3 Response status:', uploadResponse.status);
    } catch (s3Error) {
      console.log(chalk.red('Error uploading to S3:'));
      console.log('Status:', s3Error.response?.status);
      console.log('Status Text:', s3Error.response?.statusText);
      console.log('Headers:', s3Error.response?.headers);
      console.log('Error Data:', s3Error.response?.data);
      console.log('Error:', s3Error.message);
      
      // Try alternative: Skip S3 upload and just test the confirm endpoint
      console.log(chalk.yellow('\nNote: S3 upload failed with 403. This might be due to:'));
      console.log('- CORS restrictions when calling from Node.js');
      console.log('- Presigned URL expecting browser-based upload');
      console.log('- Additional security headers required');
      return false;
    }
    
    // Step 3: Confirm upload
    console.log('Step 3: Confirming upload...');
    const confirmResponse = await axios.post(
      `${API_URL}/api/uploads/confirm`,
      {
        fileKey: presignedResponse.data.fileKey,
        fileName: "test-document.txt",
        fileSize: Buffer.byteLength(testFileContent),
        fileType: "text/plain",
        orderId: orderId,
        documentType: "supplemental"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Document upload confirmed successfully'));
    console.log('Response status:', confirmResponse.status);
    console.log('Success:', confirmResponse.data.success);
    console.log('Document ID:', confirmResponse.data.documentId);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error in document upload process:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test patient information update
async function testUpdatePatientInfo(token, orderId) {
  console.log(chalk.blue(`Testing patient information update for order ${orderId}...`));
  
  try {
    const response = await axios.put(
      `${API_URL}/api/admin/orders/${orderId}/patient-info`,
      testPatientInfo,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Patient information updated successfully'));
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error updating patient information:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Test sending order to radiology
async function testSendToRadiology(token, orderId, radiologyOrgId) {
  console.log(chalk.blue(`Testing sending order ${orderId} to radiology organization ${radiologyOrgId}...`));
  
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/orders/${orderId}/send-to-radiology-fixed`,
      {
        radiologyOrganizationId: radiologyOrgId
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(chalk.green('Order sent to radiology successfully'));
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Remaining Credits:', response.data.remainingCredits);
    
    return true;
  } catch (error) {
    console.log(chalk.red('Error sending order to radiology:'));
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
}

// Main function to run all tests
async function runAllTests() {
  console.log(chalk.bold('=== Admin Staff Complete Test Suite (with File Upload) ==='));
  console.log(`API URL: ${API_URL}`);
  
  try {
    // Step 1: Login
    const token = await testAdminStaffLogin();
    if (!token) {
      console.log(chalk.red('Login failed. Cannot proceed with tests.'));
      return;
    }
    
    // Step 2: Get admin order queue
    const orderId = await testAdminOrderQueue(token);
    if (!orderId) {
      console.log(chalk.red('No orders in queue. Cannot proceed with order-specific tests.'));
      return;
    }
    
    // Step 3: Update patient information (required for send to radiology)
    console.log(chalk.bold('\n=== Updating Patient Information ==='));
    await testUpdatePatientInfo(token, orderId);
    
    // Step 4: Test COMPLETE document upload with actual S3 upload
    console.log(chalk.bold('\n=== Testing Complete File Upload Workflow ==='));
    const uploadSuccess = await testCompleteDocumentUpload(token, orderId);
    
    if (uploadSuccess) {
      console.log(chalk.green('\n✅ Complete file upload test PASSED!'));
      console.log('The file was successfully:');
      console.log('1. Uploaded to S3 using presigned URL');
      console.log('2. Confirmed in the database');
      console.log('3. Associated with the order');
    } else {
      console.log(chalk.red('\n❌ Complete file upload test FAILED'));
    }
    
    // Step 5: Send to radiology (using hardcoded ID since admin staff can't list connections)
    console.log(chalk.bold('\n=== Sending Order to Radiology ==='));
    const radiologyOrgId = 2;
    await testSendToRadiology(token, orderId, radiologyOrgId);
    
    console.log(chalk.bold('\n=== Admin Staff Complete Test Suite Finished ==='));
  } catch (error) {
    console.error(chalk.red('Unexpected error during test execution:'));
    console.error(error);
  }
}

// Run all tests
runAllTests();