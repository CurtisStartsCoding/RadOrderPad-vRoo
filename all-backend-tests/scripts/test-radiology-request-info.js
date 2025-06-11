/**
 * Test script for the radiology request-info endpoint
 * This script focuses on testing the /api/radiology/orders/{orderId}/request-info endpoint
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const TEST_ORDER_ID = process.env.TEST_ORDER_ID || 606; // Use a valid order ID for testing

// Load tokens from files
function loadToken(role) {
  const tokenPath = path.join(__dirname, `../tokens/${role}-token.txt`);
  try {
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.log(`Warning: Could not load ${role} token from file`);
    return null;
  }
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
    
    const token = loadToken(role);
    if (!token) {
      recordTestResult(`POST /api/radiology/orders/${orderId}/request-info with ${role} role`, false, { message: `Could not load ${role} token` });
      return null;
    }
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
    
    const token = loadToken(role);
    if (!token) {
      recordTestResult(`POST /api/radiology/orders/${orderId}/request-info with ${role} role`, false, { message: `Could not load ${role} token` });
      return null;
    }
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
    
    const token = loadToken(role);
    if (!token) {
      recordTestResult(`POST /api/radiology/orders/${orderId}/request-info with ${role} role`, false, { message: `Could not load ${role} token` });
      return null;
    }
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
