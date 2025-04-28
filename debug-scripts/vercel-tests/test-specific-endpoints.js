/**
 * Test script for specific endpoints that may be working
 * This script focuses on testing POST /api/orders and /api/admin/orders/{orderId}/send-to-radiology-fixed
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://api.radorderpad.com';
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
async function testCreateOrder() {
  try {
    console.log('\n🔍 Testing POST /api/orders with physician role...');
    
    const token = generateToken('physician');
    const client = createAuthClient(token);
    
    const orderData = {
      patient_id: 1,
      referring_organization_id: 1,
      radiology_organization_id: 2,
      priority: "routine",
      original_dictation: "72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy."
    };
    
    const response = await client.post(`/api/orders`, orderData);
    console.log('✅ PASSED: POST /api/orders with physician role');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ FAILED: POST /api/orders with physician role');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

async function testSendToRadiologyFixed() {
  try {
    console.log('\n🔍 Testing POST /api/admin/orders/607/send-to-radiology-fixed with admin_staff role...');
    
    const token = generateToken('admin_staff');
    const client = createAuthClient(token);
    
    const response = await client.post(`/api/admin/orders/607/send-to-radiology-fixed`);
    console.log('✅ PASSED: POST /api/admin/orders/607/send-to-radiology-fixed with admin_staff role');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.log('❌ FAILED: POST /api/admin/orders/607/send-to-radiology-fixed with admin_staff role');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('=== TESTING SPECIFIC ENDPOINTS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('==================================\n');
  
  await testCreateOrder();
  await testSendToRadiologyFixed();
  
  console.log('\n=== TEST COMPLETE ===');
}

// Execute tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});