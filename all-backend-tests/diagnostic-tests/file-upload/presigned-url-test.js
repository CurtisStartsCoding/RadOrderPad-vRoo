/**
 * Presigned URL Generation Test
 * 
 * This script focuses specifically on testing the presigned URL generation
 * both directly using AWS SDK and through the API.
 */

const axios = require('axios');
const AWS = require('aws-sdk');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
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
 * Test presigned URL generation using AWS SDK
 */
async function testSdkPresignedUrl() {
  console.log(chalk.blue('Testing presigned URL generation using AWS SDK...'));
  
  try {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `test-uploads/presigned-test-${Date.now()}.txt`,
      Expires: 60, // URL expires in 60 seconds
      ContentType: 'text/plain'
    };
    
    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log(chalk.green('✅ Presigned URL generated successfully using AWS SDK'));
    console.log('URL:', url.substring(0, 100) + '...');
    
    // Parse the URL to extract components
    const parsedUrl = new URL(url);
    console.log('Host:', parsedUrl.host);
    console.log('Path:', parsedUrl.pathname);
    console.log('Query parameters present:', parsedUrl.search.length > 0 ? 'Yes' : 'No');
    
    return {
      success: true,
      url: url
    };
  } catch (error) {
    console.log(chalk.red('❌ Failed to generate presigned URL using AWS SDK'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 'CredentialsError') {
      console.log(chalk.yellow('⚠️ AWS credentials are missing or invalid'));
    } else if (error.code === 'AccessDenied') {
      console.log(chalk.yellow('⚠️ AWS credentials do not have permission to generate presigned URLs'));
    }
    
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test presigned URL generation using API
 */
async function testApiPresignedUrl() {
  console.log(chalk.blue('\nTesting presigned URL generation using API...'));
  
  try {
    // Try to load admin staff token from file
    let token = null;
    try {
      const tokenPath = path.resolve(__dirname, '../../../all-backend-tests/tokens/admin_staff-token.txt');
      if (fs.existsSync(tokenPath)) {
        token = fs.readFileSync(tokenPath, 'utf8').trim();
        console.log('Admin Staff token loaded from file');
      }
    } catch (tokenError) {
      console.log('Could not load token from file:', tokenError.message);
    }

    if (!token) {
      console.log(chalk.yellow('⚠️ No authentication token available. API call will likely fail.'));
      console.log('Run the token generation script first or set the ADMIN_STAFF_TOKEN environment variable.');
    }

    const response = await axios.post(`${API_URL}/api/uploads/presigned-url`, {
      fileName: `presigned-test-${Date.now()}.txt`,
      contentType: 'text/plain',
      fileType: 'supplemental',
      orderId: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'x-test-mode': 'true'
      }
    });
    
    if (response.data && response.data.uploadUrl) {
      console.log(chalk.green('✅ Presigned URL generated successfully using API'));
      console.log('URL:', response.data.uploadUrl.substring(0, 100) + '...');
      console.log('File Key:', response.data.fileKey);
      
      // Parse the URL to extract components
      const parsedUrl = new URL(response.data.uploadUrl);
      console.log('Host:', parsedUrl.host);
      console.log('Path:', parsedUrl.pathname);
      console.log('Query parameters present:', parsedUrl.search.length > 0 ? 'Yes' : 'No');
      
      return {
        success: true,
        url: response.data.uploadUrl,
        fileKey: response.data.fileKey
      };
    } else {
      console.log(chalk.red('❌ API response does not contain a presigned URL'));
      console.log('Response:', response.data);
      
      return {
        success: false,
        error: 'API response does not contain a presigned URL'
      };
    }
  } catch (error) {
    console.log(chalk.red('❌ Failed to generate presigned URL using API'));
    
    if (error.response) {
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
      console.log('Error:', error.message);
    }
    
    return {
      success: false,
      error: error.response ? error.response.data : error.message
    };
  }
}

/**
 * Compare SDK and API presigned URLs
 */
function comparePresignedUrls(sdkUrl, apiUrl) {
  console.log(chalk.blue('\nComparing SDK and API presigned URLs...'));
  
  if (!sdkUrl || !apiUrl) {
    console.log(chalk.yellow('⚠️ Cannot compare URLs because one or both generation methods failed'));
    return;
  }
  
  const parsedSdkUrl = new URL(sdkUrl);
  const parsedApiUrl = new URL(apiUrl);
  
  console.log('SDK URL host:', parsedSdkUrl.host);
  console.log('API URL host:', parsedApiUrl.host);
  
  if (parsedSdkUrl.host === parsedApiUrl.host) {
    console.log(chalk.green('✅ Hosts match'));
  } else {
    console.log(chalk.red('❌ Hosts do not match'));
    console.log(chalk.yellow('⚠️ This may indicate that the API is using a different S3 bucket or region'));
  }
  
  // Compare the path structure (not the exact path)
  const sdkPathParts = parsedSdkUrl.pathname.split('/');
  const apiPathParts = parsedApiUrl.pathname.split('/');
  
  console.log('SDK URL path parts:', sdkPathParts.length);
  console.log('API URL path parts:', apiPathParts.length);
  
  if (sdkPathParts.length === apiPathParts.length) {
    console.log(chalk.green('✅ Path structures match'));
  } else {
    console.log(chalk.red('❌ Path structures do not match'));
    console.log(chalk.yellow('⚠️ This may indicate that the API is using a different S3 bucket structure'));
  }
  
  // Check if both URLs have query parameters
  const sdkHasQuery = parsedSdkUrl.search.length > 0;
  const apiHasQuery = parsedApiUrl.search.length > 0;
  
  console.log('SDK URL has query parameters:', sdkHasQuery ? 'Yes' : 'No');
  console.log('API URL has query parameters:', apiHasQuery ? 'Yes' : 'No');
  
  if (sdkHasQuery && apiHasQuery) {
    console.log(chalk.green('✅ Both URLs have query parameters'));
  } else if (!sdkHasQuery && !apiHasQuery) {
    console.log(chalk.green('✅ Neither URL has query parameters'));
  } else {
    console.log(chalk.red('❌ Query parameter presence does not match'));
    console.log(chalk.yellow('⚠️ This may indicate a difference in how the presigned URLs are generated'));
  }
}

/**
 * Run all presigned URL tests
 */
async function runPresignedUrlTests() {
  console.log(chalk.bold('=== Presigned URL Generation Test ==='));
  
  // Log environment variables (without sensitive values)
  console.log(chalk.blue('Environment:'));
  console.log('API_URL:', API_URL);
  console.log('AWS_REGION:', AWS_REGION);
  console.log('S3_BUCKET_NAME:', S3_BUCKET_NAME);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
  
  // Run tests
  const sdkResult = await testSdkPresignedUrl();
  const apiResult = await testApiPresignedUrl();
  
  // Compare URLs if both tests succeeded
  if (sdkResult.success && apiResult.success) {
    comparePresignedUrls(sdkResult.url, apiResult.url);
  }
  
  // Summary
  console.log(chalk.bold('\n=== Presigned URL Test Summary ==='));
  console.log(`SDK Presigned URL Generation: ${sdkResult.success ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  console.log(`API Presigned URL Generation: ${apiResult.success ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  
  // Recommendations
  console.log(chalk.bold('\n=== Recommendations ==='));
  
  if (!sdkResult.success) {
    console.log('- Verify AWS credentials are correct');
    console.log('- Ensure the AWS user has permission to generate presigned URLs');
    console.log('- Check if the S3 bucket exists and is accessible');
  }
  
  if (!apiResult.success) {
    console.log('- Check if the API server has AWS credentials configured');
    console.log('- Verify the S3_BUCKET_NAME is set in the server environment');
    console.log('- Ensure the API server has the necessary permissions to generate presigned URLs');
  }
  
  if (sdkResult.success && !apiResult.success) {
    console.log('- The issue is likely with the API server configuration, not with AWS credentials or S3 bucket');
    console.log('- Check the API server logs for more information');
  }
  
  if (!sdkResult.success && apiResult.success) {
    console.log('- The API server is using different AWS credentials than those in .env.test');
    console.log('- Update the AWS credentials in .env.test to match those used by the API server');
  }
  
  console.log(chalk.bold('\n=== Presigned URL Test Complete ==='));
}

// Run the tests
runPresignedUrlTests();