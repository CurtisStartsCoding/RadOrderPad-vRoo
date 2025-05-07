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

// Get admin_referring token
let token;
try {
  token = fs.readFileSync(path.join(__dirname, '..', '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading admin_referring token file:', error.message);
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
  console.log('Testing Location Management Endpoints\n');
  
  let locationId;
  
  // Step 1: Create a test location
  console.log('Step 1: Creating a test location...');
  try {
    const createResponse = await api.post('/api/organizations/mine/locations', {
      name: 'Test Location',
      address_line1: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip_code: '12345',
      phone_number: '555-123-4567'
    });
    
    console.log('Create Location Response:', JSON.stringify(createResponse.data, null, 2));
    locationId = createResponse.data.location.id;
    console.log(`Extracted Location ID: ${locationId}\n`);
  } catch (error) {
    console.error('Error creating location:', handleError(error));
    process.exit(1);
  }
  
  // Test 1: Get location details
  console.log('Test 1: Get location details');
  try {
    const getResponse = await api.get(`/api/organizations/mine/locations/${locationId}`);
    console.log(JSON.stringify(getResponse.data, null, 2));
  } catch (error) {
    console.error('Error getting location:', handleError(error));
  }
  
  // Test 2: Update location
  console.log('\nTest 2: Update location');
  try {
    const updateResponse = await api.put(`/api/organizations/mine/locations/${locationId}`, {
      name: 'Updated Test Location',
      address_line1: '456 Updated St',
      city: 'Updated City'
    });
    console.log(JSON.stringify(updateResponse.data, null, 2));
  } catch (error) {
    console.error('Error updating location:', handleError(error));
  }
  
  // Test 3: Get updated location details
  console.log('\nTest 3: Get updated location details');
  try {
    const getUpdatedResponse = await api.get(`/api/organizations/mine/locations/${locationId}`);
    console.log(JSON.stringify(getUpdatedResponse.data, null, 2));
  } catch (error) {
    console.error('Error getting updated location:', handleError(error));
  }
  
  // Test 4: Deactivate location
  console.log('\nTest 4: Deactivate location');
  try {
    const deactivateResponse = await api.delete(`/api/organizations/mine/locations/${locationId}`);
    console.log(JSON.stringify(deactivateResponse.data, null, 2));
  } catch (error) {
    console.error('Error deactivating location:', handleError(error));
  }
  
  // Test 5: Try to get deactivated location (should return 404)
  console.log('\nTest 5: Try to get deactivated location (should return 404)');
  try {
    const getDeactivatedResponse = await api.get(`/api/organizations/mine/locations/${locationId}`);
    console.log(JSON.stringify(getDeactivatedResponse.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  // Test 6: Invalid location ID format
  console.log('\nTest 6: Invalid location ID format (should return 400)');
  try {
    const invalidIdResponse = await api.get('/api/organizations/mine/locations/invalid-id');
    console.log(JSON.stringify(invalidIdResponse.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  // Test 7: Non-existent location ID
  console.log('\nTest 7: Non-existent location ID (should return 404)');
  try {
    const nonExistentResponse = await api.get('/api/organizations/mine/locations/9999');
    console.log(JSON.stringify(nonExistentResponse.data, null, 2));
  } catch (error) {
    console.log(JSON.stringify(handleError(error), null, 2));
  }
  
  // Test 8: No authentication
  console.log('\nTest 8: No authentication (should return 401)');
  try {
    const noAuthResponse = await axios.get(`${API_URL}/api/organizations/mine/locations/${locationId}`);
    console.log(JSON.stringify(noAuthResponse.data, null, 2));
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
