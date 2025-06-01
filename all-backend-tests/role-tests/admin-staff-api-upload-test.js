/**
 * Admin Staff API-based File Upload Test
 * 
 * This test focuses on the file upload functionality for the Admin Staff role
 * using the API approach rather than direct S3 access.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const ADMIN_STAFF_TOKEN = process.env.ADMIN_STAFF_TOKEN;

// Test data
const TEST_ORDER_ID = 912; // Use the order ID from our previous tests
const TEST_FILE_NAME = 'test-document.txt';
const TEST_FILE_CONTENT = 'This is a test document for file upload testing.';
const TEST_FILE_TYPE = 'text/plain';

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} data - Request body
 * @returns {Promise<Object>} Response data
 */
async function makeApiRequest(endpoint, method = 'GET', data = null) {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(chalk.blue(`Making ${method} request to: ${url}`));
    
    const options = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_STAFF_TOKEN}`
      },
      timeout: 30000
    };
    
    if (data) {
      options.data = data;
    }
    
    const response = await axios(options);
    
    console.log(chalk.green(`Response status: ${response.status}`));
    return {
      status: response.status,
      data: response.data,
      success: true
    };
  } catch (error) {
    console.log(chalk.red(`Error making API request: ${error.message}`));
    return {
      status: error.response?.status,
      data: error.response?.data,
      success: false,
      error: error.message
    };
  }
}

/**
 * Upload a file using a presigned URL
 * @param {string} presignedUrl - Presigned URL for upload
 * @param {string} filePath - Path to the file to upload
 * @param {string} contentType - Content type of the file
 * @returns {Promise<boolean>} Success status
 */
async function uploadWithPresignedUrl(presignedUrl, filePath, contentType) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Parse the URL to extract query parameters
    const url = new URL(presignedUrl);
    console.log(chalk.blue(`Uploading to: ${url.hostname}${url.pathname}`));
    
    // Set up additional headers that might be needed
    const headers = {
      'Content-Type': contentType,
      'Content-Length': fileContent.length.toString(),
      'x-amz-acl': 'private'
    };
    
    // Add any x-amz headers from the presigned URL query parameters
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith('x-amz-')) {
        headers[key] = value;
      }
    }
    
    console.log(chalk.blue('Using headers:'), headers);
    
    // Increase timeout to 60 seconds
    const timeout = 60000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(chalk.blue('Sending request...'));
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: headers,
        body: fileContent,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(chalk.blue(`Upload response status: ${response.status}`));
      return response.status >= 200 && response.status < 300;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.log(chalk.yellow('⚠️ Upload request timed out after 60 seconds'));
      } else if (fetchError.code === 'ECONNRESET') {
        console.log(chalk.yellow('⚠️ Connection reset during upload (ECONNRESET)'));
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.log(chalk.red(`Error uploading with presigned URL: ${error.message}`));
    
    // Log more detailed error information
    if (error.code) {
      console.log(chalk.red(`Error code: ${error.code}`));
    }
    if (error.errno) {
      console.log(chalk.red(`Error number: ${error.errno}`));
    }
    if (error.syscall) {
      console.log(chalk.red(`System call: ${error.syscall}`));
    }
    
    // No fallback - presigned URL upload must work
    return false;
  }
}

/**
 * Create a test file
 * @param {string} fileName - Name of the file to create
 * @param {string} content - Content of the file
 * @returns {string} Path to the created file
 */
function createTestFile(fileName, content) {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content);
  console.log(chalk.blue(`Test file created at: ${filePath}`));
  return filePath;
}

/**
 * Delete a test file
 * @param {string} filePath - Path to the file to delete
 */
function deleteTestFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(chalk.blue(`Test file deleted: ${filePath}`));
  }
}

/**
 * Run the file upload test
 */
async function testFileUpload() {
  console.log(chalk.bold('=== Admin Staff API-based File Upload Test ==='));
  
  // Check if token is available
  if (!ADMIN_STAFF_TOKEN) {
    console.log(chalk.red('Admin Staff token not found. Please set the ADMIN_STAFF_TOKEN environment variable.'));
    console.log('You can generate a token using the generate-all-role-tokens.js script.');
    return;
  }
  
  try {
    // Create a test file
    const filePath = createTestFile(TEST_FILE_NAME, TEST_FILE_CONTENT);
    
    // Step 1: Get presigned URL from API
    console.log(chalk.blue('\nStep 1: Get presigned URL from API'));
    const presignedUrlResponse = await makeApiRequest('/api/uploads/presigned-url', 'POST', {
      fileType: TEST_FILE_TYPE,
      fileName: TEST_FILE_NAME,
      contentType: TEST_FILE_TYPE,
      orderId: TEST_ORDER_ID,
      documentType: 'supplemental'
    });
    
    if (presignedUrlResponse.success && presignedUrlResponse.data.success) {
      console.log(chalk.green('✅ Successfully obtained presigned URL from API'));
      
      // Extract the presigned URL and file key
      const presignedUrl = presignedUrlResponse.data.uploadUrl;
      const fileKey = presignedUrlResponse.data.fileKey;
      
      console.log('Presigned URL:', presignedUrl.substring(0, 100) + '...');
      console.log('File Key:', fileKey);
      
      // Step 2: Upload file using presigned URL
      console.log(chalk.blue('\nStep 2: Upload file using presigned URL'));
      const uploadSuccess = await uploadWithPresignedUrl(presignedUrl, filePath, TEST_FILE_TYPE);
      
      if (uploadSuccess) {
        console.log(chalk.green('✅ Successfully uploaded file using presigned URL'));
        
        // Step 3: Confirm upload with API
        console.log(chalk.blue('\nStep 3: Confirm upload with API'));
        const confirmResponse = await makeApiRequest('/api/uploads/confirm', 'POST', {
          fileKey: fileKey,
          orderId: TEST_ORDER_ID,
          documentType: 'supplemental',
          fileName: TEST_FILE_NAME,
          fileSize: fs.statSync(filePath).size,
          contentType: TEST_FILE_TYPE
        });
        
        if (confirmResponse.success && confirmResponse.data.success) {
          console.log(chalk.green('✅ Successfully confirmed upload with API'));
          console.log('Document ID:', confirmResponse.data.documentId);
        } else {
          console.log(chalk.red('❌ Failed to confirm upload with API'));
          console.log('Response:', JSON.stringify(confirmResponse.data, null, 2));
        }
      } else {
        console.log(chalk.red('❌ Failed to upload file using presigned URL'));
        console.log(chalk.yellow('⚠️ This may indicate an issue with the presigned URL or S3 permissions'));
      }
    } else {
      console.log(chalk.red('❌ Failed to obtain presigned URL from API'));
      console.log('Response:', JSON.stringify(presignedUrlResponse.data, null, 2));
      
      // Check for specific error messages
      if (presignedUrlResponse.data && presignedUrlResponse.data.message) {
        if (presignedUrlResponse.data.message.includes('AWS credentials')) {
          console.log(chalk.yellow('⚠️ The API server is missing AWS credentials or has insufficient permissions'));
        } else if (presignedUrlResponse.data.message.includes('bucket')) {
          console.log(chalk.yellow('⚠️ The API server is missing the S3 bucket configuration'));
          console.log(chalk.yellow('⚠️ Make sure S3_BUCKET_NAME is set in the .env.production file'));
        }
      }
    }
    
    // Clean up test file
    deleteTestFile(filePath);
    
    console.log(chalk.bold('\n=== Admin Staff API-based File Upload Test Complete ==='));
  } catch (error) {
    console.log(chalk.red(`Unexpected error: ${error.message}`));
    console.log(error.stack);
  }
}

// Run the test
testFileUpload();