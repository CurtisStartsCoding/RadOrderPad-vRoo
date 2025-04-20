/**
 * Test script for Stripe webhook handlers
 * 
 * This script tests the enhanced Stripe webhook handlers for subscription events.
 * It focuses on testing idempotency, error handling, and purgatory event resolution.
 * 
 * Usage:
 * ```
 * node tests/batch/test-stripe-webhook-handlers.js
 * ```
 */

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import crypto from 'crypto';
import Stripe from 'stripe';

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_webhook_secret';
let TEST_TOKEN;

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
    return {
      signature: stripe.webhooks.generateTestHeaderString({
        payload: payloadString,
        secret: secret || STRIPE_WEBHOOK_SECRET,
        timestamp: timestamp
      }),
      payloadString,
      timestamp
    };
  } catch (error) {
    console.log('Falling back to manual signature generation:', error.message);
    
    // Fallback to manual signature generation if Stripe library method fails
    const signedPayload = `${timestamp}.${payloadString}`;
    const signature = crypto
      .createHmac('sha256', secret || STRIPE_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest('hex');
    
    return {
      signature: `t=${timestamp},v1=${signature}`,
      payloadString,
      timestamp
    };
  }
}

// Read the test token from file if it exists
try {
  TEST_TOKEN = process.env.TEST_TOKEN || fs.readFileSync('./test-token.txt', 'utf8').trim();
} catch (error) {
  // If the file doesn't exist, use a default token
  TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTcxMzYxNjM1NCwiZXhwIjoxNzEzNzAyNzU0fQ.example';
  console.log('Using default test token');
}

// Test data
const testSubscriptionUpdatedEvent = {
  id: `evt_${uuidv4().replace(/-/g, '')}`,
  type: 'customer.subscription.updated',
  data: {
    object: {
      id: `sub_${uuidv4().replace(/-/g, '')}`,
      customer: 'cus_test123', // This should be a valid customer ID in your database
      status: 'active',
      items: {
        data: [
          {
            price: {
              id: 'price_tier2_monthly' // This should match a price ID in your map-price-id-to-tier.ts
            }
          }
        ]
      }
    }
  }
};

const testSubscriptionDeletedEvent = {
  id: `evt_${uuidv4().replace(/-/g, '')}`,
  type: 'customer.subscription.deleted',
  data: {
    object: {
      id: `sub_${uuidv4().replace(/-/g, '')}`,
      customer: 'cus_test123', // This should be a valid customer ID in your database
      status: 'canceled'
    }
  }
};

// Helper functions
async function sendWebhookEvent(event) {
  try {
    // First generate the payload string - must be the exact same string used for the request
    const payloadString = JSON.stringify(event);
    
    // Generate signature using this exact payload string
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret: STRIPE_WEBHOOK_SECRET,
      timestamp: timestamp
    });
    
    console.log('Sending webhook event:');
    console.log('Event ID:', event.id);
    console.log('Event Type:', event.type);
    console.log('Signature:', signature);
    
    // Send the request with the exact same payload string
    const headers = {
      'Content-Type': 'application/json',
      'Stripe-Signature': signature
    };
    
    // Send the request with the raw payload string and valid signature
    const response = await axios.post(`${API_URL}/api/webhooks/stripe`, payloadString, {
      headers: headers,
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
    
    console.log('Response:', response.status, parsedData);
    
    return {
      status: response.status,
      data: parsedData
    };
  } catch (error) {
    console.error('Error sending webhook event:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      return {
        status: error.response.status,
        data: error.response.data
      };
    }
    return {
      status: 500,
      error: error.message
    };
  }
}

// Test cases
async function testIdempotency() {
  console.log('\n--- Testing Idempotency ---');
  
  // Send the same event twice
  console.log('Sending subscription updated event...');
  const response1 = await sendWebhookEvent(testSubscriptionUpdatedEvent);
  console.log(`First response: ${response1.status}`);
  
  console.log('Sending the same event again...');
  const response2 = await sendWebhookEvent(testSubscriptionUpdatedEvent);
  console.log(`Second response: ${response2.status}`);
  
  // Both should succeed, but the second one should be a no-op
  return response1.status === 200 && response2.status === 200;
}

async function testErrorHandling() {
  console.log('\n--- Testing Error Handling ---');
  
  // Create an event with an invalid customer ID
  const invalidEvent = {
    ...testSubscriptionUpdatedEvent,
    id: `evt_${uuidv4().replace(/-/g, '')}`, // New event ID
    data: {
      object: {
        ...testSubscriptionUpdatedEvent.data.object,
        customer: 'cus_invalid_customer_id'
      }
    }
  };
  
  console.log('Sending event with invalid customer ID...');
  const response = await sendWebhookEvent(invalidEvent);
  console.log(`Response: ${response.status}`);
  
  // Should return 404 or 400 for invalid customer
  return response.status === 404 || response.status === 400;
}

async function testPurgatoryResolution() {
  console.log('\n--- Testing Purgatory Resolution ---');
  
  // First put the organization in purgatory with a subscription deleted event
  console.log('Sending subscription deleted event to put organization in purgatory...');
  const deleteResponse = await sendWebhookEvent(testSubscriptionDeletedEvent);
  console.log(`Delete response: ${deleteResponse.status}`);
  
  // Then reactivate it with a subscription updated event
  const reactivateEvent = {
    ...testSubscriptionUpdatedEvent,
    id: `evt_${uuidv4().replace(/-/g, '')}` // New event ID
  };
  
  console.log('Sending subscription updated event to reactivate organization...');
  const updateResponse = await sendWebhookEvent(reactivateEvent);
  console.log(`Update response: ${updateResponse.status}`);
  
  return deleteResponse.status === 200 && updateResponse.status === 200;
}

// Main test function
async function runTests() {
  console.log('Starting Stripe webhook handler tests...');
  
  try {
    // Test idempotency
    const idempotencyResult = await testIdempotency();
    console.log(`Idempotency test ${idempotencyResult ? 'PASSED' : 'FAILED'}`);
    
    // Test error handling
    const errorHandlingResult = await testErrorHandling();
    console.log(`Error handling test ${errorHandlingResult ? 'PASSED' : 'FAILED'}`);
    
    // Test purgatory resolution
    const purgatoryResult = await testPurgatoryResolution();
    console.log(`Purgatory resolution test ${purgatoryResult ? 'PASSED' : 'FAILED'}`);
    
    console.log('\nAll tests completed.');
    
    // Overall result
    const overallResult = idempotencyResult && errorHandlingResult && purgatoryResult;
    console.log(`\nOverall result: ${overallResult ? 'PASSED' : 'FAILED'}`);
    
    process.exit(overallResult ? 0 : 1);
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the tests
runTests();