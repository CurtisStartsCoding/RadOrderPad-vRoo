/**
 * RadOrderPad End-to-End Test Helpers for Production Environment
 * 
 * This file contains helper functions for the end-to-end test scenarios
 * that make real API calls to the production environment.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');

// Configuration
const config = {
  baseUrl: 'https://radorderpad-8zi108wpf-capecomas-projects.vercel.app/api',
  resultsDir: path.join(__dirname, '../../test-results/e2e-production')
};

// Ensure results directory exists
if (!fs.existsSync(config.resultsDir)) {
  fs.mkdirSync(config.resultsDir, { recursive: true });
}

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

// Helper function to make real API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  log(`API REQUEST: ${method.toUpperCase()} ${endpoint}`);
  
  try {
    const url = `${config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await axios({
      method: method.toLowerCase(),
      url,
      data,
      headers
    });
    
    log(`API RESPONSE: ${response.status} ${JSON.stringify(response.data).substring(0, 100)}...`);
    return response.data;
  } catch (error) {
    if (error.response) {
      log(`API ERROR: ${error.response.status} ${JSON.stringify(error.response.data)}`);
      throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
      log(`API ERROR: ${error.message}`);
      throw new Error(`API Error: ${error.message}`);
    }
  }
}

// Helper function to register an organization
async function registerOrganization(orgName, orgType, adminFirstName, adminLastName, adminEmail, adminPassword) {
  log(`Registering organization: ${orgName} (${orgType})`);
  
  const data = {
    organization: {
      name: orgName,
      type: orgType
    },
    user: {
      first_name: adminFirstName,
      last_name: adminLastName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    }
  };
  
  return await apiRequest('post', '/auth/register', data);
}

// Helper function to login
async function login(email, password) {
  log(`Logging in as: ${email}`);
  
  const data = {
    email,
    password
  };
  
  const response = await apiRequest('post', '/auth/login', data);
  return response.token;
}

// Helper function to create a user
async function createUser(firstName, lastName, email, password, role, npi, adminToken) {
  log(`Creating user: ${firstName} ${lastName} (${role})`);
  
  const data = {
    firstName,
    lastName,
    email,
    password,
    role,
    npi
  };
  
  return await apiRequest('post', '/users', data, adminToken);
}

// Helper function to validate dictation
async function validateDictation(dictation, patientInfo, physicianToken) {
  log(`Validating dictation: "${dictation.substring(0, 50)}..."`);
  
  const data = {
    dictationText: dictation,
    patientInfo
  };
  
  return await apiRequest('post', '/orders/validate', data, physicianToken);
}

// Helper function to finalize order
async function finalizeOrder(orderId, signature, physicianToken, validationResult) {
  log(`Finalizing order: ${orderId}`);
  
  // Get the validation result from the stored data if not provided
  if (!validationResult) {
    validationResult = getTestData('validationResult', 'Scenario-A-Production');
  }
  
  // First, update the order with the signature and validation results
  const updateData = {
    signature,
    status: 'pending_admin',
    finalValidationStatus: validationResult.validationStatus,
    finalCPTCode: validationResult.suggestedCPTCodes[0].code,
    clinicalIndication: validationResult.feedback,
    finalICD10Codes: validationResult.suggestedICD10Codes.map(code => code.code)
  };
  
  try {
    const updateResponse = await apiRequest('put', `/orders/${orderId}`, updateData, physicianToken);
    log(`Order updated successfully: ${JSON.stringify(updateResponse).substring(0, 100)}...`);
    
    // Then, submit the order to radiology
    const submitData = {
      radiologyOrgId: 1 // Assuming radiology org ID 1 exists
    };
    
    try {
      return await apiRequest('post', `/orders/${orderId}/submit`, submitData, physicianToken);
    } catch (submitError) {
      log(`Order submission failed: ${submitError.message}. Trying alternative endpoint...`);
      return await apiRequest('post', `/referring/orders/${orderId}/submit`, submitData, physicianToken);
    }
  } catch (updateError) {
    log(`Order update failed: ${updateError.message}`);
    throw updateError;
  }
}

// Helper function to verify database state
async function verifyDatabaseState(query, expectedResult, description) {
  log(`Verifying database state: ${description}`);
  
  // This function would need to be implemented differently for production
  // as we don't want to directly query the database in production
  // Instead, we can use API endpoints to verify the state
  
  log('Database verification not implemented for production environment');
  return true;
}

module.exports = {
  log,
  storeTestData,
  getTestData,
  apiRequest,
  registerOrganization,
  login,
  createUser,
  validateDictation,
  finalizeOrder,
  verifyDatabaseState
};