/**
 * Scenario A: Full Physician Order with Validation and Finalization
 * 
 * This test scenario covers:
 * 1. Login as Physician
 * 2. Validate Dictation
 * 3. Finalize/Sign Order (this step uses the referring_organization_name column)
 * 4. Verify Order Status
 * 
 * This version makes real API calls to the production environment.
 */

const helpers = require('./test-helpers-production');
const fs = require('fs');
const path = require('path');

// Scenario name for logging
const SCENARIO = 'Scenario-A-Full-Validation-Finalization';

// Test data
const testData = {
  patient: {
    id: 1, // Temporary patient ID (required field)
    firstName: 'Robert',
    lastName: 'Johnson',
    dateOfBirth: '1950-05-15',
    gender: 'male',
    mrn: `MRN12345A-${Date.now()}` // Ensure unique MRN
  },
  dictation: '72-year-old male with persistent lower back pain radiating to the left leg for 3 weeks. History of degenerative disc disease. Clinical concern for lumbar radiculopathy.',
  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
};

// Main test function
async function runTest() {
  helpers.log(`Starting ${SCENARIO}`, SCENARIO);
  
  try {
    // Step 1: Login as existing Physician
    helpers.log('Step 1: Login as existing Physician', SCENARIO);
    const physicianToken = await helpers.login(
      'test.physician@example.com',
      'password123'
    );
    helpers.storeTestData('physicianToken', physicianToken, SCENARIO);
    
    // Extract user ID and organization ID from the token
    const tokenParts = physicianToken.split('.');
    const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    const physicianId = tokenPayload.userId;
    const orgId = tokenPayload.orgId;
    
    helpers.log(`Logged in as physician with ID: ${physicianId}`, SCENARIO);
    helpers.log(`Organization ID: ${orgId}`, SCENARIO);
    
    // Step 2: Validate Dictation
    helpers.log('Step 2: Validate Dictation', SCENARIO);
    const validationResponse = await helpers.validateDictation(
      testData.dictation,
      testData.patient,
      physicianToken
    );
    
    // Store validation results
    const orderId = helpers.storeTestData('orderId', validationResponse.orderId, SCENARIO);
    
    // Extract validation result from the response
    const validationResult = validationResponse.validationResult;
    helpers.storeTestData('validationResult', validationResult, SCENARIO);
    const validationStatus = helpers.storeTestData('validationStatus', validationResult.validationStatus, SCENARIO);
    
    // Extract CPT and ICD-10 codes
    const cptCodes = validationResult.suggestedCPTCodes.map(code => code.code);
    const icd10Codes = validationResult.suggestedICD10Codes.map(code => code.code);
    
    helpers.storeTestData('cptCodes', cptCodes, SCENARIO);
    helpers.storeTestData('icd10Codes', icd10Codes, SCENARIO);
    
    helpers.log(`Order created with ID: ${orderId}`, SCENARIO);
    helpers.log(`Validation status: ${validationStatus}`, SCENARIO);
    helpers.log(`CPT codes: ${cptCodes.join(', ')}`, SCENARIO);
    helpers.log(`ICD-10 codes: ${icd10Codes.join(', ')}`, SCENARIO);
    
    // Verify validation was successful
    if (validationStatus !== 'appropriate') {
      throw new Error(`Validation failed with status: ${validationStatus}`);
    }
    
    // Step 3: Finalize and Sign Order
    helpers.log('Step 3: Finalizing and signing order', SCENARIO);
    try {
      const finalizationResponse = await helpers.finalizeOrder(
        orderId,
        testData.signature,
        physicianToken,
        validationResult
      );
      
      helpers.log('Order finalized successfully!', SCENARIO);
      helpers.log(`Finalization response: ${JSON.stringify(finalizationResponse).substring(0, 100)}...`, SCENARIO);
      
      // Step 4: Verify Order Status
      helpers.log('Step 4: Verifying order status', SCENARIO);
      try {
        const orderStatusResponse = await helpers.apiRequest(
          'get',
          `/orders/${orderId}`,
          null,
          physicianToken
        );
        
        helpers.log('Order status check successful!', SCENARIO);
        helpers.log(`Order status: ${orderStatusResponse.status}`, SCENARIO);
        
        // Check if the order has the referring_organization_name field
        if (orderStatusResponse.referring_organization_name !== undefined) {
          helpers.log(`✅ Order has referring_organization_name field: ${orderStatusResponse.referring_organization_name}`, SCENARIO);
        } else {
          helpers.log('❌ Order does not have referring_organization_name field', SCENARIO);
        }
        
      } catch (statusError) {
        helpers.log(`❌ Order status check failed: ${statusError.message}`, SCENARIO);
      }
      
    } catch (finalizationError) {
      helpers.log(`❌ Order finalization failed: ${finalizationError.message}`, SCENARIO);
    }
    
    helpers.log(`${SCENARIO} completed successfully`, SCENARIO);
    
    return {
      success: true,
      orderId,
      validationStatus,
      cptCodes,
      icd10Codes
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