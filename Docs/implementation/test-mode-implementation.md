# Test Mode Implementation for Services

**Date:** 2025-04-13
**Author:** Roo
**Status:** Complete

## Overview

This document details the implementation of test modes for the NotificationService and BillingService. These test modes allow automated tests to run without requiring actual AWS SES email sending or credit deductions, making the tests more reliable and independent of external services.

## Components Implemented

### 1. Configuration Updates

- Updated `src/config/config.ts` to include test mode configuration:
  ```typescript
  // Test mode configuration
  testMode: {
    email: process.env.EMAIL_TEST_MODE === 'true' || false,
    billing: process.env.BILLING_TEST_MODE === 'true' || false
  }
  ```
- Added environment variables to `.env` file:
  ```
  EMAIL_TEST_MODE=true
  BILLING_TEST_MODE=true
  ```

### 2. NotificationService Test Mode

The NotificationService was updated to check for test mode before attempting to send emails:

```typescript
private async sendEmail(
  to: string,
  subject: string,
  textBody: string,
  htmlBody?: string
): Promise<void> {
  try {
    // Log the test mode configuration
    console.log(`[NOTIFICATION] Email test mode is: ${config.aws.ses.testMode ? 'ENABLED' : 'DISABLED'}`);
    
    // Check if test mode is enabled
    if (config.aws.ses.testMode) {
      // In test mode, just log the email details and return successfully
      console.log(`[TEST MODE] Email send skipped for recipient: ${to}, subject: ${subject}`);
      console.log(`[TEST MODE] Email body would have been: ${textBody.substring(0, 100)}...`);
      return;
    }
    
    // Regular email sending logic...
  }
}
```

### 3. BillingService Test Mode

The BillingService was updated to check for test mode before attempting to burn credits:

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
  
  // Regular credit burning logic...
}
```

## Implementation Details

### Test Mode Detection

Both services use a similar pattern for detecting test mode:

1. Check the configuration value from `config.ts`
2. If test mode is enabled, log the action that would have been taken
3. Return a successful result without performing the actual operation
4. If test mode is disabled, proceed with the normal operation

### Logging

Test mode operations are logged with a `[TEST MODE]` prefix to clearly indicate that they are running in test mode. This helps with debugging and understanding test behavior.

## Benefits

1. **Reliable Testing**: Tests can run without depending on external services like AWS SES or database state
2. **Faster Tests**: No need to wait for actual email sending or database transactions
3. **Cost Savings**: No AWS SES usage during testing
4. **Isolation**: Tests don't affect production data or services
5. **Predictable Results**: Tests produce consistent results regardless of external factors

## Usage

To enable test mode, set the appropriate environment variables:

```
EMAIL_TEST_MODE=true
BILLING_TEST_MODE=true
```

These can be set in the `.env` file for local development or in the CI/CD pipeline for automated testing.

## Test Results

With test mode enabled, the automated tests now show:

- `[TEST MODE] Email send skipped for recipient: admin@testradiology.com, subject: New Connection Request from Test Organization`
- `[TEST MODE] Credit burn skipped for organization 1, action: validate`

All tests are now passing, including:
- Connection Management Tests
- Validation Tests
- Upload Tests
- Order Finalization Tests
- Admin Finalization Tests
- Location Management Tests
- Radiology Workflow Tests

## Future Enhancements

1. **Expanded Test Modes**: Add test modes for other services like AWS S3 for file uploads
2. **Test Data Capture**: Capture test mode operations for later verification
3. **Configurable Test Behavior**: Allow configuration of test mode behavior (e.g., simulate failures)
4. **Test Mode API**: Add an API endpoint to check if test mode is enabled
5. **Test Mode UI**: Add UI indicators when running in test mode

## Related Documentation

- [Notification Service Implementation](./notification-service-implementation.md)
- [Billing Credits Documentation](../Docs/billing_credits.md)