/**
 * Test script for updating an order
 * This script focuses on testing the PUT /api/orders/{id} endpoint with all required fields
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://radorderpad-q20dishz7-capecomas-projects.vercel.app';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';
const ORDER_ID = 607; // Use order #607 for testing

// Generate token for physician role
function generatePhysicianToken() {
  const payload = {
    userId: 3,
    orgId: 1,
    role: 'physician',
    email: 'test.physician@example.com',
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

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function recordTestResult(name, passed, error = null, response = null) {
  if (passed) {
    testResults.passed++;
    console.log(`✅ PASSED: ${name}`);
    if (response) {
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    }
  } else {
    testResults.failed++;
    console.log(`❌ FAILED: ${name}`);
    if (error) {
      console.log(`   Error: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
  }
  
  testResults.tests.push({
    name,
    passed,
    error: error ? {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    } : null,
    response: response ? {
      status: response.status,
      data: response.data
    } : null
  });
}

// Test functions
async function testGetOrderDetails() {
  try {
    console.log(`\n🔍 Testing GET /api/orders/${ORDER_ID}...`);
    
    const token = generatePhysicianToken();
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/orders/${ORDER_ID}`);
    recordTestResult(`GET /api/orders/${ORDER_ID}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders/${ORDER_ID}`, false, error);
    return null;
  }
}

async function testUpdateOrder(orderData) {
  try {
    console.log(`\n🔍 Testing PUT /api/orders/${ORDER_ID}...`);
    
    const token = generatePhysicianToken();
    const client = createAuthClient(token);
    
    // Include all required fields with valid values
    const updateData = {
      finalValidationStatus: 'appropriate', // Valid values: 'appropriate', 'inappropriate', 'needs_clarification'
      finalCPTCode: '70450',
      clinicalIndication: 'Headache',
      ...orderData
    };
    
    const response = await client.put(`/api/orders/${ORDER_ID}`, updateData);
    recordTestResult(`PUT /api/orders/${ORDER_ID}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`PUT /api/orders/${ORDER_ID}`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING ORDER UPDATE ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log(`Order ID: ${ORDER_ID}`);
  console.log('==========================\n');
  
  // First get the current order details
  const orderDetails = await testGetOrderDetails();
  
  if (orderDetails) {
    // Then try to update the order
    await testUpdateOrder({
      dictation: 'Updated dictation for API testing',
      // Include any other fields you want to update
    });
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/update-order-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/update-order-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});