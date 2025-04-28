/**
 * Test script for the GET /api/organizations/mine/debug endpoint
 * 
 * This script tests the debug endpoint for organization details,
 * which provides more detailed error information.
 * 
 * Usage:
 * node test-organizations-mine-debug-endpoint.js
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
let AUTH_TOKEN = process.env.AUTH_TOKEN;

// Try to read token from file if not in environment variable
if (!AUTH_TOKEN) {
  const tokenFile = path.join(__dirname, 'clean-token.txt');
  if (fs.existsSync(tokenFile)) {
    AUTH_TOKEN = fs.readFileSync(tokenFile, 'utf8').trim();
    console.log('Read token from file');
  }
}

if (!AUTH_TOKEN) {
  console.error('Error: AUTH_TOKEN environment variable or clean-token.txt file is required');
  process.exit(1);
}

async function testDebugEndpoint() {
  console.log('Testing GET /api/organizations/mine/debug endpoint...');
  
  try {
    // Make sure token doesn't have any whitespace or special characters
    const cleanToken = AUTH_TOKEN.trim();
    
    console.log('Using token (first 10 chars):', cleanToken.substring(0, 10) + '...');
    
    const response = await axios.get(`${API_URL}/api/organizations/mine/debug`, {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success! Status code:', response.status);
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return false;
  }
}

// Run the test
(async () => {
  try {
    const success = await testDebugEndpoint();
    
    if (success) {
      console.log('\nTest completed successfully!');
    } else {
      console.log('\nTest failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
})();