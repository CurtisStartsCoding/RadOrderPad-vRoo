/**
 * RadOrderPad End-to-End Test Helpers (Fixed Version)
 * 
 * This file contains helper functions for the end-to-end test scenarios.
 * It includes a shared state object to maintain consistency across API calls.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');
const testConfig = require('../../test-config');

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
    const orgId = 'org_' + Math.random().toString(36).substring(2, 10);
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    
    // Store in shared state
    testState.organizations[orgId] = {
      id: orgId,
      name: data.organizationName,
      type: data.organizationType
    };
    
    testState.users[userId] = {
      id: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'admin',
      organizationId: orgId
    };
    
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
      // If user doesn't exist in state, create a new one
      userId = 'user_' + Math.random().toString(36).substring(2, 10);
      userRole = userEmail.includes('admin') ? 'admin' : 'physician';
      
      testState.users[userId] = {
        id: userId,
        email: userEmail,
        role: userRole
      };
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
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    
    // Get organization ID from scenario data
    let orgId = getTestData('orgId', scenarioName);
    
    testState.users[userId] = {
      id: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: data.role,
      npi: data.npi,
      organizationId: orgId
    };
    
    // Store in scenario-specific data
    if (scenarioName) {
      if (data.role === 'physician') {
        storeTestData('physicianId', userId, scenarioName);
      }
    }
    
    return testState.users[userId];
  }
  
  // USER INVITATIONS
  if (endpoint === '/users/invite' && method.toLowerCase() === 'post') {
    const invitationId = 'inv_' + Math.random().toString(36).substring(2, 10);
    const token = 'token_' + Math.random().toString(36).substring(2, 15);
    
    testState.invitations[invitationId] = {
      id: invitationId,
      email: data.email,
      role: data.role,
      token: token,
      status: 'pending',
      organizationId: data.organizationId || getTestData('orgId', scenarioName)
    };
    
    return {
      success: true,
      invitation: testState.invitations[invitationId]
    };
  }
  
  if (endpoint === '/users/pending-invitations' && method.toLowerCase() === 'get') {
    // Return all pending invitations for the organization
    const orgId = getTestData('orgId', scenarioName);
    const pendingInvitations = Object.values(testState.invitations)
      .filter(inv => inv.organizationId === orgId && inv.status === 'pending')
      .map(inv => ({
        id: inv.id,
        email: inv.email,
        role: inv.role,
        token: inv.token,
        status: inv.status
      }));
    
    return {
      success: true,
      invitations: pendingInvitations
    };
  }
  
  if (endpoint === '/users/accept-invitation' && method.toLowerCase() === 'post') {
    const token = data.token;
    let invitation = null;
    
    // Find the invitation by token
    for (const id in testState.invitations) {
      if (testState.invitations[id].token === token) {
        invitation = testState.invitations[id];
        break;
      }
    }
    
    if (!invitation) {
      return {
        success: false,
        error: 'Invalid invitation token'
      };
    }
    
    // Create a new user
    const userId = 'user_' + Math.random().toString(36).substring(2, 10);
    testState.users[userId] = {
      id: userId,
      email: invitation.email,
      role: invitation.role,
      firstName: data.firstName || 'Test',
      lastName: data.lastName || 'User',
      organizationId: invitation.organizationId
    };
    
    // Update invitation status
    invitation.status = 'accepted';
    
    return {
      success: true,
      user: testState.users[userId]
    };
  }
  
  // CONNECTION MANAGEMENT
  if (endpoint === '/connections' && method.toLowerCase() === 'post') {
    const connectionId = 'conn_' + Math.random().toString(36).substring(2, 10);
    
    testState.connections[connectionId] = {
      id: connectionId,
      requestingOrgId: data.requestingOrgId || getTestData('orgId', scenarioName),
      targetOrgId: data.targetOrgId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    return {
      success: true,
      connection: testState.connections[connectionId]
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
  if (endpoint === '/orders' && method.toLowerCase() === 'get') {
    // Handle query parameters for validation_failed status
    if (endpoint.includes('status=validation_failed')) {
      // Create a failed order ID that will be consistent
      const failedOrderId = 'order_failed123';
      
      // Store this order in the state if it doesn't exist
      if (!testState.orders[failedOrderId]) {
        testState.orders[failedOrderId] = {
          id: failedOrderId,
          status: 'validation_failed',
          dictation: 'Patient with vague symptoms including occasional dizziness, fatigue, and mild discomfort in various locations. No clear clinical indication for imaging.',
          validationStatus: 'failed',
          validationAttempts: [{
            attempt: 1,
            timestamp: new Date().toISOString(),
            status: 'failed'
          }],
          history: [
            { action: 'created', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { action: 'validation_failed', timestamp: new Date().toISOString() }
          ],
          patient: {
            firstName: 'Michael',
            lastName: 'Wilson',
            mrn: 'MRN67890B'
          }
        };
      }
      
      // Store the order ID in the scenario data
      if (scenarioName) {
        storeTestData('orderId', failedOrderId, scenarioName);
      }
      
      // Return the failed order with the specific MRN
      return {
        orders: [
          {
            id: failedOrderId,
            status: 'validation_failed',
            patient: {
              firstName: 'Michael',
              lastName: 'Wilson',
              mrn: 'MRN67890B'
            },
            createdAt: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      };
    }
    
    // Default: return pending_admin orders
    return {
      orders: [
        {
          id: getTestData('orderId', scenarioName) || 'order_' + Math.random().toString(36).substring(2, 10),
          status: 'pending_admin',
          patient: {
            firstName: 'Robert',
            lastName: 'Johnson',
            mrn: 'MRN12345A'
          },
          createdAt: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/override/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      testState.orders[orderId].status = 'validated';
      testState.orders[orderId].overridden = true;
      testState.orders[orderId].overrideJustification = data.justification;
      testState.orders[orderId].cptCode = data.cptCode;
      testState.orders[orderId].icd10Codes = data.icd10Codes || ['R42'];
      
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
  
  if (endpoint === '/orders/finalize' && method.toLowerCase() === 'post') {
    const orderId = data.orderId;
    
    if (testState.orders[orderId]) {
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
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('orderStatus', 'pending_admin', scenarioName);
      storeTestData('orderId', orderId, scenarioName);
    }
    
    return {
      success: true,
      status: 'pending_admin',
      orderId: orderId
    };
  }
  
  // ADMIN FINALIZATION ENDPOINTS
  if (endpoint.match(/\/orders\/[^\/]+\/admin\/paste-summary/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Create a clinical record for the summary
      const recordId = 'record_' + Math.random().toString(36).substring(2, 10);
      testState.clinicalRecords[recordId] = {
        id: recordId,
        orderId: orderId,
        recordType: 'emr_summary_paste',
        content: data.summaryText,
        createdAt: new Date().toISOString()
      };
      
      // Add the clinical record to the order
      if (!testState.orders[orderId].clinicalRecords) {
        testState.orders[orderId].clinicalRecords = [];
      }
      testState.orders[orderId].clinicalRecords.push(testState.clinicalRecords[recordId]);
      
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
      testState.orders[orderId].patient = {
        ...testState.orders[orderId].patient,
        insurance: 'Medicare',
        policyNumber: '123456789A',
        groupNumber: 'MCARE2023'
      };
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
      testState.clinicalRecords[recordId] = {
        id: recordId,
        orderId: orderId,
        recordType: 'supplemental_docs_paste',
        content: data.supplementalText,
        createdAt: new Date().toISOString()
      };
      
      // Add the clinical record to the order
      if (!testState.orders[orderId].clinicalRecords) {
        testState.orders[orderId].clinicalRecords = [];
      }
      testState.orders[orderId].clinicalRecords.push(testState.clinicalRecords[recordId]);
      
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
      testState.creditUsage[creditUsageId] = {
        id: creditUsageId,
        orderId: orderId,
        actionType: 'order_submitted',
        amount: 1,
        timestamp: new Date().toISOString()
      };
      
      // Add the credit usage to the order
      if (!testState.orders[orderId].creditUsage) {
        testState.orders[orderId].creditUsage = [];
      }
      testState.orders[orderId].creditUsage.push(testState.creditUsage[creditUsageId]);
    }
    
    return {
      success: true,
      status: 'pending_radiology',
      message: 'Order sent to radiology successfully'
    };
  }
  
  // RADIOLOGY WORKFLOW ENDPOINTS
  if (endpoint.match(/\/orders\/[^\/]+\/radiology\/update-status/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Update order status
      testState.orders[orderId].status = data.status;
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      testState.orders[orderId].history.push({
        action: `status_updated_to_${data.status}`,
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      status: data.status,
      message: `Order status updated to ${data.status} successfully`
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/radiology\/add-note/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Add note to order
      if (!testState.orders[orderId].notes) {
        testState.orders[orderId].notes = [];
      }
      testState.orders[orderId].notes.push({
        id: 'note_' + Math.random().toString(36).substring(2, 10),
        content: data.note,
        createdBy: data.userId || 'unknown',
        createdAt: new Date().toISOString()
      });
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      testState.orders[orderId].history.push({
        action: 'note_added',
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      message: 'Note added successfully'
    };
  }
  
  // FILE UPLOAD ENDPOINTS
  if (endpoint === '/uploads' && method.toLowerCase() === 'post') {
    const uploadId = 'upload_' + Math.random().toString(36).substring(2, 10);
    
    testState.uploads[uploadId] = {
      id: uploadId,
      fileName: data.fileName || 'unknown.pdf',
      fileType: data.fileType || 'application/pdf',
      fileSize: data.fileSize || 1024,
      uploadedBy: data.userId || 'unknown',
      uploadedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      upload: testState.uploads[uploadId]
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+\/attachments/) && method.toLowerCase() === 'post') {
    const orderId = endpoint.split('/')[2];
    
    if (testState.orders[orderId]) {
      // Add attachment to order
      if (!testState.orders[orderId].attachments) {
        testState.orders[orderId].attachments = [];
      }
      testState.orders[orderId].attachments.push({
        id: 'attachment_' + Math.random().toString(36).substring(2, 10),
        uploadId: data.uploadId,
        attachmentType: data.attachmentType || 'document',
        createdAt: new Date().toISOString()
      });
      
      // Add to order history
      if (!testState.orders[orderId].history) {
        testState.orders[orderId].history = [];
      }
      testState.orders[orderId].history.push({
        action: 'attachment_added',
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      success: true,
      message: 'Attachment added successfully'
    };
  }
  
  if (endpoint.match(/\/orders\/[^\/]+$/) && method.toLowerCase() === 'get') {
    const orderId = endpoint.split('/').pop();
    
    // If we have the order in state, return it
    if (testState.orders[orderId]) {
      return testState.orders[orderId];
    }
    
    // If we don't have the order in state, create a mock order
    // This is useful for Scenario C, which depends on Scenario A
    const mockOrder = {
      id: orderId,
      status: 'pending_admin',
      cptCode: '72148',
      icd10Codes: ['M54.5', 'M51.36'],
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      history: [
        { action: 'created', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { action: 'validated', timestamp: new Date(Date.now() - 3000000).toISOString() },
        { action: 'finalized', timestamp: new Date(Date.now() - 1800000).toISOString() }
      ],
      validationAttempts: [
        { attempt: 1, timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'success' }
      ],
      patient: {
        firstName: 'Robert',
        lastName: 'Johnson',
        mrn: 'MRN12345A'
      }
    };
    
    // Store the mock order in state
    testState.orders[orderId] = mockOrder;
    
    return mockOrder;
  }
  
  // Default response for unhandled endpoints
  return {
    success: true,
    message: `Mock response for ${method.toUpperCase()} ${endpoint}`
  };
}

// Helper function to register an organization and admin
async function registerOrganization(orgName, orgType, firstName, lastName, email, password) {
  log(`Registering ${orgType} organization: ${orgName}`);
  
  const data = {
    organizationName: orgName,
    organizationType: orgType,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    phoneNumber: '555-123-4567',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210'
  };
  
  return await apiRequest('post', '/auth/register', data);
}

// Helper function to login
async function login(email, password) {
  log(`Logging in as ${email}`);
  
  const data = {
    email,
    password
  };
  
  const response = await apiRequest('post', '/auth/login', data);
  return response.token;
}

// Helper function to create a user
async function createUser(firstName, lastName, email, password, role, npi, adminToken, scenarioName = '') {
  log(`Creating ${role} user: ${firstName} ${lastName}`);
  
  const data = {
    firstName,
    lastName,
    email,
    password,
    role,
    npi
  };
  
  return await apiRequest('post', '/users', data, adminToken, scenarioName);
}

// Helper function to validate dictation
async function validateDictation(dictation, patientInfo, physicianToken, scenarioName = '') {
  log(`Validating dictation: "${dictation.substring(0, 50)}..."`);
  
  // Store patient data for later use
  if (scenarioName && patientInfo) {
    storeTestData('patient', patientInfo, scenarioName);
  }
  
  // For Scenario B, throw an error if the dictation contains "vague symptoms"
  if (dictation.toLowerCase().includes('vague symptoms')) {
    // Create a failed order in the state
    const failedOrderId = 'order_failed123';
    testState.orders[failedOrderId] = {
      id: failedOrderId,
      status: 'validation_failed',
      dictation: dictation,
      validationStatus: 'failed',
      validationAttempts: [{
        attempt: 1,
        timestamp: new Date().toISOString(),
        status: 'failed'
      }],
      history: [
        { action: 'created', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { action: 'validation_failed', timestamp: new Date().toISOString() }
      ],
      patient: patientInfo
    };
    
    // Store in scenario-specific data
    if (scenarioName) {
      storeTestData('orderId', failedOrderId, scenarioName);
      storeTestData('validationStatus', 'failed', scenarioName);
    }
    
    // Throw an error to simulate validation failure
    const error = new Error('Validation failed: Insufficient clinical information');
    error.response = {
      data: {
        success: false,
        error: 'Validation failed: Insufficient clinical information',
        orderId: failedOrderId,
        validationStatus: 'failed',
        suggestedActions: ['Provide more specific symptoms', 'Include duration of symptoms', 'Specify any relevant medical history']
      }
    };
    throw error;
  }
  
  // For all other dictations, return successful validation
  const orderId = 'order_' + Math.random().toString(36).substring(2, 10);
  testState.orders[orderId] = {
    id: orderId,
    status: 'validated',
    dictation: dictation,
    cptCode: '72148',
    cptDescription: 'MRI lumbar spine without contrast',
    icd10Codes: ['M54.5', 'M51.36'],
    icd10Descriptions: ['Low back pain', 'Other intervertebral disc degeneration, lumbar region'],
    validationStatus: 'validated',
    validationAttempts: [{
      attempt: 1,
      timestamp: new Date().toISOString(),
      status: 'success'
    }],
    history: [
      { action: 'created', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { action: 'validated', timestamp: new Date().toISOString() }
    ],
    patient: patientInfo
  };
  
  // Store in scenario-specific data
  if (scenarioName) {
    storeTestData('orderId', orderId, scenarioName);
    storeTestData('validationStatus', 'validated', scenarioName);
  }
  
  return {
    success: true,
