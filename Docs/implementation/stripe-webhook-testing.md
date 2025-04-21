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

4. **Environment variables**
   - Make sure your `.env` file has the correct database connection strings
   - Ensure `STRIPE_WEBHOOK_SECRET` is set for webhook signature verification

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

## Test Scenarios

The test script runs through the following scenarios:

### Scenario 1: Credit Top-up (checkout.session.completed)

**What it tests:**
- Processing of checkout.session.completed webhook event
- Updating organization's credit balance
- Logging billing events

**Expected database changes:**
- `organizations.credit_balance` should increase by the credit amount
- A new record should be added to `billing_events` with type 'top_up'

### Scenario 2: Subscription Payment Success (Active Org)

**What it tests:**
- Processing of invoice.payment_succeeded webhook event for an active organization
- Resetting credit balance to the tier's default amount
- Logging billing events

**Expected database changes:**
- `organizations.credit_balance` should be reset to the tier's default amount
- A new record should be added to `billing_events` with type 'subscription_payment'

### Scenario 3: Subscription Payment Success (Purgatory Org)

**What it tests:**
- Processing of invoice.payment_succeeded webhook event for an organization in purgatory
- Reactivating the organization
- Resolving purgatory events
- Sending notifications

**Expected database changes:**
- `organizations.status` should change from 'purgatory' to 'active'
- `purgatory_events` status should be updated to 'resolved'
- A new record should be added to `billing_events` with type 'subscription_payment'

### Scenario 4: Payment Failure

**What it tests:**
- Processing of invoice.payment_failed webhook event
- Putting an organization in purgatory if criteria are met
- Creating purgatory events
- Sending notifications

**Expected database changes:**
- `organizations.status` should change from 'active' to 'purgatory'
- A new record should be added to `purgatory_events` with reason 'payment_failed'
- A new record should be added to `billing_events` with type 'payment_failed'

### Scenario 5: Subscription Update

**What it tests:**
- Processing of customer.subscription.updated webhook event
- Updating subscription tier
- Replenishing credits based on the new tier
- Sending notifications

**Expected database changes:**
- `organizations.subscription_tier` should be updated to the new tier
- `organizations.credit_balance` should be updated to the new tier's default amount
- A new record should be added to `billing_events` with type 'subscription_updated'

### Scenario 6: Subscription Cancelled

**What it tests:**
- Processing of customer.subscription.deleted webhook event
- Putting an organization in purgatory
- Setting subscription_tier to NULL
- Creating purgatory events
- Sending notifications

**Expected database changes:**
- `organizations.status` should change from 'active' to 'purgatory'
- `organizations.subscription_tier` should be set to NULL
- A new record should be added to `purgatory_events` with reason 'subscription_canceled'
- A new record should be added to `billing_events` with type 'subscription_deleted'

## Troubleshooting

### Common Issues

1. **Stripe CLI not found**
   - Ensure Stripe CLI is installed and in your PATH
   - Verify with: `stripe --version`

2. **Server not running**
   - Start the server before running the tests
   - Verify with: `curl http://localhost:3000/api/health`

3. **Database connection issues**
   - Check your database connection string in `.env`
   - Ensure PostgreSQL is running

4. **Webhook signature verification failures**
   - Ensure `STRIPE_WEBHOOK_SECRET` is set correctly in `.env`
   - The Stripe CLI should automatically use the correct signature

5. **Test data preparation failures**
   - Check database permissions
   - Ensure the database has the necessary tables

### Logs and Debugging

- Check the server logs for detailed information about webhook processing
- The test scripts output query results to help diagnose issues
- For more detailed debugging, add `console.log` statements to the webhook handlers

## Extending the Tests

To add new test scenarios:

1. Add a new section to the test script with the appropriate Stripe CLI trigger command
2. Update the database queries to verify the expected changes
3. Document the new scenario in this guide

## Cleaning Up

The test scripts include commented-out code for cleaning up test data. Uncomment these lines if you want to reset the database after testing.

## References

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe API Reference](https://stripe.com/docs/api)