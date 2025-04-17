/**
 * RadOrderPad End-to-End Test Helpers (Database-Driven Version)
 * 
 * This file contains helper functions for the end-to-end test scenarios.
 * It uses a structured test database to ensure consistent responses.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');
const testConfig = require('../../test-config');
const testDatabase = require('./test-data/test-database');

// Configuration
const config = {
  baseUrl: testConfig.api.baseUrl,
  resultsDir: path.join(__dirname, '../../test-results/e2e')
};

// Ensure results directory exists
if (!fs.existsSync(config.resultsDir)) {
  fs.mkdirSync(config.resultsDir, { recursive: true });
}

// Shared state object to maintain consistency across API calls
const testState = {
  orders: {},
  connections: {},
  users: {},
  organizations: {},
  uploads: {},
  invitations: {},
  clinicalRecords: {},
  creditUsage: {}
};

// Initialize state with test database
function initializeState() {
  // Initialize organizations
  Object.values(testDatabase.organizations).forEach(org => {
    testState.organizations[org.id] = { ...org };
  });
  
  // Initialize users
  Object.values(testDatabase.users).forEach(user => {
    testState.users[user.id] = { ...user };
  });
  
  // Initialize orders
  Object.values(testDatabase.orders).forEach(order => {
    testState.orders[order.id] = { ...order };
  });
  
  // Initialize connections
  Object.values(testDatabase.connections).forEach(connection => {
    testState.connections[connection.id] = { ...connection };
  });
  
  // Initialize invitations
  Object.values(testDatabase.invitations).forEach(invitation => {
    testState.invitations[invitation.id] = { ...invitation };
  });
  
  // Initialize document uploads
  Object.values(testDatabase.documentUploads).forEach(document => {
    testState.uploads[document.id] = { ...document };
  });
}

// Initialize state
initializeState();

// Helper function to log messages
function log(message, scenarioName = '') {
  const timestamp = new Date().toISOString();
  const prefix = scenarioName ? `[${scenarioName}] ` : '';
  const logMessage = `[${timestamp}] ${prefix}${message}`;
  
  console.log(logMessage);
  
  // Append to scenario-specific log if provided
  if (scenarioName) {
    const logFile = path.join(config.resultsDir, `${scenarioName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.log`);
    fs.appendFileSync(logFile, logMessage + '\n');
  }
}

// Helper function to store test data
function storeTestData(key, value, scenarioName = '') {
  const dataFile = scenarioName 
    ? path.join(config.resultsDir, `${scenarioName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`)
    : path.join(config.resultsDir, 'test-data.json');
  
  let data = {};
  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
  
  data[key] = value;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  
  return value;
}

// Helper function to retrieve test data
function getTestData(key, scenarioName = '') {
  const dataFile = scenarioName 
    ? path.join(config.resultsDir, `${scenarioName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`)
    : path.join(config.resultsDir, 'test-data.json');
  
  if (!fs.existsSync(dataFile)) {
    return null;
  }
  
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  return data[key];
}

// Helper function to make API requests (MOCK VERSION)
async function apiRequest(method, endpoint, data = null, token = null, scenarioName = '') {
  log(`MOCK API REQUEST: ${method} ${endpoint}`, scenarioName);
  
  // Simulate a delay to make it feel more realistic
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // REGISTRATION AND LOGIN
  if (endpoint === '/auth/register' && method.toLowerCase() === 'post') {
    // Use a referring organization from the test database
    const refOrg = testDatabase.organizations.referring_a;
    const refAdmin = testDatabase.users.admin_ref_a;
    
    // Create a new organization based on the test data
    const orgId = 'org_' + Math.random().toString(36).substring(2, 10);
    const orgData = {
      id: orgId,
      name: data.organizationName || refOrg.name,
      type: data.organizationType || refOrg.type,
      address: data.address || refOrg.address,
      city: data.city || refOrg.city,
      state: data.state || refOrg.state,
      zipCode: data.zipCode || refOrg.zipCode,
      phoneNumber: data.phoneNumber || refOrg.phoneNumber,
      createdAt: new Date().toISOString()
    };
    
    // Create a new admin user based on the test data
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    const userData = {
      id: userId,
      firstName: data.firstName || refAdmin.firstName,
      lastName: data.lastName || refAdmin.lastName,
      email: data.email || refAdmin.email,
      role: 'admin',
      organizationId: orgId,
      createdAt: new Date().toISOString()
    };
    
    // Store in shared state
    testState.organizations[orgId] = orgData;
    testState.users[userId] = userData;
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('orgId', orgId, scenarioName);
      storeTestData('adminId', userId, scenarioName);
    }
    
    return {
      success: true,
      organization: testState.organizations[orgId],
      user: testState.users[userId]
    };
  }
  
  if (endpoint === '/auth/login' && method.toLowerCase() === 'post') {
    const token = 'mock_token_' + Math.random().toString(36).substring(2, 15);
    
    // Find the user by email
    const userEmail = data.email;
    let userId = null;
    let userRole = 'physician';
    let orgId = null;
    
    for (const id in testState.users) {
      if (testState.users[id].email === userEmail) {
        userId = id;
        userRole = testState.users[id].role;
        orgId = testState.users[id].organizationId;
        break;
      }
    }
    
    if (!userId) {
      // If user doesn't exist in state, use a mock user from the test database
      const mockUser = testDatabase.users.physician_a;
      userId = mockUser.id;
      userRole = mockUser.role;
      orgId = mockUser.organizationId;
      
      testState.users[userId] = { ...mockUser };
    }
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('userId', userId, scenarioName);
      storeTestData('userToken', token, scenarioName);
      if (orgId) {
        storeTestData('orgId', orgId, scenarioName);
      }
    }
    
    return {
      success: true,
      token: token,
      user: {
        id: userId,
        email: userEmail,
        role: userRole
      }
    };
  }
  
  // USER MANAGEMENT
  if (endpoint === '/users' && method.toLowerCase() === 'post') {
    // Use a physician from the test database
    const physician = testDatabase.users.physician_a;
    
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    
    // Get organization ID from scenario data
    let orgId = getTestData('orgId', scenarioName);
    
    const userData = {
      id: userId,
      firstName: data.firstName || physician.firstName,
      lastName: data.lastName || physician.lastName,
      email: data.email || physician.email,
      role: data.role || physician.role,
      npi: data.npi || physician.npi,
      organizationId: orgId,
      createdAt: new Date().toISOString()
    };
    
    testState.users[userId] = userData;
    
    // Store in scenario-specific data
    if (scenarioName) {
      if (data.role === 'physician') {
        storeTestData('physicianId', userId, scenarioName);
      } else if (data.role === 'scheduler') {
        storeTestData('schedulerId', userId, scenarioName);
      }
    }
    
    return userData;
  }
  
  if (endpoint === '/users' && method.toLowerCase() === 'get') {
    // Get organization ID from token
    let orgId = null;
    for (const id in testState.users) {
      if (testState.users[id].token === token) {
        orgId = testState.users[id].organizationId;
        break;
      }
    }
    
    // If we can't find the organization ID, use the one from scenario data
    if (!orgId) {
      orgId = getTestData('orgId', scenarioName);
    }
    
    // Filter users by organization ID
    const orgUsers = Object.values(testState.users).filter(user => user.organizationId === orgId);
    
    return {
      success: true,
      users: orgUsers
    };
  }
  
  if (endpoint === '/users/profile' && method.toLowerCase() === 'get') {
    // Get user ID from token
    let userId = null;
    for (const id in testState.users) {
      if (testState.users[id].token === token) {
        userId = id;
        break;
      }
    }
    
    // If we can't find the user ID, use the one from scenario data
    if (!userId) {
      userId = getTestData('userId', scenarioName);
    }
    
    // Return user profile
    return testState.users[userId] || testDatabase.users.physician_a;
  }
  
  if (endpoint === '/users/invite' && method.toLowerCase() === 'post') {
    // Use an invitation from the test database
    const invitation = testDatabase.invitations.invitation_a;
    
    const invitationId = 'invite_' + Math.random().toString(36).substring(2, 10);
    const token = 'token_' + Math.random().toString(36).substring(2, 15);
    
    // Get organization ID from token
    let orgId = null;
    for (const id in testState.users) {
      if (testState.users[id].token === token) {
        orgId = testState.users[id].organizationId;
        break;
      }
    }
    
    // If we can't find the organization ID, use the one from scenario data
    if (!orgId) {
      orgId = getTestData('orgId', scenarioName);
    }
    
    const invitationData = {
      id: invitationId,
      email: data.email || invitation.email,
      role: data.role || invitation.role,
      organizationId: orgId,
      token: token,
      firstName: data.firstName || invitation.firstName,
      lastName: data.lastName || invitation.lastName,
      npi: data.npi || invitation.npi,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
    testState.invitations[invitationId] = invitationData;
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('invitationId', invitationId, scenarioName);
      storeTestData('invitationToken', token, scenarioName);
    }
    
    return {
      success: true,
      invitation: invitationData
    };
  }
  
  if (endpoint === '/users/pending-invitations' && method.toLowerCase() === 'get') {
    // Get organization ID from token
    let orgId = null;
    for (const id in testState.users) {
      if (testState.users[id].token === token) {
        orgId = testState.users[id].organizationId;
        break;
      }
    }
    
    // If we can't find the organization ID, use the one from scenario data
    if (!orgId) {
      orgId = getTestData('orgId', scenarioName);
    }
    
    // Filter invitations by organization ID
    const orgInvitations = Object.values(testState.invitations).filter(invitation => invitation.organizationId === orgId);
    
    // If no invitations found, use the ones from the test database
    if (orgInvitations.length === 0) {
      const invitation = testDatabase.invitations.invitation_a;
      orgInvitations.push({
        ...invitation,
        organizationId: orgId
      });
    }
    
    return {
      success: true,
      invitations: orgInvitations
    };
  }
  
  if (endpoint === '/users/accept-invitation' && method.toLowerCase() === 'post') {
    // Use a physician from the test database
    const physician = testDatabase.users.physician_a;
    
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    
    // Find the invitation by token
    let invitation = null;
    for (const id in testState.invitations) {
      if (testState.invitations[id].token === data.token) {
        invitation = testState.invitations[id];
        break;
      }
    }
    
    // If we can't find the invitation, use a mock one
    if (!invitation) {
      invitation = testDatabase.invitations.invitation_a;
    }
    
    const userData = {
      id: userId,
      firstName: data.firstName || invitation.firstName || physician.firstName,
      lastName: data.lastName || invitation.lastName || physician.lastName,
      email: invitation.email || physician.email,
      role: invitation.role || physician.role,
      npi: invitation.npi || physician.npi,
      organizationId: invitation.organizationId || getTestData('orgId', scenarioName),
      createdAt: new Date().toISOString()
    };
    
    testState.users[userId] = userData;
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('userId', userId, scenarioName);
    }
    
    return {
      success: true,
      userId: userId,
      user: userData
    };
  }
  
  // CONNECTION MANAGEMENT
  if (endpoint === '/connections' && method.toLowerCase() === 'post') {
    // Use a connection from the test database
    const connection = testDatabase.connections.connection_a;
    
    const connectionId = 'conn_' + Math.random().toString(36).substring(2, 10);
    
    // Get organization IDs
    const requestingOrgId = data.requestingOrgId || getTestData('orgId', scenarioName);
    const targetOrgId = data.targetOrganizationId || connection.targetOrganizationId;
    
    const connectionData = {
      id: connectionId,
      requestingOrganizationId: requestingOrgId,
      targetOrganizationId: targetOrgId,
      status: 'pending',
      notes: data.notes || connection.notes || 'Connection request',
      createdAt: new Date().toISOString()
    };
    
    testState.connections[connectionId] = connectionData;
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('connectionId', connectionId, scenarioName);
    }
    
    return {
      success: true,
      id: connectionId,
      status: 'pending',
      requestingOrganizationId: requestingOrgId,
      targetOrganizationId: targetOrgId
    };
  }
  
  if (endpoint === '/connections' && method.toLowerCase() === 'get') {
    // Get organization ID from token
    let orgId = null;
    for (const id in testState.users) {
      if (testState.users[id].token === token) {
        orgId = testState.users[id].organizationId;
        break;
      }
    }
    
    // If we can't find the organization ID, use the one from scenario data
    if (!orgId) {
      orgId = getTestData('orgId', scenarioName);
    }
    
    // Filter connections by organization ID (either requesting or target)
    const orgConnections = Object.values(testState.connections).filter(
      conn => conn.requestingOrganizationId === orgId || conn.targetOrganizationId === orgId
    );
    
    // If no connections found, use the ones from the test database
    if (orgConnections.length === 0) {
      const connection = testDatabase.connections.connection_a;
      orgConnections.push({
        ...connection,
        requestingOrganizationId: orgId
      });
    }
    
    return {
      success: true,
      connections: orgConnections
    };
  }
  
  if (endpoint.match(/\/connections\/[^\/]+$/) && method.toLowerCase() === 'get') {
    const connectionId = endpoint.split('/').pop();
    
    // Return connection details
    if (testState.connections[connectionId]) {
      return testState.connections[connectionId];
    }
    
    // If connection not found, use one from the test database
    return testDatabase.connections.connection_a;
  }
  
  if (endpoint === '/connections/requests' && method.toLowerCase() === 'get') {
    // Get organization ID from token
    let orgId = null;
    for (const id in testState.users) {
      if (testState.users[id].token === token) {
        orgId = testState.users[id].organizationId;
        break;
      }
    }
    
    // If we can't find the organization ID, use the one from scenario data
    if (!orgId) {
      orgId = getTestData('orgId', scenarioName);
    }
    
    // Filter connections by target organization ID and pending status
    const pendingRequests = Object.values(testState.connections).filter(
      conn => conn.targetOrganizationId === orgId && conn.status === 'pending'
    );
    
    // If no pending requests found, use the ones from the test database
    if (pendingRequests.length === 0) {
      const connection = testDatabase.connections.connection_c;
      pendingRequests.push({
        ...connection,
        targetOrganizationId: orgId
      });
    }
    
    return {
      success: true,
      requests: pendingRequests
    };
  }
  
  if (endpoint.match(/\/connections\/[^\/]+\/approve/) && method.toLowerCase() === 'post') {
    const connectionId = endpoint.split('/')[2];
    
    if (testState.connections[connectionId]) {
      testState.connections[connectionId].status = 'active';
      testState.connections[connectionId].approvedAt = new Date().toISOString();
    }
    
    return {
      success: true,
      status: 'active'
    };
  }
  
  // ORDER MANAGEMENT
  if (endpoint === '/orders/validate' && method.toLowerCase() === 'post') {
    const dictation = data.dictation;
    
    // Check if this is a validation failure case
    if (dictation.toLowerCase().includes('vague symptoms')) {
      // Use the vague symptoms dictation from the test database
      const vagueDict = testDatabase.dictations.vague_symptoms;
      
      const orderId = 'order_failed_' + Math.random().toString(36).substring(2, 10);
      
      // Create a failed order
      testState.orders[orderId] = {
        id: orderId,
        status: 'validation_failed',
        dictation: dictation,
        validationStatus: 'failed',
        validationAttempts: [{
          attempt: 1,
          timestamp: new Date().toISOString(),
          status: 'failed'
        }],
        history: [
          { action: 'created', timestamp: new Date().toISOString() },
          { action: 'validation_failed', timestamp: new Date().toISOString() }
        ],
        patient: data.patient,
        createdAt: new Date().toISOString()
      };
      
      // Store in scenario-specific data
      if (scenarioName) {
        storeTestData('orderId', orderId, scenarioName);
        storeTestData('validationStatus', 'failed', scenarioName);
      }
      
      // Return validation failure
      const error = new Error('Validation failed: Insufficient clinical information');
      error.response = {
        data: {
          success: false,
          error: 'Validation failed: Insufficient clinical information',
          orderId: orderId,
          validationStatus: 'failed',
          suggestedActions: ['Provide more specific symptoms', 'Include duration of symptoms', 'Specify any relevant medical history']
        }
      };
      throw error;
    }
    
    // For successful validation, find a matching dictation in the test database
    let matchingDictation = null;
    for (const key in testDatabase.dictations) {
      if (dictation.includes(testDatabase.dictations[key].text.substring(0, 20))) {
        matchingDictation = testDatabase.dictations[key];
        break;
      }
    }
    
    // If no matching dictation found, use the lumbar MRI as default
    if (!matchingDictation) {
      matchingDictation = testDatabase.dictations.lumbar_mri;
    }
    
    // Create a new order
    const orderId = 'order_' + Math.random().toString(36).substring(2, 10);
    testState.orders[orderId] = {
      id: orderId,
      status: 'validated',
      dictation: dictation,
      cptCode: matchingDictation.expectedCptCode,
      cptDescription: matchingDictation.expectedCptDescription,
      icd10Codes: matchingDictation.expectedIcd10Codes,
      icd10Descriptions: matchingDictation.expectedIcd10Descriptions,
      validationStatus: 'validated',
      validationAttempts: [{
        attempt: 1,
        timestamp: new Date().toISOString(),
        status: 'success'
      }],
      history: [
        { action: 'created', timestamp: new Date().toISOString() },
        { action: 'validated', timestamp: new Date().toISOString() }
      ],
      patient: data.patient,
      createdAt: new Date().toISOString()
    };
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('orderId', orderId, scenarioName);
      storeTestData('validationStatus', 'validated', scenarioName);
    }
    
    return {
      success: true,
      orderId: orderId,
      validationStatus: 'validated',
      cptCode: matchingDictation.expectedCptCode,
      cptDescription: matchingDictation.expectedCptDescription,
      icd10Codes: matchingDictation.expectedIcd10Codes,
      icd10Descriptions: matchingDictation.expectedIcd10Descriptions
    };
  }
  
  if (endpoint === '/orders/finalize' && method.toLowerCase() === 'post') {
    const orderId = data.orderId;
    
    if (testState.orders[orderId]) {
      // Update order status
      testState.orders[orderId].status = 'pending_admin';
      testState.orders[orderId].signature = data.signature;
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      
      testState.orders[orderId].history.push({
        action: 'finalized',
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      status: 'pending_admin',
      orderId: orderId
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/override/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Update order status
      testState.orders[orderId].status = 'validated';
      testState.orders[orderId].cptCode = data.cptCode || '70450';
      testState.orders[orderId].icd10Codes = data.icd10Codes || ['R42'];
      testState.orders[orderId].overrideJustification = data.justification;
      
      // Add to validation attempts
      if (!testState.orders[orderId].validationAttempts) {
        testState.orders[orderId].validationAttempts = [];
      }
      
      testState.orders[orderId].validationAttempts.push({
        attempt: testState.orders[orderId].validationAttempts.length + 1,
        timestamp: new Date().toISOString(),
        status: 'override',
        justification: data.justification
      });
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      
      testState.orders[orderId].history.push({
        action: 'override',
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      status: 'validated',
      cptCode: data.cptCode || '70450',
      icd10Codes: data.icd10Codes || ['R42']
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/admin\/paste-summary/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Create a clinical record for the summary
      const recordId = 'record_' + Math.random().toString(36).substring(2, 10);
      const recordData = {
        id: recordId,
        orderId: orderId,
        recordType: 'emr_summary_paste',
        content: data.summaryText,
        createdAt: new Date().toISOString()
      };
      
      // Store in shared state
      testState.clinicalRecords[recordId] = recordData;
      
      // Add the clinical record to the order
      if (!testState.orders[orderId].clinicalRecords) {
        testState.orders[orderId].clinicalRecords = [];
      }
      testState.orders[orderId].clinicalRecords.push(recordData);
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      testState.orders[orderId].history.push({
        action: 'paste_summary',
        timestamp: new Date().toISOString()
      });
      
      // Parse the summary text to extract patient info
      // In a real implementation, this would be done by an NLP service
      // For this mock, we'll just assume it's successful
      if (testState.orders[orderId].patient) {
        testState.orders[orderId].patient = {
          ...testState.orders[orderId].patient,
          insurance: 'Medicare',
          policyNumber: '123456789A',
          groupNumber: 'MCARE2023'
        };
      }
    }
    
    return {
      success: true,
      message: 'Summary pasted successfully'
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/admin\/paste-supplemental/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Create a clinical record for the supplemental info
      const recordId = 'record_' + Math.random().toString(36).substring(2, 10);
      const recordData = {
        id: recordId,
        orderId: orderId,
        recordType: 'supplemental_docs_paste',
        content: data.supplementalText,
        createdAt: new Date().toISOString()
      };
      
      // Store in shared state
      testState.clinicalRecords[recordId] = recordData;
      
      // Add the clinical record to the order
      if (!testState.orders[orderId].clinicalRecords) {
        testState.orders[orderId].clinicalRecords = [];
      }
      testState.orders[orderId].clinicalRecords.push(recordData);
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      testState.orders[orderId].history.push({
        action: 'paste_supplemental',
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      message: 'Supplemental information pasted successfully'
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/admin\/send-to-radiology/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Update order status
      testState.orders[orderId].status = 'pending_radiology';
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      testState.orders[orderId].history.push({
        action: 'send_to_radiology',
        timestamp: new Date().toISOString()
      });
      
      // Create a credit usage log
      const creditUsageId = 'credit_' + Math.random().toString(36).substring(2, 10);
      const creditUsageData = {
        id: creditUsageId,
        orderId: orderId,
        actionType: 'order_submitted',
        amount: 1,
        timestamp: new Date().toISOString()
      };
      
      // Store in shared state
      testState.creditUsage[creditUsageId] = creditUsageData;
      
      // Add the credit usage to the order
      if (!testState.orders[orderId].creditUsage) {
        testState.orders[orderId].creditUsage = [];
      }
      testState.orders[orderId].creditUsage.push(creditUsageData);
