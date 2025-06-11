# Billing and Credit Management API Documentation

**Last Updated:** June 11, 2025  
**Version:** 2.0 (Dual Credit System)

## Overview

This document provides comprehensive documentation for RadOrderPad's billing and credit management endpoints. These endpoints handle credit balance management, usage tracking, subscription management, and the credit consumption process when orders are sent to radiology.

## Dual Credit System

RadOrderPad uses a unified pre-paid credit model for all organizations:

### Referring Organizations
- **Single Credit Type**: Standard credits for submitting orders
- **Consumption**: 1 credit per order sent to radiology
- **Balance Field**: `credit_balance`

### Radiology Organizations  
- **Dual Credit Types**:
  - **Basic Credits**: For standard imaging (X-ray, Ultrasound, etc.)
  - **Advanced Credits**: For advanced imaging (MRI, CT, PET, Nuclear)
- **Consumption**: 1 credit per order received (type determined by imaging modality)
- **Balance Fields**: `basic_credit_balance` and `advanced_credit_balance`

### Credit Consumption Flow
1. When admin staff sends an order to radiology:
   - 1 credit is deducted from the referring organization
   - 1 credit (basic or advanced) is deducted from the radiology organization
2. Credit type for radiology is automatically determined based on:
   - Order modality (MRI, CT, PET, NUCLEAR = advanced)
   - CPT codes associated with the order

## Authentication

All billing endpoints require JWT authentication and specific role authorization:
- **admin_referring**: Can access all billing endpoints including creating subscriptions and checkout sessions
- **admin_radiology**: Can only access read-only endpoints (billing overview)
- **admin_staff**: Can trigger credit consumption through the send-to-radiology endpoint

## Endpoints

### 1. Get Billing Overview

**Endpoint:** `GET /api/billing`

**Description:** Retrieves comprehensive billing information for the authenticated user's organization, including subscription status, credit balance, and Stripe subscription details.

