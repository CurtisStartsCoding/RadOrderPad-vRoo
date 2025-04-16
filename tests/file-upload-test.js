const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const JWT_TOKEN = process.env.JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDY3MzE5MywiZXhwIjoxNzQ0NzU5NTkzfQ.bkBAUApAhSS0t2vRiYY2ZXlKdmaPRqCIsSO_HokX84Y';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json',
      'x-test-mode': 'true'  // Add this header to indicate test mode
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
      orderId: 1,
      documentType: 'signature'
    });
    
    console.log('Response:', JSON.stringify(presignedUrlResponse, null, 2));
    
    if (presignedUrlResponse.status === 200 && presignedUrlResponse.data.success) {
      console.log('✅ Test passed: Successfully generated presigned URL');
      
      const { uploadUrl: presignedUrl, fileKey: filePath } = presignedUrlResponse.data;
      
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
          orderId: 1,
          patientId: 1,
          documentType: 'signature',
          fileName: 'test-signature.png',
          fileSize: pngData.length,
          contentType: 'image/png'
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