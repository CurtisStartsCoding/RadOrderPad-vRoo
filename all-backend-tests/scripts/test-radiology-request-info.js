/**
 * Test script for the radiology request-info endpoint
 * This script focuses on testing the /api/radiology/orders/{orderId}/request-info endpoint
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-secure-jwt-secret-f8a72c1e9b5d3e7f4a6b2c8d9e0f1a2b3c4d5e6f';
const TEST_ORDER_ID = process.env.TEST_ORDER_ID || 606; // Use a valid order ID for testing

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
async function testRequestInfoEndpoint(role, orderId, requestData) {
  try {
    console.log(`\n🔍 Testing /api/radiology/orders/${orderId}/request-info with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.post(`/api/radiology/orders/${orderId}/request-info`, requestData);
    recordTestResult(`POST /api/radiology/orders/${orderId}/request-info with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`POST /api/radiology/orders/${orderId}/request-info with ${role} role`, false, error);
    return null;
  }
}

async function testRequestInfoWithInvalidData(role, orderId, requestData, testName) {
  try {
    console.log(`\n🔍 Testing ${testName}...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.post(`/api/radiology/orders/${orderId}/request-info`, requestData);
    // This should fail, so if we get here, the test failed
    recordTestResult(testName, false, { message: "Expected request to fail but it succeeded" }, response);
    return response.data;
  } catch (error) {
    // This is expected to fail, so it's a pass
    recordTestResult(testName, true, error);
    return null;
  }
}

async function testRequestInfoWithUnauthorizedRole(role, orderId, requestData) {
  try {
    console.log(`\n🔍 Testing unauthorized role ${role} for /api/radiology/orders/${orderId}/request-info...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.post(`/api/radiology/orders/${orderId}/request-info`, requestData);
    // This should fail, so if we get here, the test failed
    recordTestResult(`Unauthorized role ${role} for /api/radiology/orders/${orderId}/request-info`, false, { message: "Expected request to fail but it succeeded" }, response);
    return response.data;
  } catch (error) {
    // This is expected to fail, so it's a pass
    recordTestResult(`Unauthorized role ${role} for /api/radiology/orders/${orderId}/request-info`, true, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING RADIOLOGY REQUEST INFO ENDPOINT ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('============================================\n');
  
  const validRequestData = {
    requestedInfoType: 'labs',
    requestedInfoDetails: 'Please provide recent CBC and metabolic panel results for this patient.'
  };
  
  // Test with valid data and authorized roles
  await testRequestInfoEndpoint('scheduler', TEST_ORDER_ID, validRequestData);
  await testRequestInfoEndpoint('admin_radiology', TEST_ORDER_ID, validRequestData);
  
  // Test with invalid data
  await testRequestInfoWithInvalidData('scheduler', TEST_ORDER_ID, 
    { requestedInfoType: 'labs' }, // Missing requestedInfoDetails
    'Missing requestedInfoDetails test'
  );
  
  await testRequestInfoWithInvalidData('scheduler', TEST_ORDER_ID, 
    { requestedInfoDetails: 'Please provide lab results' }, // Missing requestedInfoType
    'Missing requestedInfoType test'
  );
  
  await testRequestInfoWithInvalidData('scheduler', TEST_ORDER_ID, 
    {}, // Empty request body
    'Empty request body test'
  );
  
  // Test with non-existent order ID
  await testRequestInfoWithInvalidData('scheduler', 999999, 
    validRequestData,
    'Non-existent order ID test'
  );
  
  // Test with unauthorized roles
  await testRequestInfoWithUnauthorizedRole('physician', TEST_ORDER_ID, validRequestData);
  await testRequestInfoWithUnauthorizedRole('admin_referring', TEST_ORDER_ID, validRequestData);
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Create directory if it doesn't exist
  const resultsDir = '../../test-results/vercel-tests';
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Save results to file
  fs.writeFileSync(`${resultsDir}/radiology-request-info-results.json`, JSON.stringify(testResults, null, 2));
  console.log(`\nTest results saved to ${resultsDir}/radiology-request-info-results.json`);
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});
