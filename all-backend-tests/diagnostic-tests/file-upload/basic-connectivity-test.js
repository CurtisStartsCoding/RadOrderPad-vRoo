/**
 * Basic Connectivity Tests for Upload Functionality
 * 
 * This script performs simple connectivity tests for the various services
 * required for the upload functionality to work properly:
 * 1. API connectivity
 * 2. AWS S3 connectivity
 * 3. Presigned URL generation
 */

const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.test') });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const AWS_REGION = process.env.AWS_REGION || 'us-east-2';
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'radorderpad-uploads-prod-us-east-2';

// Initialize AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION
});

// Create S3 client
const s3 = new AWS.S3();

/**
 * Test API connectivity
 */
async function testApiConnectivity() {
  console.log(chalk.blue('Testing API connectivity...'));
  
  try {
    const response = await axios.get(`${API_URL}/api/health`);
    console.log(chalk.green('✅ API is reachable'));
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    if (error.response) {
      // The API responded with an error status
      console.log(chalk.yellow('⚠️ API responded with an error'));
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
      return true; // Still reachable, just returned an error
    } else if (error.request) {
      // The request was made but no response was received
      console.log(chalk.red('❌ API is not reachable'));
      console.log('Error:', error.message);
      return false;
    } else {
      // Something happened in setting up the request
      console.log(chalk.red('❌ Error setting up API request'));
      console.log('Error:', error.message);
      return false;
    }
  }
}

/**
 * Test AWS S3 connectivity
 */
async function testS3Connectivity() {
  console.log(chalk.blue('\nTesting AWS S3 connectivity...'));
  console.log('AWS Region:', AWS_REGION);
  console.log('S3 Bucket:', S3_BUCKET_NAME);
  
  try {
    // Try to list objects in the bucket (just to test connectivity)
    const params = {
      Bucket: S3_BUCKET_NAME,
      MaxKeys: 1 // Just need to check if we can connect, don't need actual objects
    };
    
    const data = await s3.listObjectsV2(params).promise();
    console.log(chalk.green('✅ S3 is reachable'));
    console.log('Response received from S3');
    return true;
  } catch (error) {
    console.log(chalk.red('❌ S3 is not reachable or credentials are invalid'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 'AccessDenied') {
      console.log(chalk.yellow('⚠️ This is likely a permissions issue. The AWS credentials do not have access to the S3 bucket.'));
    } else if (error.code === 'NoSuchBucket') {
      console.log(chalk.yellow('⚠️ The specified bucket does not exist.'));
    } else if (error.code === 'CredentialsError') {
      console.log(chalk.yellow('⚠️ AWS credentials are missing or invalid.'));
    }
    
    return false;
  }
}

/**
 * Test presigned URL generation
 */
async function testPresignedUrlGeneration() {
  console.log(chalk.blue('\nTesting presigned URL generation...'));
  
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `test-uploads/connectivity-test-${Date.now()}.txt`,
      Expires: 60, // URL expires in 60 seconds
      ContentType: 'text/plain'
    };
    
    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log(chalk.green('✅ Presigned URL generated successfully'));
    console.log('URL:', url.substring(0, 100) + '...');
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Failed to generate presigned URL'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    return false;
  }
}

/**
 * Test API presigned URL endpoint
 */
async function testApiPresignedUrl() {
  console.log(chalk.blue('\nTesting API presigned URL endpoint...'));
  
  try {
    const response = await axios.post(`${API_URL}/api/uploads/presigned-url`, {
      fileName: 'connectivity-test.txt',
      contentType: 'text/plain',
      fileType: 'supplemental',
      orderId: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-test-mode': 'true'
      }
    });
    
    console.log(chalk.green('✅ API presigned URL endpoint is working'));
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.uploadUrl) {
      console.log('Upload URL received');
      return true;
    } else {
      console.log(chalk.yellow('⚠️ Upload URL not received'));
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.log(chalk.yellow('⚠️ API presigned URL endpoint responded with an error'));
      console.log('Status:', error.response.status);
      console.log('Response:', error.response.data);
      
      if (error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('AWS credentials')) {
          console.log(chalk.yellow('⚠️ The API server is missing AWS credentials or has insufficient permissions'));
        } else if (error.response.data.message.includes('bucket')) {
          console.log(chalk.yellow('⚠️ The API server is missing the S3 bucket configuration'));
          console.log(chalk.yellow('⚠️ Make sure S3_BUCKET_NAME is set in the server environment'));
        }
      }
    } else {
      console.log(chalk.red('❌ Error making request to API presigned URL endpoint'));
      console.log('Error:', error.message);
    }
    return false;
  }
}

/**
 * Run all connectivity tests
 */
async function runConnectivityTests() {
  console.log(chalk.bold('=== Basic Connectivity Tests for Upload Functionality ==='));
  
  // Log environment variables (without sensitive values)
  console.log(chalk.blue('Environment:'));
  console.log('API_URL:', API_URL);
  console.log('AWS_REGION:', AWS_REGION);
  console.log('S3_BUCKET_NAME:', S3_BUCKET_NAME);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
  
  // Run tests
  const apiConnected = await testApiConnectivity();
  const s3Connected = await testS3Connectivity();
  const presignedUrlGenerated = await testPresignedUrlGeneration();
  const apiPresignedUrlWorking = await testApiPresignedUrl();
  
  // Summary
  console.log(chalk.bold('\n=== Connectivity Test Summary ==='));
  console.log(`API Connectivity: ${apiConnected ? chalk.green('✅ Connected') : chalk.red('❌ Failed')}`);
  console.log(`S3 Connectivity: ${s3Connected ? chalk.green('✅ Connected') : chalk.red('❌ Failed')}`);
  console.log(`Presigned URL Generation: ${presignedUrlGenerated ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  console.log(`API Presigned URL Endpoint: ${apiPresignedUrlWorking ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  
  // Recommendations
  console.log(chalk.bold('\n=== Recommendations ==='));
  
  if (!apiConnected) {
    console.log('- Check if the API server is running and accessible');
    console.log('- Verify the API_URL is correct');
  }
  
  if (!s3Connected) {
    console.log('- Verify AWS credentials are correct');
    console.log('- Check if the S3 bucket exists and is accessible');
    console.log('- Ensure the AWS user has the necessary S3 permissions');
  }
  
  if (!presignedUrlGenerated) {
    console.log('- Verify AWS credentials have permission to generate presigned URLs');
    console.log('- Check if the S3 bucket name is correct');
  }
  
  if (!apiPresignedUrlWorking) {
    console.log('- Check if the API server has AWS credentials configured');
    console.log('- Verify the S3_BUCKET_NAME is set in the server environment');
    console.log('- Ensure the API server has the necessary permissions to generate presigned URLs');
  }
  
  console.log(chalk.bold('\n=== Basic Connectivity Tests Complete ==='));
}

// Run the tests
runConnectivityTests();