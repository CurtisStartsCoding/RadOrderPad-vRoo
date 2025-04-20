# Stripe Webhook Handlers Implementation

**Version:** 1.0
**Date:** 2025-04-19
**Author:** Backend Team

This document describes the implementation of Stripe webhook handlers for subscription events in the RadOrderPad application.

## Overview

The Stripe webhook handlers process events from Stripe related to subscription changes. These events are critical for maintaining the correct subscription status, tier, and credit balance for organizations in the system.

## Handlers

### 1. Subscription Updated Handler

**Files:**
- `src/services/billing/stripe/webhooks/handle-subscription-updated/handle-subscription-updated.ts` - Main handler
- `src/services/billing/stripe/webhooks/handle-subscription-updated/status-transitions.ts` - Status transition logic
- `src/services/billing/stripe/webhooks/handle-subscription-updated/notifications.ts` - Notification logic
- `src/services/billing/stripe/webhooks/handle-subscription-updated/map-price-id-to-tier.ts` - Price ID mapping
- `src/services/billing/stripe/webhooks/handle-subscription-updated/index.ts` - Module exports

This handler processes the `customer.subscription.updated` event from Stripe, which is triggered when a subscription is updated (e.g., plan change, status change). The implementation follows the Single Responsibility Principle by separating concerns into focused modules.

#### Key Functionality:

- **Organization Lookup:** Finds the organization by Stripe customer ID.
- **Tier Mapping:** Maps Stripe price IDs to internal tier names using the `mapPriceIdToTier` function.
- **Status Management:** Updates organization status based on subscription status:
  - If subscription is active but org is in purgatory → reactivate
  - If subscription is canceled but org is active → put in purgatory
- **Credit Replenishment:** Replenishes credits for referring organizations when:
  - Tier changes
  - Status changes to active
- **Database Updates:** Updates the organization's subscription tier and status in a transaction.
- **Event Logging:** Logs billing events and purgatory events.
- **Relationship Management:** Updates organization relationships when status changes.
- **Notifications:** Sends email notifications to organization admins about status and tier changes.

### 2. Subscription Deleted Handler

**File:** `src/services/billing/stripe/webhooks/handle-subscription-deleted.ts`

This handler processes the `customer.subscription.deleted` event from Stripe, which is triggered when a subscription is canceled.

#### Key Functionality:

- **Organization Lookup:** Finds the organization by Stripe customer ID.
- **Status Management:** Sets organization status to 'purgatory' if not already in that state.
- **Subscription Tier:** Sets the subscription tier to NULL to indicate no active subscription.
- **Database Updates:** Updates the organization's status and subscription tier in a transaction.
- **Event Logging:** Logs billing events and purgatory events.
- **Relationship Management:** Updates organization relationships to 'purgatory' status.
- **Notifications:** Sends email notifications to organization admins about the subscription cancellation.

## Supporting Modules

### 1. Price ID to Tier Mapping

**File:** `src/services/billing/stripe/webhooks/handle-subscription-updated/map-price-id-to-tier.ts`

Maps Stripe price IDs to internal subscription tier names. Includes mappings for:
- Monthly plans
- Yearly plans
- Test price IDs
- Production price IDs

### 2. Credit Management

**File:** `src/services/billing/credit/replenish-credits-for-tier.ts`

Handles credit replenishment based on subscription tier. Defines the credit allocation for each tier:
- Tier 1: 500 credits
- Tier 2: 1500 credits
- Tier 3: 5000 credits

### 3. Error Handling

**File:** `src/services/billing/stripe/webhooks/errors.ts`

Defines custom error types for Stripe webhook handlers:
- `StripeWebhookError`: Base class for webhook errors
- `OrganizationNotFoundError`: Organization not found by Stripe customer ID
- `DatabaseOperationError`: Database operation failed
- `NotificationError`: Failed to send notification

## Testing

**File:** `tests/stripe-webhook-handlers.test.js`

Test script for verifying the functionality of the webhook handlers. Simulates Stripe webhook events and tests the handlers' responses.

## Error Handling

All webhook handlers include robust error handling:
- Database operations are wrapped in transactions to ensure atomicity
- Custom error types provide detailed error information
- Notification failures are caught and logged but don't prevent other operations
- All errors are logged with detailed context

## Future Improvements

1. **Retry Mechanism:** Implement a retry mechanism for failed webhook processing.
2. **Webhook Signature Verification:** Enhance security by verifying Stripe webhook signatures.
3. **Logging Enhancement:** Add structured logging for better monitoring and debugging.
4. **Metrics Collection:** Collect metrics on webhook processing for performance monitoring.