/**
 * Comprehensive test script for the user invitation endpoint
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Read the admin token from the file
const adminToken = fs.readFileSync(path.join(__dirname, 'admin-test-token.txt'), 'utf8').trim();

// Base URL for the API
const baseUrl = 'http://localhost:3000/api';

// JWT secret (should match the one used in the application)
const JWT_SECRET = 'radorderpad-jwt-secret-for-development-and-testing-purposes-only';

// Create a non-admin token (physician role)
const nonAdminToken = jwt.sign(
  {
    userId: 2,
    orgId: 1,
    role: 'physician',
    email: 'test.physician@example.com'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

// Test valid invitation
async function testValidInvitation() {
  try {
    console.log('1. Testing valid invitation...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'new.user@example.com',
        role: 'physician'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return true;
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return false;
  }
}

// Test invalid email format
async function testInvalidEmail() {
  try {
    console.log('\n2. Testing invalid email format...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'invalid-email',
        role: 'physician'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 400; // Expected 400 Bad Request
  }
}

// Test invalid role
async function testInvalidRole() {
  try {
    console.log('\n3. Testing invalid role...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'test.user@example.com',
        role: 'invalid_role'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 400; // Expected 400 Bad Request
  }
}

// Test duplicate invitation
async function testDuplicateInvitation() {
  try {
    console.log('\n4. Testing duplicate invitation...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'test.user@example.com',
        role: 'physician'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 409; // Expected 409 Conflict
  }
}

// Test missing email
async function testMissingEmail() {
  try {
    console.log('\n5. Testing missing email...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        role: 'physician'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 400; // Expected 400 Bad Request
  }
}

// Test missing role
async function testMissingRole() {
  try {
    console.log('\n6. Testing missing role...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'test.user@example.com'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 400; // Expected 400 Bad Request
  }
}

// Test non-admin token
async function testNonAdminToken() {
  try {
    console.log('\n7. Testing non-admin token (should fail with 403)...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'test.user@example.com',
        role: 'physician'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${nonAdminToken}`
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 403; // Expected 403 Forbidden
  }
}

// Test without token
async function testNoToken() {
  try {
    console.log('\n8. Testing without token (should fail with 401)...');
    const response = await axios.post(
      `${baseUrl}/users/invite`,
      {
        email: 'test.user@example.com',
        role: 'physician'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Response:', response.status, response.data);
    return false; // This should fail, so success is a failure here
  } catch (error) {
    console.error('Error:', error.response ? error.response.status : error.message);
    console.error('Error data:', error.response ? error.response.data : 'No response data');
    return error.response && error.response.status === 401; // Expected 401 Unauthorized
  }
}

// Run the tests
async function runTests() {
  const results = {
    validInvitation: await testValidInvitation(),
    invalidEmail: await testInvalidEmail(),
    invalidRole: await testInvalidRole(),
    duplicateInvitation: await testDuplicateInvitation(),
    missingEmail: await testMissingEmail(),
    missingRole: await testMissingRole(),
    nonAdminToken: await testNonAdminToken(),
    noToken: await testNoToken()
  };

  console.log('\n=== TEST RESULTS SUMMARY ===');
  for (const [test, passed] of Object.entries(results)) {
    console.log(`${test}: ${passed ? 'PASSED' : 'FAILED'}`);
  }

  const allPassed = Object.values(results).every(result => result);
  console.log(`\nOverall result: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
}

runTests();