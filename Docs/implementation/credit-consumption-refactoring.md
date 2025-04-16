# Credit Consumption Refactoring

**Version:** 1.0
**Date:** 2025-04-14
**Author:** RadOrderPad Development Team

This document outlines the implementation details for refactoring the credit consumption system in RadOrderPad, moving from validation-based credit consumption to order submission-based credit consumption.

---

## 1. Overview

### 1.1 Previous Implementation

In the previous implementation, credits were consumed at the validation stage:
- Each time a physician submitted a dictation for validation via `/api/orders/validate`
- Each time a physician submitted a clarification for validation
- Each time a physician submitted an override validation

This approach had several drawbacks:
- Physicians were charged for validation attempts even if they never submitted the order
- Multiple validation attempts for a single order consumed multiple credits
- Validation attempts for testing or training purposes consumed credits

### 1.2 New Implementation

In the new implementation, credits are consumed only when an order is actually sent to radiology:
- Credits are consumed only once per order, at the time of submission to radiology
- Validation attempts are free, allowing physicians to refine their orders without cost
- Credits are consumed by the admin staff when they send the finalized order to radiology via `/api/admin/orders/{orderId}/send-to-radiology`

This approach offers several benefits:
- Better alignment with the business value (completed orders)
- Improved user experience for physicians (no cost for validation attempts)
- Simplified billing model (one credit per completed order)
- Encourages proper use of the validation system for order refinement

## 2. Implementation Details

### 2.1 Modified Files

#### TypeScript Service Files
- `src/services/billing/types.ts`: Updated `CreditActionType` to remove validation-related actions and add `'order_submitted'`
- `src/services/billing/credit/burn-credit.ts`: Updated documentation to reflect new credit consumption model
- `src/services/order/validation/handler.ts`: Removed credit consumption logic from validation handler
- `src/services/order/admin/handlers/send-to-radiology.ts`: Added credit consumption logic to send-to-radiology handler

#### Documentation Files
- `docs/credit_usage_tracking.md`: Updated to reflect new credit consumption model
- `docs/billing_credits.md`: Updated to reflect new credit consumption model
- `docs/admin_finalization.md`: Updated to include credit check and consumption steps
- `docs/api_endpoints.md`: Updated endpoint descriptions to reflect credit consumption changes
- `docs/api_schema_map.md`: Updated database interactions to reflect credit consumption changes
- `docs/physician_order_flow.md`: Updated to remove credit consumption from validation flow
- `docs/purgatory_mode.md`: Updated to reflect changes in service interruption conditions

#### Test Files
- `tests/batch/test-admin-send-to-radiology.js`: New test script for testing credit consumption during order submission
- `tests/batch/run-admin-send-to-radiology-tests.bat`: Windows batch script for running the tests
- `tests/batch/run-admin-send-to-radiology-tests.sh`: Unix/Mac shell script for running the tests

### 2.2 Key Changes

1. **Validation Handler**:
   - Removed credit consumption logic from the validation handler
   - Validation attempts are now logged but do not consume credits

2. **Send-to-Radiology Handler**:
   - Added credit balance check before sending order to radiology
   - Added credit consumption logic after successful status update
   - Returns 402 Payment Required error if insufficient credits

3. **Credit Usage Tracking**:
   - Updated credit usage logging to track 'order_submitted' action type
   - Credit usage logs now associate with the admin staff user who submitted the order

4. **Testing**:
   - Created comprehensive tests for both successful and failed credit consumption scenarios
   - Tests verify that credits are consumed only when orders are sent to radiology
   - Tests verify that orders cannot be sent to radiology with insufficient credits

## 3. Testing Strategy

The implementation includes a comprehensive testing strategy:

1. **Unit Tests**:
   - Test credit consumption during order submission
   - Test credit balance check before order submission
   - Test error handling for insufficient credits

2. **Integration Tests**:
   - Test the end-to-end flow from validation to order submission
   - Verify credit balance updates correctly in the database
   - Verify credit usage logs are created correctly

3. **Manual Testing**:
   - Verify UI feedback for insufficient credits
   - Verify admin dashboard shows correct credit balance
   - Verify credit usage reports show correct consumption data

## 4. Deployment Considerations

When deploying this change, consider the following:

1. **Database Migration**:
   - No schema changes are required, but existing credit usage logs will have different action types going forward

2. **User Communication**:
   - Inform users about the change in credit consumption model
   - Highlight the benefits (free validation attempts, simplified billing)
   - Update user documentation and training materials

3. **Monitoring**:
   - Monitor credit consumption patterns after deployment
   - Watch for any unexpected changes in validation behavior
   - Monitor for any issues with credit balance updates

## 5. Future Enhancements

Potential future enhancements to the credit consumption system:

1. **Credit Usage Analytics**:
   - Provide more detailed analytics on credit usage patterns
   - Track validation attempts vs. submitted orders ratio

2. **Tiered Pricing**:
   - Implement tiered pricing based on order complexity or modality
   - Different credit costs for different types of orders

3. **Credit Expiration**:
   - Implement credit expiration policies
   - Track and notify users of expiring credits

---

## References

- `credit_usage_tracking.md`: Details on credit usage tracking
- `billing_credits.md`: Details on the billing and credit system
- `admin_finalization.md`: Details on the admin finalization workflow
- `physician_order_flow.md`: Details on the physician order workflow