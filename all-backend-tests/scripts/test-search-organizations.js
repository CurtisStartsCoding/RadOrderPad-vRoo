/**
 * Test script for the GET /api/organizations endpoint
 * This script tests the search functionality for potential partner organizations
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load token
let token;
try {
  token = fs.readFileSync(path.join(__dirname, '../../tokens/admin_referring-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error loading token:', error.message);
  process.exit(1);
}

// Set API URL
const API_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'https://api.radorderpad.com';

console.log(`Using API URL: ${API_URL}`);

/**
 * Make a request to the organizations endpoint
 */
async function searchOrganizations(queryParams = {}, authToken = token) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Build query string
    const queryString = Object.keys(queryParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
      .join('&');
    
    const url = queryString ? `${API_URL}/api/organizations?${queryString}` : `${API_URL}/api/organizations`;
    
    const response = await axios.get(url, { headers });
    
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
  console.log('Testing GET /api/organizations endpoint\n');
  
  try {
    // Test 1: Basic search without filters
    console.log('Test 1: Basic search without filters');
    const basicResult = await searchOrganizations();
    console.log(JSON.stringify(basicResult, null, 2));
    console.log();
    
    // Test 2: Search by name
    console.log('Test 2: Search by name (partial match)');
    const nameResult = await searchOrganizations({ name: 'Rad' });
    console.log(JSON.stringify(nameResult, null, 2));
    console.log();
    
    // Test 3: Search by type
    console.log('Test 3: Search by type');
    const typeResult = await searchOrganizations({ type: 'radiology_group' });
    console.log(JSON.stringify(typeResult, null, 2));
    console.log();
    
    // Test 4: Search by state
    console.log('Test 4: Search by state');
    const stateResult = await searchOrganizations({ state: 'CA' });
    console.log(JSON.stringify(stateResult, null, 2));
    console.log();
    
    // Test 5: Search with multiple filters
    console.log('Test 5: Search with multiple filters');
    const multiResult = await searchOrganizations({ type: 'radiology_group', state: 'CA' });
    console.log(JSON.stringify(multiResult, null, 2));
    console.log();
    
    // Test 6: Test with non-admin token (should get 403)
    console.log('Test 6: Test with non-admin token (should get 403)');
    let physicianToken;
    try {
      physicianToken = fs.readFileSync(path.join(__dirname, '../../tokens/physician-token.txt'), 'utf8').trim();
    } catch (error) {
      console.error('Error loading physician token:', error.message);
      physicianToken = 'invalid-token';
    }
    
    const unauthorizedResult = await searchOrganizations({}, physicianToken);
    console.log(JSON.stringify(unauthorizedResult, null, 2));
    console.log();
    
    console.log('Tests completed successfully');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error running tests:', error);
});
