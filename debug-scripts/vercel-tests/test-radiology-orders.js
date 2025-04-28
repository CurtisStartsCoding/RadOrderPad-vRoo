/**
 * Test script for the radiology orders endpoint
 * This script focuses on testing the /api/radiology/orders endpoint with different query parameters
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
    'scheduler': {
      userId: 6,
      orgId: 2,
      email: 'test.scheduler@example.com'
    },
    'admin_radiology': {
      userId: 5,
      orgId: 2,
      email: 'test.admin_radiology@example.com'
    },
    'radiologist': {
      userId: 7,
      orgId: 2,
      email: 'test.radiologist@example.com'
    }
  };

  const config = roleConfig[role] || roleConfig['scheduler'];
  
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
async function testRadiologyOrdersEndpoint(role, params = {}) {
  try {
    console.log(`\n🔍 Testing /api/radiology/orders with ${role} role and params: ${JSON.stringify(params)}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get('/api/radiology/orders', { params });
    recordTestResult(`GET /api/radiology/orders with ${role} role and params: ${JSON.stringify(params)}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/radiology/orders with ${role} role and params: ${JSON.stringify(params)}`, false, error);
    return null;
  }
}

async function testRadiologyOrderDetailEndpoint(role, orderId) {
  try {
    console.log(`\n🔍 Testing /api/radiology/orders/${orderId} with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/radiology/orders/${orderId}`);
    recordTestResult(`GET /api/radiology/orders/${orderId} with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/radiology/orders/${orderId} with ${role} role`, false, error);
    return null;
  }
}

async function testRadiologyOrderStatusUpdate(role, orderId, newStatus) {
  try {
    console.log(`\n🔍 Testing /api/radiology/orders/${orderId}/update-status with ${role} role and status: ${newStatus}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.post(`/api/radiology/orders/${orderId}/update-status`, { newStatus });
    recordTestResult(`POST /api/radiology/orders/${orderId}/update-status with ${role} role and status: ${newStatus}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`POST /api/radiology/orders/${orderId}/update-status with ${role} role and status: ${newStatus}`, false, error);
    return null;
  }
}

async function testRadiologyOrderExport(role, orderId, format) {
  try {
    console.log(`\n🔍 Testing /api/radiology/orders/${orderId}/export/${format} with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/radiology/orders/${orderId}/export/${format}`);
    recordTestResult(`GET /api/radiology/orders/${orderId}/export/${format} with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/radiology/orders/${orderId}/export/${format} with ${role} role`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING RADIOLOGY ORDERS ENDPOINT ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('=======================================\n');
  
  // Test with different query parameters
  await testRadiologyOrdersEndpoint('scheduler', {});
  await testRadiologyOrdersEndpoint('scheduler', { status: 'pending_radiology' });
  await testRadiologyOrdersEndpoint('scheduler', { status: 'scheduled' });
  await testRadiologyOrdersEndpoint('scheduler', { status: 'completed' });
  await testRadiologyOrdersEndpoint('scheduler', { status: 'all' });
  
  await testRadiologyOrdersEndpoint('scheduler', { priority: 'routine' });
  await testRadiologyOrdersEndpoint('scheduler', { priority: 'stat' });
  
  await testRadiologyOrdersEndpoint('scheduler', { modality: 'MRI' });
  await testRadiologyOrdersEndpoint('scheduler', { modality: 'CT' });
  
  await testRadiologyOrdersEndpoint('scheduler', { referringOrgId: 1 });
  
  await testRadiologyOrdersEndpoint('scheduler', { page: 1, limit: 10 });
  await testRadiologyOrdersEndpoint('scheduler', { sortBy: 'created_at', sortOrder: 'desc' });
  
  // Test with combined parameters
  await testRadiologyOrdersEndpoint('scheduler', { 
    status: 'pending_radiology',
    priority: 'routine',
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  // Test order detail endpoint
  await testRadiologyOrderDetailEndpoint('scheduler', 606);
  
  // Test order status update
  await testRadiologyOrderStatusUpdate('scheduler', 606, 'scheduled');
  
  // Test order export
  await testRadiologyOrderExport('scheduler', 606, 'json');
  await testRadiologyOrderExport('scheduler', 606, 'csv');
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/radiology-orders-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/radiology-orders-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});