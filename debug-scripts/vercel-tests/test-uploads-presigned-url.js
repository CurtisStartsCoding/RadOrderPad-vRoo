/**
 * Test script for the uploads/presigned-url endpoint
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Load token
let token;
try {
  token = fs.readFileSync(path.join(__dirname, '../../tokens/admin_referring-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error loading token:', error.message);
  process.exit(1);
}

// Set API URL
const API_URL = 'https://api.radorderpad.com';

console.log(`Using API URL: ${API_URL}`);

/**
 * Make a request to the presigned URL endpoint
 */
async function testPresignedUrl(payload, authToken = token) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await axios.post(
      `${API_URL}/api/uploads/presigned-url`,
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
 * Upload a file using the presigned URL
 */
async function uploadFileWithPresignedUrl(presignedUrl, filePath, contentType) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const response = await axios.put(presignedUrl, fileContent, {
      headers: {
        'Content-Type': contentType
      }
    });
    
    return {
      success: true,
      status: response.status,
      statusText: response.statusText
    };
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
  console.log('Testing POST /api/uploads/presigned-url endpoint\n');
  
  // Test 1: Valid request with all required fields
  console.log('Test 1: Valid request with all required fields');
  const validPayload = {
    fileName: 'test-document.pdf',
    fileType: 'application/pdf',
    contentType: 'application/pdf',
    fileSize: 1048576, // 1MB
    documentType: 'test'
  };
  
  const validResult = await testPresignedUrl(validPayload);
  console.log(JSON.stringify(validResult, null, 2));
  console.log();
  
  // Test 2: Missing required fields
  console.log('Test 2: Missing required fields');
  const invalidPayload = {
    fileName: 'test-document.pdf'
  };
  
  const invalidResult = await testPresignedUrl(invalidPayload);
  console.log(JSON.stringify(invalidResult, null, 2));
  console.log();
  
  // Test 3: Invalid file type
  console.log('Test 3: Invalid file type');
  const invalidTypePayload = {
    fileName: 'test-document.exe',
    fileType: 'application/octet-stream',
    contentType: 'application/octet-stream',
    fileSize: 1048576
  };
  
  const invalidTypeResult = await testPresignedUrl(invalidTypePayload);
  console.log(JSON.stringify(invalidTypeResult, null, 2));
  console.log();
  
  // Test 4: File size too large
  console.log('Test 4: File size too large');
  const largeSizePayload = {
    fileName: 'large-image.jpg',
    fileType: 'image/jpeg',
    contentType: 'image/jpeg',
    fileSize: 10485760 // 10MB
  };
  
  const largeSizeResult = await testPresignedUrl(largeSizePayload);
  console.log(JSON.stringify(largeSizeResult, null, 2));
  console.log();
  
  // Test 5: No authentication
  console.log('Test 5: No authentication');
  const noAuthResult = await testPresignedUrl(validPayload, null);
  console.log(JSON.stringify(noAuthResult, null, 2));
  console.log();
  
  // Test 6: Upload a file using the presigned URL (if Test 1 succeeded)
  if (validResult.success && validResult.uploadUrl) {
    console.log('Test 6: Upload a file using the presigned URL');
    
    // Create a temporary test file
    const testFilePath = path.join(__dirname, 'temp-test-file.pdf');
    fs.writeFileSync(testFilePath, 'This is a test PDF file content');
    
    try {
      const uploadResult = await uploadFileWithPresignedUrl(
        validResult.uploadUrl,
        testFilePath,
        'application/pdf'
      );
      
      console.log(JSON.stringify(uploadResult, null, 2));
      
      if (uploadResult.success) {
        console.log(`\nFile successfully uploaded to S3 with key: ${validResult.fileKey}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      // Clean up the temporary file
      fs.unlinkSync(testFilePath);
    }
  } else {
    console.log('Skipping Test 6: Could not get a valid presigned URL from Test 1');
  }
  
  console.log('\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});