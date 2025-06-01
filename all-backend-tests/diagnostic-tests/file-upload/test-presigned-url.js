/**
 * Diagnostic Test: Presigned URL Generation and Usage
 * 
 * This test focuses specifically on presigned URL generation and usage
 * It tests the following operations:
 * 1. Generate a presigned URL using the AWS SDK
 * 2. Generate a presigned URL using the API
 * 3. Compare the two URLs
 * 4. Test uploading with both URLs
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const helpers = require('./helpers');
const config = require('./config');

// Main test function
async function runTests() {
  console.log(chalk.bold('=== Diagnostic Test: Presigned URL Generation and Usage ==='));
  
  try {
    // Generate a JWT token for admin_staff user
    const token = helpers.generateToken(config.testData.adminStaff);
    console.log(chalk.blue('Generated JWT token for admin_staff user'));
    
    // Create a test file
    const fileName = config.testFile.name;
    const filePath = helpers.createTestFile(fileName, config.testFile.content);
    
    // Test 1: Generate a presigned URL using the AWS SDK
    console.log(chalk.blue('\nTest 1: Generate a presigned URL using the AWS SDK'));
    let sdkPresignedUrl = null;
    try {
      const key = `diagnostic-tests/${Date.now()}-sdk-${fileName}`;
      sdkPresignedUrl = await helpers.generatePresignedUrl(key, config.testFile.contentType);
      console.log(chalk.green('✅ Successfully generated presigned URL using AWS SDK'));
      console.log('SDK Presigned URL (first 100 chars):', sdkPresignedUrl.substring(0, 100) + '...');
      
      // Extract the hostname and path from the URL
      const sdkUrl = new URL(sdkPresignedUrl);
      console.log('Hostname:', sdkUrl.hostname);
      console.log('Path:', sdkUrl.pathname);
      console.log('Query parameters:', sdkUrl.search.substring(0, 50) + '...');
    } catch (error) {
      console.log(chalk.red(`❌ Failed to generate presigned URL using AWS SDK: ${error.message}`));
      console.log(chalk.yellow('⚠️ This indicates that the AWS credentials do not have the necessary S3 permissions'));
      
      // Log detailed error information
      if (error.code) {
        console.log('Error code:', error.code);
      }
      if (error.statusCode) {
        console.log('Status code:', error.statusCode);
      }
      if (error.requestId) {
        console.log('Request ID:', error.requestId);
      }
    }
    
    // Test 2: Generate a presigned URL using the API
    console.log(chalk.blue('\nTest 2: Generate a presigned URL using the API'));
    let apiPresignedUrl = null;
    let fileKey = null;
    
    const presignedUrlResponse = await helpers.makeApiRequest('/uploads/presigned-url', 'POST', {
      fileType: config.testFile.contentType,
      fileName: fileName,
      contentType: config.testFile.contentType,
      orderId: config.testData.testOrderId,
      documentType: 'supplemental'
    }, token);
    
    if (presignedUrlResponse.success && presignedUrlResponse.data.success) {
      console.log(chalk.green('✅ Successfully generated presigned URL using API'));
      
      // Extract the presigned URL and file key
      apiPresignedUrl = presignedUrlResponse.data.uploadUrl;
      fileKey = presignedUrlResponse.data.fileKey;
      
      console.log('API Presigned URL (first 100 chars):', apiPresignedUrl.substring(0, 100) + '...');
      console.log('File Key:', fileKey);
      
      // Extract the hostname and path from the URL
      const apiUrl = new URL(apiPresignedUrl);
      console.log('Hostname:', apiUrl.hostname);
      console.log('Path:', apiUrl.pathname);
      console.log('Query parameters:', apiUrl.search.substring(0, 50) + '...');
    } else {
      console.log(chalk.red('❌ Failed to generate presigned URL using API'));
      console.log('Response:', JSON.stringify(presignedUrlResponse.data, null, 2));
    }
    
    // Test 3: Compare the two URLs
    if (sdkPresignedUrl && apiPresignedUrl) {
      console.log(chalk.blue('\nTest 3: Compare the two presigned URLs'));
      
      const sdkUrl = new URL(sdkPresignedUrl);
      const apiUrl = new URL(apiPresignedUrl);
      
      console.log('SDK URL hostname:', sdkUrl.hostname);
      console.log('API URL hostname:', apiUrl.hostname);
      
      if (sdkUrl.hostname === apiUrl.hostname) {
        console.log(chalk.green('✅ Hostnames match'));
      } else {
        console.log(chalk.red('❌ Hostnames do not match'));
        console.log(chalk.yellow('⚠️ This may indicate that the API is using a different S3 bucket or region'));
      }
      
      // Compare the path structure (not the exact path)
      const sdkPathParts = sdkUrl.pathname.split('/');
      const apiPathParts = apiUrl.pathname.split('/');
      
      console.log('SDK URL path parts:', sdkPathParts.length);
      console.log('API URL path parts:', apiPathParts.length);
      
      if (sdkPathParts.length === apiPathParts.length) {
        console.log(chalk.green('✅ Path structures match'));
      } else {
        console.log(chalk.red('❌ Path structures do not match'));
        console.log(chalk.yellow('⚠️ This may indicate that the API is using a different S3 bucket structure'));
      }
    }
    
    // Test 4: Test uploading with both URLs
    if (sdkPresignedUrl) {
      console.log(chalk.blue('\nTest 4a: Upload using SDK-generated presigned URL'));
      const sdkUploadSuccess = await helpers.uploadWithPresignedUrl(sdkPresignedUrl, filePath, config.testFile.contentType);
      
      if (sdkUploadSuccess) {
        console.log(chalk.green('✅ Successfully uploaded file using SDK-generated presigned URL'));
      } else {
        console.log(chalk.red('❌ Failed to upload file using SDK-generated presigned URL'));
        console.log(chalk.yellow('⚠️ This may indicate an issue with the presigned URL or S3 permissions'));
      }
    }
    
    if (apiPresignedUrl) {
      console.log(chalk.blue('\nTest 4b: Upload using API-generated presigned URL'));
      const apiUploadSuccess = await helpers.uploadWithPresignedUrl(apiPresignedUrl, filePath, config.testFile.contentType);
      
      if (apiUploadSuccess) {
        console.log(chalk.green('✅ Successfully uploaded file using API-generated presigned URL'));
        
        // Confirm the upload with the API
        console.log(chalk.blue('\nConfirming upload with API...'));
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
        console.log(chalk.red('❌ Failed to upload file using API-generated presigned URL'));
        console.log(chalk.yellow('⚠️ This may indicate an issue with the presigned URL or S3 permissions'));
      }
    }
    
    // Clean up test file
    helpers.deleteTestFile(filePath);
    
    console.log(chalk.bold('\n=== Diagnostic Test Complete ==='));
    console.log(chalk.yellow('If the SDK-generated URL failed but the API-generated URL worked, the API is likely using different AWS credentials.'));
    console.log(chalk.yellow('If both URLs failed, there may be an issue with the S3 bucket permissions or configuration.'));
  } catch (error) {
    console.log(chalk.red(`Unexpected error: ${error.message}`));
    console.log(error.stack);
  }
}

// Run the tests
runTests();