/**
 * Script to test connection endpoints with existing data
 * 
 * This script:
 * 1. Gets tokens for admin_referring and admin_radiology users
 * 2. Tests the connection endpoints with these tokens
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.production' });

// Constants
const API_URL = 'https://api.radorderpad.com';
const TOKENS_DIR = path.join(__dirname, 'tokens');

// Ensure tokens directory exists
if (!fs.existsSync(TOKENS_DIR)) {
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
}

// Test user credentials
const TEST_USERS = [
  {
    email: 'test.admin_referring@example.com',
    password: 'password123',
    role: 'admin_referring'
  },
  {
    email: 'test.admin_radiology@example.com',
    password: 'password123',
    role: 'admin_radiology'
  }
];

// Function to get JWT token
async function getToken(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    return response.data.token;
  } catch (error) {
    console.error(`Error getting token for ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Function to save token to file
function saveToken(role, token) {
  const tokenFile = path.join(TOKENS_DIR, `${role}-token.txt`);
  fs.writeFileSync(tokenFile, token);
  console.log(`Token saved to ${tokenFile}`);
}

// Function to test connection endpoints
async function testConnectionEndpoints(tokens) {
  console.log('\n=== TESTING CONNECTION ENDPOINTS ===');
  console.log(`API URL: ${API_URL}`);
  console.log('===================================\n');
  
  // Test list connections
  console.log('--- Testing List Connections ---');
  try {
    const response = await axios.get(`${API_URL}/connections`, {
      headers: { Authorization: `Bearer ${tokens.adminReferring}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    
    // Find relationships to test
    const connections = response.data.connections || [];
    const pendingRelationship = connections.find(conn => conn.status === 'pending');
    const activeRelationship = connections.find(conn => conn.status === 'active');
    
    if (pendingRelationship) {
      console.log(`\nFound pending relationship with ID: ${pendingRelationship.id}`);
    }
    
    if (activeRelationship) {
      console.log(`\nFound active relationship with ID: ${activeRelationship.id}`);
    }
    
    // Test list incoming requests
    console.log('\n--- Testing List Incoming Requests ---');
    try {
      const response = await axios.get(`${API_URL}/connections/requests`, {
        headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
      });
      
      console.log('Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));
      
      // Find pending requests
      const requests = response.data.requests || [];
      if (requests.length > 0) {
        console.log(`\nFound ${requests.length} pending request(s)`);
        
        // Test approve connection
        const requestToApprove = requests[0];
        console.log(`\n--- Testing Approve Connection (ID: ${requestToApprove.id}) ---`);
        try {
          const response = await axios.post(`${API_URL}/connections/${requestToApprove.id}/approve`, {}, {
            headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
          });
          
          console.log('Status:', response.status);
          console.log('Response Data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
        }
      } else if (pendingRelationship) {
        // If no requests found but we have a pending relationship from the connections list
        console.log(`\n--- Testing Reject Connection (ID: ${pendingRelationship.id}) ---`);
        try {
          const response = await axios.post(`${API_URL}/connections/${pendingRelationship.id}/reject`, {}, {
            headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
          });
          
          console.log('Status:', response.status);
          console.log('Response Data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
        }
      }
      
      // Test terminate connection if we found an active relationship
      if (activeRelationship) {
        console.log(`\n--- Testing Terminate Connection (ID: ${activeRelationship.id}) ---`);
        try {
          const response = await axios.delete(`${API_URL}/connections/${activeRelationship.id}`, {
            headers: { Authorization: `Bearer ${tokens.adminRadiology}` }
          });
          
          console.log('Status:', response.status);
          console.log('Response Data:', JSON.stringify(response.data, null, 2));
        } catch (error) {
          console.error('Error:', error.response?.data || error.message);
        }
      }
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
  
  console.log('\n=== CONNECTION ENDPOINT TESTING COMPLETE ===');
}

// Main function
async function main() {
  try {
    console.log('=== TESTING CONNECTION ENDPOINTS WITH EXISTING DATA ===');
    
    // Get tokens for test users
    console.log('\nGetting tokens for test users...');
    let adminReferringToken, adminRadiologyToken;
    
    try {
      adminReferringToken = await getToken(TEST_USERS[0].email, TEST_USERS[0].password);
      console.log(`✅ Got token for ${TEST_USERS[0].role}`);
      saveToken(TEST_USERS[0].role, adminReferringToken);
    } catch (error) {
      console.error(`❌ Failed to get token for ${TEST_USERS[0].role}`);
    }
    
    try {
      adminRadiologyToken = await getToken(TEST_USERS[1].email, TEST_USERS[1].password);
      console.log(`✅ Got token for ${TEST_USERS[1].role}`);
      saveToken(TEST_USERS[1].role, adminRadiologyToken);
    } catch (error) {
      console.error(`❌ Failed to get token for ${TEST_USERS[1].role}`);
    }
    
    // If we couldn't get tokens for the test users, try to use the tokens from the tokens directory
    if (!adminReferringToken || !adminRadiologyToken) {
      console.log('\nTrying to use existing tokens from tokens directory...');
      
      try {
        const adminReferringTokenPath = path.join(TOKENS_DIR, 'admin_referring-token.txt');
        if (fs.existsSync(adminReferringTokenPath)) {
          adminReferringToken = fs.readFileSync(adminReferringTokenPath, 'utf8').trim();
          console.log('✅ Using existing admin_referring token');
        }
      } catch (error) {
        console.error('❌ Failed to read admin_referring token');
      }
      
      try {
        const adminRadiologyTokenPath = path.join(TOKENS_DIR, 'admin_radiology-token.txt');
        if (fs.existsSync(adminRadiologyTokenPath)) {
          adminRadiologyToken = fs.readFileSync(adminRadiologyTokenPath, 'utf8').trim();
          console.log('✅ Using existing admin_radiology token');
        }
      } catch (error) {
        console.error('❌ Failed to read admin_radiology token');
      }
    }
    
    // Test connection endpoints if we have tokens
    if (adminReferringToken && adminRadiologyToken) {
      await testConnectionEndpoints({
        adminReferring: adminReferringToken,
        adminRadiology: adminRadiologyToken
      });
    } else {
      console.error('\n❌ Cannot test connection endpoints without tokens');
    }
    
    console.log('\n=== CONNECTION ENDPOINT TESTING COMPLETE ===');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the main function
main();