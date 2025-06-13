# Billing and Credit Management API Documentation

## Overview

RadOrderPad uses a pre-paid credit system for all organizations. Credits are consumed when orders are sent to radiology groups. This documentation covers endpoints for viewing balances, tracking usage, and purchasing credits.

## Credit System

### Referring Organizations
- **Single Credit Type**: Standard credits for submitting orders
- **Consumption**: 1 credit per order sent to radiology
- **Purchase**: Can buy credits through Stripe checkout

### Radiology Organizations  
- **Dual Credit Types**:
  - **Basic Credits**: For standard imaging (X-ray, Ultrasound)
  - **Advanced Credits**: For advanced imaging (MRI, CT, PET, Nuclear)
- **Consumption**: 1 credit per order received (type auto-determined by imaging modality)
- **Purchase**: Currently manual process (no self-service purchasing)

## Authentication

All billing endpoints require JWT authentication:
- **admin_referring**: Full access to all billing features
- **admin_radiology**: Read-only access to billing overview and balances
- Other roles: No access to billing endpoints

## Endpoints

### 1. Get Billing Overview

Get comprehensive billing information for your organization.

**Endpoint:** `GET /api/billing`

**Authorization:** Admin roles only (admin_referring, admin_radiology)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response - Referring Organization:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "data": {
    "organizationStatus": "active",
    "organizationType": "referring_practice",
    "subscriptionTier": "tier_1",
    "currentCreditBalance": 3478,
    "stripeSubscriptionStatus": null,
    "currentPeriodEnd": null,
    "billingInterval": null,
    "cancelAtPeriodEnd": null
  }
}
```

**Success Response - Radiology Organization:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "data": {
    "organizationStatus": "active",
    "organizationType": "radiology_group",
    "subscriptionTier": null,
    "currentCreditBalance": 10000,
    "stripeSubscriptionStatus": null,
    "currentPeriodEnd": null,
    "billingInterval": null,
    "cancelAtPeriodEnd": null,
    "basicCreditBalance": 100,
    "advancedCreditBalance": 100
  }
}
```

**Response Fields:**
- `organizationStatus`: Organization status (active/inactive/suspended)
- `organizationType`: Either "referring_practice" or "radiology_group"
- `subscriptionTier`: Current subscription tier (if any)
- `currentCreditBalance`: Total credits (legacy field for compatibility)
- `basicCreditBalance`: Basic credits (radiology only)
- `advancedCreditBalance`: Advanced credits (radiology only)
- `stripeSubscriptionStatus`: Subscription status if using recurring billing
- `currentPeriodEnd`: Subscription renewal date
- `billingInterval`: "month" or "year" for subscriptions
- `cancelAtPeriodEnd`: Boolean for pending cancellations

**Error Responses:**
- **Status:** 403 Forbidden - Non-admin role
  ```json
  {
    "message": "Access denied: Insufficient permissions",
    "requiredRoles": ["admin_referring", "admin_radiology"],
    "userRole": "physician"
  }
  ```

---

### 2. Get Credit Balance

Get just the credit balance for your organization (lightweight endpoint).

**Endpoint:** `GET /api/billing/credit-balance`

**Authorization:** admin_referring only

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response - Referring Organization:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "data": {
    "organizationType": "referring_practice",
    "creditBalance": 3478
  }
}
```

**Error Responses:**
- **Status:** 403 Forbidden - Non-admin or radiology admin
  ```json
  {
    "message": "Access denied: Insufficient permissions",
    "requiredRoles": ["admin_referring"],
    "userRole": "admin_radiology"
  }
  ```

**Notes:**
- This endpoint is restricted to admin_referring only
- Radiology admins should use the billing overview endpoint instead
- Lighter weight than the full billing overview

---

### 3. Get Credit Usage History

View detailed history of credit consumption with filtering and pagination.

**Endpoint:** `GET /api/billing/credit-usage`

**Authorization:** admin_referring only

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20, max: 100)
- `sortBy` (string, optional): Sort field (default: createdAt)
- `sortOrder` (string, optional): Sort direction - 'asc' or 'desc' (default: desc)
- `actionType` (string, optional): Filter by action type
- `dateStart` (string, optional): Start date filter (ISO format)
- `dateEnd` (string, optional): End date filter (ISO format)

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "data": {
    "usageLogs": [
      {
        "id": 22,
        "userId": 4,
        "userName": "John Doe",
        "orderId": 976,
        "tokensBurned": 1,
        "actionType": "order_submitted",
        "createdAt": "2025-06-13T00:06:49.875Z"
      }
    ],
    "pagination": {
      "total": 22,
      "page": 1,
      "limit": 5,
      "pages": 5
    }
  }
}
```

**Response Fields:**
- `usageLogs`: Array of credit usage records
  - `id`: Usage record ID
  - `userId`: ID of user who triggered the action
  - `userName`: Name of the user
  - `orderId`: Associated order ID
  - `tokensBurned`: Number of credits consumed (always 1 currently)
  - `actionType`: Type of action (order_submitted, order_received, etc.)
  - `createdAt`: Timestamp of credit consumption
