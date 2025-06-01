const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://api.radorderpad.com';

async function checkAPIAWSUser() {
  console.log('=== Checking AWS User Used by API Server ===\n');

  try {
    // First, generate a token
    console.log('1. Generating admin staff token...');
    const tokenPath = path.join(__dirname, '..', 'tokens', 'admin_staff-token.txt');
    
    if (!fs.existsSync(tokenPath)) {
      console.error('Error: Admin staff token not found. Please run token generation first.');
      return;
    }
    
    const token = fs.readFileSync(tokenPath, 'utf8').trim();
    console.log('✓ Token loaded successfully\n');

    // Request a presigned URL
    console.log('2. Requesting presigned URL from API...');
    const response = await axios.post(
      `${API_URL}/api/uploads/presigned-url`,
      {
        fileName: "test-check-user.txt",
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

    console.log('✓ Presigned URL received\n');
    
    // Parse the presigned URL to extract AWS credentials
    console.log('3. Analyzing presigned URL...');
    const presignedUrl = response.data.uploadUrl;
    console.log('Full URL:', presignedUrl, '\n');
    
    // Extract the X-Amz-Credential parameter
    const credentialMatch = presignedUrl.match(/X-Amz-Credential=([^&]+)/);
    if (credentialMatch) {
      const credential = decodeURIComponent(credentialMatch[1]);
      const accessKeyId = credential.split('/')[0];
      
      console.log('=== API Server AWS Credentials ===');
      console.log('Access Key ID:', accessKeyId);
      console.log('Full Credential:', credential);
      
      // Compare with known values
      console.log('\n=== Comparison ===');
      console.log('Old Access Key (from your original .env): AKIAVP2W2JHIZLEMD37D');
      console.log('New Access Key (you just created):        AKIAVP2W2JHIZV7R2OPT');
      console.log('API Server is using:                      ' + accessKeyId);
      
      if (accessKeyId === 'AKIAVP2W2JHIZLEMD37D') {
        console.log('\n✓ The API server is using the OLD credentials');
        console.log('  This explains why the file upload fails - the server doesn\'t have the updated IAM policy');
      } else if (accessKeyId === 'AKIAVP2W2JHIZV7R2OPT') {
        console.log('\n✓ The API server is using the NEW credentials');
      } else {
        console.log('\n⚠ The API server is using different credentials than expected');
      }
    } else {
      console.log('Could not extract AWS credentials from presigned URL');
    }
    
  } catch (error) {
    console.error('Error checking API AWS user:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the check
checkAPIAWSUser();