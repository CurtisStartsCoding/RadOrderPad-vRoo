/**
 * Test script for the accept-invitation endpoint
 * This script tests the functionality of accepting an invitation and creating a user account
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './.env.test' });

// API base URL
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Read admin token from file
const getToken = () => {
  try {
    // Get the project root directory
    const projectRoot = process.env.PROJECT_ROOT || process.cwd();
    const tokenPath = `${projectRoot}/tokens/admin_referring-token.txt`;
    
    // Try to read the admin_referring token
    console.log(`Reading token from: ${tokenPath}`);
    return fs.readFileSync(tokenPath, 'utf8').trim();
  } catch (error) {
    console.error('Error reading admin token:', error.message);
    process.exit(1);
  }
};

// Test the accept-invitation endpoint
async function testAcceptInvitation() {
  console.log('Testing accept-invitation endpoint...');
  console.log(`API URL: ${API_URL}`);
  
  try {
    // Get admin_referring token
    const token = getToken();
    
    // Decode the JWT token to get basic user info
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      try {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('\nToken information:');
        console.log('User ID:', payload.userId);
        console.log('Organization ID:', payload.orgId);
        console.log('Role:', payload.role);
        console.log('Token expires:', new Date(payload.exp * 1000).toLocaleString());
      } catch (e) {
        console.log('Could not decode token:', e.message);
      }
    }
    
    // Use a test token for testing
    const TEST_TOKEN = 'test-token-12345';
    
    // Test 1: Invalid token (we can't create a real token without database access)
    console.log('\nTest 1: Invalid token');
    try {
      const response = await axios.post(
        `${API_URL}/api/user-invites/accept-invitation`,
        {
          token: TEST_TOKEN,
          password: 'Password123!',
          first_name: 'Test',
          last_name: 'User'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('Response Status:', error.response?.status);
      console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    }
    
    // Test 2: Missing required fields
    console.log('\nTest 2: Missing required fields');
    try {
      const response = await axios.post(
        `${API_URL}/api/user-invites/accept-invitation`,
        {
          token: TEST_TOKEN
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('Response Status:', error.response?.status);
      console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    }
    
    // Test 3: Weak password
    console.log('\nTest 3: Weak password');
    try {
      const response = await axios.post(
        `${API_URL}/api/user-invites/accept-invitation`,
        {
          token: TEST_TOKEN,
          password: 'weak',
          first_name: 'Test',
          last_name: 'User'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log('Response Status:', error.response?.status);
      console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    }
    
    console.log('\nTesting completed.');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the test
testAcceptInvitation();
