/**
 * Test script for the GET /api/billing/credit-balance endpoint
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Set API URL
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://api.radorderpad.com';

console.log(`Using API URL: ${API_URL}`);

// Get admin_referring token
let adminReferringToken;
try {
  adminReferringToken = fs.readFileSync(path.join(__dirname, '../../tokens/admin_referring-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading admin_referring token file:', error.message);
  try {
    adminReferringToken = fs.readFileSync(path.join(__dirname, '../../tokens/admin_referring-token.txt'), 'utf8').trim();
  } catch (error) {
    console.error('Error reading admin_referring token file (alternative path):', error.message);
    process.exit(1);
  }
}

// Get physician token
let physicianToken;
try {
  physicianToken = fs.readFileSync(path.join(__dirname, '../../tokens/physician-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading physician token file:', error.message);
  try {
    physicianToken = fs.readFileSync(path.join(__dirname, '../../tokens/physician-token.txt'), 'utf8').trim();
  } catch (error) {
    console.error('Error reading physician token file (alternative path):', error.message);
    process.exit(1);
  }
}

/**
 * Make a request to the credit balance endpoint
 */
async function getCreditBalance(authToken = null) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await axios.get(`${API_URL}/api/billing/credit-balance`, { headers });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        error: true,
        status: error.response.status,
        data: error.response.data
      };
    }
    
    return {
      error: true,
      message: error.message
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('=== Testing GET /api/billing/credit-balance Endpoint ===\n');
  
  try {
    // Test 1: Get credit balance with admin_referring token
    console.log('Test 1: Get credit balance with admin_referring token');
    console.log('Expected: 200 OK with credit balance data');
    const adminResult = await getCreditBalance(adminReferringToken);
    console.log(JSON.stringify(adminResult, null, 2));
    console.log();
    
    // Test 2: Get credit balance with physician token
    console.log('Test 2: Get credit balance with physician token');
    console.log('Expected: 403 Forbidden (role restriction)');
    const physicianResult = await getCreditBalance(physicianToken);
    console.log(JSON.stringify(physicianResult, null, 2));
    console.log();
    
    // Test 3: Get credit balance without token
    console.log('Test 3: Get credit balance without token');
    console.log('Expected: 401 Unauthorized');
    const noTokenResult = await getCreditBalance();
    console.log(JSON.stringify(noTokenResult, null, 2));
    console.log();
    
    console.log('=== Test Completed ===');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error running tests:', error);
});