/**
 * Script to get a clean authentication token and save it to a file
 * This script logs in with test credentials and saves the token to a file
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const OUTPUT_FILE = path.join(__dirname, 'clean-token.txt');

// Test user credentials - using admin_staff role
const TEST_USER = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

async function getCleanToken() {
  console.log('Getting clean authentication token...');
  
  try {
    // Login to get a token
    console.log(`Logging in as ${TEST_USER.email}...`);
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    if (!loginResponse.data || !loginResponse.data.token) {
      console.error('Error: No token received in login response');
      process.exit(1);
    }
    
    const token = loginResponse.data.token;
    console.log('Token received successfully');
    
    // Save token to file
    fs.writeFileSync(OUTPUT_FILE, token, 'utf8');
    console.log(`Token saved to ${OUTPUT_FILE}`);
    
    // Also output token to console for debugging
    console.log('\nToken:');
    console.log(token);
    
    return token;
  } catch (error) {
    console.error('Error getting token:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the function
getCleanToken().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});