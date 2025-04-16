/**
 * Stripe Webhook Handler Tests
 * 
 * This script tests the Stripe webhook handler endpoint (/api/webhooks/stripe)
 * by sending mock Stripe events with valid and invalid signatures.
 */

const Stripe = require('stripe');
const axios = require('axios');
const crypto = require('crypto');
const assert = require('assert');
const helpers = require('./batch/test-helpers');

// Configuration
// Make sure we don't double the /api in the URL
const API_BASE_URL = (process.env.API_BASE_URL || helpers.config.api.baseUrl || 'http://localhost:3000').replace(/\/api$/, '');
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';
const WEBHOOK_ENDPOINT = `${API_BASE_URL}/api/webhooks/stripe`;

// Initialize Stripe with a dummy API key (only needed for signature generation)
const stripe = new Stripe('sk_test_dummy');

/**
 * Helper function to generate a valid Stripe signature header
 * @param {Object} payload - The event payload object
 * @param {string} secret - The webhook secret
 * @returns {string} - The Stripe-Signature header value
 */
function generateStripeSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Important: Use the exact same JSON.stringify result for both signature generation and the request
  // Different JSON.stringify calls can produce slightly different results due to whitespace/ordering
  const payloadString = JSON.stringify(payload);
  
  // Generate the signature using the Stripe library if available
  try {
    return stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: secret,
      timestamp: timestamp
    });
  } catch (error) {
    console.log('Falling back to manual signature generation:', error.message);
    
    // Fallback to manual signature generation if Stripe library method fails
    const signedPayload = `${timestamp}.${payloadString}`;
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');
    
    return `t=${timestamp},v1=${signature}`;
  }
}

/**
 * Helper function to send a webhook request
 * @param {Object} payload - The event payload
 * @param {string|null} signature - The Stripe signature header (null for invalid signature test)
 * @returns {Promise<Object>} - The response object
 */
async function sendWebhookRequest(payload, signature) {
  // Convert payload to string - this is crucial for Stripe signature verification
  const payloadString = JSON.stringify(payload);
  
  const headers = {
    // Important: For Stripe webhooks, the Content-Type must be application/json
    // but the body must be sent as a raw string, not a parsed JSON object
    'Content-Type': 'application/json'
  };
  
  if (signature) {
    headers['Stripe-Signature'] = signature;
  }
  
  try {
    // Send the raw string payload, not a JSON object
    // This matches how Stripe sends webhooks - as raw bodies
    const response = await axios.post(WEBHOOK_ENDPOINT, payloadString, {
      headers,
      // Prevent axios from automatically parsing the response
      transformResponse: [(data) => data]
    });
    
    // Parse the response data if it's JSON
    let parsedData;
    try {
      parsedData = JSON.parse(response.data);
    } catch (e) {
      parsedData = response.data;
    }
    
    return {
      status: response.status,
      data: parsedData
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data
      };
    }
    throw error;
  }
}

// Mock event payloads
const mockCheckoutSessionCompleted = {
  id: 'evt_test_checkout_completed',
  object: 'event',
  api_version: '2025-03-31.basil',
  created: Math.floor(Date.now() / 1000),
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_123',
      object: 'checkout.session',
      amount_total: 5000, // $50.00
      currency: 'usd',
      customer: 'cus_test123',
      metadata: {
        radorderpad_org_id: '42',
        credit_bundle_price_id: 'price_credits_medium'
      }
    }
  }
};

// Mock event with missing metadata (to test error handling)
const mockCheckoutSessionCompletedMissingMetadata = {
  id: 'evt_test_checkout_completed_missing_metadata',
  object: 'event',
  api_version: '2025-03-31.basil',
  created: Math.floor(Date.now() / 1000),
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_456',
      object: 'checkout.session',
      amount_total: 5000, // $50.00
      currency: 'usd',
      customer: 'cus_test123',
      metadata: {} // Missing required metadata
    }
  }
};

const mockInvoicePaymentSucceeded = {
  id: 'evt_test_invoice_succeeded',
  object: 'event',
  api_version: '2025-03-31.basil',
  created: Math.floor(Date.now() / 1000),
  type: 'invoice.payment_succeeded',
  data: {
    object: {
      id: 'in_test_123',
      object: 'invoice',
      amount_paid: 10000, // $100.00
      currency: 'usd',
      customer: 'cus_test456',
      subscription_item: 'si_test123', // Indicates this is a subscription payment
      number: 'INV-001',
      status: 'paid'
    }
  }
};