**Access:** Private - admin_referring or admin_radiology role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organizationStatus": "active",
    "organizationType": "referring",
    "subscriptionTier": "tier_2",
    "currentCreditBalance": 150,
    "stripeSubscriptionStatus": "active",
    "currentPeriodEnd": "2024-02-15T00:00:00.000Z",
    "billingInterval": "month",
    "cancelAtPeriodEnd": false,
    "stripeCustomerPortalUrl": "https://billing.stripe.com/session/..."
  }
}
```

**Response for Radiology Organizations:**
```json
{
  "success": true,
  "data": {
    "organizationStatus": "active",
    "organizationType": "radiology_group",
    "subscriptionTier": "tier_2",
    "currentCreditBalance": 0,
    "basicCreditBalance": 100,
    "advancedCreditBalance": 50,
    "stripeSubscriptionStatus": "active",
    "currentPeriodEnd": "2024-02-15T00:00:00.000Z",
    "billingInterval": "month",
    "cancelAtPeriodEnd": false,
    "stripeCustomerPortalUrl": "https://billing.stripe.com/session/..."
  }
}
```

**Response Fields:**
- `organizationStatus`: Current status of the organization (active, inactive, suspended)
- `organizationType`: Type of organization (referring, referring_practice, radiology, radiology_group)
- `subscriptionTier`: Current subscription tier (tier_1, tier_2, tier_3, or null)
- `currentCreditBalance`: Number of credits available (referring organizations only)
- `basicCreditBalance`: Number of basic imaging credits (radiology organizations only)
- `advancedCreditBalance`: Number of advanced imaging credits (radiology organizations only)
- `stripeSubscriptionStatus`: Status of Stripe subscription (active, canceled, past_due, etc.)
- `currentPeriodEnd`: ISO date string of when the current billing period ends
- `billingInterval`: Billing frequency ('month' or 'year')
- `cancelAtPeriodEnd`: Boolean indicating if subscription will cancel at period end
- `stripeCustomerPortalUrl`: URL to Stripe's customer portal for managing billing

**Error Responses:**
- `401 Unauthorized`: User not associated with an organization
- `404 Not Found`: Organization not found
- `500 Internal Server Error`: Server error

---

### 2. Get Credit Balance

**Endpoint:** `GET /api/billing/credit-balance`

**Description:** Retrieves the current credit balance for the authenticated user's organization.

**Access:** Private - admin_referring role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response for Referring Organizations:**
```json
{
  "success": true,
  "data": {
    "organizationType": "referring",
    "creditBalance": 150
  }
}
```

**Response for Radiology Organizations:**
```json
{
  "success": true,
  "data": {
    "organizationType": "radiology_group",
    "basicCreditBalance": 100,
    "advancedCreditBalance": 50
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not associated with an organization
- `404 Not Found`: Organization not found
- `500 Internal Server Error`: Server error

---

### 3. Get Credit Usage History

**Endpoint:** `GET /api/billing/credit-usage`

**Description:** Retrieves paginated credit usage history for the organization with filtering and sorting options.

**Access:** Private - admin_referring role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number for pagination |
| limit | integer | 20 | Number of records per page |
| sortBy | string | created_at | Column to sort by (created_at, action_type, user_id, tokens_burned, order_id) |
| sortOrder | string | DESC | Sort direction (ASC or DESC) |
| actionType | string | - | Filter by action type |
| dateStart | string | - | Filter records after this date (ISO format) |
| dateEnd | string | - | Filter records before this date (ISO format) |

**Example Request:**
```
GET /api/billing/credit-usage?page=1&limit=10&sortBy=created_at&sortOrder=DESC&actionType=order_submitted
```

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
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

**Action Types:**
- `order_submitted`: Credit consumed when order sent to radiology
- `manual_adjustment`: Manual credit adjustment by admin
- `subscription_renewal`: Credits added from subscription renewal
- `credit_purchase`: Credits added from one-time purchase

**Error Responses:**
- `401 Unauthorized`: User not associated with an organization
- `500 Internal Server Error`: Server error

---

### 4. Create Checkout Session

**Endpoint:** `POST /api/billing/create-checkout-session`

**Description:** Creates a Stripe checkout session for purchasing credit bundles. Returns a session ID that can be used with Stripe Checkout on the frontend.

**Access:** Private - admin_referring role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "priceId": "price_1234567890" // Optional - uses default if not provided
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3d4e5f6..."
}
```

**Implementation Note:** The frontend should redirect to Stripe Checkout using this session ID:
```javascript
const stripe = Stripe('your-publishable-key');
stripe.redirectToCheckout({ sessionId: response.sessionId });
```

**Error Responses:**
- `401 Unauthorized`: User not associated with an organization
- `500 Internal Server Error`: Failed to create checkout session

---

### 5. Create Subscription

**Endpoint:** `POST /api/billing/subscriptions`

**Description:** Creates a Stripe subscription for a specific pricing tier. Returns subscription details including a client secret for payment confirmation.

**Access:** Private - admin_referring role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "priceId": "price_tier_2_monthly" // Required - must be a valid tier price ID
}
```

**Valid Price IDs:** 
- Configured in environment variables as:
  - `STRIPE_PRICE_ID_TIER_1`
  - `STRIPE_PRICE_ID_TIER_2`
  - `STRIPE_PRICE_ID_TIER_3`

**Response:**
```json
{
  "success": true,
  "subscriptionId": "sub_1234567890",
  "clientSecret": "pi_1234567890_secret_abcdef",
  "status": "incomplete"
}
```

**Response Fields:**
- `subscriptionId`: Stripe subscription ID
- `clientSecret`: Client secret for confirming payment (if required)
- `status`: Subscription status (incomplete, active, etc.)

**Error Responses:**
- `400 Bad Request`: Missing or invalid price ID
- `401 Unauthorized`: User not associated with an organization
- `500 Internal Server Error`: Failed to create subscription

---

### 6. Send Order to Radiology (Credit Consumption)

**Endpoint:** `POST /api/admin/orders/:orderId/send-to-radiology`

**Description:** Finalizes an order and sends it to the radiology group. This action consumes one credit from the organization's balance.

**Access:** Private - admin_staff role only

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters:**
- `orderId`: The ID of the order to send to radiology

**Credit Consumption Process:**
1. Verifies order exists and has status 'pending_admin'
2. Validates patient information is complete
3. Validates insurance information is complete
4. Checks organization has sufficient credits
5. Checks organization account is active
6. Updates order status to 'pending_radiology'
7. Deducts 1 credit from organization balance
8. Logs the credit usage with action type 'order_submitted'

**Response:**
```json
{
  "success": true,
  "orderId": 789,
  "message": "Order sent to radiology successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid order ID
- `401 Unauthorized`: User authentication required
- `403 Forbidden`: Insufficient credits or organization account not active
- `404 Not Found`: Order not found
- `422 Unprocessable Entity`: Missing required patient or insurance information
- `500 Internal Server Error`: Server error

**Validation Errors:**
The endpoint validates that all required patient and insurance fields are present:
- Patient: firstName, lastName, dateOfBirth, sex, phone, address
- Insurance: name, memberId, groupNumber, isPrimary

Missing fields will be listed in the error message:
```json
{
  "success": false,
  "message": "Cannot send to radiology: Missing required information: patient.phone, insurance.groupNumber"
}
```

---

## Credit System Overview

### Credit Balance Management

- Credits are stored in the `organizations.credit_balance` field
- Credits are consumed when orders are sent to radiology (1 credit per order)
- Credits can be added through:
  - Subscription renewals (automatic monthly/yearly)
  - One-time credit bundle purchases
  - Manual adjustments by system administrators

### Credit Usage Tracking

All credit transactions are logged in the `credit_usage_logs` table with:
- User who performed the action
- Order ID (if applicable)
- Number of credits consumed/added
- Action type
- Timestamp

### Insufficient Credits Handling

When an organization has insufficient credits:
1. The send-to-radiology endpoint returns a 403 Forbidden error
2. The organization must purchase additional credits or wait for subscription renewal
3. Orders remain in 'pending_admin' status until credits are available

---

## Integration Notes

### Frontend Integration

1. **Billing Overview Page**: Use the `/api/billing` endpoint to display:
   - Current credit balance
   - Subscription status
   - Link to Stripe customer portal

2. **Credit Purchase Flow**:
   - Call `/api/billing/create-checkout-session` to get session ID
   - Redirect to Stripe Checkout
   - Handle success/cancel URLs

3. **Order Submission**:
   - Check credit balance before allowing send-to-radiology
   - Handle insufficient credits error gracefully
   - Show credit consumption in UI

### Webhook Integration

The system handles Stripe webhooks for:
- Checkout session completion (adds purchased credits)
- Invoice payment success (subscription renewals)
- Subscription updates and cancellations

Webhook endpoint: `POST /api/billing/webhooks/stripe`

---

## Testing

### Test Credit System
- Create test organizations with various credit balances
- Test insufficient credits scenario
- Test credit consumption and usage logging

### Test Stripe Integration
- Use Stripe test mode with test API keys
- Test credit bundle purchases with test cards
- Test subscription creation and management

---

## Security Considerations

1. **Role-Based Access**: Strict role checking ensures only authorized users can access billing information
2. **Organization Isolation**: Users can only access their own organization's billing data
3. **Stripe Security**: All payment processing handled by Stripe's secure infrastructure
4. **Audit Trail**: Complete logging of all credit transactions

---

## Error Handling Best Practices

1. Always check for sufficient credits before critical operations
2. Provide clear error messages for insufficient credits
3. Log all billing-related errors for debugging
4. Handle Stripe API errors gracefully with fallback behavior