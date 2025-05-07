/**
 * Test script for the GET /api/connections/requests endpoint
 * This endpoint lists pending incoming connection requests for the authenticated user's organization
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './.env.test' });

// API base URL
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Read admin token from file
const getAdminToken = () => {
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

// Main test function
async function testConnectionRequests() {
  const token = getAdminToken();
  
  console.log('\n=== Testing GET /api/connections/requests endpoint ===\n');
  
  try {
    console.log('Using API URL:', API_URL);
    console.log('Using admin token from:', `${process.env.PROJECT_ROOT || process.cwd()}/tokens/admin_referring-token.txt`);
    
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
    
    // Test 1: Basic request - should return a list of pending requests
    console.log('\nTest 1: Basic request for pending connection requests');
    console.log('Making GET request to:', `${API_URL}/api/connections/requests`);
    console.log('This endpoint queries the organization_relationships table in the Main database');
    console.log('Looking for records where:');
    console.log('  - related_organization_id = [from token]');
    console.log('  - status = "pending"');
    
    const response = await axios.get(`${API_URL}/api/connections/requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`\nResponse Status: ${response.status}`);
    console.log('Response Headers:', JSON.stringify(response.headers, null, 2));
    
    if (response.data && response.data.requests) {
      console.log(`\nFound ${response.data.requests.length} pending requests`);
      console.log('Full response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.requests.length > 0) {
        // Show details of the first request
        console.log('\nFirst request details:');
        console.log(JSON.stringify(response.data.requests[0], null, 2));
      } else {
        console.log('\nNo pending requests found. This is expected if no other organizations have requested to connect with this organization.');
      }
      
      console.log('\n✅ Test passed: Connection requests retrieved successfully');
    } else {
      console.log('\n⚠️ Test warning: Response format unexpected');
      console.log('Response data:', JSON.stringify(response.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
}

// Run the tests
testConnectionRequests();
