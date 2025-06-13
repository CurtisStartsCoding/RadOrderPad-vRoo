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
  console.log('\n===== Testing DELETE /api/users/:userId (Deactivate User) =====\n');
  
  // First, let's get a user we can deactivate (we'll use user ID 10 which is inactive)
  const testUserId = 10; // test.superadmin@example.com (already inactive)
  const activeUserId = 4; // test.admin_staff@example.com (active)
  const differentOrgUserId = 2; // User from different organization
  
  // Test 1: Deactivate an active user
  console.log('Test 1: Deactivate an active user (ID: 4)');
  try {
    const response = await axios.delete(
      `${API_URL}/api/users/${activeUserId}`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
    
    // Reactivate the user for future tests
    await axios.put(
      `${API_URL}/api/users/${activeUserId}`,
      { isActive: true },
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('(User reactivated for future tests)');
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 2: Deactivate an already inactive user
  console.log('\n\nTest 2: Deactivate an already inactive user (ID: 10)');
  try {
    const response = await axios.delete(
      `${API_URL}/api/users/${testUserId}`,
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
  
  // Test 3: Try to deactivate user from different organization
  console.log('\n\nTest 3: Try to deactivate user from different organization (ID: 2)');
  try {
    const response = await axios.delete(
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
  
  // Test 4: Try to deactivate non-existent user
  console.log('\n\nTest 4: Try to deactivate non-existent user (ID: 99999)');
  try {
    const response = await axios.delete(
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
  
  // Test 5: Invalid user ID format
  console.log('\n\nTest 5: Invalid user ID format');
  try {
    const response = await axios.delete(
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
  
  // Test 6: Non-admin token (should fail with 403)
  console.log('\n\nTest 6: Non-admin token (should fail with 403)');
  try {
    const response = await axios.delete(
      `${API_URL}/api/users/${activeUserId}`,
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
  
  // Test 7: Without token (should fail with 401)
  console.log('\n\nTest 7: Without token (should fail with 401)');
  try {
    const response = await axios.delete(
      `${API_URL}/api/users/${activeUserId}`,
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
  
  // Test 8: Try to deactivate yourself (admin deactivating their own account)
  console.log('\n\nTest 8: Try to deactivate yourself');
  try {
    // First get the admin's user ID
    const meResponse = await axios.get(
      `${API_URL}/api/users/me`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const adminUserId = meResponse.data.data.id;
    
    // Try to deactivate self
    const response = await axios.delete(
      `${API_URL}/api/users/${adminUserId}`,
      {
        headers: { 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Result:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Result:', handleError(error));
  }
  
  console.log('\n\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});