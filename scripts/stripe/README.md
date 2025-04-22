# Stripe Testing Scripts

This directory contains scripts for testing Stripe webhook handlers and other Stripe-related functionality.

## Available Scripts

### Test Webhook Handlers

The `test-webhook-handlers.js` script simulates Stripe webhook events and tests the webhook handlers with mock implementations.

#### Usage

**Windows:**
```
.\scripts\stripe\run-test-webhook-handlers.bat
```

**Unix/Linux/macOS:**
```
bash scripts/stripe/run-test-webhook-handlers.sh
```

#### What it Tests

1. **Invoice Payment Succeeded Handler**: Tests the handler for `invoice.payment_succeeded` events
2. **Subscription Updated Handler**: Tests the handler for `customer.subscription.updated` events
3. **Subscription Deleted Handler**: Tests the handler for `customer.subscription.deleted` events

#### Implementation Details

The test script:
- Loads environment variables from the `.env` file
- Creates mock Stripe event objects
- Implements mock webhook handlers
- Simulates the processing of each event type
- Displays the results of each handler

## Documentation

For detailed information about the Stripe webhook handlers implementation, see:
- [Stripe Webhook Handlers Implementation](../../Docs/implementation/stripe-webhook-handlers.md)

## Related Files

The actual webhook handler implementations are located in:
- `src/services/billing/stripe/webhooks/handleInvoicePaymentSucceeded.ts`
- `src/services/billing/stripe/webhooks/handleSubscriptionUpdated.ts`
- `src/services/billing/stripe/webhooks/handleSubscriptionDeleted.ts`