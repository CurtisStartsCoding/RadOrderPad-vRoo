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

// Get admin token
let token;
try {
  token = fs.readFileSync(path.join(__dirname, '..', '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading admin token file:', error.message);
  process.exit(1);
}

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

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
  console.log('Testing User Location Assignment Endpoints\n');
  
  // Test data - using actual IDs from our database
  const userIdX = 29; // Admin Referring user
  const userIdY = 39; // Admin Radiology user (should fail)
  const locationL1Id = 81; // Clinic Location for referring practice
  const locationL2Id = 80; // Imaging Center Location for radiology group (should fail)
  
  // Test 1: Assign User X to Location L1
  console.log('Test 1: Assign User X to Location L1');
  try {
    const assignResponse = await api.post(`/api/user-locations/${userIdX}/locations/${locationL1Id}`);
    console.log(JSON.stringify(assignResponse.data, null, 2));
  } catch (error) {
    console.error('Error assigning user to location:', handleError(error));
  }
  
  // Test 2: Get locations for User X
  console.log('\nTest 2: Get locations for User X');
  try {
    const getResponse = await api.get(`/api/user-locations/${userIdX}/locations`);
    console.log(JSON.stringify(getResponse.data, null, 2));
  } catch (error) {
    console.error('Error getting user locations:', handleError(error));
  }
  
  // Test 3: Assign User X to Location L1 again (should be idempotent)
  console.log('\nTest 3: Assign User X to Location L1 again');
  try {
    const assignAgainResponse = await api.post(`/api/user-locations/${userIdX}/locations/${locationL1Id}`);
    console.log(JSON.stringify(assignAgainResponse.data, null, 2));
  } catch (error) {
    console.error('Error assigning user to location again:', handleError(error));
  }
  
  // Test 4: Try to assign User X to Location L2 (should fail as it's from a different org)
  console.log('\nTest 4: Try to assign User X to Location L2 (should fail)');
  try {
    const assignL2Response = await api.post(`/api/user-locations/${userIdX}/locations/${locationL2Id}`);
    console.log(JSON.stringify(assignL2Response.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  // Test 5: Unassign User X from Location L1
  console.log('\nTest 5: Unassign User X from Location L1');
  try {
    const unassignResponse = await api.delete(`/api/user-locations/${userIdX}/locations/${locationL1Id}`);
    console.log(JSON.stringify(unassignResponse.data, null, 2));
  } catch (error) {
    console.error('Error unassigning user from location:', handleError(error));
  }
  
  // Test 6: Get locations for User X (should be empty now)
  console.log('\nTest 6: Get locations for User X (should be empty now)');
  try {
    const getFinalResponse = await api.get(`/api/user-locations/${userIdX}/locations`);
    console.log(JSON.stringify(getFinalResponse.data, null, 2));
  } catch (error) {
    console.error('Error getting final user locations:', handleError(error));
  }
  
  // Test 7: Unassign User X from Location L1 again (should return 404)
  console.log('\nTest 7: Unassign User X from Location L1 again (should return 404)');
  try {
    const unassignAgainResponse = await api.delete(`/api/user-locations/${userIdX}/locations/${locationL1Id}`);
    console.log(JSON.stringify(unassignAgainResponse.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  // Test 8: Try to assign User Y (Org B) using Org A token (should return 404)
  console.log('\nTest 8: Try to assign User Y (Org B) using Org A token (should return 404)');
  try {
    const assignUserYResponse = await api.post(`/api/user-locations/${userIdY}/locations/${locationL1Id}`);
    console.log(JSON.stringify(assignUserYResponse.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  // Test 9: Try with invalid user ID format (should return 400)
  console.log('\nTest 9: Try with invalid user ID format (should return 400)');
  try {
    const invalidUserIdResponse = await api.get(`/api/user-locations/invalid-id/locations`);
    console.log(JSON.stringify(invalidUserIdResponse.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  console.log('\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});