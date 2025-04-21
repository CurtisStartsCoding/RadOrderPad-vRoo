# Admin Finalization Workflow Fix Guide

**Date:** April 21, 2025  
**Author:** Roo  
**Status:** Complete

## Overview

This document provides a comprehensive guide to the fix for the database connection issue in the Admin Finalization workflow, specifically in the "Send to Radiology" functionality.

## Issue Description

The "Send to Radiology" endpoint (`POST /api/admin/orders/:orderId/send-to-radiology`) was failing with the error:

```
relation "organizations" does not exist
```

This error occurred because:

1. The organizations table exists in the Main database
2. The send-to-radiology handler was using the PHI database connection to try to access this table

The issue was introduced during the Credit Consumption Refactoring on April 14, 2025, when the credit consumption logic was moved from the validation stage to the order submission stage.

## Solution

The solution involves creating a fixed implementation that uses both database connections:

1. **New Service Handler**: `src/services/order/admin/handlers/send-to-radiology-fixed.ts`
   - Uses separate connections for PHI and Main databases
   - Properly manages transactions across both databases
   - Maintains all the original functionality

2. **New Controller**: `src/controllers/admin-order/send-to-radiology-fixed.controller.ts`
   - Handles the fixed implementation endpoint

3. **New Route**: Added to `src/routes/admin-orders.routes.ts`
   - Endpoint: `/api/admin/orders/:orderId/send-to-radiology-fixed`
   - Uses the same authentication and authorization as the original endpoint

## Deployment Steps

### 1. Create Deployment Package

The deployment package has been created in the `deployment` directory and contains all the necessary files for the fixed implementation.

If you need to recreate the deployment package:

```bash
# Windows
.\create-deployment-zip-manual.bat

# Linux/macOS
chmod +x create-deployment-zip-manual.sh
./create-deployment-zip-manual.sh
```

This will create a `deployment-manual.zip` file in the root directory.

### 2. Deploy to AWS Elastic Beanstalk

To deploy the fixed implementation to AWS Elastic Beanstalk:

```bash
# Windows
.\deploy-manual-zip.bat

# Linux/macOS
chmod +x deploy-manual-zip.sh
./deploy-manual-zip.sh
```

This will deploy the `deployment-manual.zip` file to AWS Elastic Beanstalk.

### 3. Test the Fixed Implementation

To test the fixed implementation after deployment:

```bash
# Windows
.\run-test-fixed-implementation-production.bat

# Linux/macOS
chmod +x run-test-fixed-implementation-production.sh
./run-test-fixed-implementation-production.sh
```

This will run a test script that:
- Updates patient information for a test order
- Sends the order to radiology using the fixed implementation
- Verifies that the order status is updated correctly

## Frontend Integration

To use the fixed implementation in the frontend:

```javascript
// Change this:
fetch(`${API_BASE_URL}/admin/orders/${orderId}/send-to-radiology`, {...})

// To this:
fetch(`${API_BASE_URL}/admin/orders/${orderId}/send-to-radiology-fixed`, {...})
```

The fixed implementation maintains the same request and response format as the original endpoint, so no other changes are needed.

## Long-Term Solution

While this fix provides an immediate solution to the issue, a long-term solution would be to refactor the credit consumption logic to properly handle the database connection separation. This would involve:

1. Creating a dedicated service for credit consumption that knows which database to use
2. Updating all handlers that need to consume credits to use this service
3. Ensuring that all database operations follow the principle of strict separation between PHI and non-PHI databases

## Conclusion

The fixed implementation successfully addresses the database connection issue in the Admin Finalization workflow. It maintains the same functionality as the original implementation while properly handling the database connection separation.

The original endpoint remains unchanged, allowing for a gradual transition to the fixed implementation.