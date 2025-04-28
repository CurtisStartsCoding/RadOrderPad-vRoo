/**
 * Test script for critical endpoints
 * This script focuses on testing a few critical endpoints to ensure they're working correctly
 */

const axios = require('axios');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'https://radorderpad-q20dishz7-capecomas-projects.vercel.app';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Test user credentials
const TEST_USER = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

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
async function testHealthEndpoint() {
  try {
    console.log('\n🔍 Testing health endpoint...');
    const response = await axios.get(`${API_URL}/health`);
    recordTestResult('Health Endpoint', true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult('Health Endpoint', false, error);
    return null;
  }
}

async function testAuthEndpoint() {
  try {
    console.log('\n🔍 Testing authentication endpoint...');
    const response = await axios.post(`${API_URL}/api/auth/login`, TEST_USER);
    recordTestResult('Authentication Endpoint', true, null, response);
    return response.data;
  } catch (error) {
    recordTestResult('Authentication Endpoint', false, error);
    return null;
  }
}

async function testSuperadminEndpoints() {
  console.log('\n🔍 Testing superadmin endpoints...');
  
  const token = generateToken('super_admin');
  const client = createAuthClient(token);
  
  // Test get all organizations (GET)
  try {
    const superadminOrgsResponse = await client.get(`/api/superadmin/organizations`);
    recordTestResult('GET /api/superadmin/organizations', true, null, superadminOrgsResponse);
  } catch (error) {
    recordTestResult('GET /api/superadmin/organizations', false, error);
  }
  
  // Test get all users (GET)
  try {
    const superadminUsersResponse = await client.get(`/api/superadmin/users`);
    recordTestResult('GET /api/superadmin/users', true, null, superadminUsersResponse);
  } catch (error) {
    recordTestResult('GET /api/superadmin/users', false, error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('=== TESTING CRITICAL ENDPOINTS ===');
  console.log(`Testing API at: ${API_URL}`);
  console.log('================================\n');
  
  await testHealthEndpoint();
  await testAuthEndpoint();
  await testSuperadminEndpoints();
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
  
  // Save results to file
  fs.writeFileSync('../../test-results/vercel-tests/critical-endpoints-results.json', JSON.stringify(testResults, null, 2));
  console.log('\nTest results saved to test-results/vercel-tests/critical-endpoints-results.json');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Error running tests:', error);
});