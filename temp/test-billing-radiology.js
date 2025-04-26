/**
 * Test script for the GET /api/billing endpoint with radiology admin token
 */
const axios = require('axios');
const fs = require('fs');

// Configuration
const API_URL = 'https://api.radorderpad.com';
const ENDPOINT = `${API_URL}/api/billing`;

// Get radiology admin token
const token = fs.readFileSync('./tokens/admin_radiology-token.txt', 'utf8').trim();

console.log('Testing GET /api/billing endpoint with radiology admin token...');
console.log(`API URL: ${API_URL}`);

// Make the request
axios.get(ENDPOINT, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => {
  console.log('\n✅ SUCCESS: GET /api/billing');
  console.log(`Status: ${response.status}`);
  console.log('Response data:');
  console.log(JSON.stringify(response.data, null, 2));
  console.log('\nTest completed successfully.');
})
.catch(error => {
  console.log('\n❌ ERROR: GET /api/billing');
  
  if (error.response) {
    console.log(`Status: ${error.response.status}`);
    console.log('Response data:');
    console.log(JSON.stringify(error.response.data, null, 2));
  } else {
    console.log(`Error: ${error.message}`);
  }
  
  console.log('\nTest failed.');
});