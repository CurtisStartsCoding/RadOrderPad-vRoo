/**
 * Direct S3 Upload Test
 * 
 * This script tests direct uploads to S3 using credentials from .env.test
 */

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.test') });

// Create a test file
const testFilePath = path.join(__dirname, 'direct-test.txt');
fs.writeFileSync(testFilePath, 'This is a direct upload test');

// Log the credentials being used (partially redacted for security)
console.log('=== Direct S3 Upload Test ===');
console.log('Using credentials:');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set (redacted)' : '❌ Not set');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);

// Create S3 client with explicit credentials
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  // Add longer timeout to see if that helps with ECONNRESET
  requestHandler: {
    connectionTimeout: 30000, // 30 seconds
    socketTimeout: 60000 // 60 seconds
  }
});

async function testDirectUpload() {
  try {
    const fileContent = fs.readFileSync(testFilePath);
    const key = `uploads/direct-test-${Date.now()}.txt`;
    
    console.log(`\nUploading file to ${key}...`);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'text/plain'
    });
    
    console.log('Sending request to S3...');
    const response = await s3Client.send(command);
    console.log('✅ Direct Upload: Success');
    console.log('Response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.log(`❌ Direct Upload: Failed - ${error.name}: ${error.message}`);
    if (error.name === 'NetworkingError' && error.message.includes('ECONNRESET')) {
      console.log('\n⚠️ ECONNRESET error detected. This typically indicates:');
      console.log('  - Network connectivity issues');
      console.log('  - Firewall or proxy interrupting the connection');
      console.log('  - Timeout during upload');
      console.log('  - Try increasing the timeout or using a more stable network');
    } else if (error.name === 'AccessDenied') {
      console.log('\n⚠️ Access Denied error detected. This indicates:');
      console.log('  - The IAM user does not have permission to upload to this path');
      console.log('  - Check the IAM policy and ensure it allows s3:PutObject on this path');
    }
    return false;
  } finally {
    // Clean up
    try {
      fs.unlinkSync(testFilePath);
      console.log(`\nTest file deleted: ${testFilePath}`);
    } catch (error) {
      console.log('Warning: Failed to clean up test file', error.message);
    }
  }
}

// Run the test
testDirectUpload()
  .then(() => {
    console.log('\n=== Direct S3 Upload Test Complete ===');
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    console.log('\n=== Direct S3 Upload Test Failed ===');
  });