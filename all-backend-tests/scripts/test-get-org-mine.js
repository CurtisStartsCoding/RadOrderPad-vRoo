/**
 * Test script for the GET /api/organizations/mine endpoint
 */

const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: './.env.test' });

// API base URL
const API_URL = process.env.API_URL || 'https://api.radorderpad.com';

// Read tokens from files
const getTokens = () => {
  try {
    // Get the project root directory
    const projectRoot = process.env.PROJECT_ROOT || process.cwd();
    
    // Read admin token
    const adminTokenPath = `${projectRoot}/tokens/admin_referring-token.txt`;
    console.log(`Reading admin token from: ${adminTokenPath}`);
    const adminToken = fs.readFileSync(adminTokenPath, 'utf8').trim();
    
    // Read physician token
    const physicianTokenPath = `${projectRoot}/tokens/physician-token.txt`;
    console.log(`Reading physician token from: ${physicianTokenPath}`);
    const physicianToken = fs.readFileSync(physicianTokenPath, 'utf8').trim();
    
    return { adminToken, physicianToken };
  } catch (error) {
    console.error('Error reading tokens:', error.message);
    process.exit(1);
  }
};

// Test the organizations/mine endpoint
async function testGetOrgMine() {
  console.log('Testing get my organization endpoint...');
  console.log(`API URL: ${API_URL}`);
  
  try {
    const { adminToken, physicianToken } = getTokens();
    
    // Test 1: Get my organization with admin token
    console.log('\nTest 1: Get my organization with admin token');
    try {
      const adminResponse = await axios.get(
        `${API_URL}/api/organizations/mine`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );
      console.log('Response Status:', adminResponse.status);
      console.log('Response Data:', JSON.stringify(adminResponse.data, null, 2));
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
    
    // Test 2: Get my organization with physician token
    console.log('\nTest 2: Get my organization with physician token');
    try {
      const physicianResponse = await axios.get(
        `${API_URL}/api/organizations/mine`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${physicianToken}`
          }
        }
      );
      console.log('Response Status:', physicianResponse.status);
      console.log('Response Data:', JSON.stringify(physicianResponse.data, null, 2));
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
    
    // Test 3: Get my organization without token
    console.log('\nTest 3: Get my organization without token');
    try {
      const noTokenResponse = await axios.get(
        `${API_URL}/api/organizations/mine`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Response Status:', noTokenResponse.status);
      console.log('Response Data:', JSON.stringify(noTokenResponse.data, null, 2));
    } catch (error) {
      console.log('Response Status:', error.response?.status);
      console.log('Response Data:', JSON.stringify(error.response?.data, null, 2));
    }
    
    console.log('\nTest completed.');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the test
testGetOrgMine();
