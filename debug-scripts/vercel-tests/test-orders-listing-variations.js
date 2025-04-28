/**
 * Test script for finding a working orders listing endpoint
 * This script tries various URL patterns, HTTP methods, roles, and query parameters
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
async function testEndpoint(method, endpoint, role, params = {}, data = null) {
  try {
    console.log(`\n🔍 Testing ${method} ${endpoint} with ${role} role and params: ${JSON.stringify(params)}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
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
  console.log('=== TESTING ORDERS LISTING VARIATIONS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=======================================\n');
  
  // Define roles to test with
  const roles = ['admin_staff', 'physician', 'admin_referring', 'super_admin'];
  
  // Define URL patterns to test
  const urlPatterns = [
    '/api/orders',
    '/api/orders/',
    '/api/orders/list',
    '/api/orders/all',
    '/api/orders/search',
    '/api/orders/query',
    '/api/orders/find',
    '/api/orders/get',
    '/api/orders/fetch',
    '/api/orders/view',
    '/api/admin/orders',
    '/api/admin/orders/',
    '/api/admin/orders/list',
    '/api/admin/orders/all',
    '/api/admin/orders/search',
    '/api/admin/orders/query',
    '/api/admin/orders/find',
    '/api/admin/orders/get',
    '/api/admin/orders/fetch',
    '/api/admin/orders/view',
    '/api/referring/orders',
    '/api/referring/orders/list',
    '/api/physician/orders',
    '/api/physician/orders/list',
    '/api/user/orders',
    '/api/user/orders/list',
    '/api/my/orders',
    '/api/my/orders/list'
  ];
  
  // Define query parameters to test
  const queryParams = [
    {},
    { status: 'pending_admin' },
    { status: 'pending_validation' },
    { status: 'all' },
    { role: 'admin_staff' },
    { role: 'physician' },
    { status: 'pending_admin', role: 'admin_staff' },
    { status: 'pending_validation', role: 'physician' },
    { page: 1, limit: 10 },
    { sortBy: 'created_at', sortOrder: 'desc' }
  ];
  
  // Test GET requests with different URL patterns, roles, and query parameters
  for (const role of roles) {
    for (const url of urlPatterns) {
      // Test with empty params first
      await testEndpoint('GET', url, role, {});
      
      // If we find a working endpoint, test it with all query parameters
      const emptyParamsTest = testResults.tests[testResults.tests.length - 1];
      if (emptyParamsTest.passed) {
        console.log(`\n🎉 Found working endpoint: ${url} with ${role} role! Testing with different query parameters...`);
        
        for (const params of queryParams) {
          if (Object.keys(params).length > 0) { // Skip empty params as we already tested it
            await testEndpoint('GET', url, role, params);
          }
        }
      }
    }
  }
  
  // Test POST requests for search functionality
  console.log('\n=== Testing POST requests for search functionality ===');
  
  const searchBodies = [
    { search: '' },
    { search: 'test' },
    { filters: { status: 'pending_admin' } },
    { filters: { status: 'pending_validation' } },
    { filters: { status: 'all' } },
    { filters: { role: 'admin_staff' } },
    { filters: { role: 'physician' } },
    { pagination: { page: 1, limit: 10 } },
    { sorting: { field: 'created_at', order: 'desc' } }
  ];
  
  for (const role of roles) {
    for (const url of ['/api/orders/search', '/api/admin/orders/search', '/api/orders/filter', '/api/admin/orders/filter']) {
      for (const body of searchBodies) {
        await testEndpoint('POST', url, role, {}, body);
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
  fs.writeFileSync('../../test-results/vercel-tests/orders-listing-variations-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/orders-listing-variations-results.json');
  
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