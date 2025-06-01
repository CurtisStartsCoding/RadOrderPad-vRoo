/**
 * Diagnostic Test Configuration
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env.test') });

module.exports = {
  // API configuration
  api: {
    baseUrl: 'https://api.radorderpad.com/api',
    timeout: 30000 // 30 seconds
  },
  
  // AWS configuration
  aws: {
    region: process.env.AWS_REGION || 'us-east-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3Bucket: process.env.S3_BUCKET_NAME || 'radorderpad-uploads-prod-us-east-2'
  },
  
  // JWT configuration
  jwt: {
    secret: '79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112',
    expiresIn: '24h'
  },
  
  // Test data
  testData: {
    adminStaff: {
      userId: 2,
      orgId: 1,
      role: 'admin_staff',
      email: 'test.admin_staff@example.com'
    },
    adminReferring: {
      userId: 3,
      orgId: 1,
      role: 'admin_referring',
      email: 'test.admin_referring@example.com'
    },
    physician: {
      userId: 1,
      orgId: 1,
      role: 'physician',
      email: 'test.physician@example.com'
    },
    testOrderId: 912 // Use the order ID from our previous tests
  },
  
  // Test file data
  testFile: {
    name: 'test-document.txt',
    content: 'This is a test document for file upload diagnostics.',
    contentType: 'text/plain'
  }
};