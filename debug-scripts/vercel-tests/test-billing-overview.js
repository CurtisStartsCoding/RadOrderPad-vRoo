/**
 * Test script for the GET /api/billing endpoint
 */
const axios = require('axios');
const fs = require('fs');

// Configuration
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';
const ENDPOINT = `${API_URL}/api/billing`;

// Get token from file or environment variable
let token = process.env.ADMIN_TOKEN;
if (!token && fs.existsSync('./tokens/admin_referring-token.txt')) {
  token = fs.readFileSync('./tokens/admin_referring-token.txt', 'utf8').trim();
}

if (!token) {
  console.error('No admin token found. Please set ADMIN_TOKEN environment variable or create tokens/admin_referring-token.txt');
  process.exit(1);
}

// Test function
async function testBillingOverview() {
  console.log('Testing GET /api/billing endpoint...');
  console.log(`API URL: ${API_URL}`);
  
  try {
    const response = await axios.get(ENDPOINT, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('\n✅ SUCCESS: GET /api/billing');
    console.log(`Status: ${response.status}`);
    console.log('Response data:');
    console.log(JSON.stringify(response.data, null, 2));
    
    return true;
  } catch (error) {
    console.log('\n❌ ERROR: GET /api/billing');
    
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log('Response data:');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`Error: ${error.message}`);
    }
    
    return false;
  }
}

// Run the test
testBillingOverview()
  .then(success => {
    if (success) {
      console.log('\nTest completed successfully.');
      process.exit(0);
    } else {
      console.log('\nTest failed.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });