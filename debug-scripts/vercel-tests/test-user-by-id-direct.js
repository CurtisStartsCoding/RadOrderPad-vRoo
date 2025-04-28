/**
 * Simple test script for the GET /api/users/{userId} endpoint
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const TOKEN_PATH = path.join(__dirname, '..', '..', 'admin-test-token.txt');
const USER_ID = 9; // This is the admin_referring user (same org as the token)

async function runTest() {
  console.log('Testing GET /api/users/{userId} endpoint directly...');
  console.log(`API URL: ${API_URL}`);
  console.log(`User ID: ${USER_ID}`);

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

    // Make the request
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${USER_ID}`,
        { headers }
      );
      
      console.log(`Response status: ${response.status}`);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(`Error: ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
  } catch (error) {
    console.error('Unexpected error during testing:', error);
    process.exit(1);
  }
}

runTest();