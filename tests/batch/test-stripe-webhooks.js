/**
 * Test script for Stripe webhook handlers
 * 
 * This script tests the Stripe webhook handlers by directly calling the handler functions
 * with mock Stripe events and verifying that they process them correctly.
 */

const { Pool } = require('pg');
const path = require('path');

// Adjust paths to find the compiled handlers
const handlersPath = path.resolve(__dirname, '../../dist/services/billing/stripe/webhooks');

// Dynamically require the handlers to handle potential path issues
let handleCheckoutSessionCompleted, handleInvoicePaymentSucceeded, 
    handleInvoicePaymentFailed, handleSubscriptionUpdated, handleSubscriptionDeleted;

try {
  handleCheckoutSessionCompleted = require(path.join(handlersPath, 'handle-checkout-session-completed')).handleCheckoutSessionCompleted;
  handleInvoicePaymentSucceeded = require(path.join(handlersPath, 'handle-invoice-payment-succeeded')).handleInvoicePaymentSucceeded;
  handleInvoicePaymentFailed = require(path.join(handlersPath, 'handle-invoice-payment-failed')).handleInvoicePaymentFailed;
  handleSubscriptionUpdated = require(path.join(handlersPath, 'handle-subscription-updated')).handleSubscriptionUpdated;
  handleSubscriptionDeleted = require(path.join(handlersPath, 'handle-subscription-deleted')).handleSubscriptionDeleted;
} catch (error) {
  console.error('Error loading webhook handlers:', error.message);
  console.error('Make sure you have compiled the TypeScript files using "npx tsc" before running this test.');
  process.exit(1);
}

// Load test configuration
const testConfig = require('../test-config');

// Create a database connection pool
const pool = new Pool({
  connectionString: testConfig.mainDbConnectionString
});

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting Stripe webhook handler tests...');
  
  try {
    // Set up test data
    await setupTestData();
    
    // Run tests
    await testCheckoutSessionCompleted();
    await testInvoicePaymentSucceeded();
    await testInvoicePaymentFailed();
    await testSubscriptionUpdated();
    await testSubscriptionDeleted();
    
    console.log('All Stripe webhook handler tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('Stripe webhook handler tests failed:', error);
    process.exit(1);
  } finally {
    // Clean up test data
    await cleanupTestData();
    await pool.end();
  }
}

/**
 * Set up test data
 */
async function setupTestData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create a test organization
    await client.query(`
      INSERT INTO organizations (id, name, type, billing_id, credit_balance, status, subscription_tier)
      VALUES (9999, 'Test Webhook Org', 'referring_practice', 'cus_test123', 100, 'active', 'tier_1')
      ON CONFLICT (id) DO UPDATE
      SET name = 'Test Webhook Org', billing_id = 'cus_test123', credit_balance = 100, status = 'active'
    `);
    
    // Create test users
    await client.query(`
      INSERT INTO users (id, organization_id, email, first_name, last_name, role)
      VALUES (9999, 9999, 'test.admin@example.com', 'Test', 'Admin', 'admin_referring')
      ON CONFLICT (id) DO UPDATE
      SET organization_id = 9999, email = 'test.admin@example.com', role = 'admin_referring'
    `);
    
    await client.query('COMMIT');
    console.log('Test data setup complete');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Clean up test data
 */
async function cleanupTestData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Delete test billing events
    await client.query(`
      DELETE FROM billing_events
      WHERE organization_id = 9999
    `);
    
    // Delete test purgatory events
    await client.query(`
      DELETE FROM purgatory_events
      WHERE organization_id = 9999
    `);
    
    // Reset test organization
    await client.query(`
      UPDATE organizations
      SET credit_balance = 100, status = 'active'
      WHERE id = 9999
    `);
    
    await client.query('COMMIT');
    console.log('Test data cleanup complete');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test checkout.session.completed handler
 */
