/**
 * Super Admin API Tests
 *
 * This file contains tests for the Super Admin API functionality.
 */
const fetch = require('node-fetch');
const assert = require('assert').strict;
const helpers = require('./test-helpers');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const ORGANIZATIONS_ENDPOINT = `${API_BASE_URL}/superadmin/organizations`;
const USERS_ENDPOINT = `${API_BASE_URL}/superadmin/users`;

// Main test function
async function runTests() {
  console.log('Starting Super Admin API tests...');
  
  // Generate a JWT token for a super_admin user
  const superAdminUser = {
    userId: 1,
    orgId: 1,
    role: 'super_admin',
    email: 'test.superadmin@example.com'
  };
  
  const token = helpers.generateToken(superAdminUser);
  console.log(`Generated token for super_admin user: ${token.substring(0, 20)}...`);
  
  // Test 1: List Organizations
  try {
    console.log('\nTest 1: List Organizations');
    const response = await fetch(ORGANIZATIONS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(data.success, true, 'Response should indicate success');
    assert.ok(Array.isArray(data.data), 'Response data should be an array');
    console.log('[PASS] List Organizations');
  } catch (error) {
    console.error('[FAIL] List Organizations:', error.message);
    process.exit(1);
  }
  
  // Test 2: Get Organization by ID
  try {
    console.log('\nTest 2: Get Organization by ID');
    const response = await fetch(`${ORGANIZATIONS_ENDPOINT}/1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(data.success, true, 'Response should indicate success');
    assert.ok(data.data && typeof data.data === 'object', 'Response data should be an object');
    console.log('[PASS] Get Organization by ID');
  } catch (error) {
    console.error('[FAIL] Get Organization by ID:', error.message);
    process.exit(1);
  }
  
  // Test 3: List Users
  try {
    console.log('\nTest 3: List Users');
    const response = await fetch(USERS_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(data.success, true, 'Response should indicate success');
    assert.ok(Array.isArray(data.data), 'Response data should be an array');
    console.log('[PASS] List Users');
  } catch (error) {
    console.error('[FAIL] List Users:', error.message);
    process.exit(1);
  }
  
  // Test 4: Get User by ID
  try {
    console.log('\nTest 4: Get User by ID');
    const response = await fetch(`${USERS_ENDPOINT}/1`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    assert.equal(response.status, 200, 'Status code should be 200');
    assert.equal(data.success, true, 'Response should indicate success');
    assert.ok(data.data && typeof data.data === 'object', 'Response data should be an object');
    console.log('[PASS] Get User by ID');
  } catch (error) {
    console.error('[FAIL] Get User by ID:', error.message);
    process.exit(1);
  }
  
  console.log('\nAll Super Admin API tests passed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});