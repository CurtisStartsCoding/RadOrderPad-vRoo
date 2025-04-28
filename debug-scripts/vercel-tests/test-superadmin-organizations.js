/**
 * Test script for the superadmin/organizations endpoint
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const JWT_SECRET = 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Generate token for super_admin role
function generateToken() {
  const payload = {
    userId: 10,
    orgId: 1,
    role: 'super_admin',
    email: 'test.superadmin@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Test superadmin/organizations endpoint
async function testSuperadminOrganizations() {
  try {
    console.log('\n🔍 Testing GET /api/superadmin/organizations...');
    
    const token = generateToken();
    const client = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const response = await client.get('/api/superadmin/organizations');
    console.log('✅ PASSED: GET /api/superadmin/organizations');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ FAILED: GET /api/superadmin/organizations');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Run test
console.log('=== TESTING SUPERADMIN/ORGANIZATIONS ENDPOINT ===');
console.log(`Testing API at: ${API_URL}`);
console.log('==============================================\n');

testSuperadminOrganizations().catch(error => {
  console.error('Error running test:', error);
});