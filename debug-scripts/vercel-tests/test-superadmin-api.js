/**
 * Super Admin API Tests
 *
 * This file contains tests for the Super Admin API functionality.
 */
const axios = require('axios');
const assert = require('assert').strict;
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const JWT_SECRET = process.env.JWT_SECRET || 'radorderpad-secure-jwt-secret-f8a72c1e9b5d3e7f4a6b2c8d9e0f1a2b3c4d5e6f';
const ORGANIZATIONS_ENDPOINT = `${API_URL}/api/superadmin/organizations`;
const USERS_ENDPOINT = `${API_URL}/api/superadmin/users`;

// Generate a JWT token for a super_admin user
function generateSuperAdminToken() {
  const payload = {
    userId: 1,
    orgId: 1,
    role: 'super_admin',
    email: 'test.superadmin@example.com',
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

// Main test function
async function runTests() {
  console.log('Starting Super Admin API tests...');
  
  // Generate a JWT token for a super_admin user
  const token = generateSuperAdminToken();
  console.log(`Generated token for super_admin user: ${token.substring(0, 20)}...`);
  
  const client = createAuthClient(token);
  
  // Test 1: List Organizations
  try {
    console.log('\nTest 1: List Organizations');
    const response = await client.get(`/api/superadmin/organizations`);
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(Array.isArray(response.data.data), 'Response data should be an array');
    recordTestResult('List Organizations', true, null, response);
  } catch (error) {
    recordTestResult('List Organizations', false, error);
  }
  
  // Test 2: Get Organization by ID
  try {
    console.log('\nTest 2: Get Organization by ID');
    const response = await client.get(`/api/superadmin/organizations/1`);
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
    recordTestResult('Get Organization by ID', true, null, response);
  } catch (error) {
    recordTestResult('Get Organization by ID', false, error);
  }
  
  // Test 3: List Users
  try {
    console.log('\nTest 3: List Users');
    const response = await client.get(`/api/superadmin/users`);
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(Array.isArray(response.data.data), 'Response data should be an array');
    recordTestResult('List Users', true, null, response);
  } catch (error) {
    recordTestResult('List Users', false, error);
  }
  
  // Test 4: Get User by ID
  try {
    console.log('\nTest 4: Get User by ID');
    const response = await client.get(`/api/superadmin/users/1`);
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
    recordTestResult('Get User by ID', true, null, response);
  } catch (error) {
    recordTestResult('Get User by ID', false, error);
  }
  
  // Test 5: Update Organization Status
  try {
    console.log('\nTest 5: Update Organization Status');
    const response = await client.put(`/api/superadmin/organizations/1/status`, {
      newStatus: 'active'
    });
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
    assert.equal(response.data.data.status, 'active', 'Organization status should be updated to active');
    recordTestResult('Update Organization Status', true, null, response);
  } catch (error) {
    recordTestResult('Update Organization Status', false, error);
  }
  
  // Test 6: Adjust Organization Credits
  try {
    console.log('\nTest 6: Adjust Organization Credits');
    const response = await client.post(`/api/superadmin/organizations/1/credits/adjust`, {
      amount: 100,
      reason: 'Test credit adjustment'
    });
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
    recordTestResult('Adjust Organization Credits', true, null, response);
  } catch (error) {
    recordTestResult('Adjust Organization Credits', false, error);
  }
  
  // Test 7: Update User Status
  try {
    console.log('\nTest 7: Update User Status');
    const response = await client.put(`/api/superadmin/users/1/status`, {
      isActive: true
    });
    
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(response.data.success, true, 'Response should indicate success');
    assert.ok(response.data.data && typeof response.data.data === 'object', 'Response data should be an object');
    assert.equal(response.data.data.is_active, true, 'User status should be updated to active');
    recordTestResult('Update User Status', true, null, response);
  } catch (error) {
    recordTestResult('Update User Status', false, error);
  }
  
  // Print summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log('===================');
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});