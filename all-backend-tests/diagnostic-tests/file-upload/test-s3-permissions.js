/**
 * S3 Permissions Test
 * 
 * This script tests if the AWS credentials have the necessary S3 permissions
 * for the file upload functionality to work properly.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env.test') });
const { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

console.log('=== S3 Permissions Test ===');
console.log('Environment variables:');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);

// Test ListBucket permission
async function testListBucket() {
  try {
    console.log(`\nTesting ListBucket permission on ${process.env.S3_BUCKET_NAME}...`);
    const command = new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      MaxKeys: 1
    });
    const response = await s3Client.send(command);
    console.log('✅ ListBucket permission: Success');
    console.log('Response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.log(`❌ ListBucket permission: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test PutObject permission
async function testPutObject() {
  try {
    console.log(`\nTesting PutObject permission on ${process.env.S3_BUCKET_NAME}...`);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'test-upload.txt',
      Body: 'This is a test file',
      ContentType: 'text/plain'
    });
    const response = await s3Client.send(command);
    console.log('✅ PutObject permission: Success');
    console.log('Response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.log(`❌ PutObject permission: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test GetObject permission
async function testGetObject() {
  try {
    console.log(`\nTesting GetObject permission on ${process.env.S3_BUCKET_NAME}...`);
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: 'test-upload.txt'
    });
    const response = await s3Client.send(command);
    console.log('✅ GetObject permission: Success');
    // Don't log the full response as it contains the file content
    console.log('Response status:', response.$metadata.httpStatusCode);
    return true;
  } catch (error) {
    console.log(`❌ GetObject permission: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  const listResult = await testListBucket();
  const putResult = await testPutObject();
  
  // Only test GetObject if PutObject succeeded
  let getResult = false;
  if (putResult) {
    getResult = await testGetObject();
  }
  
  console.log('\n=== S3 Permissions Test Summary ===');
  console.log(`ListBucket: ${listResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`PutObject: ${putResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`GetObject: ${getResult ? '✅ Success' : '❌ Failed'}`);
  
  if (!listResult || !putResult || !getResult) {
    console.log('\nRecommendation: Update the IAM policy for the AWS user to include these permissions:');
    console.log(`
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::${process.env.S3_BUCKET_NAME}"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::${process.env.S3_BUCKET_NAME}/*"
    }
  ]
}
`);
  }
}

runTests();