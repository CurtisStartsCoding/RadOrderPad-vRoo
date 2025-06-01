/**
 * Diagnostic Test: API-based File Upload
 * 
 * This test uses the RadOrderPad API to handle file uploads
 * It tests the following operations:
 * 1. Get a presigned URL from the API
 * 2. Upload a file using the presigned URL
 * 3. Confirm the upload with the API
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const helpers = require('./helpers');
const config = require('./config');

// Main test function
async function runTests() {
  console.log(chalk.bold('=== Diagnostic Test: API-based File Upload ==='));
  
  try {
    // Generate a JWT token for admin_staff user
    const token = helpers.generateToken(config.testData.adminStaff);
    console.log(chalk.blue('Generated JWT token for admin_staff user'));
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
    
    // Create a test file
    const fileName = config.testFile.name;
    const filePath = helpers.createTestFile(fileName, config.testFile.content);
    
    // Test 1: Get presigned URL from API
    console.log(chalk.blue('\nTest 1: Get presigned URL from API'));
    const presignedUrlResponse = await helpers.makeApiRequest('/uploads/presigned-url', 'POST', {
      fileType: config.testFile.contentType,
      fileName: fileName,
      contentType: config.testFile.contentType,
      orderId: config.testData.testOrderId,
      documentType: 'supplemental'
    }, token);
    
    if (presignedUrlResponse.success && presignedUrlResponse.data.success) {
      console.log(chalk.green('✅ Successfully obtained presigned URL from API'));
      
      // Extract the presigned URL and file key
      const presignedUrl = presignedUrlResponse.data.uploadUrl;
      const fileKey = presignedUrlResponse.data.fileKey;
      
      console.log('Presigned URL:', presignedUrl.substring(0, 100) + '...');
      console.log('File Key:', fileKey);
      
      // Test 2: Upload file using presigned URL
      console.log(chalk.blue('\nTest 2: Upload file using presigned URL'));
      const uploadSuccess = await helpers.uploadWithPresignedUrl(presignedUrl, filePath, config.testFile.contentType);
      
      if (uploadSuccess) {
        console.log(chalk.green('✅ Successfully uploaded file using presigned URL'));
        
        // Test 3: Confirm upload with API
        console.log(chalk.blue('\nTest 3: Confirm upload with API'));
        const confirmResponse = await helpers.makeApiRequest('/uploads/confirm', 'POST', {
          fileKey: fileKey,
          orderId: config.testData.testOrderId,
          documentType: 'supplemental',
          fileName: fileName,
          fileSize: fs.statSync(filePath).size,
          contentType: config.testFile.contentType
        }, token);
        
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
        }
      }
    }
    
    // Clean up test file
    helpers.deleteTestFile(filePath);
    
    console.log(chalk.bold('\n=== Diagnostic Test Complete ==='));
    console.log(chalk.yellow('If the API returned an error about AWS credentials or S3 bucket, check the server configuration.'));
    console.log(chalk.yellow('If the upload failed but the presigned URL was generated, check the S3 bucket permissions.'));
  } catch (error) {
    console.log(chalk.red(`Unexpected error: ${error.message}`));
    console.log(error.stack);
  }
}

// Run the tests
runTests();