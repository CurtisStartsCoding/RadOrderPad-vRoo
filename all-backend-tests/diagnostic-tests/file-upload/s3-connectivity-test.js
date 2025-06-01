/**
 * AWS S3 Connectivity Test
 * 
 * This script performs a simple connectivity test to AWS S3
 * to verify that the AWS credentials and S3 bucket are properly configured.
 */

const AWS = require('aws-sdk');
const chalk = require('chalk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.test') });

// Configuration
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
 * Test AWS credentials
 */
async function testAwsCredentials() {
  console.log(chalk.blue('Testing AWS credentials...'));
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log(chalk.red('❌ AWS credentials are not configured'));
    console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
    console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
    return false;
  }
  
  try {
    // Try to get the caller identity (simple operation that requires valid credentials)
    const sts = new AWS.STS();
    const data = await sts.getCallerIdentity().promise();
    
    console.log(chalk.green('✅ AWS credentials are valid'));
    console.log('Account ID:', data.Account);
    console.log('User ARN:', data.Arn);
    console.log('User ID:', data.UserId);
    return true;
  } catch (error) {
    console.log(chalk.red('❌ AWS credentials are invalid'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    return false;
  }
}

/**
 * Test S3 bucket existence
 */
async function testS3BucketExistence() {
  console.log(chalk.blue('\nTesting S3 bucket existence...'));
  console.log('S3 Bucket:', S3_BUCKET_NAME);
  
  try {
    // Try to check if the bucket exists
    const params = {
      Bucket: S3_BUCKET_NAME
    };
    
    await s3.headBucket(params).promise();
    console.log(chalk.green('✅ S3 bucket exists and is accessible'));
    return true;
  } catch (error) {
    console.log(chalk.red('❌ S3 bucket does not exist or is not accessible'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 'NotFound') {
      console.log(chalk.yellow('⚠️ The specified bucket does not exist.'));
    } else if (error.code === 'Forbidden') {
      console.log(chalk.yellow('⚠️ You do not have permission to access this bucket.'));
    }
    
    return false;
  }
}

/**
 * Test S3 list objects
 */
async function testS3ListObjects() {
  console.log(chalk.blue('\nTesting S3 list objects...'));
  
  try {
    // Try to list objects in the bucket
    const params = {
      Bucket: S3_BUCKET_NAME,
      MaxKeys: 5
    };
    
    const data = await s3.listObjectsV2(params).promise();
    console.log(chalk.green('✅ Successfully listed objects in S3 bucket'));
    console.log('Number of objects:', data.Contents ? data.Contents.length : 0);
    
    if (data.Contents && data.Contents.length > 0) {
      console.log('First few objects:');
      data.Contents.slice(0, 3).forEach((obj, i) => {
        console.log(`${i + 1}. ${obj.Key} (${obj.Size} bytes)`);
      });
    } else {
      console.log('Bucket is empty or you do not have permission to list objects');
    }
    
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Failed to list objects in S3 bucket'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 'AccessDenied') {
      console.log(chalk.yellow('⚠️ You do not have permission to list objects in this bucket.'));
      console.log(chalk.yellow('⚠️ The AWS user needs the s3:ListBucket permission.'));
    }
    
    return false;
  }
}

/**
 * Test S3 put object
 */
async function testS3PutObject() {
  console.log(chalk.blue('\nTesting S3 put object...'));
  
  try {
    // Try to put a small test object in the bucket
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `test-uploads/connectivity-test-${Date.now()}.txt`,
      Body: 'This is a test file for S3 connectivity testing.',
      ContentType: 'text/plain'
    };
    
    const data = await s3.putObject(params).promise();
    console.log(chalk.green('✅ Successfully uploaded test object to S3 bucket'));
    console.log('ETag:', data.ETag);
    return true;
  } catch (error) {
    console.log(chalk.red('❌ Failed to upload test object to S3 bucket'));
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    
    if (error.code === 'AccessDenied') {
      console.log(chalk.yellow('⚠️ You do not have permission to put objects in this bucket.'));
      console.log(chalk.yellow('⚠️ The AWS user needs the s3:PutObject permission.'));
    }
    
    return false;
  }
}

/**
 * Run all S3 connectivity tests
 */
async function runS3ConnectivityTests() {
  console.log(chalk.bold('=== AWS S3 Connectivity Test ==='));
  
  // Log environment variables (without sensitive values)
  console.log(chalk.blue('Environment:'));
  console.log('AWS_REGION:', AWS_REGION);
  console.log('S3_BUCKET_NAME:', S3_BUCKET_NAME);
  console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? '✅ Set' : '❌ Not set');
  console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
  
  // Run tests
  const credentialsValid = await testAwsCredentials();
  const bucketExists = await testS3BucketExistence();
  const listObjectsWorks = await testS3ListObjects();
  const putObjectWorks = await testS3PutObject();
  
  // Summary
  console.log(chalk.bold('\n=== S3 Connectivity Test Summary ==='));
  console.log(`AWS Credentials: ${credentialsValid ? chalk.green('✅ Valid') : chalk.red('❌ Invalid')}`);
  console.log(`S3 Bucket Existence: ${bucketExists ? chalk.green('✅ Exists') : chalk.red('❌ Not Found')}`);
  console.log(`S3 List Objects: ${listObjectsWorks ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  console.log(`S3 Put Object: ${putObjectWorks ? chalk.green('✅ Working') : chalk.red('❌ Failed')}`);
  
  // Recommendations
  console.log(chalk.bold('\n=== Recommendations ==='));
  
  if (!credentialsValid) {
    console.log('- Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are correct');
    console.log('- Check if the AWS user exists and is active');
  }
  
  if (!bucketExists) {
    console.log('- Verify S3_BUCKET_NAME is correct');
    console.log('- Check if the bucket exists in the specified AWS region');
  }
  
  if (!listObjectsWorks) {
    console.log('- Ensure the AWS user has the s3:ListBucket permission for this bucket');
    console.log('- Check the bucket policy to ensure it allows listing objects');
  }
  
  if (!putObjectWorks) {
    console.log('- Ensure the AWS user has the s3:PutObject permission for this bucket');
    console.log('- Check the bucket policy to ensure it allows putting objects');
  }
  
  console.log(chalk.bold('\n=== AWS S3 Connectivity Test Complete ==='));
}

// Run the tests
runS3ConnectivityTests();