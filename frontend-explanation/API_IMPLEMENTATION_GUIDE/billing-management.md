# Billing Management

This section covers endpoints related to billing, subscriptions, and credit management in the RadOrderPad system.

## Create Checkout Session

**Endpoint:** `POST /api/billing/create-checkout-session`

**Description:** Creates a Stripe checkout session for purchasing credit bundles.

**Authentication:** Required (admin_referring role only)

**Request Body:**
```json
{
  "priceId": "price_1234567890",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0"
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring role
- 404 Not Found: If the price ID is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to create a checkout session for purchasing credit bundles.
- The priceId should be a valid Stripe price ID.
- The quantity is the number of credit bundles to purchase.
- The response includes a sessionId that can be used to redirect the user to the Stripe checkout page.
- After successful payment, the user will be redirected to the success URL configured in the application.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-billing-endpoint.js

## Create Subscription

**Endpoint:** `POST /api/billing/subscriptions`

**Description:** Creates a Stripe subscription for a specific pricing tier.

**Authentication:** Required (admin_referring role only)

**Request Body:**
```json
{
  "priceId": "price_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "subscriptionId": "sub_1234567890",
  "clientSecret": "seti_1234567890_secret_1234567890"
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring role
- 404 Not Found: If the price ID is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to create a subscription for a specific pricing tier.
- The priceId should be a valid Stripe price ID corresponding to a subscription plan.
- The response includes a subscriptionId and clientSecret that can be used to confirm the subscription.
- After successful subscription creation, the organization's subscription_tier will be updated accordingly.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-billing-endpoint.js

## Get Billing Information (Not Implemented)

**Endpoint:** `GET /api/billing`

**Description:** This endpoint would retrieve billing information for the current organization, but it is not currently implemented.

**Authentication:** Would require admin_referring role

**Expected Response (if implemented):**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "Test Organization",
      "billingId": "cus_1234567890",
      "creditBalance": 500,
      "subscriptionTier": "tier_1",
      "status": "active"
    },
    "billingEvents": [
      {
        "id": 1,
        "event_type": "credit_purchase",
        "amount_cents": 10000,
        "currency": "usd",
        "description": "Purchase of 100 credits",
        "created_at": "2025-04-22T13:11:56.390Z"
      }
    ]
  }
}
```

**Current Status:**
- Returns 404 "Route not found" error
- The dist/routes/billing.routes.js file does not define a handler for the base GET / path
- Only POST routes for creating checkout sessions and subscriptions are implemented

**Implementation Suggestion:**
- Add a GET / route to the billing.routes.ts file
- Create a controller function to retrieve billing information from the database
- Return organization details and recent billing events

**Implementation Status:**
- **Status:** Not Implemented
- **Tested With:** test-billing-endpoint.js, test-superadmin-endpoints.js, test-comprehensive-api-with-roles.js

## Webhook Handling

The system also includes webhook endpoints for handling Stripe events, but these are not directly accessible via the API and are used internally by the system to process Stripe events such as:

- Checkout session completed
- Invoice payment succeeded
- Invoice payment failed
- Subscription updated
- Subscription deleted

These webhooks update the organization's credit balance, subscription tier, and billing events in the database.

## Credit Management

The system includes internal services for managing credits:

- Burning credits when orders are created or processed
- Replenishing credits based on subscription tier
- Tracking credit usage in billing events

These services are not directly accessible via the API but are used internally by the system to manage credits.

## Implementation Notes

- The billing system is integrated with Stripe for payment processing.
- Organizations can purchase credit bundles or subscribe to a pricing tier.
- Credits are used to process orders, with different order types consuming different amounts of credits.
- The system tracks credit usage and replenishes credits based on subscription tier.
- Billing events are recorded in the database for auditing and reporting purposes.