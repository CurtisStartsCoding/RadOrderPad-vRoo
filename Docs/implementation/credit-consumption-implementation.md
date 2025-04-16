# Credit Consumption Implementation

**Date:** 2025-04-13

This document details the implementation of the credit consumption system for RadOrderPad, which tracks and manages validation credits for referring physician groups.

## Overview

The credit consumption system is responsible for:

1. Decrementing an organization's credit balance when a validation action is performed
2. Logging credit usage in the `credit_usage_logs` table
3. Preventing validation when an organization has insufficient credits
4. Providing appropriate error messages to users when credits are depleted

## Implementation Details

### 1. BillingService

The core of the implementation is in the `src/services/billing.service.ts` file, which provides the following functionality:

#### Custom Error Class

```typescript
export class InsufficientCreditsError extends Error {
  constructor(message: string = 'Insufficient credits available') {
    super(message);
    this.name = 'InsufficientCreditsError';
    Object.setPrototypeOf(this, InsufficientCreditsError.prototype);
  }
}
```

This custom error class allows for specific handling of insufficient credit scenarios throughout the application.

#### Credit Consumption Logic

The `burnCredit` method handles the core credit consumption logic:

```typescript
static async burnCredit(
  organizationId: number, 
  userId: number, 
  orderId: number, 
  actionType: 'validate' | 'clarify' | 'override_validate'
): Promise<boolean> {
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
    
    // Double-check that the balance is not negative
    if (newBalance < 0) {
      await client.query('ROLLBACK');
      throw new InsufficientCreditsError(`Organization ${organizationId} has a negative credit balance`);
    }
    
    // 2. Log the credit usage
    await client.query(
      `INSERT INTO credit_usage_logs 
       (organization_id, user_id, order_id, tokens_burned, action_type) 
       VALUES ($1, $2, $3, $4, $5)`,
      [organizationId, userId, orderId, 1, actionType]
    );
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Log the action (for development purposes)
    console.log(`[BillingService] Burning credit for organization ${organizationId}, user ${userId}, order ${orderId}, action ${actionType}`);
    console.log(`[BillingService] New credit balance: ${newBalance}`);
    
    return true;
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    
    // Re-throw InsufficientCreditsError, but wrap other errors
    if (error instanceof InsufficientCreditsError) {
      throw error;
    } else {
      console.error('Error in burnCredit:', error);
      throw new Error(`Failed to burn credit: ${error instanceof Error ? error.message : String(error)}`);
    }
  } finally {
    // Release client back to pool
    client.release();
  }
}
```

Key aspects of this implementation:

- Uses a database transaction to ensure atomicity
- Checks for sufficient credits before deducting
- Logs credit usage in the `credit_usage_logs` table
- Handles errors appropriately with transaction rollback

### 2. Integration with Validation Flow

The credit consumption is integrated into the validation flow in `src/services/order/validation-request.ts`:

```typescript
// Log credit usage
const actionType = isOverrideValidation ? 'override_validate' : 'validate';
try {
  await BillingService.burnCredit(orgId, userId, orderIdToUse, actionType);
  
  return {
    success: true,
    orderId: orderIdToUse,
    validationResult
  };
} catch (error) {
  // Handle insufficient credits error
  if (error instanceof InsufficientCreditsError) {
    console.warn(`Insufficient credits for organization ${orgId}: ${error.message}`);
    throw {
      status: 402, // Payment Required
      message: 'Insufficient validation credits. Please contact your administrator to purchase more credits.',
      code: 'INSUFFICIENT_CREDITS',
      orderId: orderIdToUse
    };
  }
  
  // Re-throw other errors
  throw error;
}
```

This code:
- Calls the `burnCredit` method after successful validation
- Catches `InsufficientCreditsError` and transforms it into a user-friendly error object
- Includes HTTP status code 402 (Payment Required) for proper API response

### 3. Controller Error Handling

The controller (`src/controllers/order-validation.controller.ts`) handles the custom error object:

```typescript
// Handle custom error object with status
if (error && typeof error === 'object' && 'status' in error) {
  const customError = error as { status: number; message: string; code?: string; orderId?: number };
  res.status(customError.status).json({
    message: customError.message,
    code: customError.code,
    orderId: customError.orderId
  });
} else if (error instanceof Error) {
  res.status(500).json({ message: error.message });
} else {
  res.status(500).json({ message: 'An unexpected error occurred' });
}
```

This ensures that the appropriate HTTP status code and error message are returned to the client.

## Database Schema

The implementation uses the following database tables:

1. `organizations` - Contains the `credit_balance` column that tracks available credits
2. `credit_usage_logs` - Records each credit consumption event

## Testing

To test the credit consumption system:

1. Set an organization's credit balance to a known value:
   ```sql
   UPDATE organizations SET credit_balance = 5 WHERE id = 1;
   ```

2. Perform validation requests and verify that:
   - Credits are decremented correctly
   - Usage is logged in `credit_usage_logs`
   - When credits reach 0, a 402 error is returned

3. Verify transaction integrity by intentionally causing errors during the process

## Future Enhancements

Potential future enhancements to the credit system:

1. Implement credit top-up functionality via Stripe integration
2. Add admin UI for managing credit balances
3. Implement credit usage reporting and analytics
4. Add email notifications for low credit balances
5. Implement different credit costs for different validation types

## Conclusion

This implementation provides a robust credit consumption system that accurately tracks and manages validation credits for referring physician groups. It ensures that organizations cannot perform validations without sufficient credits and provides clear error messages when credits are depleted.