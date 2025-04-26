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

## Get Credit Balance

**Endpoint:** `GET /api/billing/credit-balance`

**Description:** Retrieves the current credit balance for the authenticated user's organization.

**Authentication:** Required (admin_referring role only)

**Response:**
```json
{
  "success": true,
  "data": {
    "creditBalance": 500
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated or not associated with an organization
- 403 Forbidden: If the user does not have the admin_referring role
- 404 Not Found: If the organization is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to retrieve the current credit balance for the organization.
- The credit balance represents the number of validation credits available for use.
- Credits are consumed when orders are sent to radiology.
- Use this endpoint to display the current credit balance in the UI, such as in a dashboard or billing page.
- Consider implementing low credit warnings in the UI when the balance falls below a certain threshold.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-get-credit-balance.bat, test-get-credit-balance.sh

## Get Credit Usage History

**Endpoint:** `GET /api/billing/credit-usage`

**Description:** Retrieves the credit usage history for the authenticated user's organization.

**Authentication:** Required (admin_referring role only)

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sortBy` (optional): Field to sort by (default: created_at). Valid values: created_at, action_type, user_id, tokens_burned, order_id
- `sortOrder` (optional): Sort direction (default: desc). Valid values: asc, desc
- `actionType` (optional): Filter by action type (e.g., order_submitted)
- `dateStart` (optional): Filter by start date (ISO format)
- `dateEnd` (optional): Filter by end date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "usageLogs": [
      {
        "id": 123,
        "userId": 456,
        "userName": "John Doe",
        "orderId": 789,
        "tokensBurned": 1,
        "actionType": "order_submitted",
        "createdAt": "2025-04-22T13:11:56.390Z"
      },
      {
        "id": 124,
        "userId": 456,
        "userName": "John Doe",
        "orderId": 790,
        "tokensBurned": 1,
        "actionType": "order_submitted",
        "createdAt": "2025-04-22T14:22:33.123Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated or not associated with an organization
- 403 Forbidden: If the user does not have the admin_referring role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to retrieve the credit usage history for the organization.
- The response includes a list of usage logs and pagination information.
- Each usage log includes the user who performed the action, the order ID, the number of tokens burned, the action type, and the timestamp.
- Use this endpoint to display credit usage history in the UI, such as in a dashboard or billing page.
- The endpoint supports pagination, sorting, and filtering to help users find specific usage events.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-get-credit-usage.bat, test-get-credit-usage.sh

## Get Billing Overview

**Endpoint:** `GET /api/billing`

**Description:** Retrieves billing information for the current organization, including subscription status and credit balance.

**Authentication:** Required (admin_referring or admin_radiology role)

**Response:**
```json
{
  "success": true,
  "data": {
    "organizationStatus": "active",
    "subscriptionTier": "tier_1",
    "currentCreditBalance": 500,
    "stripeSubscriptionStatus": "active",
    "currentPeriodEnd": "2025-05-22T13:11:56.390Z",
    "billingInterval": "month",
    "cancelAtPeriodEnd": false,
    "stripeCustomerPortalUrl": "https://billing.stripe.com/p/session/..."
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated or not associated with an organization
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 404 Not Found: If the organization is not found
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to retrieve billing information for the organization.
- The response includes the organization's status, subscription tier, credit balance, and Stripe subscription details.
- The stripeCustomerPortalUrl field provides a direct link to the Stripe Customer Portal for managing billing.
- Use this endpoint to display billing information in the UI, such as in a dashboard or billing page.

**Implementation Status:**
- **Status:** Implemented
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