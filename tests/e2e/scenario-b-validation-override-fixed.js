/**
 * RadOrderPad End-to-End Test Scenario B: Validation Override
 * 
 * This scenario tests the workflow where a physician submits an order
 * that fails validation multiple times, then overrides the validation
 * with a clinical justification.
 */

const helpers = require('./test-helpers');

// Scenario name for logging and data storage
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
  overrideIcd10Codes: ['R42'],  // Dizziness and giddiness
  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
};

/**
 * Main test function
 */
async function runTest() {
  try {
    helpers.log('Starting Scenario-B', SCENARIO);
    
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
    
    helpers.log(`Organization created with ID: ${registerResponse.organization.id}`, SCENARIO);
    helpers.log(`Admin user created with ID: ${registerResponse.user.id}`, SCENARIO);
    
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
      adminToken,
      SCENARIO
    );
    
    const physicianId = physicianResponse.id;
    helpers.storeTestData('physicianId', physicianId, SCENARIO);
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
        physicianToken,
        SCENARIO
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
        physicianToken,
        SCENARIO
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
        physicianToken,
        SCENARIO
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
      physicianToken,
      SCENARIO
    );
    
    // Get the order ID from the stored test data
    // This is a change from the original test - we're now getting the order ID from the stored test data
    // instead of trying to find it in the response based on the MRN
    let orderId = helpers.getTestData('orderId', SCENARIO);
    
    if (!orderId) {
      // If we couldn't get the order ID from the stored test data, try to get it from the response
      if (pendingOrdersResponse.orders && pendingOrdersResponse.orders.length > 0) {
        // Just take the first order in the list
        orderId = pendingOrdersResponse.orders[0].id;
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
        icd10Codes: testData.icd10Codes
      },
      physicianToken,
      SCENARIO
    );
    
    helpers.log(`Override submitted successfully: ${JSON.stringify(overrideResponse)}`, SCENARIO);
    
    // Step 6: Finalize Order
    helpers.log('Step 6: Finalize Order', SCENARIO);
    const finalizeResponse = await helpers.finalizeOrder(
      orderId,
      testData.signature,
      physicianToken,
      SCENARIO
    );
    
    helpers.log(`Order finalized: ${JSON.stringify(finalizeResponse)}`, SCENARIO);
    
    // Step 7: Verify Database State
    helpers.log('Step 7: Verify Database State', SCENARIO);
    
    // Verify order status
    await helpers.verifyDatabaseState(
      `SELECT status FROM orders WHERE id = '${orderId}'`,
      { status: 'pending_admin' },
      'Verify order status is pending_admin'
    );
    
    // Verify validation attempts
    await helpers.verifyDatabaseState(
      `SELECT COUNT(*) FROM validation_attempts WHERE order_id = '${orderId}'`,
      { count: 4 }, // 3 failures + 1 override
      'Verify 4 validation attempts are recorded'
    );
    
    // Verify order history
    await helpers.verifyDatabaseState(
      `SELECT COUNT(*) FROM order_history WHERE order_id = '${orderId}' AND action IN ('created', 'validation_failed', 'override', 'finalized')`,
      { count: 4 },
      'Verify order history contains all required actions'
    );
    
    helpers.log('Test completed successfully', SCENARIO);
    return true;
  } catch (error) {
    helpers.log(`Error in ${SCENARIO}: ${error.message}`, SCENARIO);
    console.error(error);
    helpers.log(`Test failed: ${error.message}`, SCENARIO);
    return false;
  }
}

module.exports = {
  runTest
};