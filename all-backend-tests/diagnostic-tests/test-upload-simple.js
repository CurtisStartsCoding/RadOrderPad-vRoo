const https = require('https');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = 'https://api.radorderpad.com';

async function testSimpleUpload() {
  console.log('=== Simple S3 Upload Test ===\n');

  try {
    // Load token
    const tokenPath = path.join(__dirname, '..', 'tokens', 'admin_staff-token.txt');
    const token = fs.readFileSync(tokenPath, 'utf8').trim();
    console.log('1. Token loaded\n');

    // Get presigned URL
    console.log('2. Getting presigned URL...');
    const presignedResponse = await axios.post(
      `${API_URL}/api/uploads/presigned-url`,
      {
        fileName: "test-simple.txt",
        contentType: "text/plain",
        fileType: "supplemental",
        orderId: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 10000
      }
    );

    const { uploadUrl } = presignedResponse.data;
    console.log('✓ Presigned URL received\n');

    // Parse URL
    const url = new URL(uploadUrl);
    console.log('3. Upload details:');
    console.log('   Host:', url.hostname);
    console.log('   Path:', url.pathname);
    console.log('   Query params:', url.search.substring(0, 100) + '...\n');

    // Test content
    const testContent = 'Simple test file content';
    
    // Try a simple HTTPS PUT request
    console.log('4. Attempting upload with native HTTPS...');
    
    const uploadPromise = new Promise((resolve, reject) => {
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(testContent)
        },
        timeout: 15000
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          console.log('   Status:', res.statusCode);
          console.log('   Headers:', JSON.stringify(res.headers, null, 2));
          if (data) {
            console.log('   Response:', data.substring(0, 500));
          }
          resolve({ status: res.statusCode, data });
        });
      });

      req.on('error', (error) => {
        console.log('   Request error:', error.message);
        reject(error);
      });

      req.on('timeout', () => {
        console.log('   Request timeout!');
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(testContent);
      req.end();
    });

    try {
      const result = await uploadPromise;
      if (result.status === 200) {
        console.log('\n✅ Upload successful!');
      } else {
        console.log('\n❌ Upload failed with status:', result.status);
        
        // Try to parse S3 error
        if (result.data && result.data.includes('<?xml')) {
          const messageMatch = result.data.match(/<Message>([^<]+)<\/Message>/);
          const codeMatch = result.data.match(/<Code>([^<]+)<\/Code>/);
          if (codeMatch) console.log('   Error Code:', codeMatch[1]);
          if (messageMatch) console.log('   Error Message:', messageMatch[1]);
        }
      }
    } catch (error) {
      console.log('\n❌ Upload error:', error.message);
    }

  } catch (error) {
    console.error('Test error:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.error('The request timed out - this might indicate a network or firewall issue');
    }
  }
}

// Run test
testSimpleUpload();