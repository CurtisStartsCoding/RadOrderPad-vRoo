# Implementation Summary: Radiology Order Usage Reporting

**Date:** 2025-04-21

## Overview

Implemented a new system for reporting Radiology Group order usage to Stripe for billing purposes. This implementation enables the automatic tracking, categorization, and billing of orders received by Radiology Groups, following the pay-per-order model outlined in the billing documentation.

## Key Components

1. **Usage Reporting Service**
   - Created `src/services/billing/usage/reportUsage.ts` with the main function `reportRadiologyOrderUsage`
   - Implemented order categorization logic (standard vs. advanced imaging)
   - Added Stripe invoice item creation for billing

2. **BillingService Integration**
   - Updated `src/services/billing/index.ts` to expose the usage reporting functionality
   - Added a method to the BillingService class for easy access

3. **Test Scripts**
   - Created `scripts/billing/test-billing-usage-reporting.js` for testing the functionality
   - Added batch and shell scripts for Windows and Unix-like systems
   - Implemented test data insertion capability for comprehensive testing

4. **Documentation**
   - Created `DOCS/implementation/radiology-usage-reporting.md` with detailed implementation documentation
   - Updated `DOCS/billing_credits.md` to include information about the new functionality

## Implementation Details

### Database Interactions

The implementation interacts with both databases:

- **PHI Database**: Queries orders and order history to determine which orders were sent to radiology within a date range
- **Main Database**: Retrieves Stripe billing IDs and records billing events

### Stripe Integration

- Uses the existing Stripe service for API access
- Creates invoice items for standard and advanced imaging orders
- Includes detailed metadata with each invoice item for tracking and reporting

### Error Handling

- Comprehensive error handling for database queries and Stripe API calls
- Transaction management for database operations
- Detailed logging for troubleshooting

## Deployment Considerations

In a production environment, this functionality should be triggered by:

1. A scheduled job (e.g., AWS EventBridge Scheduler) to run monthly
2. A Super Admin action for manual triggering when needed

## Files Created/Modified

### Created:
- `src/services/billing/usage/reportUsage.ts`
- `src/services/billing/usage/index.ts`
- `scripts/billing/test-billing-usage-reporting.js`
- `scripts/billing/test-billing-usage-reporting.bat`
- `scripts/billing/test-billing-usage-reporting.sh`
- `DOCS/implementation/radiology-usage-reporting.md`

### Modified:
- `src/services/billing/stripe/stripe.service.ts` (added getStripeInstance method)
- `src/services/billing/index.ts` (added reportRadiologyOrderUsage method and export)
- `DOCS/billing_credits.md` (updated with usage reporting information)

## Testing

The implementation includes a comprehensive test script that:

1. Optionally inserts test data (orders for a test radiology organization)
2. Calls the reportRadiologyOrderUsage function with a specified date range
3. Displays detailed results including success/failure status and amounts

To verify the implementation, check the Stripe Test Dashboard to confirm that invoice items were created correctly.

## Future Enhancements

1. **Real-Time Usage Monitoring**: Implement real-time tracking of radiology order usage for super admin dashboard visibility. See [Radiology Usage Real-Time Monitoring](./radiology-usage-real-time-monitoring.md) for detailed design.
2. Automated invoice creation after adding invoice items
3. Email notifications to Radiology Group admins
4. Detailed reporting of billed orders
5. Custom pricing for different Radiology Groups
6. Batch processing for large order volumes

## Related Documentation

- [Billing Credits](../billing_credits.md)
- [Radiology Usage Reporting](./radiology-usage-reporting.md)
- [Stripe Integration Setup](./stripe-integration-setup.md)