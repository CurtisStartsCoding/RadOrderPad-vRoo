/**
 * Test script specifically for the roles that failed login
 */

const axios = require('axios');

// Configuration
const API_URL = 'https://api.radorderpad.com';

// Test user credentials with different password variations
const TEST_USERS = [
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'password123'
  },
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'Password123'
  },
  {
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    password: 'password'
  },
  {
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    password: 'password123'
  },
  {
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    password: 'Password123'
  },
  {
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    password: 'admin123'
  },
  {
    role: 'super_admin',
    email: 'admin@example.com', // Try a different email
    password: 'password123'
  }
];

// Function to test login with different credentials
async function testLoginEndpoint() {
  console.log('=== TESTING LOGIN FOR FAILED ROLES ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('====================================\n');

  // First, check if the users exist by trying to get user info
  console.log('\n🔍 Checking if users exist in the system...');
  
  // Get a working token first (from admin_staff)
  let adminToken = '';
  try {
    const authResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'test.admin_staff@example.com',
      password: 'password123'
    });
    adminToken = authResponse.data.token;
    console.log('✅ Got admin token for checking users');
  } catch (error) {
    console.log('❌ Failed to get admin token:', error.message);
    // Continue anyway
  }
  
  // Try to check users if we have a token
  if (adminToken) {
    const client = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    try {
      // Try to get users list
      const usersResponse = await client.get('/api/users');
      console.log('✅ Got users list');
      
      // Check if our problematic users exist
      const users = usersResponse.data.users || [];
      const adminReferringUser = users.find(u => u.email === 'test.admin_referring@example.com');
      const superAdminUser = users.find(u => u.email === 'test.superadmin@example.com');
      
      if (adminReferringUser) {
        console.log('✅ admin_referring user exists in the system:');
        console.log(JSON.stringify(adminReferringUser, null, 2));
      } else {
        console.log('❌ admin_referring user does not exist in the users list');
      }
      
      if (superAdminUser) {
        console.log('✅ super_admin user exists in the system:');
        console.log(JSON.stringify(superAdminUser, null, 2));
      } else {
        console.log('❌ super_admin user does not exist in the users list');
      }
    } catch (error) {
      console.log('❌ Failed to get users list:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }

  // Now try different login combinations
  console.log('\n🔍 Testing different login combinations...');
  
  for (const user of TEST_USERS) {
    try {
      console.log(`\n🔍 Testing POST /api/auth/login with ${user.role} role...`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      
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
      }
    }
  }
  
  console.log('\n=== TEST COMPLETE ===');
}

// Run the test
testLoginEndpoint().catch(error => {
  console.error('Error running test:', error);
});