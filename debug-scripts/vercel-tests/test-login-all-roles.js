/**
 * Test script specifically for the login endpoint with all roles
 */

const axios = require('axios');
const fs = require('fs');

// Configuration
const API_URL = 'https://api.radorderpad.com';

// Test user credentials for all roles
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
  },
  {
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    password: 'password123'
  },
  {
    role: 'admin_radiology',
    email: 'test.admin_radiology@example.com',
    password: 'password123'
  },
  {
    role: 'scheduler',
    email: 'test.scheduler@example.com',
    password: 'password123'
  },
  {
    role: 'radiologist',
    email: 'test.radiologist@example.com',
    password: 'password123'
  }
];

// Results tracking
const results = {
  passed: 0,
  failed: 0,
  roles: {}
};

// Function to test login with different users
async function testLoginEndpoint() {
  console.log('=== TESTING LOGIN ENDPOINT WITH ALL ROLES ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=========================================\n');

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
      results.passed++;
      results.roles[user.role] = {
        status: 'success',
        responseTime: responseTime.toFixed(2),
        tokenReceived: !!response.data.token
      };
      
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
      results.failed++;
      results.roles[user.role] = {
        status: 'failed',
        error: error.message,
        statusCode: error.response?.status,
        errorMessage: error.response?.data?.message
      };
      
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
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  console.log('\n=== RESULTS BY ROLE ===');
  for (const [role, result] of Object.entries(results.roles)) {
    if (result.status === 'success') {
      console.log(`✅ ${role}: Login successful (${result.responseTime}ms)`);
    } else {
      console.log(`❌ ${role}: Login failed - ${result.statusCode} ${result.errorMessage || result.error}`);
    }
  }
  
  console.log('\n=== TEST COMPLETE ===');
  
  // Save results to file
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync('../test-results')) {
      fs.mkdirSync('../test-results', { recursive: true });
    }
    fs.writeFileSync('../test-results/login-test-results.json', JSON.stringify(results, null, 2));
    console.log('\nTest results saved to ../test-results/login-test-results.json');
  } catch (error) {
    console.log('\nFailed to save test results:', error.message);
  }
}

// Run the test
testLoginEndpoint().catch(error => {
  console.error('Error running test:', error);
});