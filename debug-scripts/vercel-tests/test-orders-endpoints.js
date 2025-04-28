/**
 * Test script for testing various order endpoints
 * This script focuses on testing different order-related endpoints with various query parameters
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
    },
    'scheduler': {
      userId: 6,
      orgId: 2,
      email: 'test.scheduler@example.com'
    },
    'admin_radiology': {
      userId: 5,
      orgId: 2,
      email: 'test.admin_radiology@example.com'
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
async function testEndpoint(endpoint, role, params = {}) {
  try {
    console.log(`\n🔍 Testing ${endpoint} with ${role} role and params: ${JSON.stringify(params)}...`);
    
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
  console.log('=== TESTING ORDER ENDPOINTS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('==============================\n');
  
  // Test /api/orders endpoint with different roles and parameters
  console.log('\n=== Testing /api/orders endpoint ===');
  await testEndpoint('/api/orders', 'admin_staff');
  await testEndpoint('/api/orders', 'admin_staff', { status: 'pending_admin' });
  await testEndpoint('/api/orders', 'admin_staff', { status: 'pending_admin', role: 'admin_staff' });
  await testEndpoint('/api/orders', 'physician');
  await testEndpoint('/api/orders', 'physician', { status: 'pending_validation' });
  await testEndpoint('/api/orders', 'admin_referring');
  await testEndpoint('/api/orders', 'admin_referring', { status: 'all' });
  
  // Test /api/admin/orders endpoint with different roles and parameters
  console.log('\n=== Testing /api/admin/orders endpoint ===');
  await testEndpoint('/api/admin/orders', 'admin_staff');
  await testEndpoint('/api/admin/orders', 'admin_staff', { status: 'pending_admin' });
  await testEndpoint('/api/admin/orders', 'admin_referring');
  await testEndpoint('/api/admin/orders', 'admin_referring', { status: 'all' });
  
  // Test /api/radiology/orders endpoint with different roles and parameters
  console.log('\n=== Testing /api/radiology/orders endpoint ===');
  await testEndpoint('/api/radiology/orders', 'scheduler');
  await testEndpoint('/api/radiology/orders', 'scheduler', { status: 'pending_radiology' });
  await testEndpoint('/api/radiology/orders', 'admin_radiology');
  await testEndpoint('/api/radiology/orders', 'admin_radiology', { status: 'all' });
  
  // Test /api/orders/queue endpoint with different roles and parameters
  console.log('\n=== Testing /api/orders/queue endpoint ===');
  await testEndpoint('/api/orders/queue', 'admin_staff');
  await testEndpoint('/api/orders/queue', 'admin_staff', { status: 'pending_admin' });
  await testEndpoint('/api/orders/queue', 'physician');
  
  // Test /api/admin/orders/queue endpoint with different roles and parameters
  console.log('\n=== Testing /api/admin/orders/queue endpoint ===');
  await testEndpoint('/api/admin/orders/queue', 'admin_staff');
  await testEndpoint('/api/admin/orders/queue', 'admin_referring');
  
  // Test /api/radiology/orders/queue endpoint with different roles and parameters
  console.log('\n=== Testing /api/radiology/orders/queue endpoint ===');
  await testEndpoint('/api/radiology/orders/queue', 'scheduler');
  await testEndpoint('/api/radiology/orders/queue', 'admin_radiology');
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/orders-endpoints-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/orders-endpoints-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});