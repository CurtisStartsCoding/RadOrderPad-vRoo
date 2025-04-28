/**
 * Test script for the orders listing endpoint on the local server
 * This script uses 127.0.0.1 instead of localhost and adds more debugging
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
async function testEndpoint(method, endpoint, role, params = {}, data = null) {
  try {
    console.log(`\n🔍 Testing ${method} ${endpoint} with ${role} role and params: ${JSON.stringify(params)}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    console.log(`   URL: ${API_URL}${endpoint}`);
    console.log(`   Token: ${token.substring(0, 20)}...`);
    
    let response;
    if (method === 'GET') {
      response = await client.get(endpoint, { params });
    } else if (method === 'POST') {
      response = await client.post(endpoint, data, { params });
    }
    
    recordTestResult(`${method} ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`${method} ${endpoint} with ${role} role and params: ${JSON.stringify(params)}`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING ORDERS LISTING ENDPOINT ON LOCAL SERVER (DEBUG) ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('====================================\n');
  
  // First, test the health endpoint to make sure the server is running
  console.log('\n=== Testing health endpoint ===');
  await testEndpoint('GET', '/health', 'super_admin');
  
  // Define roles to test with
  const roles = ['admin_staff', 'physician', 'admin_referring', 'super_admin'];
  
  // Test GET /api/orders with different roles
  console.log('\n=== Testing GET /api/orders endpoint ===');
  for (const role of roles) {
    await testEndpoint('GET', '/api/orders', role);
  }
  
  // Test GET /api/orders/me with different roles
  console.log('\n=== Testing GET /api/orders/me endpoint ===');
  for (const role of roles) {
    await testEndpoint('GET', '/api/orders/me', role);
  }
  
  // Test GET /api/users/me/orders with different roles
  console.log('\n=== Testing GET /api/users/me/orders endpoint ===');
  for (const role of roles) {
    await testEndpoint('GET', '/api/users/me/orders', role);
  }
  
  // Test GET /api/organizations/mine/orders with different roles
  console.log('\n=== Testing GET /api/organizations/mine/orders endpoint ===');
  for (const role of roles) {
    await testEndpoint('GET', '/api/organizations/mine/orders', role);
  }
  
  // Test GET /api/admin/orders with different roles
  console.log('\n=== Testing GET /api/admin/orders endpoint ===');
  for (const role of roles) {
    await testEndpoint('GET', '/api/admin/orders', role);
  }
  
  // Test GET /api/radiology/orders with different roles
  console.log('\n=== Testing GET /api/radiology/orders endpoint ===');
  for (const role of roles) {
    await testEndpoint('GET', '/api/radiology/orders', role);
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/orders-listing-debug-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/orders-listing-debug-results.json');
  
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