# Stripe Webhook Handlers Implementation

**Version:** 1.0
**Date:** 2025-04-20

This document describes the implementation of the Stripe webhook handlers in the RadOrderPad application, focusing on the database update logic for managing organization status, subscription tiers, and credit balances.

## Overview

The Stripe webhook handlers are responsible for processing events from Stripe and updating the database accordingly. The main events handled are:

1. `invoice.payment_succeeded`: Triggered when an invoice payment succeeds
2. `customer.subscription.updated`: Triggered when a subscription is updated
3. `customer.subscription.deleted`: Triggered when a subscription is canceled

These handlers ensure that the organization's status, subscription tier, and credit balance are kept in sync with their Stripe subscription.

## Implementation Details

### 1. Architecture

The webhook handlers follow a modular design with clear separation of concerns:

- **Webhook Handlers**: Process specific Stripe events and update the database
- **Utility Functions**: Provide reusable functionality for common operations
- **Error Handling**: Custom error classes for better error reporting and handling

### 2. Database Update Logic

#### 2.1 Invoice Payment Succeeded Handler

The `handleInvoicePaymentSucceeded` function in `src/services/billing/stripe/webhooks/handle-invoice-payment-succeeded.ts` handles the `invoice.payment_succeeded` event:

1. **Identify Organization**: Finds the organization by Stripe customer ID
2. **Log Billing Event**: Records the payment in the `billing_events` table
3. **Handle Purgatory Exit**: If the organization is in purgatory, reactivates it:
   - Updates `organizations.status` to 'active'
   - Updates `purgatory_events` to mark events as resolved
   - Updates `organization_relationships` to reactivate relationships
   - Sends notifications to organization admins
4. **Replenish Credits**: If this is a subscription renewal for a referring practice:
   - Uses the `replenishCreditsForTier` utility to reset the credit balance based on the subscription tier
   - The credit balance is SET to the tier's allocation, not added to the existing balance

#### 2.2 Subscription Updated Handler

The `handleSubscriptionUpdated` function in `src/services/billing/stripe/webhooks/handle-subscription-updated.ts` handles the `customer.subscription.updated` event:

1. **Identify Organization**: Finds the organization by Stripe customer ID
2. **Handle Tier Changes**: If the subscription price has changed:
   - Maps the price ID to a subscription tier using the `mapPriceIdToTier` utility
   - Updates `organizations.subscription_tier`
   - Logs the tier change in `billing_events`
   - Replenishes credits based on the new tier for referring practices
   - Sends notifications to organization admins
3. **Handle Status Changes**:
   - If subscription status is 'past_due' and organization is 'active':
     - Updates `organizations.status` to 'purgatory'
     - Creates a new entry in `purgatory_events`
     - Updates `organization_relationships` to put relationships in purgatory
     - Logs the status change in `billing_events`
     - Sends notifications to organization admins
   - If subscription status is 'active' and organization is in 'purgatory':
     - Updates `organizations.status` to 'active'
     - Updates `purgatory_events` to mark events as resolved
     - Updates `organization_relationships` to reactivate relationships
     - Logs the status change in `billing_events`
     - Sends notifications to organization admins

#### 2.3 Subscription Deleted Handler

The `handleSubscriptionDeleted` function in `src/services/billing/stripe/webhooks/handle-subscription-deleted.ts` handles the `customer.subscription.deleted` event:

1. **Identify Organization**: Finds the organization by Stripe customer ID
2. **Log Billing Event**: Records the subscription cancellation in `billing_events`
3. **Handle Purgatory Entry**: If the organization is not already in purgatory:
   - Updates `organizations.status` to 'purgatory'
   - Sets `organizations.subscription_tier` to NULL
   - Creates a new entry in `purgatory_events`
   - Updates `organization_relationships` to put relationships in purgatory
   - Sends notifications to organization admins

### 3. Utility Functions

#### 3.1 Credit Replenishment

The `replenishCreditsForTier` function in `src/services/billing/credit/replenish-credits-for-tier.ts` handles credit replenishment:

- Maps subscription tiers to credit allocations
- Updates the organization's credit balance to the allocated amount
- Logs the replenishment in `billing_events`

#### 3.2 Price ID to Tier Mapping

The `mapPriceIdToTier` function in `src/utils/billing/map-price-id-to-tier.ts` maps Stripe price IDs to subscription tiers:

- Maintains a mapping of price IDs to tiers
- Returns the corresponding tier for a given price ID
- Provides utility functions for getting credit allocations and display names for tiers

### 4. Error Handling

Custom error classes in `src/services/billing/stripe/webhooks/errors.ts` provide better error reporting and handling:

- `StripeWebhookError`: Base class for all webhook errors
- `OrganizationNotFoundError`: Thrown when an organization is not found
- `DatabaseOperationError`: Thrown when a database operation fails
- `SubscriptionNotFoundError`: Thrown when a subscription is not found
- `TierMappingError`: Thrown when a price ID cannot be mapped to a tier
- `NotificationError`: Thrown when a notification fails to send

### 5. Testing

The webhook handlers can be tested using the provided test script:

```bash
# Windows
.\test-stripe-webhooks.bat

# Unix/Linux/macOS
./test-stripe-webhooks.sh
```

This script simulates Stripe events and verifies that the handlers update the database correctly.

## Key Considerations

1. **Transactions**: All database operations are wrapped in transactions to ensure data consistency
2. **Error Handling**: Comprehensive error handling with specific error types
3. **Logging**: Detailed logging of all operations for debugging and auditing
4. **Notifications**: Email notifications to organization admins for important events

## Future Enhancements

1. **Webhook Signature Verification**: Add verification of Stripe webhook signatures
2. **Retry Mechanism**: Implement a retry mechanism for failed webhook processing
3. **Event Logging**: Log all received webhook events for auditing
4. **Metrics Collection**: Add metrics collection for webhook processing
5. **Webhook Dashboard**: Create a dashboard for monitoring webhook events

## References

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)