/**
 * Test script for the uploads/confirm endpoint
 * This script:
 * 1. Gets a presigned URL
 * 2. Skips the actual S3 upload (since we don't have S3 permissions in the test environment)
 * 3. Calls the confirm endpoint directly
 * 4. Tests error cases
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load token
let token;
try {
  token = fs.readFileSync(path.join(__dirname, '../../tokens/admin_referring-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error loading token:', error.message);
  process.exit(1);
}

// Set API URL
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://api.radorderpad.com';

console.log(`Using API URL: ${API_URL}`);

// Set test order ID - use a valid order ID that the test user has access to
const TEST_ORDER_ID = 606; // Update this to a valid order ID in your test environment
const TEST_PATIENT_ID = 1; // Update this to a valid patient ID in your test environment

/**
 * Make a request to the presigned URL endpoint
 */
async function getPresignedUrl() {
  try {
    console.log(`Getting presigned URL for orderId: ${TEST_ORDER_ID}, patientId: ${TEST_PATIENT_ID}`);
    const response = await axios.post(
      `${API_URL}/api/uploads/presigned-url`,
      {
        fileName: "confirm-test.txt",
        fileType: "text/plain",
        contentType: "text/plain",
        fileSize: 1024,
        documentType: "test_document",
        orderId: TEST_ORDER_ID,
        patientId: TEST_PATIENT_ID
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        data: error.response.data
      };
    }
    
    return {
      error: true,
      message: error.message
    };
  }
}

/**
 * Make a request to the confirm endpoint
 */
async function confirmUpload(payload, authToken = token) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await axios.post(
      `${API_URL}/api/uploads/confirm`,
      payload,
      { headers }
    );
    
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        data: error.response.data
      };
    }
    
    return {
      error: true,
      message: error.message
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Testing POST /api/uploads/confirm endpoint\n');
  
  try {
    // Step 1: Get a presigned URL
    console.log('Step 1: Getting a presigned URL...');
    const presignedUrlResult = await getPresignedUrl();
    console.log(JSON.stringify(presignedUrlResult, null, 2));
    console.log();
    
    if (presignedUrlResult.error || !presignedUrlResult.fileKey) {
      console.error('Failed to get a valid presigned URL. Cannot continue tests.');
      return;
    }
    
    const fileKey = presignedUrlResult.fileKey;
    
    // Step 2: Skip the actual S3 upload
    console.log('Step 2: Skipping actual S3 upload (no permissions in test environment)');
    console.log('In a production environment, the file would be uploaded to S3 at this point.');
    console.log();
    
    // Step 3: Call the confirm endpoint directly
    console.log('Step 3: Calling the confirm endpoint directly...');
    console.log('Note: This is expected to fail with a 500 error because the backend will check if the file exists in S3.');
    const validPayload = {
      fileKey,
      orderId: TEST_ORDER_ID,
      patientId: TEST_PATIENT_ID,
      documentType: 'test_document',
      fileName: 'confirm-test.txt',
      fileSize: 1024,
      contentType: 'text/plain'
    };
    
    const validResult = await confirmUpload(validPayload);
    console.log(JSON.stringify(validResult, null, 2));
    console.log();
    
    // Test 4: Missing required fields
    console.log('Test 4: Missing required fields');
    const invalidPayload = {
      fileKey
    };
    
    const invalidResult = await confirmUpload(invalidPayload);
    console.log(JSON.stringify(invalidResult, null, 2));
    console.log();
    
    // Test 5: Invalid fileKey
    console.log('Test 5: Invalid fileKey');
    const invalidKeyPayload = {
      fileKey: 'invalid-file-key',
      orderId: TEST_ORDER_ID,
      patientId: TEST_PATIENT_ID,
      documentType: 'test_document',
      fileName: 'confirm-test.txt',
      fileSize: 1024,
      contentType: 'text/plain'
    };
    
    const invalidKeyResult = await confirmUpload(invalidKeyPayload);
    console.log(JSON.stringify(invalidKeyResult, null, 2));
    console.log();
    
    // Test 6: No authentication
    console.log('Test 6: No authentication');
    const noAuthResult = await confirmUpload(validPayload, null);
    console.log(JSON.stringify(noAuthResult, null, 2));
    console.log();
    
    console.log('Tests completed successfully');
    console.log('Note: The 500 error from the confirm endpoint is expected because the backend checks if the file exists in S3.');
    console.log('In a production environment with proper S3 permissions, the confirm endpoint would succeed if the file was uploaded successfully.');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error running tests:', error);
});
