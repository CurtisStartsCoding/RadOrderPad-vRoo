/**
 * Test script for the GET /api/users/{userId} endpoint
 * 
 * This script tests the ability for organization administrators to retrieve
 * user profiles for users within their organization.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const TOKEN_PATH = path.join(__dirname, '..', '..', 'admin-test-token.txt');

// Test users (these should exist in the test environment)
// User in the admin's organization
const USER_IN_ORG_ID = 9; // This is the admin_referring user (same org as the token)
// User in a different organization
const USER_OTHER_ORG_ID = 2; // This should be a user in a different organization
// Non-existent user ID
const NON_EXISTENT_USER_ID = 99999;
// Invalid user ID format
const INVALID_USER_ID = 'abc';

async function runTests() {
  console.log('Testing get user by ID endpoint...');
  console.log('Testing get user by ID endpoint...');
  console.log(`API URL: ${API_URL}`);

  try {
    // Read the admin token
    let token;
    try {
      token = fs.readFileSync(TOKEN_PATH, 'utf8').trim();
      console.log('Using admin token for authentication');
    } catch (error) {
      console.error(`Error reading token file: ${error.message}`);
      process.exit(1);
    }

    // Set up axios headers with the token
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Test 1: Get a user in the admin's organization (should succeed)
    console.log(`\nTest 1: Get user in admin's organization (ID: ${USER_IN_ORG_ID})`);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${USER_IN_ORG_ID}`,
        { headers }
      );
      
      if (response.status === 200 && response.data.success) {
        console.log('✓ Successfully retrieved user in admin\'s organization');
        console.log('User data:', JSON.stringify(response.data.data, null, 2));
      } else {
        console.log(`✗ Unexpected response: ${response.status}`);
        console.log('Response:', JSON.stringify(response.data, null, 2));
      }
    } catch (error) {
      console.log(`✗ Error getting user in admin's organization: ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      }
    }

    // Test 2: Get a user in a different organization (should fail with 404)
    console.log(`\nTest 2: Get user in different organization (ID: ${USER_OTHER_ORG_ID})`);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${USER_OTHER_ORG_ID}`,
        { headers }
      );
      
      console.log(`✗ Unexpected success: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✓ Correctly rejected with 404 Not Found (user not in admin\'s organization)');
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(`✗ Unexpected error: ${error.message}`);
        if (error.response) {
          console.log(`Status: ${error.response.status}`);
          console.log('Response:', JSON.stringify(error.response.data, null, 2));
        }
      }
    }

    // Test 3: Get a non-existent user (should fail with 404)
    console.log(`\nTest 3: Get non-existent user (ID: ${NON_EXISTENT_USER_ID})`);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${NON_EXISTENT_USER_ID}`,
        { headers }
      );
      
      console.log(`✗ Unexpected success: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✓ Correctly rejected with 404 Not Found (user does not exist)');
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(`✗ Unexpected error: ${error.message}`);
        if (error.response) {
          console.log(`Status: ${error.response.status}`);
          console.log('Response:', JSON.stringify(error.response.data, null, 2));
        }
      }
    }

    // Test 4: Get a user with invalid ID format (should fail with 400)
    console.log(`\nTest 4: Get user with invalid ID format (ID: ${INVALID_USER_ID})`);
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${INVALID_USER_ID}`,
        { headers }
      );
      
      console.log(`✗ Unexpected success: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✓ Correctly rejected with 400 Bad Request (invalid ID format)');
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(`✗ Unexpected error: ${error.message}`);
        if (error.response) {
          console.log(`Status: ${error.response.status}`);
          console.log('Response:', JSON.stringify(error.response.data, null, 2));
        }
      }
    }

    // Test 5: Get a user without authentication (should fail with 401)
    console.log('\nTest 5: Get user without authentication');
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${USER_IN_ORG_ID}`
      );
      
      console.log(`✗ Unexpected success: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✓ Correctly rejected with 401 Unauthorized (no authentication)');
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log(`✗ Unexpected error: ${error.message}`);
        if (error.response) {
          console.log(`Status: ${error.response.status}`);
          console.log('Response:', JSON.stringify(error.response.data, null, 2));
        }
      }
    }

    console.log('\nAll tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error during testing:', error);
    process.exit(1);
  }
}

runTests();