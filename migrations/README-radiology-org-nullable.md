# Radiology Organization ID Nullable Migration

## Overview
This migration fixes a fundamental workflow issue in the RadOrderPad system where the database schema incorrectly required a `radiology_organization_id` when physicians create orders.

## The Problem
The database schema had `radiology_organization_id` as a NOT NULL column in the orders table, but the actual workflow is:

1. **Physician creates order**: Order is created with referring organization ID (from physician's profile)
2. **Order goes to admin queue**: Status is `pending_admin`
3. **Admin assigns radiology organization**: Admin staff later assigns the order to a specific radiology organization

Having `radiology_organization_id` as NOT NULL forced a workaround where a default value of 1 was used, which is incorrect.

## The Solution
This migration:
- Makes `radiology_organization_id` nullable in the orders table
- Cleans up existing orders that have the default value of 1 (where not legitimate)
- Adds documentation to the column explaining the workflow

## Running the Migration

1. **Apply the migration**:
   ```bash
   cd archive/db-migrations
   run-make-radiology-organization-id-nullable.bat
   ```

2. **Verify the migration**:
   ```bash
   run-verify-radiology-org-nullable.bat
   ```

## Code Changes Required
After applying this migration, ensure:

1. **Order creation endpoints** don't require or set `radiology_organization_id`
2. **Admin endpoints** properly set `radiology_organization_id` when assigning orders
3. **Queries** handle NULL values appropriately

## Affected Files
- `src/controllers/order-management/handlers/create-order.ts` - No longer needs to set radiology_organization_id
- `src/services/order/validation/draft-order.ts` - Updated to pass NULL instead of default value
- Any queries that filter by `radiology_organization_id` should handle NULL values

## Rollback
If needed, you can rollback by making the column NOT NULL again:
```sql
ALTER TABLE orders ALTER COLUMN radiology_organization_id SET NOT NULL;
```
Note: This will fail if there are any NULL values in the column.