/**
 * Fixed version of the test script for the GET /api/organizations/mine endpoint
 * 
 * This script tests the GET /api/organizations/mine endpoint, which returns
 * information about the authenticated user's organization, including locations and users.
 * 
 * This version includes additional error handling and token validation.
 * 
 * Usage:
 * node test-organizations-mine-endpoint-fixed.js
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

// Validate token format
if (!AUTH_TOKEN.match(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/)) {
  console.error('Warning: Token does not appear to be in valid JWT format');
  console.log('Token:', AUTH_TOKEN);
}

async function testGetMyOrganization() {
  console.log('Testing GET /api/organizations/mine endpoint...');
  
  try {
    // Make sure token doesn't have any whitespace or special characters
    const cleanToken = AUTH_TOKEN.trim();
    
    console.log('Using token (first 10 chars):', cleanToken.substring(0, 10) + '...');
    
    const response = await axios.get(`${API_URL}/api/organizations/mine`, {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success! Status code:', response.status);
    console.log('Response data:');
    
    // Print organization details
    const { organization, locations, users } = response.data.data;
    console.log('\nOrganization:');
    console.log(`ID: ${organization.id}`);
    console.log(`Name: ${organization.name}`);
    console.log(`Type: ${organization.type}`);
    
    // Check if status exists before trying to print it
    if (organization.status !== undefined) {
      console.log(`Status: ${organization.status}`);
    } else {
      console.log('Status: <not present in response>');
    }
    
    // Print locations
    console.log('\nLocations:');
    if (locations && locations.length > 0) {
      locations.forEach(location => {
        console.log(`- ${location.name} (ID: ${location.id})`);
      });
    } else {
      console.log('No locations found');
    }
    
    // Print users
    console.log('\nUsers:');
    if (users && users.length > 0) {
      users.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}, Role: ${user.role})`);
      });
    } else {
      console.log('No users found');
    }
    
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.response) {
      console.error('Status code:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    // If there's an issue with the token, suggest getting a new one
    if (error.message.includes('Authorization') || error.message.includes('token') || 
        (error.response && error.response.status === 401)) {
      console.error('\nThis appears to be an authentication issue. Try getting a new token:');
      console.error('node get-clean-token.js');
    }
    
    return false;
  }
}

// Run the test
(async () => {
  try {
    const success = await testGetMyOrganization();
    
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