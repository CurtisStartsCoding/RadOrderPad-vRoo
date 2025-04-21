/**
 * Scenario E: Connection Request (Production)
 * 
 * This test scenario covers:
 * 1. Register two organizations (Referring and Radiology)
 * 2. Login as Referring Admin
 * 3. Call /connections (POST to request connection to Radiology Org)
 * 4. Login as Radiology Admin
 * 5. Call /connections/requests (GET to see request)
 * 6. Call /connections/{reqId}/approve
 * 7. Login as Referring Admin
 * 8. Call /connections (GET to verify status 'active')
 * 
 * This version makes real API calls to the production environment.
 */

const helpers = require('./test-helpers-production');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-E-Production';

// Test data
const testData = {
  referring: {
    orgName: 'Test Referring Practice E-Prod',
    orgType: 'referring',
    admin: {
      firstName: 'Thomas',
      lastName: 'Wilson',
      email: `admin-ref-e-prod-${Date.now()}@example.com`, // Ensure unique email
      password: 'Password123!'
    }
  },
  radiology: {
    orgName: 'Test Radiology Center E-Prod',
    orgType: 'radiology',
    admin: {
      firstName: 'Rebecca',
      lastName: 'Taylor',
      email: `admin-rad-e-prod-${Date.now()}@example.com`, // Ensure unique email
      password: 'Password123!'
    }
  },
  connectionNotes: 'Connection request for production testing purposes'
};

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Step 1: Register Referring Organization and Admin
    helpers.log('Step 1: Register Referring Organization and Admin', SCENARIO);
    const referringRegisterResponse = await helpers.registerOrganization(
      testData.referring.orgName,
      testData.referring.orgType,
      testData.referring.admin.firstName,
      testData.referring.admin.lastName,
      testData.referring.admin.email,
      testData.referring.admin.password
    );
    
    // Store referring organization and admin data
    const referringOrgId = helpers.storeTestData('referringOrgId', referringRegisterResponse.organization.id, SCENARIO);
    const referringAdminId = helpers.storeTestData('referringAdminId', referringRegisterResponse.user.id, SCENARIO);
    helpers.log(`Referring organization created with ID: ${referringOrgId}`, SCENARIO);
    helpers.log(`Referring admin created with ID: ${referringAdminId}`, SCENARIO);
    
    // Step 2: Register Radiology Organization and Admin
    helpers.log('Step 2: Register Radiology Organization and Admin', SCENARIO);
    const radiologyRegisterResponse = await helpers.registerOrganization(
      testData.radiology.orgName,
      testData.radiology.orgType,
      testData.radiology.admin.firstName,
      testData.radiology.admin.lastName,
      testData.radiology.admin.email,
      testData.radiology.admin.password
    );
    
    // Store radiology organization and admin data
    const radiologyOrgId = helpers.storeTestData('radiologyOrgId', radiologyRegisterResponse.organization.id, SCENARIO);
    const radiologyAdminId = helpers.storeTestData('radiologyAdminId', radiologyRegisterResponse.user.id, SCENARIO);
    helpers.log(`Radiology organization created with ID: ${radiologyOrgId}`, SCENARIO);
    helpers.log(`Radiology admin created with ID: ${radiologyAdminId}`, SCENARIO);
    
    // Step 3: Login as Referring Admin
    helpers.log('Step 3: Login as Referring Admin', SCENARIO);
    const referringAdminToken = await helpers.login(
      testData.referring.admin.email,
      testData.referring.admin.password
    );
    helpers.storeTestData('referringAdminToken', referringAdminToken, SCENARIO);
    
    // Step 4: Call /connections (POST to request connection to Radiology Org)
    helpers.log('Step 4: Request Connection to Radiology Organization', SCENARIO);
    const connectionRequestResponse = await helpers.apiRequest(
      'post',
      '/connections',
      {
        targetOrganizationId: radiologyOrgId,
        notes: testData.connectionNotes
      },
      referringAdminToken
    );
    
    // Store connection request data
    const connectionId = helpers.storeTestData('connectionId', connectionRequestResponse.id, SCENARIO);
    helpers.log(`Connection request created with ID: ${connectionId}`, SCENARIO);
    
    // Verify connection request status is 'pending'
    if (connectionRequestResponse.status !== 'pending') {
      throw new Error(`Unexpected connection request status: ${connectionRequestResponse.status}`);
    }
    
    // Step 5: Login as Radiology Admin
    helpers.log('Step 5: Login as Radiology Admin', SCENARIO);
    const radiologyAdminToken = await helpers.login(
      testData.radiology.admin.email,
      testData.radiology.admin.password
    );
    helpers.storeTestData('radiologyAdminToken', radiologyAdminToken, SCENARIO);
    
    // Step 6: Call /connections/requests (GET to see request)
    helpers.log('Step 6: Get Connection Requests for Radiology Organization', SCENARIO);
    const connectionRequestsResponse = await helpers.apiRequest(
      'get',
      '/connections/requests',
      null,
      radiologyAdminToken
    );
    
    // Verify the connection request is in the list
    const requestFound = connectionRequestsResponse.requests.some(r => r.id === connectionId);
    if (!requestFound) {
      throw new Error(`Connection request ${connectionId} not found in requests list`);
    }
    
    helpers.log('Connection request found in requests list', SCENARIO);
    
    // Step 7: Call /connections/{reqId}/approve
    helpers.log('Step 7: Approve Connection Request', SCENARIO);
    const approveResponse = await helpers.apiRequest(
      'post',
      `/connections/${connectionId}/approve`,
      {},
      radiologyAdminToken
    );
    
    // Verify approval was successful
    if (!approveResponse.success) {
      throw new Error('Connection approval failed');
    }
    
    helpers.log('Connection request approved successfully', SCENARIO);
    
    // Step 8: Login as Referring Admin again
    helpers.log('Step 8: Login as Referring Admin Again', SCENARIO);
    const referringAdminToken2 = await helpers.login(
      testData.referring.admin.email,
      testData.referring.admin.password
    );
    
    // Step 9: Call /connections (GET to verify status 'active')
    helpers.log('Step 9: Verify Connection Status', SCENARIO);
    const connectionsResponse = await helpers.apiRequest(
      'get',
      '/connections',
      null,
      referringAdminToken2
    );
    
    // Find the connection in the list
    const connection = connectionsResponse.connections.find(c => c.id === connectionId);
    if (!connection) {
      throw new Error(`Connection ${connectionId} not found in connections list`);
    }
    
    // Verify connection status is 'active'
    if (connection.status !== 'active') {
      throw new Error(`Unexpected connection status: ${connection.status}`);
    }
    
    helpers.log(`Connection verified with status: ${connection.status}`, SCENARIO);
    
    // Step 10: Verify Connection Details
    helpers.log('Step 10: Verify Connection Details', SCENARIO);
    
    // Verify connection details from referring side
    const referringConnectionDetails = await helpers.apiRequest(
      'get',
      `/connections/${connectionId}`,
      null,
      referringAdminToken2
    );
    
    // Verify connection details
    if (referringConnectionDetails.id !== connectionId) {
      throw new Error('Connection ID mismatch');
    }
    
    if (referringConnectionDetails.status !== 'active') {
      throw new Error(`Unexpected connection status: ${referringConnectionDetails.status}`);
    }
    
    if (referringConnectionDetails.notes !== testData.connectionNotes) {
      throw new Error('Connection notes do not match');
    }
    
    if (referringConnectionDetails.requestingOrganizationId !== referringOrgId) {
      throw new Error('Requesting organization ID mismatch');
    }
    
    if (referringConnectionDetails.targetOrganizationId !== radiologyOrgId) {
      throw new Error('Target organization ID mismatch');
    }
    
    helpers.log('Connection details verified successfully', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
    return {
      success: true,
      referringOrgId,
      radiologyOrgId,
      connectionId
    };
    
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    return {
      success: false,
      error: error.message
    };
  }
}

// If this script is run directly (not required), run the test
if (require.main === module) {
  runTest().then(result => {
    console.log('Test result:', result);
    process.exit(result.success ? 0 : 1);
  });
} else {
  // Export the runTest function for use in other scripts
  module.exports = { runTest };
}