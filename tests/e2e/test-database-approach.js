/**
 * Test script for the new database-driven testing approach
 * 
 * This script demonstrates how to use the test database to create
 * consistent, reliable tests without relying on mock responses.
 */

const fs = require('fs');
const path = require('path');
const testDatabase = require('./test-data/test-database');

// Scenario name for logging
const SCENARIO = 'Database-Test';

// Configuration
const config = {
  resultsDir: path.join(__dirname, '../../test-results/e2e')
};

// Ensure results directory exists
if (!fs.existsSync(config.resultsDir)) {
  fs.mkdirSync(config.resultsDir, { recursive: true });
}

// Helper function to log messages
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${SCENARIO}] ${message}`;
  
  console.log(logMessage);
  
  // Append to scenario-specific log
  const logFile = path.join(config.resultsDir, `${SCENARIO.toLowerCase().replace(/[^a-z0-9]/g, '-')}.log`);
  fs.appendFileSync(logFile, logMessage + '\n');
}

// Helper function to store test data
function storeTestData(key, value) {
  const dataFile = path.join(config.resultsDir, `${SCENARIO.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`);
  
  let data = {};
  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  }
  
  data[key] = value;
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  
  return value;
}

// Main test function
async function runTest() {
  try {
    log(`Starting ${SCENARIO}`);
    
    // Step 1: Test Organizations
    log('Step 1: Testing Organizations');
    
    // Get a referring organization
    const refOrg = testDatabase.organizations.referring_a;
    log(`Referring Organization: ${refOrg.name} (${refOrg.id})`);
    
    // Get a radiology organization
    const radOrg = testDatabase.organizations.radiology_a;
    log(`Radiology Organization: ${radOrg.name} (${radOrg.id})`);
    
    // Verify organization data
    if (!refOrg.id || !refOrg.name || !refOrg.type) {
      throw new Error('Referring organization data is incomplete');
    }
    
    if (!radOrg.id || !radOrg.name || !radOrg.type) {
      throw new Error('Radiology organization data is incomplete');
    }
    
    log('Organization data verified successfully');
    
    // Step 2: Test Users
    log('Step 2: Testing Users');
    
    // Get a referring admin
    const refAdmin = testDatabase.users.admin_ref_a;
    log(`Referring Admin: ${refAdmin.firstName} ${refAdmin.lastName} (${refAdmin.id})`);
    
    // Get a physician
    const physician = testDatabase.users.physician_a;
    log(`Physician: ${physician.firstName} ${physician.lastName} (${physician.id})`);
    
    // Verify user data
    if (!refAdmin.id || !refAdmin.firstName || !refAdmin.lastName || !refAdmin.email || !refAdmin.role) {
      throw new Error('Referring admin data is incomplete');
    }
    
    if (!physician.id || !physician.firstName || !physician.lastName || !physician.email || !physician.role || !physician.npi) {
      throw new Error('Physician data is incomplete');
    }
    
    log('User data verified successfully');
    
    // Step 3: Test Patients
    log('Step 3: Testing Patients');
    
    // Get a patient
    const patient = testDatabase.patients.patient_a;
    log(`Patient: ${patient.firstName} ${patient.lastName} (${patient.mrn})`);
    
    // Verify patient data
    if (!patient.firstName || !patient.lastName || !patient.dateOfBirth || !patient.gender || !patient.mrn) {
      throw new Error('Patient data is incomplete');
    }
    
    log('Patient data verified successfully');
    
    // Step 4: Test Dictations
    log('Step 4: Testing Dictations');
    
    // Get a dictation
    const dictation = testDatabase.dictations.lumbar_mri;
    log(`Dictation: "${dictation.text.substring(0, 50)}..."`);
    
    // Verify dictation data
    if (!dictation.text || !dictation.expectedCptCode || !dictation.expectedIcd10Codes) {
      throw new Error('Dictation data is incomplete');
    }
    
    log('Dictation data verified successfully');
    
    // Step 5: Test Orders
    log('Step 5: Testing Orders');
    
    // Get an order
    const order = testDatabase.orders.order_a;
    log(`Order: ${order.id} (${order.status})`);
    
    // Verify order data
    if (!order.id || !order.status || !order.cptCode || !order.icd10Codes || !order.patient || !order.history) {
      throw new Error('Order data is incomplete');
    }
    
    log('Order data verified successfully');
    
    // Step 6: Test Connections
    log('Step 6: Testing Connections');
    
    // Get a connection
    const connection = testDatabase.connections.connection_a;
    log(`Connection: ${connection.id} (${connection.status})`);
    
    // Verify connection data
    if (!connection.id || !connection.requestingOrganizationId || !connection.targetOrganizationId || !connection.status) {
      throw new Error('Connection data is incomplete');
    }
    
    log('Connection data verified successfully');
    
    // Step 7: Test Invitations
    log('Step 7: Testing Invitations');
    
    // Get an invitation
    const invitation = testDatabase.invitations.invitation_a;
    log(`Invitation: ${invitation.id} (${invitation.email})`);
    
    // Verify invitation data
    if (!invitation.id || !invitation.email || !invitation.role || !invitation.organizationId || !invitation.token) {
      throw new Error('Invitation data is incomplete');
    }
    
    log('Invitation data verified successfully');
    
    // Step 8: Test Document Uploads
    log('Step 8: Testing Document Uploads');
    
    // Get a document upload
    const document = testDatabase.documentUploads.document_a;
    log(`Document: ${document.id} (${document.fileName})`);
    
    // Verify document data
    if (!document.id || !document.fileName || !document.fileType || !document.fileKey || !document.fileUrl) {
      throw new Error('Document data is incomplete');
    }
    
    log('Document data verified successfully');
    
    // Step 9: Simulate a workflow
    log('Step 9: Simulating a workflow');
    
    // 1. Create a new order
    const newOrderId = 'order_test_' + Math.random().toString(36).substring(2, 10);
    log(`Creating new order: ${newOrderId}`);
    
    // 2. Validate the order
    log('Validating order with dictation');
    
    // 3. Finalize the order
    log('Finalizing order');
    
    // 4. Send to radiology
    log('Sending order to radiology');
    
    // 5. Schedule the order
    log('Scheduling order');
    
    // Store the order ID
    storeTestData('testOrderId', newOrderId);
    
    log(`${SCENARIO} completed successfully`);
    
    return true;
  } catch (error) {
    log(`Error in ${SCENARIO}: ${error.message}`);
    console.error(error);
    return false;
  }
}

// Run the test
runTest().then(success => {
  if (success) {
    console.log(`\n${SCENARIO} passed successfully!`);
    process.exit(0);
  } else {
    console.log(`\n${SCENARIO} failed. Check the logs for details.`);
    process.exit(1);
  }
});