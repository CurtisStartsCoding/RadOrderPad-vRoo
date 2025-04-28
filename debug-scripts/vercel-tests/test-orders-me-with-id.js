/**
 * Test script for the /api/orders/me endpoint with order ID parameter
 * This script tries different ways to pass the order ID parameter
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'http://127.0.0.1:3000'; // Use IPv4 address explicitly
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
async function testOrdersMeEndpoint(role, orderId, method = 'query') {
  try {
    let endpoint = '/api/orders/me';
    let params = {};
    
    if (method === 'path') {
      endpoint = `/api/orders/me/${orderId}`;
    } else if (method === 'query') {
      params = { orderId };
    } else if (method === 'id') {
      params = { id: orderId };
    } else if (method === 'order_id') {
      params = { order_id: orderId };
    }
    
    console.log(`\n🔍 Testing GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}...`);
    console.log(`   URL: ${API_URL}${endpoint}`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(endpoint, { params });
    recordTestResult(`GET ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, true, null, response);
    return response.data;
  } catch (error) {
    const endpointForError = method === 'path' ? `/api/orders/me/${orderId}` : '/api/orders/me';
    recordTestResult(`GET ${endpointForError} with ${role} role and params: ${JSON.stringify(method === 'path' ? {} : { [method === 'query' ? 'orderId' : method === 'id' ? 'id' : 'order_id']: orderId })}`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING /api/orders/me ENDPOINT WITH ORDER ID ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('====================================\n');
  
  // Define roles to test with
  const roles = ['admin_staff', 'physician', 'admin_referring', 'super_admin'];
  
  // Define order IDs to test with
  const orderIds = [1, 2, 3, 606, 607];
  
  // Define methods to pass the order ID
  const methods = ['query', 'path', 'id', 'order_id'];
  
  // Test all combinations
  for (const role of roles) {
    for (const orderId of orderIds) {
      for (const method of methods) {
        await testOrdersMeEndpoint(role, orderId, method);
      }
    }
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/orders-me-with-id-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/orders-me-with-id-results.json');
  
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