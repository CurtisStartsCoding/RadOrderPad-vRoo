/**
 * Test script for Stripe webhooks using the Stripe CLI
 * 
 * This script tests the Stripe webhook handlers by:
 * 1. Using the Stripe CLI to trigger webhook events
 * 2. Verifying that the webhook events are processed correctly
 * 
 * Prerequisites:
 * - Stripe CLI installed and configured
 * - Stripe CLI listening for webhook events: stripe listen --forward-to http://host.docker.internal:3000/api/webhooks/stripe
 * 
 * Usage:
 *   node test-stripe-webhooks.js [--event-type EVENT_TYPE]
 */

const { program } = require('commander');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Parse command line arguments
program
  .option('--event-type <type>', 'Stripe event type to trigger', 'invoice.payment_succeeded');

program.parse(process.argv);
const options = program.opts();

// Available event types
const availableEventTypes = [
  'checkout.session.completed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'payment_intent.succeeded',
  'payment_intent.payment_failed'
];

// Main function
async function main() {
  try {
    console.log('=== Testing Stripe Webhooks ===\n');
    
    // Validate event type
    const eventType = options.eventType;
    if (!availableEventTypes.includes(eventType)) {
      console.error(`Error: Invalid event type '${eventType}'`);
      console.log('Available event types:');
      availableEventTypes.forEach(type => console.log(`- ${type}`));
      process.exit(1);
    }
    
    console.log(`Triggering Stripe event: ${eventType}`);
    
    // Execute Stripe CLI command to trigger the event
    const { stdout, stderr } = await execAsync(`stripe trigger ${eventType}`);
    
    if (stderr) {
      console.error('Error triggering event:', stderr);
      process.exit(1);
    }
    
    console.log('Stripe CLI output:');
    console.log(stdout);
    
    console.log('\nEvent triggered successfully!');
    console.log('Check the application logs to verify that the webhook was processed correctly.');
    console.log('You can also check the Stripe dashboard for the event details:');
    console.log('https://dashboard.stripe.com/test/events');
    
    console.log('\n=== Test Complete ===');
  } catch (error) {
    console.error('Error running test:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch(console.error);