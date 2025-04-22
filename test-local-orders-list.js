/**
 * Test script for getting a list of orders from the local server
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Generate tokens for different roles
function generateToken(role) {
  const roleConfig = {
    'super_admin': {
      userId: 999,
      orgId: 1,
      email: 'test.superadmin@example.com'
    },
    'admin_staff': {
      userId: 4,
      orgId: 1,
      email: 'test.admin_staff@example.com'
    },
    'physician': {
      userId: 3,
      orgId: 1,
      email: 'test.physician@example.com'
    },
    'admin_referring': {
      userId: 2,
      orgId: 1,
      email: 'test.admin_referring@example.com'
    }
  };

  const config = roleConfig[role] || roleConfig['super_admin'];
  
  const payload = {
    userId: config.userId,
    orgId: config.orgId,
    role: role,
    email: config.email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Create API client with authentication
function createAuthClient(token) {
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}

// Test functions
async function testGetOrdersWithRole(role) {
  try {
    console.log(`\n🔍 Testing GET /api/orders with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/orders`);
    console.log(`✅ PASSED: GET /api/orders with ${role} role`);
    console.log(`   Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
    return response.data;
  } catch (error) {
    console.log(`❌ FAILED: GET /api/orders with ${role} role`);
    console.log(`   Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING GET ORDERS LIST (LOCAL SERVER) ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('==========================================\n');
  
  // Test with different roles
  await testGetOrdersWithRole('admin_staff');
  await testGetOrdersWithRole('physician');
  await testGetOrdersWithRole('admin_referring');
  await testGetOrdersWithRole('super_admin');
  
  console.log('\n=== TEST COMPLETE ===');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});