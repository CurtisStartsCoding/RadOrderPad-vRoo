# Credit Management

This guide covers the credit management system for the RadOrderPad API, which allows organizations to purchase, track, and use credits for validation services.

## Prerequisites

- You must have an administrator role
- Your organization must be active
- You must have a valid JWT token

## Credit System Overview

The credit system consists of these components:

1. Credit Packages: Pre-defined bundles of credits available for purchase
2. Credit Transactions: Records of credit purchases, usage, and adjustments
3. Credit Balance: The current available credits for an organization
4. Usage Tracking: System for tracking credit consumption by validation requests

## Retrieving Credit Information

### Get Current Credit Balance

Retrieve your organization's current credit balance:

```javascript
const getCreditBalance = async (token) => {
  try {
    const response = await fetch('/api/billing/credits/balance', {
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
    console.error('Failed to retrieve credit balance:', error);
    throw error;
  }
};
```

The response will include:
- `balance`: The current credit balance
- `lastUpdated`: Timestamp of the last balance update
- `autoReloadEnabled`: Whether automatic credit reload is enabled
- `autoReloadThreshold`: The threshold for automatic reload
- `autoReloadAmount`: The amount to reload automatically

### Get Credit Transaction History

Retrieve your organization's credit transaction history:

```javascript
const getCreditTransactions = async (token, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/billing/credits/transactions?page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve credit transactions:', error);
    throw error;
  }
};
```

The response will include:
- `transactions`: Array of transaction records
- `pagination`: Pagination information
  - `currentPage`: Current page number
  - `totalPages`: Total number of pages
  - `totalItems`: Total number of transactions
  - `itemsPerPage`: Number of transactions per page

Each transaction record includes:
- `id`: Transaction ID
- `type`: Transaction type (purchase, usage, adjustment, refund)
- `amount`: Credit amount (positive for additions, negative for deductions)
- `description`: Transaction description
- `createdAt`: Transaction timestamp
- `reference`: Reference information (e.g., order ID, payment ID)

### Get Available Credit Packages

Retrieve available credit packages for purchase:

```javascript
const getCreditPackages = async (token) => {
  try {
    const response = await fetch('/api/billing/credits/packages', {
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
    console.error('Failed to retrieve credit packages:', error);
    throw error;
  }
};
```

The response will include an array of credit packages, each with:
- `id`: Package ID
- `name`: Package name
- `description`: Package description
- `credits`: Number of credits included
- `price`: Package price in cents
- `currency`: Currency code (e.g., USD)
- `discountPercentage`: Discount percentage if applicable
- `isPopular`: Whether this is a popular package

## Purchasing Credits

### Purchase Credits Using a Credit Package

Purchase credits using a pre-defined credit package:

```javascript
const purchaseCredits = async (token, packageId, paymentMethodId) => {
  try {
    const response = await fetch('/api/billing/credits/purchase', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        packageId,
        paymentMethodId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to purchase credits:', error);
    throw error;
  }
};
```

The response will include:
- `transactionId`: The ID of the credit transaction
- `newBalance`: The updated credit balance
- `receipt`: Receipt information
  - `receiptUrl`: URL to the receipt
  - `receiptNumber`: Receipt number
  - `receiptDate`: Receipt date

### Purchase Custom Credit Amount

Purchase a custom amount of credits:

```javascript
const purchaseCustomCredits = async (token, creditAmount, paymentMethodId) => {
  try {
    const response = await fetch('/api/billing/credits/purchase-custom', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        creditAmount,
        paymentMethodId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to purchase custom credits:', error);
    throw error;
  }
};
```

## Managing Auto-Reload Settings

### Enable Auto-Reload

Enable automatic credit reload when balance falls below a threshold:

```javascript
const enableAutoReload = async (token, threshold, reloadAmount, paymentMethodId) => {
  try {
    const response = await fetch('/api/billing/credits/auto-reload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        enabled: true,
        threshold,
        reloadAmount,
        paymentMethodId
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to enable auto-reload:', error);
    throw error;
  }
};
```

### Disable Auto-Reload

Disable automatic credit reload:

```javascript
const disableAutoReload = async (token) => {
  try {
    const response = await fetch('/api/billing/credits/auto-reload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        enabled: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to disable auto-reload:', error);
    throw error;
  }
};
```

## Credit Usage Monitoring

### Get Credit Usage Report

Retrieve a report of credit usage over time:

```javascript
const getCreditUsageReport = async (token, startDate, endDate, interval = 'day') => {
  try {
    const response = await fetch(`/api/billing/credits/usage-report?startDate=${startDate}&endDate=${endDate}&interval=${interval}`, {
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
    console.error('Failed to retrieve credit usage report:', error);
    throw error;
  }
};
```

The response will include:
- `totalUsage`: Total credits used in the period
- `intervals`: Array of usage data points
  - `date`: Interval date
  - `usage`: Credits used in this interval
  - `orders`: Number of orders processed

### Get Usage Breakdown by User

Retrieve credit usage breakdown by user:

```javascript
const getUserCreditUsage = async (token, startDate, endDate, page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/billing/credits/user-usage?startDate=${startDate}&endDate=${endDate}&page=${page}&limit=${limit}`, {
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
    console.error('Failed to retrieve user credit usage:', error);
    throw error;
  }
};
```

## Error Handling

When working with credit management endpoints, be prepared to handle these common errors:

- 400 Bad Request: Invalid input (e.g., negative credit amount)
- 401 Unauthorized: Missing or invalid authentication token
- 403 Forbidden: Insufficient permissions (non-admin role)
- 402 Payment Required: Payment method declined
- 409 Conflict: Duplicate transaction
- 422 Unprocessable Entity: Insufficient credits for operation

## Best Practices

1. Implement a credit balance display in your application
2. Set up alerts for low credit balance
3. Enable auto-reload for uninterrupted service
4. Regularly review credit usage reports
5. Implement proper error handling for payment failures
6. Consider bulk credit purchases for better pricing
7. Monitor user-specific credit usage for accountability
8. Maintain a credit usage history for auditing