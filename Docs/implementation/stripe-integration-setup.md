# Stripe Integration Setup Guide

This document provides instructions for setting up and testing Stripe integration with RadOrderPad.

## Prerequisites

1. Stripe account with API keys
2. Stripe CLI installed (download from https://stripe.com/docs/stripe-cli)

## Environment Setup

1. Add the following environment variables to your `.env` file:

```
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## Stripe CLI Setup

The Stripe CLI allows you to:
- Forward webhook events from Stripe to your local development server
- Trigger test events to simulate Stripe webhooks
- Test your webhook handlers without making actual API calls

### Starting the Webhook Listener

Run the following command to start listening for webhook events and forward them to your local server:

```
.\stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

This will output your webhook signing secret, which you should add to your `.env` file:

```
Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxxx (^C to quit)
```

### Testing Webhook Events

You can trigger test webhook events using the Stripe CLI:

```
.\stripe trigger checkout.session.completed
.\stripe trigger invoice.payment_succeeded
.\stripe trigger invoice.payment_failed
.\stripe trigger customer.subscription.updated
.\stripe trigger customer.subscription.deleted
```

## Code Structure

The Stripe integration is organized as follows:

1. **Webhook Handler**: `src/controllers/webhook.controller.ts`
   - Verifies webhook signatures
   - Routes events to appropriate handlers

2. **Stripe Service**: `src/services/billing/stripe/`
   - `webhooks/` - Contains individual webhook event handlers
   - `create-customer.ts` - Creates Stripe customers
   - `stripe.service.ts` - Core Stripe API interactions

3. **Billing Service**: `src/services/billing/index.ts`
   - Provides a facade for all billing operations
   - Handles credit management

## Webhook Events

The application handles the following Stripe webhook events:

1. **checkout.session.completed**
   - Triggered when a customer completes a checkout session
   - Used for one-time credit bundle purchases
   - Updates organization credit balance

2. **invoice.payment_succeeded**
   - Triggered when a subscription payment succeeds
   - Replenishes credits for subscription tiers
   - Reactivates organizations in purgatory status

3. **invoice.payment_failed**
   - Triggered when a subscription payment fails
   - Places organization in purgatory after multiple failures
   - Sends notification emails to administrators

4. **customer.subscription.updated**
   - Triggered when a subscription plan changes
   - Updates organization subscription tier

5. **customer.subscription.deleted**
   - Triggered when a subscription is canceled
   - Places organization in purgatory
   - Sends notification emails to administrators

## Testing

To test the Stripe integration:

1. Start your local development server:
   ```
   npm run dev
   ```

2. Start the Stripe webhook forwarder:
   ```
   .\stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```

3. Trigger test events:
   ```
   .\stripe trigger checkout.session.completed
   ```

4. Check the server logs to verify that events are being received and processed correctly.

## Troubleshooting

### Webhook Signature Verification Failed

If you see "Webhook signature verification failed" errors:

1. Ensure the `STRIPE_WEBHOOK_SECRET` in your `.env` file matches the secret provided by the Stripe CLI
2. Verify that the webhook request is not being modified by middleware
3. Check that you're using the raw request body for signature verification

### Missing Organization ID

If you see "Missing organization ID in checkout session metadata" errors:

1. This is expected for test events unless you specify metadata
2. To include metadata in test events:
   ```
   .\stripe trigger checkout.session.completed --metadata radorderpad_org_id=42
   ```

### Connection Refused

If the Stripe CLI cannot connect to your server:

1. Ensure your server is running on the correct port
2. Check for any firewall or network issues
3. Verify the forwarding URL is correct