const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.radorderpad.com';

async function testUploadDetailed() {
  console.log('=== Detailed File Upload Test ===\n');

  try {
    // Load token
    const tokenPath = path.join(__dirname, '..', 'tokens', 'admin_staff-token.txt');
    const token = fs.readFileSync(tokenPath, 'utf8').trim();
    console.log('✓ Token loaded\n');

    // Step 1: Get presigned URL
    console.log('1. Getting presigned URL...');
    const presignedResponse = await axios.post(
      `${API_URL}/api/uploads/presigned-url`,
      {
        fileName: "test-detailed.txt",
        contentType: "text/plain",
        fileType: "supplemental",
        orderId: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    const { uploadUrl, fileKey } = presignedResponse.data;
    console.log('✓ Presigned URL received');
    console.log('File Key:', fileKey);
    console.log('Upload URL:', uploadUrl.substring(0, 100) + '...\n');

    // Step 2: Create test file
    const testContent = 'This is a test file for upload verification';
    const testFilePath = path.join(__dirname, 'test-detailed.txt');
    fs.writeFileSync(testFilePath, testContent);
    console.log('2. Test file created\n');

    // Step 3: Upload file
    console.log('3. Uploading file...');
    
    // Parse the URL to check headers
    const url = new URL(uploadUrl);
    console.log('Upload host:', url.hostname);
    console.log('Upload path:', url.pathname);
    
    try {
      // Try upload without any extra headers first
      const uploadResponse = await axios.put(uploadUrl, testContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Length': Buffer.byteLength(testContent)
        },
        maxRedirects: 0,
        validateStatus: function (status) {
          return status < 500; // Accept any status < 500 to see the response
        }
      });

      console.log('Upload response status:', uploadResponse.status);
      console.log('Upload response headers:', uploadResponse.headers);
      
      if (uploadResponse.status === 200) {
        console.log('✅ File uploaded successfully!\n');
        
        // Step 4: Confirm upload
        console.log('4. Confirming upload...');
        const confirmResponse = await axios.post(
          `${API_URL}/api/uploads/confirm`,
          {
            fileKey: fileKey,
            orderId: 1
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        console.log('Confirm response:', confirmResponse.data);
        console.log('✅ Upload confirmed successfully!');
      } else {
        console.log('❌ Upload failed with status:', uploadResponse.status);
        console.log('Response data:', uploadResponse.data);
        
        // Try to parse XML error if present
        if (uploadResponse.data && typeof uploadResponse.data === 'string' && uploadResponse.data.includes('<?xml')) {
          const errorMatch = uploadResponse.data.match(/<Message>([^<]+)<\/Message>/);
          if (errorMatch) {
            console.log('\nS3 Error Message:', errorMatch[1]);
          }
        }
      }
      
    } catch (uploadError) {
      console.log('❌ Upload error:', uploadError.message);
      if (uploadError.response) {
        console.log('Error status:', uploadError.response.status);
        console.log('Error headers:', uploadError.response.headers);
        console.log('Error data:', uploadError.response.data);
      }
    }

    // Cleanup
    fs.unlinkSync(testFilePath);
    console.log('\nTest file cleaned up');

  } catch (error) {
    console.error('Test error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testUploadDetailed();