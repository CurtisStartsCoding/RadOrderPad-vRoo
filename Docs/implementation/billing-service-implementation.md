# Billing Service Implementation

**Date:** 2025-04-13
**Author:** Roo
**Status:** Complete

## Overview

This document details the implementation of the BillingService, which is responsible for managing credit consumption and handling billing-related operations in the RadOrderPad application. The implementation follows the requirements specified in the `billing_credits.md` documentation.

## Components Implemented

### 1. Credit Consumption

- Implemented the `burnCredit` method to decrement an organization's credit balance
- Created a database transaction to ensure atomicity of operations
- Added proper error handling for insufficient credits
- Implemented logging of credit usage in the `credit_usage_logs` table

### 2. Custom Error Handling

- Created a custom `InsufficientCreditsError` class for clear error identification
- Updated the validation flow to catch and handle this error
- Added HTTP 402 Payment Required response for insufficient credits

### 3. Stripe Integration

- Integrated with the Stripe API for payment processing
- Implemented customer creation during organization registration
- Added webhook handling for payment events

### 4. Test Mode

- Implemented a test mode feature that allows automated tests to run without actually consuming credits
- Added configuration options in `config.ts` for controlling test mode
- Added detailed logging of test mode operations

## Implementation Details

### Credit Consumption Logic

The core of the credit consumption implementation is the `burnCredit` method:

```typescript
static async burnCredit(
  organizationId: number, 
  userId: number, 
  orderId: number, 
  actionType: 'validate' | 'clarify' | 'override_validate'
): Promise<boolean> {
  // Check if billing test mode is enabled
  if (config.testMode.billing) {
    console.log(`[TEST MODE] Credit burn skipped for organization ${organizationId}, action: ${actionType}`);
    return true;
  }
  
  // Get a client for transaction
  const client = await getMainDbClient();
  
  try {
    // Start transaction
    await client.query('BEGIN');
    
    // 1. Decrement the organization's credit balance
    const updateResult = await client.query(
      `UPDATE organizations 
       SET credit_balance = credit_balance - 1 
       WHERE id = $1 AND credit_balance > 0 
       RETURNING credit_balance`,
      [organizationId]
    );
    
    // Check if the update was successful
    if (updateResult.rowCount === 0) {
      // No rows updated means the organization had insufficient credits
      await client.query('ROLLBACK');
      throw new InsufficientCreditsError(`Organization ${organizationId} has insufficient credits`);
    }
    
    // Get the new credit balance
    const newBalance = updateResult.rows[0].credit_balance;
    
    // 2. Log the credit usage
    await client.query(
      `INSERT INTO credit_usage_logs (
        organization_id, user_id, order_id, action_type, credits_used, balance_after
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [organizationId, userId, orderId, actionType, 1, newBalance]
    );
    
    // Commit the transaction
    await client.query('COMMIT');
    
    return true;
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    
    // Re-throw the error
    throw error;
  } finally {
    // Release the client back to the pool
    client.release();
  }
}
```

### Custom Error Class

A custom error class was created to clearly identify insufficient credits errors:

```typescript
export class InsufficientCreditsError extends Error {
  constructor(message: string = 'Insufficient credits available') {
    super(message);
    this.name = 'InsufficientCreditsError';
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}
```

### Test Mode Implementation

The BillingService includes a test mode feature that allows automated tests to run without actually consuming credits:

```typescript
// Check if billing test mode is enabled
if (config.testMode.billing) {
  console.log(`[TEST MODE] Credit burn skipped for organization ${organizationId}, action: ${actionType}`);
  return true;
}
```

This test mode is controlled by the `BILLING_TEST_MODE` environment variable, which is set to `true` in the `.env` file for development and testing environments.

When test mode is enabled, the service logs the credit consumption details but doesn't actually decrement the credit balance, allowing tests to run without requiring a specific database state.

## Error Handling

The implementation includes comprehensive error handling:

1. **Transaction Management**: All database operations are wrapped in transactions to ensure atomicity
2. **Custom Error Types**: Custom error classes for specific error conditions
3. **Error Propagation**: Errors are thrown to allow calling code to handle them appropriately
4. **Rollback on Error**: Transactions are rolled back on error to prevent partial updates

## Future Enhancements

1. **Credit Bundle Management**: Add support for purchasing credit bundles
2. **Subscription Management**: Implement subscription tier management
3. **Usage Analytics**: Add reporting and analytics for credit usage
4. **Automated Replenishment**: Implement automatic credit replenishment at billing cycle boundaries
5. **Low Credit Alerts**: Add notifications for low credit balances
6. **Credit Usage History**: Implement a UI for viewing credit usage history
7. **Credit Allocation**: Allow organizations to allocate credits to specific departments or users

## Related Documentation

- [Billing Credits Requirements](../../Docs/billing_credits.md)
- [Test Mode Implementation](./test-mode-implementation.md)
- [Stripe Integration Documentation](https://stripe.com/docs/api)