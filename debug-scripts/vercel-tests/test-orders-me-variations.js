/**
 * Test script for the /api/orders/me endpoint
 * This script focuses specifically on testing different variations of the /api/orders/me endpoint
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://radorderpad-q20dishz7-capecomas-projects.vercel.app';
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
      console.log(`   Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
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
async function testOrdersMeEndpoint(role, orderId = null, params = {}) {
  try {
    let endpoint = '/api/orders/me';
    if (orderId) {
      endpoint = `/api/orders/me/${orderId}`;
    }
    
    console.log(`\n🔍 Testing GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(endpoint, { params });
    recordTestResult(`GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, true, null, response);
    return response.data;
  } catch (error) {
    const endpoint = orderId ? `/api/orders/me/${orderId}` : '/api/orders/me';
    recordTestResult(`GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, false, error);
    return null;
  }
}

async function testOrdersMeWithQueryId(role, params = {}) {
  const endpoint = '/api/orders/me';
  try {
    console.log(`\n🔍 Testing GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(endpoint, { params });
    recordTestResult(`GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING /api/orders/me ENDPOINT VARIATIONS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('==============================================\n');
  
  // Define roles to test with
  const roles = ['admin_staff', 'physician', 'admin_referring', 'super_admin'];
  
  // Test GET /api/orders/me with different roles
  console.log('\n=== Testing GET /api/orders/me endpoint ===');
  for (const role of roles) {
    await testOrdersMeEndpoint(role);
  }
  
  // Test GET /api/orders/me/{orderId} with different roles and order IDs
  console.log('\n=== Testing GET /api/orders/me/{orderId} endpoint ===');
  const orderIds = [606, 607, 1, 2, 3];
  for (const role of roles) {
    for (const orderId of orderIds) {
      await testOrdersMeEndpoint(role, orderId);
    }
  }
  
  // Test GET /api/orders/me with orderId as query parameter
  console.log('\n=== Testing GET /api/orders/me?orderId={orderId} endpoint ===');
  for (const role of roles) {
    for (const orderId of orderIds) {
      await testOrdersMeWithQueryId(role, { orderId });
    }
  }
  
  // Test GET /api/orders/me with id as query parameter
  console.log('\n=== Testing GET /api/orders/me?id={orderId} endpoint ===');
  for (const role of roles) {
    for (const orderId of orderIds) {
      await testOrdersMeWithQueryId(role, { id: orderId });
    }
  }
  
  // Test GET /api/orders/me with order_id as query parameter
  console.log('\n=== Testing GET /api/orders/me?order_id={orderId} endpoint ===');
  for (const role of roles) {
    for (const orderId of orderIds) {
      await testOrdersMeWithQueryId(role, { order_id: orderId });
    }
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/orders-me-variations-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/orders-me-variations-results.json');
  
  // If we found any working endpoints, list them
  const workingTests = testResults.tests.filter(test => test.passed);
  if (workingTests.length > 0) {
    console.log('\n=== WORKING ENDPOINTS ===');
    workingTests.forEach(test => {
      console.log(`- ${test.name}`);
    });
    console.log('========================');
  }
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});