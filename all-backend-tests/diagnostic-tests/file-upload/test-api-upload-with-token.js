/**
 * Modified API-based File Upload Test
 * Uses real token from token generation
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const helpers = require('./helpers');
const config = require('./config');

// Main test function
async function runTests() {
  console.log(chalk.bold('=== Diagnostic Test: API-based File Upload (with real token) ==='));
  
  try {
    // Read the real admin_staff token
    const tokenPath = path.join(__dirname, '../../tokens/admin_staff-token.txt');
    if (!fs.existsSync(tokenPath)) {
      console.log(chalk.red('Error: Token file not found. Run generate-all-role-tokens.js first'));
      return;
    }
    
    const token = fs.readFileSync(tokenPath, 'utf8').trim();
    console.log(chalk.blue('Using real admin_staff token'));
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
      documentType: 'test'
    }, token);
    
    if (presignedUrlResponse.success && presignedUrlResponse.data.success) {
      console.log(chalk.green('✅ Successfully obtained presigned URL from API'));
      
      // Extract the presigned URL and file key
      const presignedUrl = presignedUrlResponse.data.uploadUrl;
      const fileKey = presignedUrlResponse.data.fileKey;
      
      console.log('Presigned URL:', presignedUrl.substring(0, 100) + '...');
      console.log('File Key:', fileKey);
      
      // Check what headers are signed
      const url = new URL(presignedUrl);
      const signedHeaders = url.searchParams.get('X-Amz-SignedHeaders');
      console.log(chalk.yellow('X-Amz-SignedHeaders:', signedHeaders));
      
      // Test 2: Upload file using presigned URL
      console.log(chalk.blue('\nTest 2: Upload file using presigned URL'));
      const uploadSuccess = await helpers.uploadWithPresignedUrl(presignedUrl, filePath, config.testFile.contentType);
      
      if (uploadSuccess) {
        console.log(chalk.green('✅ Successfully uploaded file using presigned URL'));
        console.log(chalk.green('🎉 THE UPLOAD WORKED! This is the method that works!'));
        
        // Test 3: Confirm upload with API
        console.log(chalk.blue('\nTest 3: Confirm upload with API'));
        const confirmResponse = await helpers.makeApiRequest('/uploads/confirm', 'POST', {
          fileKey: fileKey,
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
    }
    
    // Clean up test file
    helpers.deleteTestFile(filePath);
    
    console.log(chalk.bold('\n=== Diagnostic Test Complete ==='));
  } catch (error) {
    console.log(chalk.red(`Unexpected error: ${error.message}`));
    console.log(error.stack);
  }
}

// Run the tests
runTests();