/**
 * Test script for the billing endpoint
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Generate token for admin_referring role
function generateAdminReferringToken() {
  const payload = {
    userId: 5,
    orgId: 1,
    role: 'admin_referring',
    email: 'test.admin_referring@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(payload, JWT_SECRET);
}

// Test billing endpoint
async function testBillingEndpoint() {
  try {
    console.log('\n🔍 Testing GET /api/billing endpoint...');
    
    const token = generateAdminReferringToken();
    const client = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    try {
      const response = await client.get('/api/billing');
      console.log('✅ PASSED: GET /api/billing returned status', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      return { success: true, data: response.data };
    } catch (error) {
      console.log('❌ FAILED: GET /api/billing returned error');
      console.log('Status:', error.response?.status);
      console.log('Error message:', error.message);
      if (error.response) {
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      
      // Check if it's a 404 error as expected
      if (error.response && error.response.status === 404) {
        console.log('✅ CONFIRMED: GET /api/billing returns 404 as expected because the endpoint is not defined');
        console.log('The billing.routes.ts file only defines POST endpoints, not a GET / endpoint');
      }
      
      return { success: false, error: error.message, status: error.response?.status };
    }
  } catch (error) {
    console.log('❌ FAILED: Overall test execution failed');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test billing/create-checkout-session endpoint
async function testCreateCheckoutSessionEndpoint() {
  try {
    console.log('\n🔍 Testing POST /api/billing/create-checkout-session endpoint...');
    
    const token = generateAdminReferringToken();
    const client = axios.create({
      baseURL: API_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    try {
      const response = await client.post('/api/billing/create-checkout-session', {
        priceId: 'price_test',
        quantity: 1
      });
      console.log('✅ PASSED: POST /api/billing/create-checkout-session returned status', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      return { success: true, data: response.data };
    } catch (error) {
      console.log('❌ FAILED: POST /api/billing/create-checkout-session returned error');
      console.log('Status:', error.response?.status);
      console.log('Error message:', error.message);
      if (error.response) {
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      }
      return { success: false, error: error.message, status: error.response?.status };
    }
  } catch (error) {
    console.log('❌ FAILED: Overall test execution failed');
    console.log('Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run tests
console.log('=== TESTING BILLING ENDPOINTS ===');
console.log(`Testing API at: ${API_URL}`);
console.log('================================\n');

async function runTests() {
  await testBillingEndpoint();
  await testCreateCheckoutSessionEndpoint();
  
  console.log('\n=== TEST SUMMARY ===');
  console.log('The GET /api/billing endpoint is not defined in billing.routes.ts');
  console.log('To fix this issue, add a GET / endpoint to the billing.routes.ts file');
  console.log('===================');
}

runTests().catch(error => {
  console.error('Error running tests:', error);
});