/**
 * Test script for getting a list of orders
 * This script focuses on testing the GET /api/orders endpoint with query parameters
 */

const axios = require('axios');
const fs = require('fs');
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
async function testGetOrdersWithParams(role, params) {
  try {
    console.log(`\n🔍 Testing GET /api/orders with ${role} role and params: ${JSON.stringify(params)}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/orders`, { params });
    recordTestResult(`GET /api/orders with ${role} role and params: ${JSON.stringify(params)}`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders with ${role} role and params: ${JSON.stringify(params)}`, false, error);
    return null;
  }
}

async function testGetOrdersWithoutParams(role) {
  try {
    console.log(`\n🔍 Testing GET /api/orders with ${role} role (no params)...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/orders`);
    recordTestResult(`GET /api/orders with ${role} role (no params)`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders with ${role} role (no params)`, false, error);
    return null;
  }
}

async function testCreateOrder(role, orderData) {
  try {
    console.log(`\n🔍 Testing POST /api/orders with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.post(`/api/orders`, orderData);
    recordTestResult(`POST /api/orders with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`POST /api/orders with ${role} role`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING GET ORDERS LIST ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('============================\n');
  
  // Test GET /api/orders with different roles and parameters
  await testGetOrdersWithoutParams('admin_staff');
  await testGetOrdersWithParams('admin_staff', { status: 'pending_admin' });
  await testGetOrdersWithParams('admin_staff', { status: 'pending_admin', role: 'admin_staff' });
  
  await testGetOrdersWithoutParams('physician');
  await testGetOrdersWithParams('physician', { status: 'pending_validation' });
  
  await testGetOrdersWithoutParams('admin_referring');
  await testGetOrdersWithParams('admin_referring', { status: 'all' });
  
  // Test POST /api/orders with physician role
  const newOrderData = {
    dictationText: 'Patient presents with headache for 3 days. Request MRI of the brain.',
    patientInfo: {
      name: 'Test Patient',
      dob: '1980-01-01',
      gender: 'male'
    },
    modality: 'MRI',
    bodyPart: 'BRAIN'
  };
  
  await testCreateOrder('physician', newOrderData);
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/get-orders-list-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/get-orders-list-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});