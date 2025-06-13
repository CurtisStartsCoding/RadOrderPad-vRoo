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
  console.log('\n===== Testing User Invitation Endpoint =====\n');
  
  // Test 1: Valid invitation
  console.log('Test 1: Valid invitation (admin_referring token)');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: `test.invite.${Date.now()}@example.com`,
        role: 'physician'
      },
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
  
  // Test 2: Invalid email format
  console.log('\n\nTest 2: Invalid email format');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: 'invalid-email',
        role: 'physician'
      },
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
  
  // Test 3: Invalid role
  console.log('\n\nTest 3: Invalid role');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: 'test.user@example.com',
        role: 'invalid_role'
      },
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
  
  // Test 4: Missing email
  console.log('\n\nTest 4: Missing email');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        role: 'physician'
      },
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
  
  // Test 5: Missing role
  console.log('\n\nTest 5: Missing role');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: 'test.user@example.com'
      },
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
  
  // Test 6: Unauthorized role assignment (trying to create super_admin)
  console.log('\n\nTest 6: Unauthorized role assignment (super_admin)');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: 'test.superadmin@example.com',
        role: 'super_admin'
      },
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
  
  // Test 7: Non-admin token (should fail with 403)
  console.log('\n\nTest 7: Non-admin token (should fail with 403)');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: 'test.user@example.com',
        role: 'physician'
      },
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
  
  // Test 8: Without token (should fail with 401)
  console.log('\n\nTest 8: Without token (should fail with 401)');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
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
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 9: Duplicate email (invite existing user)
  console.log('\n\nTest 9: Duplicate email (invite existing user)');
  try {
    const response = await axios.post(
      `${API_URL}/api/user-invites/invite`,
      {
        email: 'test.physician@example.com', // This user already exists
        role: 'physician'
      },
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
  
  console.log('\n\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});