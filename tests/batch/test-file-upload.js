const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const helpers = require('./test-helpers');
const config = require('./test-config');

// Configuration
const API_BASE_URL = config.api.baseUrl;
const JWT_TOKEN = process.env.JWT_TOKEN || helpers.generateToken(config.testData.adminStaff);

console.log('Using JWT token:', JWT_TOKEN);

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const responseData = await response.json();
  
  return {
    status: response.status,
    data: responseData
  };
}

// Function to upload a file using a presigned URL
async function uploadFileWithPresignedUrl(presignedUrl, filePath, contentType) {
  const fileContent = fs.readFileSync(filePath);
  
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType
    },
    body: fileContent
  });
  
  return {
    status: response.status,
    success: response.status >= 200 && response.status < 300
  };
}

// Main test function
async function runTests() {
  console.log('Running File Upload Tests...');
  
  try {
    // Test 1: Get presigned URL for file upload
    console.log('\nTest 1: Get presigned URL for file upload');
    const presignedUrlResponse = await makeRequest('/uploads/presigned-url', 'POST', {
      fileType: 'image/png',
      fileName: 'test-signature.png',
      contentType: 'image/png',
      orderId: config.testData.testOrderId, // Using order ID 4 from test-config.js
      documentType: 'signature'
    });
    console.log('Response:', JSON.stringify(presignedUrlResponse, null, 2));
    
    if (presignedUrlResponse.status === 200 && presignedUrlResponse.data.success) {
      console.log('✅ Test passed: Successfully generated presigned URL');
      
      // Extract the correct field names from the response
      const presignedUrl = presignedUrlResponse.data.uploadUrl;
      const filePath = presignedUrlResponse.data.fileKey;
      
      console.log('Using presigned URL:', presignedUrl.substring(0, 60) + '...');
      
      
      // Create a test file
      const testFilePath = path.join(__dirname, 'test-signature.png');
      // Create a simple 1x1 pixel PNG
      const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(testFilePath, pngData);
      
      // Test 2: Upload file using presigned URL
      console.log('\nTest 2: Upload file using presigned URL');
      const uploadResponse = await uploadFileWithPresignedUrl(presignedUrl, testFilePath, 'image/png');
      
      console.log('Upload response status:', uploadResponse.status);
      
      if (uploadResponse.success) {
        console.log('✅ Test passed: Successfully uploaded file to S3');
        
        // Test 3: Confirm upload
        console.log('\nTest 3: Confirm upload');
        const confirmResponse = await makeRequest('/uploads/confirm', 'POST', {
          fileKey: filePath,
          orderId: config.testData.testOrderId, // Using order ID 4 from test-config.js
          patientId: 1, // Using patient ID 1 from test-order-finalization.js
          documentType: 'signature',
          fileName: 'test-signature.png',
          fileSize: pngData.length,
          contentType: 'image/png',
          userId: config.testData.adminStaff.userId
        });
        
        console.log('Response:', JSON.stringify(confirmResponse, null, 2));
        
        if (confirmResponse.status === 200 && confirmResponse.data.success) {
          console.log('✅ Test passed: Successfully confirmed upload');
          console.log('Document ID:', confirmResponse.data.documentId);
        } else {
          console.log('❌ Test failed: Could not confirm upload');
        }
        
        // Clean up test file
        fs.unlinkSync(testFilePath);
      } else {
        console.log('❌ Test failed: Could not upload file to S3');
      }
    } else {
      console.log('❌ Test failed: Could not generate presigned URL');
    }
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();
