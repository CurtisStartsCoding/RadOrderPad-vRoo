/**
 * S3 Upload Network Diagnostics
 * 
 * This script performs various tests to diagnose network-related issues
 * with S3 uploads, particularly ECONNRESET errors.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env.test') });
const { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const https = require('https');
const { promisify } = require('util');
const { execSync } = require('child_process');

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Test file paths
const TINY_FILE_PATH = path.join(__dirname, 'tiny-test.txt');
const SMALL_FILE_PATH = path.join(__dirname, 'small-test.txt');
const MEDIUM_FILE_PATH = path.join(__dirname, 'medium-test.txt');

// Create test files of different sizes
fs.writeFileSync(TINY_FILE_PATH, 'Test content');
fs.writeFileSync(SMALL_FILE_PATH, Buffer.alloc(10 * 1024).fill('A')); // 10KB
fs.writeFileSync(MEDIUM_FILE_PATH, Buffer.alloc(1 * 1024 * 1024).fill('B')); // 1MB

console.log('=== S3 Upload Network Diagnostics ===');
console.log('Environment variables:');
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? '✅ Set' : '❌ Not set');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);

// Test DNS resolution
async function testDnsResolution() {
  console.log('\n=== Testing DNS Resolution ===');
  try {
    const s3Endpoint = `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    console.log(`Resolving ${s3Endpoint}...`);
    const addresses = await promisify(dns.resolve)(s3Endpoint);
    console.log('✅ DNS Resolution: Success');
    console.log('Resolved addresses:', addresses);
    return true;
  } catch (error) {
    console.log(`❌ DNS Resolution: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test HTTPS connection
async function testHttpsConnection() {
  console.log('\n=== Testing HTTPS Connection ===');
  try {
    const s3Endpoint = `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    console.log(`Connecting to ${s3Endpoint}...`);
    
    return new Promise((resolve) => {
      const req = https.request({
        hostname: s3Endpoint,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 5000
      }, (res) => {
        console.log('✅ HTTPS Connection: Success');
        console.log('Status code:', res.statusCode);
        console.log('Headers:', res.headers);
        resolve(true);
      });
      
      req.on('error', (error) => {
        console.log(`❌ HTTPS Connection: Failed - ${error.name}: ${error.message}`);
        resolve(false);
      });
      
      req.on('timeout', () => {
        console.log('❌ HTTPS Connection: Timeout');
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
  } catch (error) {
    console.log(`❌ HTTPS Connection: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test ListBucket permission
async function testListBucket() {
  console.log('\n=== Testing ListBucket Permission ===');
  try {
    console.log(`Testing ListBucket permission on ${process.env.S3_BUCKET_NAME}...`);
    const command = new ListObjectsCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      MaxKeys: 1
    });
    const response = await s3Client.send(command);
    console.log('✅ ListBucket permission: Success');
    return true;
  } catch (error) {
    console.log(`❌ ListBucket permission: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test direct upload with tiny file
async function testDirectUploadTiny() {
  console.log('\n=== Testing Direct Upload (Tiny File) ===');
  try {
    const fileContent = fs.readFileSync(TINY_FILE_PATH);
    const key = `test-uploads/tiny-test-${Date.now()}.txt`;
    
    console.log(`Uploading tiny file (${fileContent.length} bytes) to ${key}...`);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'text/plain'
    });
    
    const response = await s3Client.send(command);
    console.log('✅ Direct Upload (Tiny File): Success');
    return true;
  } catch (error) {
    console.log(`❌ Direct Upload (Tiny File): Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test direct upload with small file
async function testDirectUploadSmall() {
  console.log('\n=== Testing Direct Upload (Small File) ===');
  try {
    const fileContent = fs.readFileSync(SMALL_FILE_PATH);
    const key = `test-uploads/small-test-${Date.now()}.txt`;
    
    console.log(`Uploading small file (${fileContent.length} bytes) to ${key}...`);
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'text/plain'
    });
    
    const response = await s3Client.send(command);
    console.log('✅ Direct Upload (Small File): Success');
    return true;
  } catch (error) {
    console.log(`❌ Direct Upload (Small File): Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test multipart upload with medium file
async function testMultipartUpload() {
  console.log('\n=== Testing Multipart Upload (Medium File) ===');
  try {
    const fileContent = fs.readFileSync(MEDIUM_FILE_PATH);
    const key = `test-uploads/medium-test-${Date.now()}.txt`;
    
    console.log(`Uploading medium file (${fileContent.length} bytes) to ${key}...`);
    
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: 'text/plain'
      }
    });
    
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Progress: ${progress.loaded}/${progress.total}`);
    });
    
    await upload.done();
    console.log('✅ Multipart Upload (Medium File): Success');
    return true;
  } catch (error) {
    console.log(`❌ Multipart Upload (Medium File): Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test presigned URL generation and upload
async function testPresignedUrlUpload() {
  console.log('\n=== Testing Presigned URL Upload ===');
  try {
    // Generate a presigned URL
    const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
    const key = `test-uploads/presigned-test-${Date.now()}.txt`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: 'text/plain'
    });
    
    console.log('Generating presigned URL...');
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('✅ Presigned URL Generation: Success');
    console.log('Presigned URL:', presignedUrl);
    
    // Upload using the presigned URL
    console.log('Uploading file using presigned URL...');
    const fileContent = fs.readFileSync(TINY_FILE_PATH);
    
    const response = await axios.put(presignedUrl, fileContent, {
      headers: {
        'Content-Type': 'text/plain'
      },
      maxBodyLength: Infinity,
      timeout: 30000 // 30 seconds timeout
    });
    
    console.log('✅ Presigned URL Upload: Success');
    console.log('Status code:', response.status);
    return true;
  } catch (error) {
    console.log(`❌ Presigned URL Upload: Failed - ${error.name}: ${error.message}`);
    if (error.code === 'ECONNRESET') {
      console.log('⚠️ ECONNRESET error detected. This typically indicates:');
      console.log('  - Network connectivity issues');
      console.log('  - Firewall or proxy interrupting the connection');
      console.log('  - Timeout during upload');
    }
    return false;
  }
}

// Test network latency to S3
async function testNetworkLatency() {
  console.log('\n=== Testing Network Latency to S3 ===');
  try {
    const s3Endpoint = `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    console.log(`Measuring latency to ${s3Endpoint}...`);
    
    const start = Date.now();
    await axios.head(`https://${s3Endpoint}`);
    const latency = Date.now() - start;
    
    console.log(`✅ Network Latency: ${latency}ms`);
    if (latency > 500) {
      console.log('⚠️ High latency detected. This may cause timeouts during uploads.');
    }
    return true;
  } catch (error) {
    console.log(`❌ Network Latency Test: Failed - ${error.name}: ${error.message}`);
    return false;
  }
}

// Test CORS configuration
async function testCorsConfiguration() {
  console.log('\n=== Testing CORS Configuration ===');
  try {
    const s3Endpoint = `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    console.log(`Sending OPTIONS request to ${s3Endpoint}...`);
    
    const response = await axios.options(`https://${s3Endpoint}`, {
      headers: {
        'Origin': 'https://example.com',
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Headers': 'content-type'
      }
    });
    
    console.log('✅ CORS Configuration: Success');
    console.log('CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers['access-control-allow-origin'],
      'Access-Control-Allow-Methods': response.headers['access-control-allow-methods'],
      'Access-Control-Allow-Headers': response.headers['access-control-allow-headers']
    });
    return true;
  } catch (error) {
    console.log(`❌ CORS Configuration: Failed - ${error.name}: ${error.message}`);
    if (!error.response || !error.response.headers['access-control-allow-origin']) {
      console.log('⚠️ CORS headers not detected. This may cause issues with browser uploads.');
    }
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('\n=== Starting Network Diagnostics ===');
  
  // Basic connectivity tests
  await testDnsResolution();
  await testHttpsConnection();
  await testNetworkLatency();
  
  // Permission tests
  await testListBucket();
  
  // Upload tests
  const tinyUploadResult = await testDirectUploadTiny();
  const smallUploadResult = tinyUploadResult ? await testDirectUploadSmall() : false;
  const multipartUploadResult = smallUploadResult ? await testMultipartUpload() : false;
  const presignedUrlResult = await testPresignedUrlUpload();
  
  // CORS test
  await testCorsConfiguration();
  
  // Clean up test files
  try {
    fs.unlinkSync(TINY_FILE_PATH);
    fs.unlinkSync(SMALL_FILE_PATH);
    fs.unlinkSync(MEDIUM_FILE_PATH);
  } catch (error) {
    console.log('Warning: Failed to clean up test files', error.message);
  }
  
  // Summary
  console.log('\n=== Network Diagnostics Summary ===');
  console.log(`Direct Upload (Tiny File): ${tinyUploadResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`Direct Upload (Small File): ${smallUploadResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`Multipart Upload (Medium File): ${multipartUploadResult ? '✅ Success' : '❌ Failed'}`);
  console.log(`Presigned URL Upload: ${presignedUrlResult ? '✅ Success' : '❌ Failed'}`);
  
  // Recommendations
  console.log('\n=== Recommendations ===');
  if (!tinyUploadResult) {
    console.log('❌ Basic uploads are failing. This suggests permission issues or severe network problems.');
    console.log('   - Verify AWS credentials and permissions');
    console.log('   - Check network connectivity to S3');
  } else if (!smallUploadResult) {
    console.log('⚠️ Small file uploads are failing but tiny uploads work. This suggests potential timeout issues.');
    console.log('   - Check for network bandwidth limitations');
    console.log('   - Consider increasing timeout settings');
  } else if (!multipartUploadResult) {
    console.log('⚠️ Multipart uploads are failing. This suggests issues with larger file handling.');
    console.log('   - Check for network stability issues');
    console.log('   - Verify multipart upload permissions');
  }
  
  if (!presignedUrlResult) {
    console.log('⚠️ Presigned URL uploads are failing. This could be due to:');
    console.log('   - CORS configuration issues');
    console.log('   - Network interruptions during upload');
    console.log('   - Incorrect Content-Type or other headers');
    console.log('   - Try using a direct upload approach instead of presigned URLs');
  }
}

runTests();