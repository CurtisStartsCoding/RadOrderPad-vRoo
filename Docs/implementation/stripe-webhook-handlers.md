# Stripe Webhook Handlers Implementation

**Version:** 1.2
**Date:** 2025-04-21 (Updated)

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

The webhook handlers can be tested using the provided test scripts:

#### 5.1 Original Test Script

```bash
# Windows
.\test-stripe-webhooks.bat

# Unix/Linux/macOS
./test-stripe-webhooks.sh
```

This script simulates Stripe events and verifies that the handlers update the database correctly.

#### 5.2 Enhanced Test Script (New)

```bash
# Windows
.\tests\batch\run-stripe-webhook-handlers-test.bat

# Unix/Linux/macOS
./tests/batch/run-stripe-webhook-handlers-test.sh
```

The enhanced test script (`tests/batch/test-stripe-webhook-handlers.js`) provides more comprehensive testing:

1. **Idempotency Testing**: Sends the same event twice to verify it's only processed once
2. **Error Handling Testing**: Sends events with invalid data to test error handling
3. **Purgatory Resolution Testing**: Tests the full cycle of putting an organization in purgatory and then reactivating it

The test script uses the following approach:
- Creates unique event IDs using UUID
- Simulates different Stripe webhook events
- Verifies the responses from the webhook handlers
- Provides detailed logging of test results

## Key Considerations

1. **Transactions**: All database operations are wrapped in transactions to ensure data consistency
2. **Idempotency**: Webhook handlers check if an event has already been processed to prevent duplicate processing
3. **Error Handling**: Comprehensive error handling with specific error types
4. **Logging**: Detailed logging of all operations for debugging and auditing
5. **Notifications**: Email notifications to organization admins for important events

## Recent Improvements (v1.1)

### 1. Idempotency Handling

Both webhook handlers now include explicit idempotency checks to prevent duplicate processing of the same event:

```typescript
// Check if this event has already been processed (idempotency)
const eventResult = await client.query(
  `SELECT id FROM billing_events WHERE stripe_event_id = $1`,
  [event.id]
);

if (eventResult.rowCount && eventResult.rowCount > 0) {
  logger.info(`Stripe event ${event.id} has already been processed. Skipping.`);
  await client.query('COMMIT');
  return;
}
```

This ensures that even if the same webhook event is received multiple times (which can happen with Stripe's retry mechanism), it will only be processed once.

### 2. Improved Error Handling

The error handling in both handlers has been standardized using a common `handleError` function:

```typescript
function handleError(error: unknown, operation: string): never {
  if (error instanceof StripeWebhookError) {
    throw error;
  } else if (error instanceof OrganizationNotFoundError) {
    throw error;
  } else if (error instanceof Error) {
    throw new DatabaseOperationError(operation, error);
  } else {
    throw new Error(`Unknown error during ${operation}: ${String(error)}`);
  }
}
```

This provides more consistent error reporting and makes the code more maintainable.

### 3. Fixed Purgatory Event Resolution

Fixed a bug in the `handleReactivation` function where purgatory events were being updated with an incorrect WHERE clause:

```typescript
// Before:
await client.query(
  `UPDATE purgatory_events
   SET status = 'resolved', resolved_at = NOW()
   WHERE organization_id = $1 AND status = 'active'`,
  [orgId]
);

// After:
await client.query(
  `UPDATE purgatory_events
   SET status = 'resolved', resolved_at = NOW()
   WHERE organization_id = $1 AND status != 'resolved'`,
  [orgId]
);
```

This ensures that all active purgatory events for an organization are properly resolved when the organization is reactivated.

### 4. Enhanced Testing

A new comprehensive test suite has been created to verify the webhook handlers:

- `tests/batch/test-stripe-webhook-handlers.js`: Tests the webhook handlers with various scenarios
- `tests/batch/run-stripe-webhook-handlers-test.bat`: Windows batch script to run the tests
- `tests/batch/run-stripe-webhook-handlers-test.sh`: Unix/Linux/macOS shell script to run the tests

The test suite includes tests for:
- Idempotency handling
- Error handling
- Purgatory event resolution

## Recent Improvements (v1.2)

### 1. Modular Webhook Handler Implementation

The webhook handlers have been refactored into a more modular structure with separate files for each handler:

- `src/services/billing/stripe/webhooks/handleInvoicePaymentSucceeded.ts`: Handles invoice payment succeeded events
- `src/services/billing/stripe/webhooks/handleSubscriptionUpdated.ts`: Handles subscription updated events
- `src/services/billing/stripe/webhooks/handleSubscriptionDeleted.ts`: Handles subscription deleted events
- `src/services/billing/stripe/webhooks/index.ts`: Exports all handlers and provides a utility function to get the appropriate handler for an event type

This modular approach improves maintainability and makes it easier to add new handlers in the future.

### 2. Enhanced Type Safety

The handlers now use TypeScript interfaces and type guards to ensure type safety:

```typescript
// Define the type for webhook handlers
type WebhookHandler = (event: Stripe.Event) => Promise<{ success: boolean; message: string }>;

// Define the map of event types to handlers with proper typing
export const webhookHandlers: Record<string, WebhookHandler> = {
  'invoice.payment_succeeded': handleInvoicePaymentSucceeded,
  'customer.subscription.updated': handleSubscriptionUpdated,
  'customer.subscription.deleted': handleSubscriptionDeleted,
};
```

This ensures that all handlers have a consistent interface and return type.

### 3. Improved Testing

A new test script has been created to test the webhook handlers:

- `scripts/stripe/test-webhook-handlers.js`: Tests all webhook handlers with mock events
- `scripts/stripe/run-test-webhook-handlers.bat`: Windows batch script to run the tests
- `scripts/stripe/run-test-webhook-handlers.sh`: Unix/Linux/macOS shell script to run the tests

The test script provides more comprehensive testing of the webhook handlers, including:

- Testing all handlers with mock events
- Verifying the responses from the handlers
- Providing detailed logging of test results

## Future Enhancements

1. **Webhook Signature Verification**: Add verification of Stripe webhook signatures
2. **Retry Mechanism**: Implement a retry mechanism for failed webhook processing
3. **Event Logging**: Log all received webhook events for auditing
4. **Metrics Collection**: Add metrics collection for webhook processing
5. **Webhook Dashboard**: Create a dashboard for monitoring webhook events
6. **Integration Tests**: Add integration tests with a real Stripe account

## References

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Enhanced Test Script](../../scripts/stripe/test-webhook-handlers.js)
- [Stripe Webhooks Refactoring](./stripe-webhooks-refactoring.md)