- `pagination`: Pagination metadata

**Action Types:**
- `order_submitted`: Credit burned when order sent to radiology
- `order_received`: Credit burned by radiology when receiving order
- `manual_adjustment`: Manual credit adjustment by admin
- `credit_purchase`: Credits added via purchase

---

### 4. Create Checkout Session

Create a Stripe checkout session for purchasing credits.

**Endpoint:** `POST /api/billing/create-checkout-session`

**Authorization:** admin_referring only

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "priceId": "price_100_credits"
}
```

**Body Parameters:**
- `priceId` (string, optional): Stripe price ID for the credit bundle

**Success Response:**
- **Status:** 200 OK
- **Body:**
```json
{
  "success": true,
  "sessionId": "cs_test_a1b2c3d4e5f6"
}
```

**Response Fields:**
- `sessionId`: Stripe checkout session ID to redirect user to payment

**Error Responses:**
- **Status:** 403 Forbidden - Radiology admin attempting to purchase
  ```json
  {
    "message": "Access denied: Insufficient permissions",
    "requiredRoles": ["admin_referring"],
    "userRole": "admin_radiology"
  }
  ```

**Notes:**
- Currently returns mock session IDs in test environment
- Production requires valid Stripe configuration
- Only referring organizations can purchase credits
- Radiology organizations get credits through manual process

---

### 5. Create Subscription (Not Implemented)

This endpoint is documented but not currently implemented.

**Endpoint:** `POST /api/billing/create-subscription`

**Status:** Returns 404 - Route not found

**Notes:**
- Subscription-based billing planned for future release
- Currently all organizations use pre-paid credits only

## Credit Consumption Flow

### When Order is Sent to Radiology

1. **Admin staff sends order** (POST /api/orders/:orderId/send-to-radiology)
2. **System checks credits**:
   - Referring org must have ≥ 1 credit
   - Radiology org must have appropriate credit type
3. **Credits deducted**:
   - 1 credit from referring organization
   - 1 credit from radiology (basic or advanced based on imaging type)
4. **Usage logged** in credit_usage_logs table

### Automatic Credit Type Detection

For radiology organizations, the system automatically determines credit type:
- **Advanced Credits**: MRI, CT, PET, Nuclear Medicine
- **Basic Credits**: All other imaging types

## Examples

### Example 1: Check Credits Before Sending Order

```javascript
// Check if organization has credits
const billingResponse = await axios.get('/api/billing', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});

if (billingResponse.data.data.currentCreditBalance < 1) {
  // Redirect to purchase credits
  const checkoutResponse = await axios.post(
    '/api/billing/create-checkout-session',
    { priceId: 'price_100_credits' },
    {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }
  );
  
  // Redirect to Stripe checkout
  window.location.href = `https://checkout.stripe.com/pay/${checkoutResponse.data.sessionId}`;
}
```

### Example 2: Display Credit Usage Report

```javascript
// Get recent credit usage
const usageResponse = await axios.get(
  '/api/billing/credit-usage?limit=10&actionType=order_submitted',
  {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }
);

// Display usage summary
const usage = usageResponse.data.data;
console.log(`Total orders sent: ${usage.pagination.total}`);
console.log(`Credits used this page: ${usage.usageLogs.length}`);

// Show recent activity
usage.usageLogs.forEach(log => {
  console.log(`${log.createdAt}: ${log.userName} sent order #${log.orderId}`);
});
```

### Example 3: Monitor Radiology Credits

```javascript
// For radiology organizations, check both credit types
const billingResponse = await axios.get('/api/billing', {
  headers: { 'Authorization': `Bearer ${radiologyAdminToken}` }
});

const credits = billingResponse.data.data;
console.log(`Basic credits: ${credits.basicCreditBalance}`);
console.log(`Advanced credits: ${credits.advancedCreditBalance}`);

// Alert if running low
if (credits.basicCreditBalance < 10 || credits.advancedCreditBalance < 10) {
  alert('Low credits! Contact RadOrderPad support.');
}
```

## Webhook Integration

RadOrderPad processes these Stripe webhook events:
- `checkout.session.completed`: Credits added after successful payment
- `invoice.payment_succeeded`: Subscription renewal processed
- `invoice.payment_failed`: Subscription payment failure handling
- `customer.subscription.updated`: Subscription changes
- `customer.subscription.deleted`: Subscription cancellation

## Security Considerations

1. **Role-Based Access**: 
   - Only admins can view billing information
   - Only referring admins can purchase credits
   - Regular users have no access to billing

2. **Organization Isolation**: 
   - Each organization only sees their own billing data
   - Credit usage history filtered by organization

3. **Audit Trail**: 
   - All credit consumption logged with user information
   - Webhook events logged for payment tracking

## Related Endpoints

- **Send to Radiology**: `/api/orders/:orderId/send-to-radiology` - Triggers credit consumption
- **Organization Profile**: `/api/organizations/mine` - Includes credit balance in response
- **Order Management**: Orders can only be sent if sufficient credits available