/**
 * Test script specifically for the login endpoint
 */

const axios = require('axios');

// Configuration
const API_URL = 'https://api.radorderpad.com';

// Test user credentials
const TEST_USERS = [
  {
    role: 'admin_staff',
    email: 'test.admin_staff@example.com',
    password: 'password123'
  },
  {
    role: 'physician',
    email: 'test.physician@example.com',
    password: 'password123'
  },
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'password123'
  }
];

// Function to test login with different users
async function testLoginEndpoint() {
  console.log('=== TESTING LOGIN ENDPOINT ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('============================\n');

  for (const user of TEST_USERS) {
    try {
      console.log(`\n🔍 Testing POST /api/auth/login with ${user.role} role...`);
      console.log(`   Email: ${user.email}`);
      
      const startTime = process.hrtime.bigint();
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: user.email,
        password: user.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const endTime = process.hrtime.bigint();
      const responseTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      console.log(`✅ PASSED: Login with ${user.role} role (${responseTime.toFixed(2)}ms)`);
      console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      
      // Verify token structure
      if (response.data.token) {
        console.log('   Token received ✓');
        
        // Check if token is in JWT format (header.payload.signature)
        const tokenParts = response.data.token.split('.');
        if (tokenParts.length === 3) {
          console.log('   Token format is valid (JWT) ✓');
          
          try {
            // Decode the payload (middle part)
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            console.log('   Token payload:', JSON.stringify(payload, null, 2));
          } catch (e) {
            console.log('   Could not decode token payload');
          }
        } else {
          console.log('   Token format is not standard JWT');
        }
      } else {
        console.log('   No token in response ✗');
      }
    } catch (error) {
      console.log(`❌ FAILED: Login with ${user.role} role`);
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
        
        // Check for specific error types
        if (error.response.status === 404) {
          console.log('\n🔍 DIAGNOSIS: The login endpoint route is not found (404)');
          console.log('This suggests the route is not properly defined or registered in the API.');
          console.log('Possible issues:');
          console.log('1. The auth routes module might not be loaded');
          console.log('2. The route path might be different than expected');
          console.log('3. There might be a deployment issue where the auth routes are missing');
        } else if (error.response.status === 401) {
          console.log('\n🔍 DIAGNOSIS: Authentication failed (401)');
          console.log('This suggests the endpoint exists but the credentials are invalid.');
        }
      } else if (error.code === 'ECONNREFUSED') {
        console.log('\n🔍 DIAGNOSIS: Connection refused');
        console.log('The server is not accepting connections. It might be down or not properly deployed.');
      } else if (error.code === 'ENOTFOUND') {
        console.log('\n🔍 DIAGNOSIS: Host not found');
        console.log('The API URL is incorrect or the server is not accessible.');
      }
    }
  }
  
  // Test with incorrect URL to check for path issues
  try {
    console.log('\n🔍 Testing alternative paths to check for routing issues...');
    
    // Test without /api prefix
    console.log('\n🔍 Testing POST /auth/login (without /api prefix)...');
    await axios.post(`${API_URL}/auth/login`, {
      email: TEST_USERS[0].email,
      password: TEST_USERS[0].password
    });
    console.log('✅ PASSED: Login without /api prefix works');
  } catch (error) {
    console.log('❌ FAILED: Login without /api prefix');
    console.log('Status:', error.response?.status);
    
    // Test with trailing slash
    try {
      console.log('\n🔍 Testing POST /api/auth/login/ (with trailing slash)...');
      await axios.post(`${API_URL}/api/auth/login/`, {
        email: TEST_USERS[0].email,
        password: TEST_USERS[0].password
      });
      console.log('✅ PASSED: Login with trailing slash works');
    } catch (error) {
      console.log('❌ FAILED: Login with trailing slash');
      console.log('Status:', error.response?.status);
    }
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
testLoginEndpoint().catch(error => {
  console.error('Error running test:', error);
});