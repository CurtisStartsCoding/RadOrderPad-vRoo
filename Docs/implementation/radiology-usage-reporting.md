# Radiology Order Usage Reporting Implementation

**Version:** 1.0
**Date:** 2025-04-21

This document details the implementation of the Radiology Order Usage Reporting functionality, which enables the system to report order usage to Stripe for billing Radiology Groups based on the number and type of orders they receive.

## Overview

Radiology Groups are billed on a pay-per-order model, with different rates for standard imaging (e.g., X-Ray, Ultrasound) and advanced imaging (e.g., MRI, CT, PET). This implementation provides a mechanism to:

1. Query the orders database to count orders received by each Radiology Group within a specified date range
2. Categorize orders as standard or advanced imaging based on modality or CPT code
3. Create Stripe invoice items for billing purposes
4. Log billing events in the database

## Implementation Details

### Core Components

1. **Usage Reporting Service**: `src/services/billing/usage/reportUsage.ts`
   - Main function: `reportRadiologyOrderUsage(startDate: Date, endDate: Date)`
   - Helper functions for querying orders, categorizing them, and creating Stripe invoice items

2. **BillingService Integration**: `src/services/billing/index.ts`
   - Added `reportRadiologyOrderUsage` method to the BillingService class
   - Exported the function for use in other modules

3. **Test Scripts**: `scripts/billing/test-billing-usage-reporting.js`
   - Test script for verifying the functionality
   - Includes options for inserting test data and specifying date ranges

### Database Queries

The implementation queries two databases:

1. **PHI Database** (`radorder_phi`):
   - Queries the `orders` table to find orders with status 'pending_radiology' or later
   - Uses the `order_history` table to determine when orders were sent to radiology
   - Extracts modality and CPT code information for categorization

2. **Main Database** (`radorder_main`):
   - Retrieves Stripe billing IDs for Radiology Groups
   - Records billing events

### Order Categorization

Orders are categorized as standard or advanced imaging based on:

1. **Modality**: If the modality contains 'MRI', 'CT', 'PET', or 'NUCLEAR', it's considered advanced imaging
2. **CPT Code**: If the modality is not available, certain CPT code ranges are used to identify advanced imaging

### Stripe Integration

The implementation uses the Stripe API to:

1. Create invoice items for each category of orders (standard and advanced)
2. Include detailed metadata with each invoice item (organization ID, order count, period)
3. Use the existing Stripe service for API access

### Error Handling and Logging

The implementation includes comprehensive error handling:

1. Database query errors
2. Stripe API errors
3. Missing billing IDs
4. Transaction management for database operations

All operations are logged using the application's logger utility.

## Usage

### Programmatic Usage

```typescript
import BillingService from '../services/billing';

// Report usage for the previous month
const startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
startDate.setDate(1); // First day of previous month

const endDate = new Date();
endDate.setDate(0); // Last day of previous month

const reports = await BillingService.reportRadiologyOrderUsage(startDate, endDate);
console.log(reports);
```

### Command Line Usage

```bash
# Windows
scripts\billing\test-billing-usage-reporting.bat --start-date 2025-04-01 --end-date 2025-04-21

# Unix/Mac
./scripts/billing/test-billing-usage-reporting.sh --start-date 2025-04-01 --end-date 2025-04-21

# Insert test data and run report
scripts\billing\test-billing-usage-reporting.bat --insert-test-data
```

## Deployment Considerations

In a production environment, this functionality should be triggered by:

1. **Scheduled Job**: Run monthly to bill for the previous month's orders
   - AWS EventBridge Scheduler
   - Cron job
   - Scheduled Lambda function

2. **Super Admin Action**: Allow manual triggering for specific date ranges
   - Add a UI in the Super Admin Console
   - Implement an API endpoint with proper authorization

## Future Enhancements

1. **Real-Time Monitoring**: Implement real-time tracking of radiology order usage for super admin dashboard visibility. See [Radiology Usage Real-Time Monitoring](./radiology-usage-real-time-monitoring.md) for detailed design.
2. **Automated Invoice Creation**: Automatically create and finalize invoices after adding invoice items
3. **Email Notifications**: Send invoice notifications to Radiology Group admins
4. **Detailed Reporting**: Provide detailed reports of billed orders
5. **Custom Pricing**: Support custom pricing agreements for different Radiology Groups
6. **Bulk Processing**: Optimize for large order volumes with batch processing

## Related Documentation

- [Billing Credits](../billing_credits.md)
- [Stripe Integration Setup](./stripe-integration-setup.md)
- [Stripe Webhook Handlers](./stripe-webhook-handlers.md)