/**
 * Diagnostic Test: Direct S3 Access
 * 
 * This test attempts to directly access AWS S3 using the credentials in .env.test
 * It tests the following operations:
 * 1. List objects in the S3 bucket
 * 2. Generate a presigned URL for upload
 * 3. Upload a file using the presigned URL
 * 4. Upload a file directly using the S3 SDK
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const helpers = require('./helpers');
const config = require('./config');

// Main test function
async function runTests() {
  console.log(chalk.bold('=== Diagnostic Test: Direct S3 Access ==='));
  
  // Log AWS configuration
  console.log(chalk.blue('AWS Configuration:'));
  console.log('- AWS_REGION:', config.aws.region);
  console.log('- AWS_ACCESS_KEY_ID:', config.aws.accessKeyId ? '✅ Set' : '❌ Not set');
  console.log('- AWS_SECRET_ACCESS_KEY:', config.aws.secretAccessKey ? '✅ Set' : '❌ Not set');
  console.log('- S3_BUCKET_NAME:', config.aws.s3Bucket);
  
  // Check if AWS credentials are configured
  if (!config.aws.accessKeyId || !config.aws.secretAccessKey) {
    console.log(chalk.red('❌ AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.'));
    return;
  }
  
  try {
    // Test 1: List objects in the S3 bucket
    console.log(chalk.blue('\nTest 1: List objects in the S3 bucket'));
    try {
      const objects = await helpers.listS3Objects('', 5);
      if (objects && objects.length > 0) {
        console.log(chalk.green('✅ Successfully listed objects in S3 bucket'));
        objects.forEach((obj, i) => {
          console.log(`${i + 1}. ${obj.Key} (${obj.Size} bytes)`);
        });
      } else {
        console.log(chalk.yellow('⚠️ No objects found in S3 bucket'));
      }
    } catch (error) {
      console.log(chalk.red(`❌ Failed to list objects in S3 bucket: ${error.message}`));
      console.log(chalk.yellow('⚠️ This may indicate insufficient permissions (s3:ListBucket)'));
      
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
    
    // Create a test file
    const fileName = config.testFile.name;
    const filePath = helpers.createTestFile(fileName, config.testFile.content);
    
    // Test 2: Generate a presigned URL for upload
    console.log(chalk.blue('\nTest 2: Generate a presigned URL for upload'));
    let presignedUrl = null;
    try {
      const key = `diagnostic-tests/${Date.now()}-${fileName}`;
      presignedUrl = await helpers.generatePresignedUrl(key, config.testFile.contentType);
      console.log(chalk.green('✅ Successfully generated presigned URL'));
      console.log('Presigned URL:', presignedUrl.substring(0, 100) + '...');
    } catch (error) {
      console.log(chalk.red(`❌ Failed to generate presigned URL: ${error.message}`));
      console.log(chalk.yellow('⚠️ This may indicate insufficient permissions (s3:PutObject)'));
      
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
    
    // Test 3: Upload a file using the presigned URL
    if (presignedUrl) {
      console.log(chalk.blue('\nTest 3: Upload a file using the presigned URL'));
      try {
        const success = await helpers.uploadWithPresignedUrl(presignedUrl, filePath, config.testFile.contentType);
        if (success) {
          console.log(chalk.green('✅ Successfully uploaded file using presigned URL'));
        } else {
          console.log(chalk.red('❌ Failed to upload file using presigned URL'));
        }
      } catch (error) {
        console.log(chalk.red(`❌ Failed to upload file using presigned URL: ${error.message}`));
      }
    }
    
    // Test 4: Upload a file directly using the S3 SDK
    console.log(chalk.blue('\nTest 4: Upload a file directly using the S3 SDK'));
    try {
      const key = `diagnostic-tests/${Date.now()}-direct-${fileName}`;
      const location = await helpers.uploadDirectToS3(key, filePath, config.testFile.contentType);
      console.log(chalk.green('✅ Successfully uploaded file directly to S3'));
      console.log('File location:', location);
    } catch (error) {
      console.log(chalk.red(`❌ Failed to upload file directly to S3: ${error.message}`));
      console.log(chalk.yellow('⚠️ This may indicate insufficient permissions (s3:PutObject)'));
      
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
    
    // Clean up test file
    helpers.deleteTestFile(filePath);
    
    console.log(chalk.bold('\n=== Diagnostic Test Complete ==='));
    console.log(chalk.yellow('If all tests failed with permission errors, the AWS credentials do not have the necessary S3 permissions.'));
    console.log(chalk.yellow('The user needs the following permissions:'));
    console.log(chalk.yellow('- s3:ListBucket on the bucket'));
    console.log(chalk.yellow('- s3:PutObject on objects in the bucket'));
    console.log(chalk.yellow('- s3:GetObject on objects in the bucket'));
  } catch (error) {
    console.log(chalk.red(`Unexpected error: ${error.message}`));
    console.log(error.stack);
  }
}

// Run the tests
runTests();