async function testCheckoutSessionCompleted() {
  console.log('Testing checkout.session.completed handler...');
  
  // Create a mock checkout session
  const mockSession = {
    id: 'cs_test_123',
    metadata: {
      radorderpad_org_id: '9999',
      credit_bundle_price_id: 'price_credits_small'
    },
    amount_total: 5000,
    currency: 'usd'
  };
  
  // Create a mock event
  const mockEvent = {
    id: 'evt_test_checkout_completed',
    type: 'checkout.session.completed',
    data: {
      object: mockSession
    }
  };
  
  // Get initial credit balance
  const initialBalanceResult = await pool.query(
    'SELECT credit_balance FROM organizations WHERE id = 9999'
  );
  const initialBalance = initialBalanceResult.rows[0].credit_balance;
  
  // Call the handler
  await handleCheckoutSessionCompleted(mockEvent);
  
  // Verify credit balance was updated
  const updatedBalanceResult = await pool.query(
    'SELECT credit_balance FROM organizations WHERE id = 9999'
  );
  const updatedBalance = updatedBalanceResult.rows[0].credit_balance;
  
  // Verify billing event was created
  const billingEventResult = await pool.query(
    "SELECT * FROM billing_events WHERE organization_id = 9999 AND event_type = 'top_up' AND stripe_event_id = $1",
    [mockEvent.id]
  );
  
  // Assert results
  if (updatedBalance !== initialBalance + 100) {
    throw new Error(`Credit balance not updated correctly. Expected ${initialBalance + 100}, got ${updatedBalance}`);
  }
  
  if (billingEventResult.rowCount === 0) {
    throw new Error('Billing event not created');
  }
  
  console.log('checkout.session.completed handler test passed');
}

/**
 * Test invoice.payment_succeeded handler
 */
async function testInvoicePaymentSucceeded() {
  console.log('Testing invoice.payment_succeeded handler...');
  
  // First, put the organization in purgatory
  await pool.query(
    "UPDATE organizations SET status = 'purgatory' WHERE id = 9999"
  );
  
  // Create a purgatory event
  await pool.query(
    "INSERT INTO purgatory_events (organization_id, reason, triggered_by, status) VALUES (9999, 'payment_failed', 'stripe_webhook', 'active')"
  );
  
  // Create a mock invoice
  const mockInvoice = {
    id: 'in_test_123',
    customer: 'cus_test123',
    amount_paid: 5000,
    currency: 'usd'
  };
  
  // Create a mock event
  const mockEvent = {
    id: 'evt_test_invoice_succeeded',
    type: 'invoice.payment_succeeded',
    data: {
      object: mockInvoice
    }
  };
  
  // Call the handler
  await handleInvoicePaymentSucceeded(mockEvent);
  
  // Verify organization status was updated
  const orgStatusResult = await pool.query(
    'SELECT status FROM organizations WHERE id = 9999'
  );
  const orgStatus = orgStatusResult.rows[0].status;
  
  // Verify purgatory event was updated
  const purgatoryEventResult = await pool.query(
    "SELECT status FROM purgatory_events WHERE organization_id = 9999 AND status = 'resolved'"
  );
  
  // Verify billing event was created
  const billingEventResult = await pool.query(
    "SELECT * FROM billing_events WHERE organization_id = 9999 AND event_type = 'charge' AND stripe_event_id = $1",
    [mockEvent.id]
  );
  
  // Assert results
  if (orgStatus !== 'active') {
    throw new Error(`Organization status not updated correctly. Expected 'active', got '${orgStatus}'`);
  }
  
  if (purgatoryEventResult.rowCount === 0) {
    throw new Error('Purgatory event not updated');
  }
  
  if (billingEventResult.rowCount === 0) {
    throw new Error('Billing event not created');
  }
  
  console.log('invoice.payment_succeeded handler test passed');
}

/**
 * Test invoice.payment_failed handler
 */
async function testInvoicePaymentFailed() {
  console.log('Testing invoice.payment_failed handler...');
  
  // Reset organization status
  await pool.query(
    "UPDATE organizations SET status = 'active' WHERE id = 9999"
  );
  
  // Create a mock invoice with high attempt count to trigger purgatory
  const mockInvoice = {
    id: 'in_test_456',
    customer: 'cus_test123',
    amount_due: 5000,
    currency: 'usd',
    attempt_count: 3
  };
  
  // Create a mock event
  const mockEvent = {
    id: 'evt_test_invoice_failed',
    type: 'invoice.payment_failed',
    data: {
      object: mockInvoice
    }
  };
  
  // Call the handler
  await handleInvoicePaymentFailed(mockEvent);
  
  // Verify organization status was updated
  const orgStatusResult = await pool.query(
    'SELECT status FROM organizations WHERE id = 9999'
  );
  const orgStatus = orgStatusResult.rows[0].status;
  
  // Verify purgatory event was created
  const purgatoryEventResult = await pool.query(
    "SELECT * FROM purgatory_events WHERE organization_id = 9999 AND reason = 'payment_failed' AND status = 'active'"
  );
  
  // Verify billing event was created
  const billingEventResult = await pool.query(
    "SELECT * FROM billing_events WHERE organization_id = 9999 AND event_type = 'payment_failed' AND stripe_event_id = $1",
    [mockEvent.id]
  );
  
  // Assert results
  if (orgStatus !== 'purgatory') {
    throw new Error(`Organization status not updated correctly. Expected 'purgatory', got '${orgStatus}'`);
  }
  
  if (purgatoryEventResult.rowCount === 0) {
    throw new Error('Purgatory event not created');
  }
  
  if (billingEventResult.rowCount === 0) {
    throw new Error('Billing event not created');
  }
  
  console.log('invoice.payment_failed handler test passed');
}

