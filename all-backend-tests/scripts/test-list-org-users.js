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

// Get tokens
let adminReferringToken, adminRadiologyToken, physicianToken;

try {
  adminReferringToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
  adminRadiologyToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_radiology-token.txt'), 'utf8').trim();
  physicianToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'physician-token.txt'), 'utf8').trim();
} catch (error) {
  console.error('Error reading token files:', error.message);
  process.exit(1);
}

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
  console.log('\n===== Testing GET /api/users Endpoint =====\n');
  
  // Test 1: Basic list with admin_referring
  console.log('Test 1: Basic list with admin_referring role');
  try {
    const response = await axios.get(`${API_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 2: With pagination
  console.log('\n\nTest 2: With pagination (page=1, limit=2)');
  try {
    const response = await axios.get(`${API_URL}/api/users?page=1&limit=2&sortBy=email&sortOrder=asc`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 3: Filter by role
  console.log('\n\nTest 3: Filter by role (physician)');
  try {
    const response = await axios.get(`${API_URL}/api/users?role=physician`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 4: Filter by status
  console.log('\n\nTest 4: Filter by status (active only)');
  try {
    const response = await axios.get(`${API_URL}/api/users?status=true`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 5: Search by name
  console.log('\n\nTest 5: Search by name (Test)');
  try {
    const response = await axios.get(`${API_URL}/api/users?name=Test`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 6: Admin radiology access
  console.log('\n\nTest 6: Admin radiology access');
  try {
    const response = await axios.get(`${API_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 7: Physician access (should fail)
  console.log('\n\nTest 7: Physician access (should fail with 403)');
  try {
    const response = await axios.get(`${API_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${physicianToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 8: No authentication
  console.log('\n\nTest 8: No authentication (should fail with 401)');
  try {
    const response = await axios.get(`${API_URL}/api/users`);
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  console.log('\n\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});