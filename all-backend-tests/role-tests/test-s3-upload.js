/**
 * Test script for AWS S3 uploads
 * This script tests direct uploads to S3 using the AWS SDK
 */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.test') });

// AWS Configuration
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION || 'us-east-2';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'radorderpad-uploads-prod-us-east-2';

console.log('AWS Configuration:');
console.log('- AWS_ACCESS_KEY_ID:', AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
console.log('- AWS_SECRET_ACCESS_KEY:', AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
console.log('- AWS_REGION:', AWS_REGION);
console.log('- S3_BUCKET_NAME:', S3_BUCKET_NAME);

// Initialize S3 client
const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

// Create a test file
const createTestFile = () => {
  const testFilePath = path.join(__dirname, 'test-document.txt');
  const testContent = 'This is a test document for S3 upload.';
  fs.writeFileSync(testFilePath, testContent);
  console.log(`Test file created at: ${testFilePath}`);
  return testFilePath;
};

// Generate a presigned URL for upload
const generatePresignedUrl = async (key, contentType) => {
  console.log(`Generating presigned URL for ${key}...`);
  
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Expires: 300 // URL expires in 5 minutes
    };
    
    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log(chalk.green('Presigned URL generated successfully'));
    return url;
  } catch (error) {
    console.log(chalk.red('Error generating presigned URL:'));
    console.log(error);
    return null;
  }
};

// Upload file using presigned URL
const uploadFileWithPresignedUrl = async (url, filePath, contentType) => {
  console.log(`Uploading file to presigned URL...`);
  
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: fileContent
    });
    
    if (response.ok) {
      console.log(chalk.green('File uploaded successfully'));
      return true;
    } else {
      console.log(chalk.red(`Upload failed with status: ${response.status}`));
      return false;
    }
  } catch (error) {
    console.log(chalk.red('Error uploading file:'));
    console.log(error);
    return false;
  }
};

// Upload file directly using S3 SDK
const uploadFileDirectly = async (key, filePath, contentType) => {
  console.log(`Uploading file directly using S3 SDK...`);
  
  try {
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType
    };
    
    const result = await s3.upload(params).promise();
    console.log(chalk.green('File uploaded successfully'));
    console.log('File location:', result.Location);
    return result.Location;
  } catch (error) {
    console.log(chalk.red('Error uploading file directly:'));
    console.log(error);
    return null;
  }
};

// List objects in bucket
const listObjects = async () => {
  console.log(`Listing objects in bucket ${S3_BUCKET_NAME}...`);
  
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      MaxKeys: 10
    };
    
    const result = await s3.listObjectsV2(params).promise();
    console.log(chalk.green(`Found ${result.Contents.length} objects`));
    
    result.Contents.forEach((item, index) => {
      console.log(`${index + 1}. ${item.Key} (${item.Size} bytes, Last modified: ${item.LastModified})`);
    });
    
    return result.Contents;
  } catch (error) {
    console.log(chalk.red('Error listing objects:'));
    console.log(error);
    return null;
  }
};

// Main test function
const runTests = async () => {
  console.log(chalk.bold('=== Testing AWS S3 Uploads ==='));
  
  try {
    // Check if AWS credentials are configured
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.log(chalk.red('AWS credentials not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.'));
      return;
    }
    
    // Test 1: List objects in bucket
    console.log(chalk.blue('\nTest 1: List objects in bucket'));
    await listObjects();
    
    // Test 2: Create test file
    console.log(chalk.blue('\nTest 2: Create test file'));
    const testFilePath = createTestFile();
    
    // Test 3: Generate presigned URL
    console.log(chalk.blue('\nTest 3: Generate presigned URL'));
    const key = `test-uploads/${Date.now()}-test-document.txt`;
    const contentType = 'text/plain';
    const presignedUrl = await generatePresignedUrl(key, contentType);
    
    if (presignedUrl) {
      // Test 4: Upload file using presigned URL
      console.log(chalk.blue('\nTest 4: Upload file using presigned URL'));
      const uploadSuccess = await uploadFileWithPresignedUrl(presignedUrl, testFilePath, contentType);
      
      if (uploadSuccess) {
        console.log(chalk.green('✅ File uploaded successfully using presigned URL'));
      } else {
        console.log(chalk.red('❌ Failed to upload file using presigned URL'));
        
        // Test 5: Upload file directly using S3 SDK
        console.log(chalk.blue('\nTest 5: Upload file directly using S3 SDK'));
        const directKey = `test-uploads/${Date.now()}-direct-test-document.txt`;
        const uploadLocation = await uploadFileDirectly(directKey, testFilePath, contentType);
        
        if (uploadLocation) {
          console.log(chalk.green('✅ File uploaded successfully using S3 SDK'));
        } else {
          console.log(chalk.red('❌ Failed to upload file using S3 SDK'));
        }
      }
    }
    
    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log(`Test file deleted: ${testFilePath}`);
    
    console.log(chalk.bold('\n=== All S3 Upload Tests Completed ==='));
  } catch (error) {
    console.error(chalk.red('Unexpected error during test execution:'));
    console.error(error);
  }
};

// Run the tests
runTests();