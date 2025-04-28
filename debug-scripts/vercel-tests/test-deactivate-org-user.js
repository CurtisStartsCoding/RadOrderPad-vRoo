/**
 * Test script for the DELETE /api/users/{userId} endpoint
 * This script tests deactivating a user by an admin
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: './.env.test' });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const ADMIN_TOKEN = process.env.ADMIN_REFERRING_TOKEN;
const NON_ADMIN_TOKEN = process.env.PHYSICIAN_TOKEN;

// Test user IDs
// UserIdX - User in Org A (same as admin)
const USER_ID_X = 10; // Assuming this is a user in Org A
// UserIdY - User in Org B (different from admin)
const USER_ID_Y = 2; // Assuming this is a user in Org B
// AdminIdA - Admin's own ID
const ADMIN_ID_A = 9; // Assuming this is the admin's ID

if (!ADMIN_TOKEN) {
  console.error('Error: ADMIN_REFERRING_TOKEN not set in .env.test');
  process.exit(1);
}

if (!NON_ADMIN_TOKEN) {
  console.error('Error: PHYSICIAN_TOKEN not set in .env.test');
  process.exit(1);
}

console.log('API URL:', API_URL);
console.log('Using admin token for authentication');

// Run all tests
async function runTests() {
  await test1_DeactivateUserInAdminsOrg();
  await test2_DeactivateUserInDifferentOrg();
  await test3_DeactivateSelf();
  await test4_DeactivateWithInvalidIdFormat();
  await test5_DeactivateNonExistentUser();
  await test6_DeactivateWithNonAdminToken();
  
  console.log('\nAll tests completed!');
}

// Test 1: Deactivate user in admin's organization
async function test1_DeactivateUserInAdminsOrg() {
  console.log('\nTest 1: Deactivate user in admin\'s organization (ID:', USER_ID_X, ')');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/${USER_ID_X}`, {
      method: 'DELETE',
      headers
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success && res.status === 200) {
      console.log('✓ Successfully deactivated user in admin\'s organization');
    } else {
      console.log('✗ Failed to deactivate user in admin\'s organization');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 2: Deactivate user in different organization
async function test2_DeactivateUserInDifferentOrg() {
  console.log('\nTest 2: Deactivate user in different organization (ID:', USER_ID_Y, ')');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/${USER_ID_Y}`, {
      method: 'DELETE',
      headers
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 404) {
      console.log('✓ Correctly rejected with 404 Not Found (user not in admin\'s organization)');
    } else {
      console.log('✗ Should have rejected with 404 Not Found');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 3: Attempt to deactivate self (admin's own account)
async function test3_DeactivateSelf() {
  console.log('\nTest 3: Attempt to deactivate self (admin\'s own account) (ID:', ADMIN_ID_A, ')');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/${ADMIN_ID_A}`, {
      method: 'DELETE',
      headers
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 400) {
      console.log('✓ Correctly rejected with 400 Bad Request (cannot deactivate self)');
    } else {
      console.log('✗ Should have rejected with 400 Bad Request');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 4: Deactivate with invalid ID format
async function test4_DeactivateWithInvalidIdFormat() {
  console.log('\nTest 4: Deactivate with invalid ID format (ID: abc)');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/abc`, {
      method: 'DELETE',
      headers
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 400) {
      console.log('✓ Correctly rejected with 400 Bad Request (invalid ID format)');
    } else {
      console.log('✗ Should have rejected with 400 Bad Request');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 5: Deactivate non-existent user
async function test5_DeactivateNonExistentUser() {
  console.log('\nTest 5: Deactivate non-existent user (ID: 99999)');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/99999`, {
      method: 'DELETE',
      headers
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 404) {
      console.log('✓ Correctly rejected with 404 Not Found (user does not exist)');
    } else {
      console.log('✗ Should have rejected with 404 Not Found');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 6: Deactivate with non-admin token
async function test6_DeactivateWithNonAdminToken() {
  console.log('\nTest 6: Deactivate with non-admin token');
  
  const headers = {
    'Authorization': `Bearer ${NON_ADMIN_TOKEN}`
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/${USER_ID_X}`, {
      method: 'DELETE',
      headers
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (res.status === 403) {
      console.log('✓ Correctly rejected with 403 Forbidden (non-admin token)');
    } else {
      console.log('✗ Should have rejected with 403 Forbidden');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run all tests
runTests().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});