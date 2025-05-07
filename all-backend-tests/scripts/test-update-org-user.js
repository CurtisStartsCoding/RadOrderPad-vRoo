/**
 * Test script for the PUT /api/users/{userId} endpoint
 * This script tests updating a user's profile by an admin
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: './.env.test' });

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const ADMIN_TOKEN = process.env.ADMIN_REFERRING_TOKEN;
const NON_ADMIN_TOKEN = process.env.PHYSICIAN_TOKEN;

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
  await test1_UpdateUserInAdminsOrg();
  await test2_UpdateUserInDifferentOrg();
  await test3_UpdateNonExistentUser();
  await test4_UpdateUserWithInvalidIdFormat();
  await test5_UpdateUserWithInvalidRole();
  await test6_UpdateUserWithNonAdminToken();
  await test7_UpdateUserWithNoAuthentication();
  
  console.log('\nAll tests completed!');
}

// Test 1: Update user in admin's organization (ID: 9)
async function test1_UpdateUserInAdminsOrg() {
  console.log('\nTest 1: Update user in admin\'s organization (ID: 9)');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    firstName: 'Updated',
    lastName: 'Name',
    specialty: 'Updated Specialty'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/9`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data.first_name === 'Updated' && data.data.last_name === 'Name') {
      console.log('✓ Successfully updated user in admin\'s organization');
    } else {
      console.log('✗ Failed to update user in admin\'s organization');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 2: Update user in different organization (ID: 2)
async function test2_UpdateUserInDifferentOrg() {
  console.log('\nTest 2: Update user in different organization (ID: 2)');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    firstName: 'Should',
    lastName: 'Fail'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/2`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
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

// Test 3: Update non-existent user (ID: 99999)
async function test3_UpdateNonExistentUser() {
  console.log('\nTest 3: Update non-existent user (ID: 99999)');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    firstName: 'Should',
    lastName: 'Fail'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/99999`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
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

// Test 4: Update user with invalid ID format (ID: abc)
async function test4_UpdateUserWithInvalidIdFormat() {
  console.log('\nTest 4: Update user with invalid ID format (ID: abc)');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    firstName: 'Should',
    lastName: 'Fail'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/abc`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
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

// Test 5: Update user with invalid role
async function test5_UpdateUserWithInvalidRole() {
  console.log('\nTest 5: Update user with invalid role');
  
  const headers = {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    role: 'super_admin'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/9`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 400) {
      console.log('✓ Correctly rejected with 400 Bad Request (invalid role)');
    } else {
      console.log('✗ Should have rejected with 400 Bad Request');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 6: Update user with non-admin token
async function test6_UpdateUserWithNonAdminToken() {
  console.log('\nTest 6: Update user with non-admin token');
  
  const headers = {
    'Authorization': `Bearer ${NON_ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    firstName: 'Should',
    lastName: 'Fail'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/9`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 403) {
      console.log('✓ Correctly rejected with 403 Forbidden (non-admin token)');
    } else {
      console.log('✗ Should have rejected with 403 Forbidden');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Test 7: Update user with no authentication
async function test7_UpdateUserWithNoAuthentication() {
  console.log('\nTest 7: Update user without authentication');
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const updateData = {
    firstName: 'Should',
    lastName: 'Fail'
  };
  
  try {
    const res = await fetch(`${API_URL}/api/users/9`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData)
    });
    
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (!data.success && res.status === 401) {
      console.log('✓ Correctly rejected with 401 Unauthorized (no authentication)');
    } else {
      console.log('✗ Should have rejected with 401 Unauthorized');
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
