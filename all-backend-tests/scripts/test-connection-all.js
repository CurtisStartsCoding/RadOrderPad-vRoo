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
let adminReferringToken, adminRadiologyToken;

try {
  adminReferringToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_referring-token.txt'), 'utf8').trim();
  adminRadiologyToken = fs.readFileSync(path.join(__dirname, '..', 'tokens', 'admin_radiology-token.txt'), 'utf8').trim();
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

// Run all connection tests
async function runTests() {
  console.log('\n===== Testing Connection Management Endpoints =====\n');
  
  // Test 1: List connections
  console.log('Test 1: List all connections (GET /api/connections)');
  try {
    const response = await axios.get(`${API_URL}/api/connections`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 2: List pending connection requests
  console.log('\n\nTest 2: List pending connection requests (GET /api/connections/requests)');
  try {
    const response = await axios.get(`${API_URL}/api/connections/requests`, {
      headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 3: Search organizations
  console.log('\n\nTest 3: Search organizations (GET /api/organizations?search=test)');
  try {
    const response = await axios.get(`${API_URL}/api/organizations?search=test`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', handleError(error));
  }
  
  // Test 4: Create connection request (with invalid target to see error)
  console.log('\n\nTest 4: Create connection request (POST /api/connections)');
  try {
    const response = await axios.post(
      `${API_URL}/api/connections`,
      {
        targetOrgId: 99999, // Non-existent org
        notes: 'Test connection request'
      },
      {
        headers: { 
          'Authorization': `Bearer ${adminReferringToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Expected error:', handleError(error));
  }
  
  // Test 5: Create valid connection request
  console.log('\n\nTest 5: Create valid connection request to org 2');
  try {
    const response = await axios.post(
      `${API_URL}/api/connections`,
      {
        targetOrgId: 2, // Radiology org
        notes: 'Partnership request for imaging services'
      },
      {
        headers: { 
          'Authorization': `Bearer ${adminReferringToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Success:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Error:', handleError(error));
  }
  
  // Test 6: Approve connection (as radiology admin)
  console.log('\n\nTest 6: Get pending requests as radiology admin');
  try {
    const requestsResponse = await axios.get(`${API_URL}/api/connections/requests`, {
      headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
    });
    
    if (requestsResponse.data.requests && requestsResponse.data.requests.length > 0) {
      const requestId = requestsResponse.data.requests[0].id;
      console.log(`Found request ID ${requestId}, attempting to approve...`);
      
      const approveResponse = await axios.post(
        `${API_URL}/api/connections/${requestId}/approve`,
        { notes: 'Approved for partnership' },
        {
          headers: { 
            'Authorization': `Bearer ${adminRadiologyToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Approval result:', JSON.stringify(approveResponse.data, null, 2));
    } else {
      console.log('No pending requests to approve');
    }
  } catch (error) {
    console.log('Error:', handleError(error));
  }
  
  // Test 7: Reject connection (create a new one first)
  console.log('\n\nTest 7: Test rejection flow');
  // First create a request from org 1 to org 2
  try {
    // Check if we already have a connection
    const existingConnections = await axios.get(`${API_URL}/api/connections`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    
    const hasActiveConnection = existingConnections.data.connections?.some(
      conn => conn.partnerOrgId === 2 && conn.status === 'active'
    );
    
    if (!hasActiveConnection) {
      // Create new request
      await axios.post(
        `${API_URL}/api/connections`,
        {
          targetOrgId: 2,
          notes: 'Test request for rejection'
        },
        {
          headers: { 
            'Authorization': `Bearer ${adminReferringToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Created test request');
      
      // Get requests as radiology admin
      const requestsResponse = await axios.get(`${API_URL}/api/connections/requests`, {
        headers: { 'Authorization': `Bearer ${adminRadiologyToken}` }
      });
      
      if (requestsResponse.data.requests && requestsResponse.data.requests.length > 0) {
        const requestId = requestsResponse.data.requests[0].id;
        console.log(`Rejecting request ID ${requestId}...`);
        
        const rejectResponse = await axios.put(
          `${API_URL}/api/connections/${requestId}/reject`,
          { notes: 'Not accepting new partners at this time' },
          {
            headers: { 
              'Authorization': `Bearer ${adminRadiologyToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Rejection result:', JSON.stringify(rejectResponse.data, null, 2));
      }
    } else {
      console.log('Active connection already exists, skipping rejection test');
    }
  } catch (error) {
    console.log('Error:', handleError(error));
  }
  
  // Test 8: Terminate connection
  console.log('\n\nTest 8: Terminate connection (DELETE /api/connections/:id)');
  try {
    // First get active connections
    const connectionsResponse = await axios.get(`${API_URL}/api/connections`, {
      headers: { 'Authorization': `Bearer ${adminReferringToken}` }
    });
    
    const activeConnection = connectionsResponse.data.connections?.find(
      conn => conn.status === 'active'
    );
    
    if (activeConnection) {
      console.log(`Terminating connection ID ${activeConnection.id}...`);
      
      const terminateResponse = await axios.delete(
        `${API_URL}/api/connections/${activeConnection.id}`,
        {
          headers: { 'Authorization': `Bearer ${adminReferringToken}` }
        }
      );
      console.log('Termination result:', JSON.stringify(terminateResponse.data, null, 2));
    } else {
      console.log('No active connections to terminate');
    }
  } catch (error) {
    console.log('Error:', handleError(error));
  }
  
  console.log('\n\nTests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});