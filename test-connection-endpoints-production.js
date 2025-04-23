/**
 * Script to test connection endpoints with the newly created users
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Constants
const API_URL = 'https://api.radorderpad.com/api';
const TOKENS_DIR = path.join(__dirname, 'tokens');

// Ensure tokens directory exists
if (!fs.existsSync(TOKENS_DIR)) {
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
}

// Test user credentials from the insert-test-data.js script
// Note: Update these with the actual email addresses from your script output
const TEST_USERS = [
  {
    email: 'test.admin_referring.b27ed4ec@example.com',
    password: 'password123',
    role: 'admin_referring'
  },
  {
    email: 'test.admin_radiology.b27ed4ec@example.com',
    password: 'password123',
    role: 'admin_radiology'
  }
];

// Function to get JWT token
async function getToken(email, password) {
  try {
    console.log(`Getting token for ${email}...`);
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    console.log(`✅ Successfully got token for ${email}`);
    return response.data.token;
  } catch (error) {
    console.error(`❌ Error getting token for ${email}:`, error.response?.data || error.message);
    throw error;
  }
}

// Function to save token to file
function saveToken(role, token) {
  const tokenFile = path.join(TOKENS_DIR, `${role}-token.txt`);
  fs.writeFileSync(tokenFile, token);
  console.log(`Token saved to ${tokenFile}`);
}

// Function to test list connections endpoint
async function testListConnections(token) {
  console.log('\n--- Testing List Connections ---');
  try {
    const response = await axios.get(`${API_URL}/connections`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Function to test list incoming requests endpoint
async function testListIncomingRequests(token) {
  console.log('\n--- Testing List Incoming Requests ---');
  try {
    const response = await axios.get(`${API_URL}/connections/requests`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Function to test approve connection endpoint
async function testApproveConnection(token, relationshipId) {
  console.log(`\n--- Testing Approve Connection (ID: ${relationshipId}) ---`);
  try {
    const response = await axios.post(`${API_URL}/connections/${relationshipId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Function to test reject connection endpoint
async function testRejectConnection(token, relationshipId) {
  console.log(`\n--- Testing Reject Connection (ID: ${relationshipId}) ---`);
  try {
    const response = await axios.post(`${API_URL}/connections/${relationshipId}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Function to test terminate connection endpoint
async function testTerminateConnection(token, relationshipId) {
  console.log(`\n--- Testing Terminate Connection (ID: ${relationshipId}) ---`);
  try {
    const response = await axios.delete(`${API_URL}/connections/${relationshipId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Function to test request connection endpoint
async function testRequestConnection(token, targetOrgId) {
  console.log(`\n--- Testing Request Connection (Target Org ID: ${targetOrgId}) ---`);
  try {
    const response = await axios.post(`${API_URL}/connections`, {
      targetOrgId: targetOrgId,
      notes: "Test connection request from script"
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Main function
async function main() {
  try {
    console.log('=== TESTING CONNECTION ENDPOINTS WITH PRODUCTION DATA ===');
    
    // Get tokens for test users
    console.log('\nGetting tokens for test users...');
    let adminReferringToken, adminRadiologyToken;
    
    try {
      adminReferringToken = await getToken(TEST_USERS[0].email, TEST_USERS[0].password);
      saveToken(TEST_USERS[0].role, adminReferringToken);
    } catch (error) {
      console.error(`❌ Failed to get token for ${TEST_USERS[0].role}`);
    }
    
    try {
      adminRadiologyToken = await getToken(TEST_USERS[1].email, TEST_USERS[1].password);
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
      console.log('\n=== TESTING CONNECTION ENDPOINTS ===');
      console.log(`API URL: ${API_URL}`);
      console.log('===================================\n');
      
      // 1. List connections for admin_referring
      const connectionsData = await testListConnections(adminReferringToken);
      
      // 2. List incoming requests for admin_radiology
      const requestsData = await testListIncomingRequests(adminRadiologyToken);
      
      // Find relationship IDs for testing
      let pendingRelationshipId = null;
      let activeRelationshipId = null;
      
      // Check connections data
      if (connectionsData && connectionsData.connections) {
        const pendingConnection = connectionsData.connections.find(conn => conn.status === 'pending');
        const activeConnection = connectionsData.connections.find(conn => conn.status === 'active');
        
        if (pendingConnection) {
          pendingRelationshipId = pendingConnection.id;
          console.log(`Found pending relationship with ID: ${pendingRelationshipId}`);
        }
        
        if (activeConnection) {
          activeRelationshipId = activeConnection.id;
          console.log(`Found active relationship with ID: ${activeRelationshipId}`);
        }
      }
      
      // Check requests data
      if (requestsData && requestsData.requests) {
        const pendingRequest = requestsData.requests[0];
        if (pendingRequest) {
          pendingRelationshipId = pendingRequest.id;
          console.log(`Found pending request with ID: ${pendingRelationshipId}`);
        }
      }
      
      // If we found a pending relationship, test approve connection
      if (pendingRelationshipId) {
        await testApproveConnection(adminRadiologyToken, pendingRelationshipId);
        
        // After approving, we should have an active relationship
        // Let's list connections again to get the active relationship ID
        console.log('\n--- Getting Active Relationship After Approval ---');
        const updatedConnectionsData = await testListConnections(adminReferringToken);
        
        if (updatedConnectionsData && updatedConnectionsData.connections) {
          const activeConnection = updatedConnectionsData.connections.find(conn => conn.status === 'active');
          
          if (activeConnection) {
            activeRelationshipId = activeConnection.id;
            console.log(`Found active relationship with ID: ${activeRelationshipId}`);
            
            // Now test terminate connection
            await testTerminateConnection(adminRadiologyToken, activeRelationshipId);
          }
        }
      } else {
        console.log('\nNo pending relationship found to approve.');
        
        // If no pending relationship found, test request connection
        // We need to know the target organization ID
        console.log('\nTesting request connection...');
        // Assuming organization IDs 7 and 8 from the insert-test-data.js script
        await testRequestConnection(adminReferringToken, 8); // Referring org requesting connection to radiology org
      }
      
      // If we still have an active relationship, test terminate connection
      if (activeRelationshipId && !pendingRelationshipId) {
        await testTerminateConnection(adminRadiologyToken, activeRelationshipId);
      } else if (!activeRelationshipId && !pendingRelationshipId) {
        console.log('\nNo active relationship found to terminate.');
      }
      
      // Test list connections again to see the updated status
      console.log('\n--- Testing List Connections Again (After Actions) ---');
      await testListConnections(adminReferringToken);
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