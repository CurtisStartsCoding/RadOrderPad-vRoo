const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '.env.test') });

// Set API URL
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://api.radorderpad.com';

console.log(`Using API URL: ${API_URL}`);

// Get tokens
let adminToken, physicianToken;

try {
  adminToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
  physicianToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'physician-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading token files:', error.message);
  process.exit(1);
}

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    return {
      error: true,
      status: error.response.status,
      data: error.response.data
    };
  } else {
    return {
      error: true,
      message: error.message
    };
  }
};

// Run tests
async function runTests() {
  console.log('\n===== Testing GET /api/users/:userId =====\n');
  
  const sameOrgUserId = 4; // User in same organization
  const differentOrgUserId = 2; // User in different organization
  
  // Test 1: Get user from same organization
  console.log('Test 1: Get user from same organization (ID: 4)');
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${sameOrgUserId}`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 2: Try to get user from different organization
  console.log('\n\nTest 2: Try to get user from different organization (ID: 2)');
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${differentOrgUserId}`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 3: Non-existent user
  console.log('\n\nTest 3: Non-existent user (ID: 99999)');
  try {
    const response = await axios.get(
      `${API_URL}/api/users/99999`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 4: Invalid user ID format
  console.log('\n\nTest 4: Invalid user ID format');
  try {
    const response = await axios.get(
      `${API_URL}/api/users/invalid-id`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 5: Non-admin token (should fail with 403)
  console.log('\n\nTest 5: Non-admin token (should fail with 403)');
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${sameOrgUserId}`,
      {
        headers: { 
          'Authorization': `Bearer ${physicianToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 6: Without token (should fail with 401)
  console.log('\n\nTest 6: Without token (should fail with 401)');
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${sameOrgUserId}`,
      {
        headers: { 
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  console.log('\n\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});