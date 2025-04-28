/**
 * Test script for the orders endpoint
 * This script focuses on testing the orders endpoint with different methods and parameters
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
async function testGetOrderById(role, orderId) {
  try {
    console.log(`\n🔍 Testing GET /api/orders/${orderId} with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get(`/api/orders/${orderId}`);
    recordTestResult(`GET /api/orders/${orderId} with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders/${orderId} with ${role} role`, false, error);
    return null;
  }
}

async function testGetAllOrders(role) {
  try {
    console.log(`\n🔍 Testing GET /api/orders with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    // Try different variations of the endpoint
    try {
      const response = await client.get(`/api/orders`);
      recordTestResult(`GET /api/orders with ${role} role`, true, null, response);
      return response.data;
    } catch (error1) {
      console.log(`   Trying GET /api/orders/ (with trailing slash)...`);
      try {
        const response = await client.get(`/api/orders/`);
        recordTestResult(`GET /api/orders/ with ${role} role`, true, null, response);
        return response.data;
      } catch (error2) {
        console.log(`   Trying GET /api/orders?limit=10...`);
        try {
          const response = await client.get(`/api/orders?limit=10`);
          recordTestResult(`GET /api/orders?limit=10 with ${role} role`, true, null, response);
          return response.data;
        } catch (error3) {
          recordTestResult(`GET /api/orders with ${role} role (all variations)`, false, error1);
          return null;
        }
      }
    }
  } catch (error) {
    recordTestResult(`GET /api/orders with ${role} role`, false, error);
    return null;
  }
}

async function testCreateOrder(role) {
  try {
    console.log(`\n🔍 Testing POST /api/orders with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const newOrder = {
      patient_name: 'Test Patient',
      patient_dob: '1980-01-01',
      dictation: 'Test dictation for API testing',
      modality: 'MRI',
      body_part: 'BRAIN'
    };
    
    const response = await client.post(`/api/orders`, newOrder);
    recordTestResult(`POST /api/orders with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`POST /api/orders with ${role} role`, false, error);
    return null;
  }
}

async function testUpdateOrder(role, orderId) {
  try {
    console.log(`\n🔍 Testing PUT /api/orders/${orderId} with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const updateData = {
      dictation: 'Updated dictation for API testing'
    };
    
    const response = await client.put(`/api/orders/${orderId}`, updateData);
    recordTestResult(`PUT /api/orders/${orderId} with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`PUT /api/orders/${orderId} with ${role} role`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING ORDERS ENDPOINT ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('============================\n');
  
  // Test with different roles and order IDs
  await testGetOrderById('admin_staff', 607);
  await testGetOrderById('physician', 607);
  await testGetOrderById('super_admin', 607);
  
  await testGetAllOrders('admin_staff');
  await testGetAllOrders('physician');
  await testGetAllOrders('super_admin');
  
  await testCreateOrder('physician');
  
  await testUpdateOrder('physician', 607);
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/orders-endpoint-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/orders-endpoint-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});