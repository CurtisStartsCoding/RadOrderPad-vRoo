# Subscription Management

This guide covers the subscription management system for the RadOrderPad API, which allows organizations to subscribe to various service tiers with different features and capabilities.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Subscription System Overview

The subscription system consists of these components:

1. Subscription Plans: Different service tiers with varying features and pricing
2. Billing Cycles: Monthly or annual billing options
3. Payment Methods: Credit cards and other payment options
4. Invoices: Records of subscription charges and payments
5. Feature Access: Controls which features are available based on subscription tier

## Retrieving Subscription Information

### Get Current Subscription

Retrieve your organization's current subscription details:

```javascript
const getCurrentSubscription = async (token) => {
  try {
    const response = await fetch('/api/billing/subscription', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    throw error;
  }
};
```

The response will include:
- `planId`: The ID of the current subscription plan
- `planName`: The name of the current subscription plan
- `status`: Subscription status (active, past_due, canceled, etc.)
- `currentPeriodStart`: Start date of the current billing period
- `currentPeriodEnd`: End date of the current billing period
- `cancelAtPeriodEnd`: Whether the subscription will cancel at the end of the period
- `trialEnd`: End date of the trial period (if applicable)
- `features`: Array of features included in the subscription
- `creditAllowance`: Monthly credit allowance (if applicable)
- `billingCycle`: Billing frequency (monthly, annual)
- `price`: Subscription price per billing cycle
- `currency`: Currency code (e.g., USD)

### Get Available Subscription Plans

Retrieve available subscription plans:

```javascript
const getSubscriptionPlans = async (token) => {
  try {
    const response = await fetch('/api/billing/subscription/plans', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve subscription plans:', error);
    throw error;
  }
};
```

The response will include an array of subscription plans, each with:
- `id`: Plan ID
- `name`: Plan name
- `description`: Plan description
- `features`: Array of features included
- `creditAllowance`: Monthly credit allowance (if applicable)
- `pricing`: Pricing options
  - `monthly`: Monthly pricing information
    - `price`: Price in cents
    - `currency`: Currency code
  - `annual`: Annual pricing information
    - `price`: Price in cents
    - `currency`: Currency code
    - `savingsPercentage`: Percentage saved compared to monthly billing
- `isPopular`: Whether this is a popular plan
- `isEnterprise`: Whether this is an enterprise plan requiring custom pricing

### Get Subscription Invoice History

Retrieve your organization's subscription invoice history:

```javascript
const getInvoiceHistory = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/billing/subscription/invoices?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve invoice history:', error);
    throw error;
  }
};
```

The response will include:
- `invoices`: Array of invoice records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of invoices
  - `itemsPerPage`: Number of invoices per page

Each invoice record includes:
- `id`: Invoice ID
- `number`: Invoice number
- `date`: Invoice date
- `dueDate`: Payment due date
- `amount`: Invoice amount in cents
- `currency`: Currency code
- `status`: Payment status (paid, unpaid, void)
- `description`: Invoice description
- `pdfUrl`: URL to download the invoice PDF
- `items`: Array of line items
  - `description`: Item description
  - `quantity`: Item quantity
  - `unitPrice`: Unit price in cents
  - `amount`: Total item amount in cents

## Managing Subscriptions

### Subscribe to a Plan

Subscribe to a new plan:

```javascript
const subscribeToPlan = async (token, planId, billingCycle, paymentMethodId) => {
  try {
    const response = await fetch('/api/billing/subscription/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId,
        billingCycle,
        paymentMethodId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to subscribe to plan:', error);
    throw error;
  }
};
```

The response will include:
- `subscriptionId`: The ID of the new subscription
- `status`: Subscription status
- `currentPeriodEnd`: End date of the current billing period
- `invoiceUrl`: URL to the initial invoice

### Change Subscription Plan

Change to a different subscription plan:

```javascript
const changeSubscriptionPlan = async (token, newPlanId, billingCycle) => {
  try {
    const response = await fetch('/api/billing/subscription/change-plan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newPlanId,
        billingCycle
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to change subscription plan:', error);
    throw error;
  }
};
```

The response will include:
- `subscriptionId`: The ID of the updated subscription
- `status`: Subscription status
- `currentPeriodEnd`: End date of the current billing period
- `prorationDate`: Date used for proration calculations
- `invoiceUrl`: URL to the proration invoice (if applicable)
- `immediateChange`: Whether the change was applied immediately

### Cancel Subscription

Cancel the current subscription:

```javascript
const cancelSubscription = async (token, cancelImmediately = false) => {
  try {
    const response = await fetch('/api/billing/subscription/cancel', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cancelImmediately
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
};
```

The response will include:
- `subscriptionId`: The ID of the canceled subscription
- `status`: Updated subscription status
- `canceledAt`: Timestamp of the cancellation
- `endDate`: Date when access will end
- `refundAmount`: Refund amount (if applicable)
- `refundCurrency`: Refund currency code

### Reactivate Canceled Subscription

Reactivate a previously canceled subscription:

```javascript
const reactivateSubscription = async (token) => {
  try {
    const response = await fetch('/api/billing/subscription/reactivate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to reactivate subscription:', error);
    throw error;
  }
};
```

## Managing Payment Methods

### Get Payment Methods

Retrieve saved payment methods:

```javascript
const getPaymentMethods = async (token) => {
  try {
    const response = await fetch('/api/billing/payment-methods', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to retrieve payment methods:', error);
    throw error;
  }
};
```

The response will include an array of payment methods, each with:
- `id`: Payment method ID
- `type`: Payment method type (card, bank_account)
- `isDefault`: Whether this is the default payment method
- `details`: Payment method details
  - For cards:
    - `brand`: Card brand (visa, mastercard, etc.)
    - `last4`: Last 4 digits of the card
    - `expiryMonth`: Expiration month
    - `expiryYear`: Expiration year
  - For bank accounts:
    - `bankName`: Bank name
    - `last4`: Last 4 digits of the account
    - `accountType`: Account type (checking, savings)

### Add Payment Method

Add a new payment method:

```javascript
const addPaymentMethod = async (token, paymentMethodToken, setAsDefault = false) => {
  try {
    const response = await fetch('/api/billing/payment-methods', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentMethodToken,
        setAsDefault
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to add payment method:', error);
    throw error;
  }
};
```

### Update Default Payment Method

Set a payment method as the default:

```javascript
const setDefaultPaymentMethod = async (token, paymentMethodId) => {
  try {
    const response = await fetch(`/api/billing/payment-methods/${paymentMethodId}/default`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to set default payment method:', error);
    throw error;
  }
};
```

### Remove Payment Method

Remove a payment method:

```javascript
const removePaymentMethod = async (token, paymentMethodId) => {
  try {
    const response = await fetch(`/api/billing/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to remove payment method:', error);
    throw error;
  }
};
```

## Error Handling

When working with subscription management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 402 Payment Required: Payment method declined
- 409 Conflict: Subscription already exists
- 422 Unprocessable Entity: Invalid subscription change

## Best Practices

1. Display clear subscription information to users
2. Implement a subscription comparison table
3. Provide a smooth upgrade/downgrade experience
4. Send notifications before subscription renewals
5. Implement proper error handling for payment failures
6. Offer annual billing options for cost savings
7. Provide clear cancellation and reactivation options
8. Maintain a subscription history for auditing
9. Implement secure payment method handling
10. Consider offering trial periods for new subscriptions