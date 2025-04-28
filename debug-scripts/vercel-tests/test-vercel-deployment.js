/**
 * Test Vercel Deployment
 * 
 * This script tests the Vercel deployment by:
 * 1. Checking if the server is running (health endpoint)
 * 2. Testing the orders endpoint
 * 3. Testing the orders/me endpoint
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = process.env.API_URL || 'https://your-vercel-deployment-url.vercel.app';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Create results directory if it doesn't exist
const resultsDir = path.join(__dirname, '../../test-results/vercel-deployment');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// Log file setup
const timestamp = new Date().toISOString().replace(/:/g, '-');
const logFile = path.join(resultsDir, `vercel-deployment-test-${timestamp}.log`);
fs.writeFileSync(logFile, `Vercel Deployment Test - ${timestamp}\n\n`);

// Helper function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  fs.appendFileSync(logFile, logMessage + '\n');
}

// Helper function to store test results
function storeTestResults(results) {
  const resultsFile = path.join(resultsDir, `vercel-deployment-test-${timestamp}.json`);
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  log(`Test results saved to ${resultsFile}`);
}

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
    log(`✅ PASSED: ${name}`);
    if (response) {
      log(`   Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
    }
  } else {
    testResults.failed++;
    log(`❌ FAILED: ${name}`);
    if (error) {
      log(`   Error: ${error.message}`);
      if (error.response) {
        log(`   Status: ${error.response.status}`);
        log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
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
async function testHealthEndpoint() {
  try {
    log(`\n🔍 Testing health endpoint...`);
    
    const response = await axios.get(`${API_URL}/health`);
    recordTestResult('Health endpoint', true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult('Health endpoint', false, error);
    return null;
  }
}

async function testOrdersEndpoint(role) {
  try {
    log(`\n🔍 Testing GET /api/orders with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get('/api/orders');
    recordTestResult(`GET /api/orders with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders with ${role} role`, false, error);
    return null;
  }
}

async function testOrdersMeEndpoint(role) {
  try {
    log(`\n🔍 Testing GET /api/orders/me with ${role} role...`);
    
    const token = generateToken(role);
    const client = createAuthClient(token);
    
    const response = await client.get('/api/orders/me');
    recordTestResult(`GET /api/orders/me with ${role} role`, true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult(`GET /api/orders/me with ${role} role`, false, error);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  log('=== TESTING VERCEL DEPLOYMENT ===');
  log(`Testing API at: ${API_URL}`);
  log('====================================\n');
  
  // Test health endpoint
  await testHealthEndpoint();
  
  // Define roles to test with
  const roles = ['admin_staff', 'physician', 'admin_referring', 'super_admin'];
  
  // Test orders endpoint with different roles
  for (const role of roles) {
    await testOrdersEndpoint(role);
  }
  
  // Test orders/me endpoint with different roles
  for (const role of roles) {
    await testOrdersMeEndpoint(role);
  }
  
  // Print summary
  log('\n=== TEST SUMMARY ===');
  log(`Total Tests: ${testResults.passed + testResults.failed}`);
  log(`Passed: ${testResults.passed}`);
  log(`Failed: ${testResults.failed}`);
  log('===================');
  
  // Store test results
  storeTestResults(testResults);
  
  // If we found any working endpoints, list them
  const workingTests = testResults.tests.filter(test => test.passed);
  if (workingTests.length > 0) {
    log('\n=== WORKING ENDPOINTS ===');
    workingTests.forEach(test => {
      log(`- ${test.name}`);
    });
    log('========================');
  }
  
  return testResults.failed === 0;
}

// Execute tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  log(`Error running tests: ${error.message}`);
  process.exit(1);
});