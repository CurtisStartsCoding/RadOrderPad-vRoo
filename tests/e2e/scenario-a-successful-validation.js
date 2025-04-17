/**
 * Scenario A: Full Physician Order (Successful Validation)
 * 
 * This test scenario covers:
 * 1. Register Referring Organization and Admin
 * 2. Register Physician
 * 3. Login as Physician
 * 4. Validate Dictation (passes first time)
 * 5. Finalize/Sign Order
 * 6. Verify Order Status, order_history, validation_attempts
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-A';

// Test data
const testData = {
  referring: {
    orgName: 'Test Referring Practice A',
    orgType: 'referring',
    admin: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin-ref-a@example.com',
      password: 'Password123!'
    },
    physician: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'physician-a@example.com',
      password: 'Password123!',
      npi: '1234567890'
    }
  },
  patient: {
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1950-05-15',
    gender: 'male',
    mrn: 'MRN12345A'
  },
  dictation: '72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.',
  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
};

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Step 1: Register Referring Organization and Admin
    helpers.log('Step 1: Register Referring Organization and Admin', SCENARIO);
    const registerResponse = await helpers.registerOrganization(
      testData.referring.orgName,
      testData.referring.orgType,
      testData.referring.admin.firstName,
      testData.referring.admin.lastName,
      testData.referring.admin.email,
      testData.referring.admin.password
    );
    
    // Store organization and admin data
    const orgId = helpers.storeTestData('orgId', registerResponse.organization.id, SCENARIO);
    const adminId = helpers.storeTestData('adminId', registerResponse.user.id, SCENARIO);
    helpers.log(`Organization created with ID: ${orgId}`, SCENARIO);
    helpers.log(`Admin user created with ID: ${adminId}`, SCENARIO);
    
    // Store the entire referring data structure for other scenarios to use
    helpers.storeTestData('referring', testData.referring, SCENARIO);
    
    // Login as admin
    const adminToken = await helpers.login(
      testData.referring.admin.email,
      testData.referring.admin.password
    );
    helpers.storeTestData('adminToken', adminToken, SCENARIO);
    
    // Step 2: Register Physician
    helpers.log('Step 2: Register Physician', SCENARIO);
    const physicianResponse = await helpers.createUser(
      testData.referring.physician.firstName,
      testData.referring.physician.lastName,
      testData.referring.physician.email,
      testData.referring.physician.password,
      'physician',
      testData.referring.physician.npi,
      adminToken
    );
    
    // Store physician data
    const physicianId = helpers.storeTestData('physicianId', physicianResponse.id, SCENARIO);
    helpers.log(`Physician created with ID: ${physicianId}`, SCENARIO);
    
    // Step 3: Login as Physician
    helpers.log('Step 3: Login as Physician', SCENARIO);
    const physicianToken = await helpers.login(
      testData.referring.physician.email,
      testData.referring.physician.password
    );
    helpers.storeTestData('physicianToken', physicianToken, SCENARIO);
    
    // Step 4: Validate Dictation
    helpers.log('Step 4: Validate Dictation', SCENARIO);
    const validationResponse = await helpers.validateDictation(
      testData.dictation,
      testData.patient,
      physicianToken
    );
    
    // Store validation results
    const orderId = helpers.storeTestData('orderId', validationResponse.orderId, SCENARIO);
    const validationStatus = helpers.storeTestData('validationStatus', validationResponse.validationStatus, SCENARIO);
    const cptCode = helpers.storeTestData('cptCode', validationResponse.cptCode, SCENARIO);
    const icd10Codes = helpers.storeTestData('icd10Codes', validationResponse.icd10Codes, SCENARIO);
    
    helpers.log(`Order created with ID: ${orderId}`, SCENARIO);
    helpers.log(`Validation status: ${validationStatus}`, SCENARIO);
    helpers.log(`CPT code: ${cptCode}`, SCENARIO);
    helpers.log(`ICD-10 codes: ${icd10Codes.join(', ')}`, SCENARIO);
    
    // Verify validation was successful
    if (validationStatus !== 'validated') {
      throw new Error(`Validation failed with status: ${validationStatus}`);
    }
    
    // Step 5: Finalize and Sign Order
    helpers.log('Step 5: Finalize and Sign Order', SCENARIO);
    const finalizeResponse = await helpers.finalizeOrder(
      orderId,
      testData.signature,
      physicianToken
    );
    
    // Store finalization results
    const finalStatus = helpers.storeTestData('finalStatus', finalizeResponse.status, SCENARIO);
    helpers.log(`Order finalized with status: ${finalStatus}`, SCENARIO);
    
    // Verify finalization was successful
    if (finalStatus !== 'pending_admin') {
      throw new Error(`Finalization failed with status: ${finalStatus}`);
    }
    
    // Step 6: Verify Order Status, order_history, validation_attempts
    helpers.log('Step 6: Verify Order Status and History', SCENARIO);
    
    // Get order details
    const orderDetails = await helpers.apiRequest(
      'get',
      `/orders/${orderId}`,
      null,
      physicianToken
    );
    
    // Verify order status
    if (orderDetails.status !== 'pending_admin') {
      throw new Error(`Unexpected order status: ${orderDetails.status}`);
    }
    
    // Verify order history exists
    if (!orderDetails.history || orderDetails.history.length < 2) {
      throw new Error('Order history is missing or incomplete');
    }
    
    // Verify validation attempts exist
    if (!orderDetails.validationAttempts || orderDetails.validationAttempts.length < 1) {
      throw new Error('Validation attempts are missing');
    }
    
    // Verify signature was saved
    if (!orderDetails.signature) {
      throw new Error('Signature is missing');
    }
    
    helpers.log('Order verification completed successfully', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
    return true;
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    return false;
  }
}

// Export the runTest function
module.exports = { runTest };

// If this script is run directly (not required), run the test
if (require.main === module) {
  runTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}