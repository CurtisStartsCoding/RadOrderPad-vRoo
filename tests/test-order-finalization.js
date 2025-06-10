/**
 * Test script for the new order finalization endpoint
 * 
 * This script tests the POST /api/orders endpoint for creating and finalizing orders
 * after validation and signature.
 */

const fetch = require('node-fetch');
const assert = require('assert').strict;

// Configuration
const API_BASE_URL = 'https://api.radorderpad.com/api';
const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;
const ORDER_CREATION_ENDPOINT = `${API_BASE_URL}/orders`;

// Sample dictation text for validation
const SAMPLE_DICTATION = `
Patient with persistent lower back pain radiating to the left leg for 3 weeks. 
History of disc herniation. Request MRI of lumbar spine.
`;

// Get JWT token from environment variable
const jwtToken = process.env.PHYSICIAN_TOKEN;
if (!jwtToken) {
  console.error('Error: PHYSICIAN_TOKEN environment variable is not set. Please run Set-TokenEnvVars.ps1 first.');
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
 * Create and finalize a new order
 */
async function createAndFinalizeOrder(validationResult) {
  try {
    // In the new approach, order creation and finalization happens in one step
    const response = await fetch(ORDER_CREATION_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        patientInfo: {
          id: 1 // Use existing patient ID instead of sending PHI
        },
        dictationText: SAMPLE_DICTATION,
        finalValidationResult: validationResult,
        isOverride: false,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0',
        signerFullName: 'Test Physician'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    return result.orderId;
  } catch (error) {
    console.error('Error creating and finalizing order:', error);
    throw error;
  }
}

/**
 * Run the test cases
 */
async function runTests() {
  console.log('Starting Order Creation and Finalization Tests');
  console.log('============================================');
  
  try {
    // Test Case: Create and Finalize Order
    await testOrderCreation();
    
    console.log('\nAll tests completed successfully!');
    console.log('[PASS] Order Creation and Finalization Tests');
    process.exit(0);
  } catch (error) {
    console.error('\nTest failed:', error.message);
    console.log('[FAIL] Order Creation and Finalization Tests');
    process.exit(1);
  }
}

/**
 * Test Case: Create and finalize an order
 */
async function testOrderCreation() {
  console.log('\nTest Case: Create and Finalize Order');
  console.log('------------------------------------');
  
  // Step 1: Validate dictation (stateless)
  console.log('Validating dictation (stateless)...');
  const validationResult = await validateDictation();
  console.log('Validation successful');
  
  // Step 2: Create and finalize order
  console.log('Creating and finalizing order...');
  const orderId = await createAndFinalizeOrder(validationResult);
  console.log(`Order created and finalized with ID: ${orderId}`);
  
  // Step 3: Verify the response
  assert.ok(orderId, 'Expected orderId to be returned');
  console.log('Order creation and finalization successful');
  
  // Optional: Add instructions for manual verification
  console.log('\nManual Verification Steps:');
  console.log('1. Check that the order status in the database is "pending_admin"');
  console.log(`2. Check that order_history has 'order_created' and 'order_signed' events for order ID ${orderId}`);
  console.log('3. Check that validation_attempts has a record for the final validation');
  
  return orderId;
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  console.log('[FAIL] Order Creation and Finalization Tests');
  process.exit(1);
});