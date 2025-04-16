/**
 * Scenario B: Full Physician Order (Override)
 * 
 * This test scenario covers:
 * 1. Register Referring Organization and Admin
 * 2. Register Physician
 * 3. Login as Physician
 * 4. Validate Dictation (fails 3 times)
 * 5. Override with Justification
 * 6. Finalize/Sign Order
 * 7. Verify Order Status, overridden=true, override_justification, order_history, validation_attempts
 */

const helpers = require('./test-helpers');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-B';

// Test data
const testData = {
  referring: {
    orgName: 'Test Referring Practice B',
    orgType: 'referring',
    admin: {
      firstName: 'Robert',
      lastName: 'Brown',
      email: 'admin-ref-b@example.com',
      password: 'Password123!'
    },
    physician: {
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'physician-b@example.com',
      password: 'Password123!',
      npi: '9876543210'
    }
  },
  patient: {
    firstName: 'Michael',
    lastName: 'Wilson',
    dateOfBirth: '1965-08-22',
    gender: 'male',
    mrn: 'MRN67890B'
  },
  // Intentionally ambiguous dictation to trigger validation failure
  dictation: 'Patient with vague symptoms including occasional dizziness, fatigue, and mild discomfort in various locations. No clear clinical indication for imaging.',
  // Override dictation with clearer clinical indication
  overrideDictation: 'Patient with vague symptoms including occasional dizziness, fatigue, and mild discomfort. Concerned about possible intracranial abnormality.',
  overrideJustification: 'Clinical suspicion of intracranial abnormality based on patient history and symptoms.',
  overrideCptCode: '70450', // CT head/brain without contrast
  overrideIcd10Code: 'R42',  // Dizziness and giddiness
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
    
    // Step 4: Validate Dictation (fails 3 times)
    helpers.log('Step 4: Validate Dictation (First Attempt - Expected to Fail)', SCENARIO);
    
    // First validation attempt
    let validationResponse;
    try {
      validationResponse = await helpers.validateDictation(
        testData.dictation,
        testData.patient,
        physicianToken
      );
      
      // If we get here, validation unexpectedly succeeded
      helpers.log('WARNING: First validation attempt unexpectedly succeeded', SCENARIO);
    } catch (error) {
      // Expected failure
      helpers.log('First validation attempt failed as expected', SCENARIO);
    }
    
    // Second validation attempt
    helpers.log('Validate Dictation (Second Attempt - Expected to Fail)', SCENARIO);
    try {
      validationResponse = await helpers.validateDictation(
        testData.dictation,
        testData.patient,
        physicianToken
      );
      
      // If we get here, validation unexpectedly succeeded
      helpers.log('WARNING: Second validation attempt unexpectedly succeeded', SCENARIO);
    } catch (error) {
      // Expected failure
      helpers.log('Second validation attempt failed as expected', SCENARIO);
    }
    
    // Third validation attempt
    helpers.log('Validate Dictation (Third Attempt - Expected to Fail)', SCENARIO);
    try {
      validationResponse = await helpers.validateDictation(
        testData.dictation,
        testData.patient,
        physicianToken
      );
      
      // If we get here, validation unexpectedly succeeded
      helpers.log('WARNING: Third validation attempt unexpectedly succeeded', SCENARIO);
    } catch (error) {
      // Expected failure
      helpers.log('Third validation attempt failed as expected', SCENARIO);
    }
    
    // Step 5: Override with Justification
    helpers.log('Step 5: Override with Justification', SCENARIO);
    
    // Get the order ID from the failed validation attempts
    // In a real implementation, we would need to query for the order ID
    // For this test, we'll simulate by making a request to get pending orders
    const pendingOrdersResponse = await helpers.apiRequest(
      'get',
      '/orders?status=validation_failed',
      null,
      physicianToken
    );
    
    // Find the order for our patient
    let orderId;
    if (pendingOrdersResponse.orders && pendingOrdersResponse.orders.length > 0) {
      const order = pendingOrdersResponse.orders.find(o => 
        o.patient && o.patient.mrn === testData.patient.mrn
      );
      
      if (order) {
        orderId = order.id;
      }
    }
    
    if (!orderId) {
      throw new Error('Could not find order ID for failed validation');
    }
    
    helpers.storeTestData('orderId', orderId, SCENARIO);
    helpers.log(`Found order with ID: ${orderId}`, SCENARIO);
    
    // Submit override
    const overrideResponse = await helpers.apiRequest(
      'post',
      `/orders/${orderId}/override`,
      {
        dictation: testData.overrideDictation,
        justification: testData.overrideJustification,
        cptCode: testData.overrideCptCode,
        icd10Codes: [testData.overrideIcd10Code]
      },
      physicianToken
    );
    
    // Store override results
    const overrideStatus = helpers.storeTestData('overrideStatus', overrideResponse.status, SCENARIO);
    helpers.log(`Override completed with status: ${overrideStatus}`, SCENARIO);
    
    // Verify override was successful
    if (overrideStatus !== 'validated') {
      throw new Error(`Override failed with status: ${overrideStatus}`);
    }
    
    // Step 6: Finalize and Sign Order
    helpers.log('Step 6: Finalize and Sign Order', SCENARIO);
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
    
    // Step 7: Verify Order Status, overridden=true, override_justification, order_history, validation_attempts
    helpers.log('Step 7: Verify Order Status and Override Details', SCENARIO);
    
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
    
    // Verify override flag
    if (!orderDetails.overridden) {
      throw new Error('Order is not marked as overridden');
    }
    
    // Verify override justification
    if (orderDetails.overrideJustification !== testData.overrideJustification) {
      throw new Error('Override justification does not match');
    }
    
    // Verify order history exists and includes override
    if (!orderDetails.history || !orderDetails.history.some(h => h.action === 'override')) {
      throw new Error('Order history is missing override action');
    }
    
    // Verify validation attempts exist and show multiple failures
    if (!orderDetails.validationAttempts || orderDetails.validationAttempts.length < 3) {
      throw new Error('Validation attempts are missing or incomplete');
    }
    
    // Verify signature was saved
    if (!orderDetails.signature) {
      throw new Error('Signature is missing');
    }
    
    helpers.log('Order verification completed successfully', SCENARIO);
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    throw error;
  }
}

// Run the test
runTest().catch(error => {
  helpers.log(`Test failed: ${error.message}`, SCENARIO);
  process.exit(1);
});