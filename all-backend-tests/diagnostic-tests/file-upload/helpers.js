/**
 * Diagnostic Test Helpers
 */

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const chalk = require('chalk');
const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const config = require('./config');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with userId, orgId, role, and email
 * @returns {string} JWT token
 */
function generateToken(user) {
  const payload = {
    userId: user.userId,
    orgId: user.orgId,
    role: user.role,
    email: user.email
  };
  
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

/**
 * Create a test file
 * @param {string} fileName - Name of the file to create
 * @param {string} content - Content of the file
 * @returns {string} Path to the created file
 */
function createTestFile(fileName, content) {
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content);
  console.log(chalk.blue(`Test file created at: ${filePath}`));
  return filePath;
}

/**
 * Delete a test file
 * @param {string} filePath - Path to the file to delete
 */
function deleteTestFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(chalk.blue(`Test file deleted: ${filePath}`));
  }
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {Object} body - Request body
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Response data
 */
async function makeApiRequest(endpoint, method = 'GET', body = null, token) {
  try {
    const url = `${config.api.baseUrl}${endpoint}`;
    console.log(chalk.blue(`Making ${method} request to: ${url}`));
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      timeout: config.api.timeout
    };
    
    if (body) {
      options.data = body;
    }
    
    const response = await axios(url, options);
    
    console.log(chalk.green(`Response status: ${response.status}`));
    return {
      status: response.status,
      data: response.data,
      success: true
    };
  } catch (error) {
    console.log(chalk.red(`Error making API request: ${error.message}`));
    return {
      status: error.response?.status,
      data: error.response?.data,
      success: false,
      error: error.message
    };
  }
}

/**
 * Initialize AWS S3 client
 * @returns {AWS.S3} S3 client
 */
function initS3Client() {
  return new AWS.S3({
    region: config.aws.region,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  });
}

/**
 * Generate a presigned URL for S3 upload
 * @param {string} key - S3 object key
 * @param {string} contentType - Content type of the file
 * @returns {Promise<string>} Presigned URL
 */
async function generatePresignedUrl(key, contentType) {
  try {
    const s3 = initS3Client();
    const params = {
      Bucket: config.aws.s3Bucket,
      Key: key,
      ContentType: contentType,
      Expires: 300 // 5 minutes
    };
    
    const url = await s3.getSignedUrlPromise('putObject', params);
    console.log(chalk.green('Presigned URL generated successfully'));
    return url;
  } catch (error) {
    console.log(chalk.red(`Error generating presigned URL: ${error.message}`));
    throw error;
  }
}

/**
 * Upload a file using a presigned URL
 * @param {string} presignedUrl - Presigned URL for upload
 * @param {string} filePath - Path to the file to upload
 * @param {string} contentType - Content type of the file
 * @returns {Promise<boolean>} Success status
 */
async function uploadWithPresignedUrl(presignedUrl, filePath, contentType) {
  try {
    const fileContent = fs.readFileSync(filePath);
    
    // Parse the URL to extract query parameters
    const url = new URL(presignedUrl);
    console.log(chalk.blue(`Uploading to: ${url.hostname}${url.pathname}`));
    
    // Set up additional headers that might be needed
    const headers = {
      'Content-Type': contentType,
      'Content-Length': fileContent.length.toString(),
      'x-amz-acl': 'private'
    };
    
    // Add any x-amz headers from the presigned URL query parameters
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith('x-amz-')) {
        headers[key] = value;
      }
    }
    
    console.log(chalk.blue('Using headers:'), headers);
    
    // Increase timeout to 60 seconds
    const timeout = 60000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(chalk.blue('Sending request...'));
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: headers,
        body: fileContent,
        signal: controller.signal,
        timeout: timeout
      });
      
      clearTimeout(timeoutId);
      
      console.log(chalk.blue(`Upload response status: ${response.status}`));
      return response.status >= 200 && response.status < 300;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.log(chalk.yellow('⚠️ Upload request timed out after 60 seconds'));
      } else if (fetchError.code === 'ECONNRESET') {
        console.log(chalk.yellow('⚠️ Connection reset during upload (ECONNRESET)'));
        console.log(chalk.blue('Attempting fallback to direct S3 upload...'));
        
        // Extract the key from the URL path
        const pathParts = url.pathname.split('/');
        const key = pathParts.slice(1).join('/'); // Remove the leading slash
        
        try {
          // Fallback to direct upload
          const location = await uploadDirectToS3(key, filePath, contentType);
          console.log(chalk.green('✅ Fallback direct upload successful'));
          console.log(chalk.blue(`File available at: ${location}`));
          return true;
        } catch (directUploadError) {
          console.log(chalk.red(`❌ Fallback direct upload failed: ${directUploadError.message}`));
          return false;
        }
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.log(chalk.red(`Error uploading with presigned URL: ${error.message}`));
    
    // Log more detailed error information
    if (error.code) {
      console.log(chalk.red(`Error code: ${error.code}`));
    }
    if (error.errno) {
      console.log(chalk.red(`Error number: ${error.errno}`));
    }
    if (error.syscall) {
      console.log(chalk.red(`System call: ${error.syscall}`));
    }
    
    return false;
  }
}

/**
 * Upload a file directly to S3
 * @param {string} key - S3 object key
 * @param {string} filePath - Path to the file to upload
 * @param {string} contentType - Content type of the file
 * @returns {Promise<string>} S3 object URL
 */
async function uploadDirectToS3(key, filePath, contentType) {
  try {
    const s3 = initS3Client();
    const fileContent = fs.readFileSync(filePath);
    
    const params = {
      Bucket: config.aws.s3Bucket,
      Key: key,
      Body: fileContent,
      ContentType: contentType
    };
    
    console.log(chalk.blue(`Uploading directly to S3: ${config.aws.s3Bucket}/${key}`));
    const result = await s3.upload(params).promise();
    console.log(chalk.green('File uploaded successfully to S3'));
    return result.Location;
  } catch (error) {
    console.log(chalk.red(`Error uploading directly to S3: ${error.message}`));
    throw error;
  }
}

/**
 * List objects in S3 bucket
 * @param {string} prefix - Prefix to filter objects
 * @param {number} maxKeys - Maximum number of keys to return
 * @returns {Promise<Array>} List of objects
 */
async function listS3Objects(prefix = '', maxKeys = 10) {
  try {
    const s3 = initS3Client();
    const params = {
      Bucket: config.aws.s3Bucket,
      Prefix: prefix,
      MaxKeys: maxKeys
    };
    
    const result = await s3.listObjectsV2(params).promise();
    console.log(chalk.green(`Found ${result.Contents.length} objects in S3 bucket`));
    return result.Contents;
  } catch (error) {
    console.log(chalk.red(`Error listing S3 objects: ${error.message}`));
    throw error;
  }
}

module.exports = {
  generateToken,
  createTestFile,
  deleteTestFile,
  makeApiRequest,
  initS3Client,
  generatePresignedUrl,
  uploadWithPresignedUrl,
  uploadDirectToS3,
  listS3Objects
};