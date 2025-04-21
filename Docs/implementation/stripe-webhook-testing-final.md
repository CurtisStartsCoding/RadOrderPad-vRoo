# Stripe Webhook Testing Guide

This document provides instructions for testing the Stripe webhook handlers using the Stripe CLI to simulate real events and verify the corresponding database updates.

## Prerequisites

Before running the tests, ensure you have the following:

1. **Stripe CLI installed**
   - Download from: https://stripe.com/docs/stripe-cli
   - Authenticate with: `stripe login`

2. **Local development server running**
   - Start the server with: `npm run dev` or `node src/server.js`

3. **Database setup**
   - Ensure your local PostgreSQL database is running
   - The database should have the necessary tables (organizations, billing_events, purgatory_events, etc.)

## Running the Tests

### Windows

```bash
test-stripe-webhooks-cli.bat
```

### macOS/Linux

```bash
chmod +x test-stripe-webhooks-cli.sh  # Make the script executable (first time only)
./test-stripe-webhooks-cli.sh
```

## What the Tests Do

The test scripts perform the following:

1. **Prepare Test Data**
   - Create or update a test organization with ID 1
   - Set the organization's Stripe customer ID
   - Initialize the credit balance to 100

2. **Start Stripe Webhook Listener**
   - Launch the Stripe CLI listener to forward events to your local server
   - The listener forwards events to http://localhost:3000/api/webhooks/stripe

3. **Test Scenario 1: Credit Top-up**
   - Trigger a checkout.session.completed event with metadata
   - Verify that the organization's credit balance increases
   - Verify that a billing event is logged in the database

4. **Manual Testing Instructions**
   - Provide instructions for testing other scenarios using the Stripe Dashboard
   - Include database queries to verify the results of each scenario

## Test Scenarios

### Automated Test

1. **Credit Top-up (checkout.session.completed)**
   - **What it tests:** Processing of checkout.session.completed webhook event
   - **Expected result:** Organization's credit balance increases, billing event logged

### Manual Testing

For the following scenarios, use the Stripe Dashboard as described in the test script:

2. **Subscription Payment Success (Active Org)**
   - **What it tests:** Processing of invoice.payment_succeeded for active organizations
   - **Expected result:** Credit balance reset to tier amount, billing event logged

3. **Subscription Payment Success (Purgatory Org)**
   - **What it tests:** Processing of invoice.payment_succeeded for organizations in purgatory
   - **Expected result:** Organization status changed to active, purgatory events resolved

4. **Payment Failure**
   - **What it tests:** Processing of invoice.payment_failed
   - **Expected result:** Organization status changed to purgatory, purgatory event created

5. **Subscription Update**
   - **What it tests:** Processing of customer.subscription.updated
   - **Expected result:** Subscription tier updated, credits replenished

6. **Subscription Cancelled**
   - **What it tests:** Processing of customer.subscription.deleted
   - **Expected result:** Subscription tier set to NULL, organization in purgatory

## Implementation Notes

The webhook handlers follow best practices:

1. **Transaction Safety**: All database operations are wrapped in transactions
2. **Error Handling**: Comprehensive error handling with specific error types
3. **Logging**: Detailed logging for debugging and monitoring
4. **Idempotency**: Events are processed idempotently to prevent duplicate processing

## Troubleshooting

If you encounter issues with the Stripe CLI commands:

1. **Parameter Errors**: The Stripe CLI may have specific parameter requirements
   - Try simplifying the parameters based on error messages
   - Check the Stripe CLI documentation for the correct parameter format

2. **Connection Issues**: Ensure your server is running and accessible
   - Check that the webhook endpoint is correctly configured
   - Verify that the server is listening on the expected port

3. **Database Issues**: Verify database connection and schema
   - Check that the necessary tables exist
   - Ensure the test organization exists with the correct Stripe customer ID