/**
 * Test customer.subscription.updated handler
 */
async function testSubscriptionUpdated() {
  console.log('Testing customer.subscription.updated handler...');
  
  // Reset organization status and tier
  await pool.query(
    "UPDATE organizations SET status = 'active', subscription_tier = 'tier_1' WHERE id = 9999"
  );
  
  // Create a mock subscription with a new tier
  const mockSubscription = {
    id: 'sub_test_123',
    customer: 'cus_test123',
    status: 'active',
    items: {
      data: [
        {
          price: {
            id: 'price_tier2_monthly'
          }
        }
      ]
    }
  };
  
  // Create a mock event
  const mockEvent = {
    id: 'evt_test_subscription_updated',
    type: 'customer.subscription.updated',
    data: {
      object: mockSubscription
    }
  };
  
  // Call the handler
  await handleSubscriptionUpdated(mockEvent);
  
  // Verify organization tier was updated
  const orgResult = await pool.query(
    'SELECT subscription_tier FROM organizations WHERE id = 9999'
  );
  const subscriptionTier = orgResult.rows[0].subscription_tier;
  
  // Verify billing event was created
  const billingEventResult = await pool.query(
    "SELECT * FROM billing_events WHERE organization_id = 9999 AND event_type = 'subscription_updated' AND stripe_event_id = $1",
    [mockEvent.id]
  );
  
  // Assert results
  if (subscriptionTier !== 'tier_2') {
    throw new Error(`Subscription tier not updated correctly. Expected 'tier_2', got '${subscriptionTier}'`);
  }
  
  if (billingEventResult.rowCount === 0) {
    throw new Error('Billing event not created');
  }
  
  console.log('customer.subscription.updated handler test passed');
}

/**
 * Test customer.subscription.deleted handler
 */
async function testSubscriptionDeleted() {
  console.log('Testing customer.subscription.deleted handler...');
  
  // Reset organization status
  await pool.query(
    "UPDATE organizations SET status = 'active' WHERE id = 9999"
  );
  
  // Create a mock subscription
  const mockSubscription = {
    id: 'sub_test_456',
    customer: 'cus_test123',
    status: 'canceled'
  };
  
  // Create a mock event
  const mockEvent = {
    id: 'evt_test_subscription_deleted',
    type: 'customer.subscription.deleted',
    data: {
      object: mockSubscription
    }
  };
  
  // Call the handler
  await handleSubscriptionDeleted(mockEvent);
  
  // Verify organization status was updated
  const orgStatusResult = await pool.query(
    'SELECT status FROM organizations WHERE id = 9999'
  );
  const orgStatus = orgStatusResult.rows[0].status;
  
  // Verify purgatory event was created
  const purgatoryEventResult = await pool.query(
    "SELECT * FROM purgatory_events WHERE organization_id = 9999 AND reason = 'subscription_canceled' AND status = 'active'"
  );
  
  // Verify billing event was created
  const billingEventResult = await pool.query(
    "SELECT * FROM billing_events WHERE organization_id = 9999 AND event_type = 'subscription_deleted' AND stripe_event_id = $1",
    [mockEvent.id]
  );
  
  // Assert results
  if (orgStatus !== 'purgatory') {
    throw new Error(`Organization status not updated correctly. Expected 'purgatory', got '${orgStatus}'`);
  }
  
  if (purgatoryEventResult.rowCount === 0) {
    throw new Error('Purgatory event not created');
  }
  
  if (billingEventResult.rowCount === 0) {
    throw new Error('Billing event not created');
  }
  
  console.log('customer.subscription.deleted handler test passed');
}

// Run the tests
runTests();