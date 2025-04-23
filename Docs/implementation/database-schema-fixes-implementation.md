# Database Schema Fixes Implementation

This document records fixes made to address database schema issues in the RadOrderPad API.

## 1. Authorization Number Column Fix

**Date:** 2025-04-23

### Issue

The POST `/api/admin/orders/{orderId}/paste-summary` endpoint was failing with the error "column authorization_number does not exist" when attempting to update the `patient_insurance` table.

### Root Cause

The code in `src/services/order/admin/insurance/update-from-emr.ts` was attempting to update an `authorization_number` column in the `patient_insurance` table, but according to the definitive schema in `SCHEMA_PHI_COMPLETE.md`, this column does not exist in that table. The `authorization_number` column exists in the `orders` table instead.

### Solution

The `authorization_number` column reference was removed from both the UPDATE and INSERT queries in the `patient_insurance` table in the `update-from-emr.ts` file.

After discussion with the team, it was determined that authorization numbers are handled independently by the radiology group after they receive the order, and are not part of the referring physician's workflow. Therefore, there was no need to store this information in either table from the EMR paste.

### Files Modified

- `src/services/order/admin/insurance/update-from-emr.ts`

### Testing

A new test script was created to verify the fix:

- `debug-scripts/vercel-tests/test-admin-paste-summary.js`
- `debug-scripts/vercel-tests/test-admin-paste-summary.bat`
- `debug-scripts/vercel-tests/test-admin-paste-summary.sh`

These scripts were added to the `run-all-tests.bat` and `run-all-tests.sh` files to ensure the fix is tested in future runs.

### Implementation Details

The paste-summary endpoint parses EMR text and updates the following fields:

1. In the `patients` table:
   - address
   - city
   - state
   - zip_code
   - phone_number
   - email

2. In the `patient_insurance` table:
   - insurer_name
   - policy_number
   - group_number
   - policy_holder_name
   - policy_holder_relationship

The authorization number is no longer stored as part of this process, as it's handled by the radiology group independently.