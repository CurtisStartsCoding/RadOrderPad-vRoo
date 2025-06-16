# Permissions Update - June 16, 2025

## Overview

This document outlines the permissions updates made to ensure admin roles have the same operational capabilities as their staff members.

## Changes Made

### 1. Admin Staff Connection Access

**Problem:** Admin staff users were receiving 403 Forbidden errors when trying to access `/api/connections` to view available radiology organizations for order routing.

**Solution:** Added `admin_staff` role to the connection routes authorization.

**File Changed:** `src/routes/connection.routes.ts`
```typescript
// Before
const adminRoles = ['admin_referring', 'admin_radiology'];

// After  
const adminRoles = ['admin_referring', 'admin_radiology', 'admin_staff'];
```

**Impact:** Admin staff can now:
- View connected radiology organizations
- Select appropriate radiology destinations when finalizing orders
- Complete their core workflow without 403 errors

### 2. Admin Referring Permissions

**Change:** Added `admin_referring` role to all admin staff endpoints

**Files Changed:** `src/routes/admin-orders.routes.ts`

**Endpoints Updated:**
- GET `/api/admin/orders/queue`
- POST `/api/admin/orders/:orderId/paste-summary`
- POST `/api/admin/orders/:orderId/paste-supplemental`
- POST `/api/admin/orders/:orderId/send-to-radiology`
- PUT `/api/admin/orders/:orderId/patient-info`
- PUT `/api/admin/orders/:orderId/insurance-info`
- PUT `/api/admin/orders/:orderId/order-details`
- PUT `/api/admin/orders/:orderId`

**Impact:** Admin referring users can now perform all order management tasks that their admin staff can perform.

### 3. Radiologist Permissions

**Change:** Added `radiologist` role to all scheduler endpoints

**Files Changed:** `src/routes/radiology-orders.routes.ts`

**Endpoints Updated:**
- GET `/api/radiology/orders`
- GET `/api/radiology/orders/:orderId`
- GET `/api/radiology/orders/:orderId/export/:format`
- POST `/api/radiology/orders/:orderId/update-status`
- POST `/api/radiology/orders/:orderId/request-info`

**Impact:** Radiologists can now access all radiology workflow endpoints, not just view assigned orders.

### 4. File Upload Permissions

**Status:** Already correctly configured - all relevant roles have access

**Roles with Upload Access:**
- physician
- admin_referring
- admin_radiology
- radiologist
- admin_staff
- scheduler

## Rationale

Admin roles should have complete oversight and operational capabilities for their departments:
- **admin_referring** should be able to do everything **admin_staff** can do
- **admin_radiology** should be able to do everything **scheduler** and **radiologist** can do

This ensures admins can:
- Cover for staff when needed
- Test workflows
- Troubleshoot issues
- Train new staff by demonstrating workflows

## Testing

The included diagnostic scripts can verify these permissions:
- `debug-scripts/diagnose-frontend-permissions.js` - Tests connection access
- `debug-scripts/test-location-permissions.js` - Tests location permissions
- `debug-scripts/create-test-users-for-permissions.js` - Creates test users for each role

## Future Considerations

### Insurance Field Handling
Currently, the system handles uninsured patients by allowing NULL values in insurance fields. A future enhancement could add a `has_insurance` boolean field to explicitly track:
- `true` - Patient has insurance (check for details)
- `false` - Patient is uninsured/cash pay
- `null` - Insurance status not yet determined

This would remove ambiguity about whether insurance data is missing or the patient is uninsured.

## Summary

These permission updates ensure that:
1. Admin staff can access connections to complete their workflow
2. Admin roles have all the capabilities of their staff members
3. The system supports proper role hierarchy and oversight capabilities