const mockInvoicePaymentFailed = {
  id: 'evt_test_invoice_failed',
  object: 'event',
  api_version: '2025-03-31.basil',
  created: Math.floor(Date.now() / 1000),
  type: 'invoice.payment_failed',
  data: {
    object: {
      id: 'in_test_456',
      object: 'invoice',
      amount_due: 10000, // $100.00
      currency: 'usd',
      customer: 'cus_test789',
      attempt_count: 3,
      number: 'INV-002',
      status: 'open'
    }
  }
};

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting Stripe webhook handler tests...');
  console.log(`Using API endpoint: ${WEBHOOK_ENDPOINT}`);
  
  try {
    // Test 1: checkout.session.completed with valid signature
    console.log('\nTest 1: checkout.session.completed with valid signature');
    
    // First generate the payload string - must be the exact same string used for the request
    const payloadString1 = JSON.stringify(mockCheckoutSessionCompleted);
    
    // Generate signature using this exact payload string
    const timestamp1 = Math.floor(Date.now() / 1000);
    const signature1 = stripe.webhooks.generateTestHeaderString({
      payload: payloadString1,
      secret: STRIPE_WEBHOOK_SECRET,
      timestamp: timestamp1
    });
    
    // Send the request with the exact same payload string
    const headers1 = {
      'Content-Type': 'application/json',
      'Stripe-Signature': signature1
    };
    
    const response1 = await axios.post(WEBHOOK_ENDPOINT, payloadString1, {
      headers: headers1,
      transformResponse: [(data) => data]
    });
    
    let responseData1;
    try {
      responseData1 = JSON.parse(response1.data);
    } catch (e) {
      responseData1 = response1.data;
    }
    
    assert.strictEqual(response1.status, 200, 'Expected 200 status code');
    assert.deepStrictEqual(responseData1, { received: true }, 'Expected { received: true } response');
    console.log('✅ Test 1 passed');
    
    // Test 2: invoice.payment_succeeded with valid signature
    console.log('\nTest 2: invoice.payment_succeeded with valid signature');
    
    // Same direct approach for consistency
    const payloadString2 = JSON.stringify(mockInvoicePaymentSucceeded);
    const timestamp2 = Math.floor(Date.now() / 1000);
    const signature2 = stripe.webhooks.generateTestHeaderString({
      payload: payloadString2,
      secret: STRIPE_WEBHOOK_SECRET,
      timestamp: timestamp2
    });
    
    const headers2 = {
      'Content-Type': 'application/json',
      'Stripe-Signature': signature2
    };
    
    const response2 = await axios.post(WEBHOOK_ENDPOINT, payloadString2, {
      headers: headers2,
      transformResponse: [(data) => data]
    });
    
    let responseData2;
    try {
      responseData2 = JSON.parse(response2.data);
    } catch (e) {
      responseData2 = response2.data;
    }
    
    assert.strictEqual(response2.status, 200, 'Expected 200 status code');
    assert.deepStrictEqual(responseData2, { received: true }, 'Expected { received: true } response');
    console.log('✅ Test 2 passed');
    
    // Test 3: invoice.payment_failed with valid signature
    console.log('\nTest 3: invoice.payment_failed with valid signature');
    
    const payloadString3 = JSON.stringify(mockInvoicePaymentFailed);
    const timestamp3 = Math.floor(Date.now() / 1000);
    const signature3 = stripe.webhooks.generateTestHeaderString({
      payload: payloadString3,
      secret: STRIPE_WEBHOOK_SECRET,
      timestamp: timestamp3
    });
    
    const headers3 = {
      'Content-Type': 'application/json',
      'Stripe-Signature': signature3
    };
    
    const response3 = await axios.post(WEBHOOK_ENDPOINT, payloadString3, {
      headers: headers3,
      transformResponse: [(data) => data]
    });
    
    let responseData3;
    try {
      responseData3 = JSON.parse(response3.data);
    } catch (e) {
      responseData3 = response3.data;
    }
    
    assert.strictEqual(response3.status, 200, 'Expected 200 status code');
    assert.deepStrictEqual(responseData3, { received: true }, 'Expected { received: true } response');
    console.log('✅ Test 3 passed');
    
    // Test 4: Valid payload with invalid signature
    console.log('\nTest 4: Valid payload with invalid signature');
    
    const payloadString4 = JSON.stringify(mockCheckoutSessionCompleted);
    const invalidSignature = 't=1234567890,v1=invalid_signature';
    
    const headers4 = {
      'Content-Type': 'application/json',
      'Stripe-Signature': invalidSignature
    };
    
    const response4 = await axios.post(WEBHOOK_ENDPOINT, payloadString4, {
      headers: headers4,
      transformResponse: [(data) => data],
      validateStatus: function (status) {
        return status < 500; // Allow 400 status codes
      }
    });
    
    assert.strictEqual(response4.status, 400, 'Expected 400 status code for invalid signature');
    console.log('✅ Test 4 passed');
    
    // Test 5: Valid payload with missing signature
    console.log('\nTest 5: Valid payload with missing signature');
    
    const payloadString5 = JSON.stringify(mockCheckoutSessionCompleted);
    const headers5 = {
      'Content-Type': 'application/json'
      // No Stripe-Signature header
    };
    
    const response5 = await axios.post(WEBHOOK_ENDPOINT, payloadString5, {
      headers: headers5,
      transformResponse: [(data) => data],
      validateStatus: function (status) {
        return status < 500; // Allow 400 status codes
      }
    });
    
    assert.strictEqual(response5.status, 400, 'Expected 400 status code for missing signature');
    console.log('✅ Test 5 passed');
    
    // Test 6: checkout.session.completed with missing metadata
    console.log('\nTest 6: checkout.session.completed with missing metadata');
    
    const payloadString6 = JSON.stringify(mockCheckoutSessionCompletedMissingMetadata);
    const timestamp6 = Math.floor(Date.now() / 1000);
    const signature6 = stripe.webhooks.generateTestHeaderString({
      payload: payloadString6,
      secret: STRIPE_WEBHOOK_SECRET,
      timestamp: timestamp6
    });
    
    const headers6 = {
      'Content-Type': 'application/json',
      'Stripe-Signature': signature6
    };
    
    const response6 = await axios.post(WEBHOOK_ENDPOINT, payloadString6, {
      headers: headers6,
      transformResponse: [(data) => data],
      validateStatus: function (status) {
        return status < 500; // Allow 400 status codes
      }
    });
    
    // We expect a 400 status code with a specific error message about missing metadata
    assert.strictEqual(response6.status, 400, 'Expected 400 status code for missing metadata');
    console.log('✅ Test 6 passed');
    
    console.log('\nAll tests passed! 🎉');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the tests
runTests();