/**
 * Test script for the organizations/mine endpoint
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const JWT_SECRET = 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Generate token for admin_staff role
function generateToken() {
  const payload = {
    userId: 4,
    orgId: 1,
    role: 'admin_staff',
    email: 'test.admin_staff@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Test organizations/mine endpoint
async function testOrganizationsMine() {
  try {
    console.log('\n🔍 Testing GET /api/organizations/mine...');
    
    const token = generateToken();
    const client = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const response = await client.get('/api/organizations/mine');
    console.log('✅ PASSED: GET /api/organizations/mine');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ FAILED: GET /api/organizations/mine');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Run test
console.log('=== TESTING ORGANIZATIONS/MINE ENDPOINT ===');
console.log(`Testing API at: ${API_URL}`);
console.log('=========================================\n');

testOrganizationsMine().catch(error => {
  console.error('Error running test:', error);
});