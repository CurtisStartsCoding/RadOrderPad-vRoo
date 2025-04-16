# Stripe Subscription Implementation

**Date:** 2025-04-14

## Overview

This document details the implementation of the Stripe subscription API endpoint for RadOrderPad. The endpoint allows referring group administrators to initiate the creation of a new Stripe subscription for a specific pricing tier.

## Implementation Details

### 1. Service Layer

Created a new service function in `src/services/billing/stripe/createSubscription.ts` that:

- Retrieves the organization's Stripe customer ID (billing_id) from the database
- Creates a Stripe subscription with payment_behavior set to 'default_incomplete'
- Expands the latest_invoice.payment_intent to get the client_secret for frontend payment confirmation
- Logs the subscription creation in the billing_events table
- Returns subscription details including ID, client secret, and status

### 2. Controller Layer

Implemented a controller in `src/controllers/billing/create-subscription.ts` that:

- Extracts the organization ID from the authenticated user
- Validates the price ID from the request body
- Checks if the price ID is one of the allowed tier price IDs (from environment variables)
- Calls the service function to create the subscription
- Returns the subscription details to the client

### 3. Route Configuration

Updated `src/routes/billing.routes.ts` to add the new endpoint:

```javascript
router.post(
  '/subscriptions',
  authenticateJWT,
  authorizeRole(['admin_referring']),
  createSubscription
);
```

### 4. Documentation

Updated `docs/api_endpoints.md` to document the new endpoint:

```
POST /billing/subscriptions: Create a Stripe subscription for a specific pricing tier. 
Returns subscription details including client secret for payment confirmation if required. 
(Admin Referring Role)
```

### 5. Testing

Created test scripts:

- `tests/batch/test-billing-subscriptions.js`: Tests the API endpoint functionality
- `tests/batch/run-billing-subscriptions-tests.bat`: Windows batch script to run the tests
- `tests/batch/run-billing-subscriptions-tests.sh`: Unix/Mac shell script to run the tests

## Configuration

The implementation uses environment variables for Stripe price IDs:

- `STRIPE_PRICE_ID_TIER_1`: Price ID for Tier 1 subscription
- `STRIPE_PRICE_ID_TIER_2`: Price ID for Tier 2 subscription
- `STRIPE_PRICE_ID_TIER_3`: Price ID for Tier 3 subscription

These should be added to the `.env` file and loaded through the configuration system.

## Frontend Integration

The frontend will need to:

1. Call the `/api/billing/subscriptions` endpoint with the desired price ID
2. Receive the subscription details including the client_secret
3. Use Stripe.js to handle payment confirmation if required (when client_secret is provided)
4. Update the UI based on the subscription status

## Security Considerations

- The endpoint is protected with JWT authentication
- Role-based access control restricts access to users with the 'admin_referring' role
- Price ID validation prevents unauthorized subscription tiers
- Stripe customer ID is retrieved from the database, not passed from the client

## Error Handling

The implementation includes comprehensive error handling:

- Database errors when retrieving the organization
- Missing or invalid billing_id
- Stripe API errors during subscription creation
- Invalid price IDs

All errors are logged and returned with appropriate HTTP status codes and error messages.