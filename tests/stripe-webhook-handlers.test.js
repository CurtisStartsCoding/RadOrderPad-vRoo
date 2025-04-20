/**
 * Test script for Stripe webhook handlers
 * 
 * This script tests the subscription updated and deleted webhook handlers
 * by simulating Stripe webhook events.
 */

const { handleSubscriptionUpdated } = require('../dist/services/billing/stripe/webhooks/handle-subscription-updated');
const { handleSubscriptionDeleted } = require('../dist/services/billing/stripe/webhooks/handle-subscription-deleted');

// Mock Stripe subscription updated event
const mockSubscriptionUpdatedEvent = {
  id: 'evt_test_subscription_updated',
  type: 'customer.subscription.updated',
  data: {
    object: {
      id: 'sub_test123',
      customer: 'cus_test123', // This should match a customer ID in your test database
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
    }
  }
};

// Mock Stripe subscription deleted event
const mockSubscriptionDeletedEvent = {
  id: 'evt_test_subscription_deleted',
  type: 'customer.subscription.deleted',
  data: {
    object: {
      id: 'sub_test123',
      customer: 'cus_test123', // This should match a customer ID in your test database
      status: 'canceled'
    }
  }
};

/**
 * Test subscription updated handler
 */
async function testSubscriptionUpdated() {
  console.log('Testing subscription updated handler...');
  
  try {
    await handleSubscriptionUpdated(mockSubscriptionUpdatedEvent);
    console.log('✅ Subscription updated handler test passed');
  } catch (error) {
    console.error('❌ Subscription updated handler test failed:', error);
  }
}

/**
 * Test subscription deleted handler
 */
async function testSubscriptionDeleted() {
  console.log('Testing subscription deleted handler...');
  
  try {
    await handleSubscriptionDeleted(mockSubscriptionDeletedEvent);
    console.log('✅ Subscription deleted handler test passed');
  } catch (error) {
    console.error('❌ Subscription deleted handler test failed:', error);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting Stripe webhook handler tests...');
  
  // Update the customer ID to match a real customer in your test database
  const testCustomerId = process.argv[2] || 'cus_test123';
  mockSubscriptionUpdatedEvent.data.object.customer = testCustomerId;
  mockSubscriptionDeletedEvent.data.object.customer = testCustomerId;
  
  console.log(`Using test customer ID: ${testCustomerId}`);
  
  // Run tests
  await testSubscriptionUpdated();
  await testSubscriptionDeleted();
  
  console.log('All tests completed');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = {
  testSubscriptionUpdated,
  testSubscriptionDeleted,
  runTests
};