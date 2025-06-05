/**
 * Test script for order finalization endpoint (PUT /api/orders/:orderId)
 * This script tests the order finalization process, including temporary patient creation
 * 
 * Usage: node test-order-finalization.js <jwt_token>
 */

const fetch = require('node-fetch');
const assert = require('assert').strict;
const testConfig = require('../../test-config');

// Configuration
const API_BASE_URL = testConfig.api.baseUrl;
const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;
const ORDER_CREATION_ENDPOINT = `${API_BASE_URL}/orders/new`;
const FINALIZATION_ENDPOINT = `${API_BASE_URL}/orders`;

// Sample dictation text for validation
const SAMPLE_DICTATION = `
Patient with persistent headache for 3 weeks, worsening with movement. 
History of migraines. Request MRI brain to rule out structural abnormalities.
`;

// Get JWT token from command line arguments
const jwtToken = process.argv[2];
if (!jwtToken) {
  console.error('Error: JWT token is required. Usage: node test-order-finalization.js <jwt_token>');
  process.exit(1);
}

// Headers for API requests
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${jwtToken}`
};

/**
 * Extract user ID from JWT token
 */
function extractUserIdFromToken(token) {
  const payload = token.split('.')[1];
  const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');
  const { userId } = JSON.parse(decodedPayload);
  return userId;
}

/**
 * Validate dictation (stateless)
 */
async function validateDictation() {
  try {
    const response = await fetch(VALIDATION_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        dictationText: SAMPLE_DICTATION
        // No patientInfo in stateless validation
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    
    // Verify no orderId is returned
    if (result.orderId !== undefined) {
      console.warn('Warning: orderId was returned, but should not be for stateless validation');
    }
    
    return result.validationResult;
  } catch (error) {
    console.error('Error validating dictation:', error);
    throw error;
  }
}

/**
 * Create a new order
 */
async function createOrder(validationResult) {
  try {
    // In the stateless approach, order creation happens separately from validation
    // According to the documentation, we use PUT /api/orders/new
    const response = await fetch(ORDER_CREATION_ENDPOINT, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        dictationText: SAMPLE_DICTATION,
        patientInfo: {
          id: 1,
          firstName: "Test",
          lastName: "Patient",
          dateOfBirth: "1980-01-01",
          gender: "M",
          mrn: "TEST12345"
        },
        status: 'pending_admin',
        finalValidationStatus: validationResult.validationStatus || 'appropriate',
        finalCPTCode: validationResult.suggestedCPTCodes?.[0]?.code || '70551',
        clinicalIndication: SAMPLE_DICTATION,
        finalICD10Codes: validationResult.suggestedICD10Codes?.map(code => code.code) || ['R51.9'],
        referring_organization_name: 'Test Organization',
        validationResult: validationResult
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result.orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Finalize an order
 */
async function finalizeOrder(orderId, finalizationData) {
  try {
    const response = await fetch(`${FINALIZATION_ENDPOINT}/${orderId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(finalizationData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error finalizing order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Run the test cases
 */
async function runTests() {
  console.log('Starting Order Finalization Tests');
  console.log('=================================');
  
  try {
    // Test Case 1: Finalize Standard Order
    await testStandardFinalization();
    
    // Test Case 2: Finalize with Temporary Patient Creation
    await testTempPatientCreation();
    
    console.log('\nAll tests completed successfully!');
    console.log('[PASS] Order Finalization Tests');
    process.exit(0);
  } catch (error) {
    console.error('\nTest failed:', error.message);
    console.log('[FAIL] Order Finalization Tests');
    process.exit(1);
  }
}

/**
 * Test Case 1: Finalize a standard order without patient updates
 */
async function testStandardFinalization() {
  console.log('\nTest Case 1: Finalize Standard Order');
  console.log('------------------------------------');
  
  // Step 1: Validate dictation (stateless)
  console.log('Validating dictation (stateless)...');
  const validationResult = await validateDictation();
  console.log('Validation successful');
  
  // Step 2: Create an order
  console.log('Creating order...');
  const orderId = await createOrder(validationResult);
  console.log(`Order created with ID: ${orderId}`);
  
  // Step 3: Finalize the order
  console.log('Finalizing order...');
  const finalizationData = {
    finalValidationStatus: 'appropriate',
    finalComplianceScore: 7,
    finalCPTCode: '70551',
    finalCPTCodeDescription: 'MRI brain without contrast',
    finalICD10Codes: ['G44.309', 'R51.9'],
    finalICD10CodeDescriptions: ['Migraine, unspecified, not intractable', 'Headache, unspecified'],
    clinicalIndication: 'Patient with persistent headache for 3 weeks, worsening with movement.',
    overridden: false,
    signedByUserId: extractUserIdFromToken(jwtToken),
    signatureDate: new Date().toISOString(),
    signerName: 'Test Physician'
  };
  
  const response = await finalizeOrder(orderId, finalizationData);
  
  // Step 3: Verify the response
  assert.equal(response.success, true, 'Expected success response');
  console.log('Order finalized successfully');
  
  // Optional: Add instructions for manual verification
  console.log('\nManual Verification Steps:');
  console.log('1. Check that the order status in the database is "pending_admin"');
  console.log(`2. Check that order_history has a 'signed' event for order ID ${orderId}`);
  
  return orderId;
}

/**
 * Test Case 2: Finalize an order with temporary patient creation
 */
async function testTempPatientCreation() {
  console.log('\nTest Case 2: Finalize with Temporary Patient Creation');
  console.log('--------------------------------------------------');
  
  // Step 1: Validate dictation (stateless)
  console.log('Validating dictation (stateless)...');
  const validationResult = await validateDictation();
  console.log('Validation successful');
  
  // Step 2: Create an order
  console.log('Creating order...');
  const orderId = await createOrder(validationResult);
  console.log(`Order created with ID: ${orderId}`);
  
  // Step 3: Finalize the order with temporary patient data
  console.log('Finalizing order with temporary patient data...');
  const finalizationData = {
    finalValidationStatus: 'appropriate',
    finalComplianceScore: 8,
    finalCPTCode: '70551',
    finalCPTCodeDescription: 'MRI brain without contrast',
    finalICD10Codes: ['G44.309', 'R51.9'],
    finalICD10CodeDescriptions: ['Migraine, unspecified, not intractable', 'Headache, unspecified'],
    clinicalIndication: 'Patient with persistent headache for 3 weeks, worsening with movement.',
    overridden: false,
    signedByUserId: extractUserIdFromToken(jwtToken),
    signatureDate: new Date().toISOString(),
    signerName: 'Test Physician',
    // Temporary patient data
    isTemporaryPatient: true,
    patientInfo: {
      firstName: 'Temp',
      lastName: 'Patient Test',
      dateOfBirth: '1999-12-31',
      gender: 'F',
      mrn: 'TEMP-12345',
      phoneNumber: '555-123-4567'
    }
  };
  
  const response = await finalizeOrder(orderId, finalizationData);
  
  // Step 3: Verify the response
  assert.equal(response.success, true, 'Expected success response');
  console.log('Order finalized successfully with temporary patient creation');
  
  // Optional: Add instructions for manual verification
  console.log('\nManual Verification Steps:');
  console.log('1. Check that the order status in the database is "pending_admin"');
  console.log(`2. Check that order_history has a 'signed' event for order ID ${orderId}`);
  console.log('3. Check that a new patient record was created in the patients table');
  console.log(`4. Check that orders.patient_id for order ${orderId} points to the new patient ID`);
  
  return orderId;
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  console.log('[FAIL] Order Finalization Tests');
  process.exit(1);
});