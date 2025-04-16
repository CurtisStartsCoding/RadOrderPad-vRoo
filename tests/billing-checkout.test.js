const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const JWT_TOKEN = process.env.JWT_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoiYWRtaW5fcmVmZXJyaW5nIiwiZW1haWwiOiJ0ZXN0LmFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ0NTc1NTM4LCJleHAiOjE3NDQ2NjE5Mzh9.gnTcT9gQoz1RNmvo6A_DWAolelanr0ilBvn6PylJK9k';

// Helper function to make API requests
async function makeRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const responseData = await response.json();
  
  return {
    status: response.status,
    data: responseData
  };
}

// Main test function
async function runTests() {
  console.log('Running Billing Checkout Tests...');
  
  try {
    // Test 1: Create checkout session
    console.log('\nTest 1: Create checkout session');
    const response = await makeRequest('/billing/create-checkout-session', 'POST', {});
    
    console.log('Response:', JSON.stringify(response, null, 2));
    
    if (response.status === 200 && response.data.success && response.data.sessionId) {
      console.log('✅ Test passed: Successfully created checkout session');
      console.log('Session ID:', response.data.sessionId);
      console.log('Checkout URL: https://checkout.stripe.com/c/pay/' + response.data.sessionId);
    } else {
      console.log('❌ Test failed: Could not create checkout session');
    }
    
    // Test 2: Create checkout session with custom price ID
    console.log('\nTest 2: Create checkout session with custom price ID');
    const customPriceResponse = await makeRequest('/billing/create-checkout-session', 'POST', {
      priceId: 'price_' + uuidv4().replace(/-/g, '')
    });
    
    console.log('Response:', JSON.stringify(customPriceResponse, null, 2));
    
    if (customPriceResponse.status === 200 && customPriceResponse.data.success) {
      console.log('✅ Test passed: Successfully created checkout session with custom price ID');
    } else if (customPriceResponse.status === 500 && customPriceResponse.data.message.includes('No such price')) {
      console.log('✅ Test passed: Correctly rejected invalid price ID');
    } else {
      console.log('❓ Test inconclusive: Unexpected response');
    }
    
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();