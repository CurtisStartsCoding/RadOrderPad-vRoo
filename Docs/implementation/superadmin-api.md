# Super Admin API Implementation

**Version:** 1.0
**Date:** 2025-04-21

This document describes the implementation of the Super Admin API endpoints for managing organization status and credit balance.

## Overview

The Super Admin API provides endpoints for administrative tasks that can only be performed by users with the `super_admin` role. These endpoints are secured with JWT authentication and role-based authorization.

## Implemented Endpoints

### 1. Update Organization Status

**Endpoint:** `PUT /api/superadmin/organizations/{orgId}/status`

**Description:** Updates the status of an organization. This can be used to place an organization in purgatory, put it on hold, or reactivate it.

**Request Body:**
```json
{
  "newStatus": "active" | "purgatory" | "on_hold" | "terminated"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization status updated to [status]",
  "data": {
    // Organization object with updated status
  }
}
```

**Implementation Details:**
- The endpoint is secured with JWT authentication and requires the `super_admin` role.
- When an organization is placed in purgatory, a new entry is created in the `purgatory_events` table.
- When an organization is moved out of purgatory, any active purgatory events are marked as resolved.
- Organization relationships are also updated when an organization enters or leaves purgatory.
- All operations are performed within a database transaction to ensure data consistency.

### 2. Adjust Organization Credits

**Endpoint:** `POST /api/superadmin/organizations/{orgId}/credits/adjust`

**Description:** Adjusts the credit balance of an organization. This can be used to add or remove credits from an organization's account.

**Request Body:**
```json
{
  "amount": 100, // Positive or negative number
  "reason": "Reason for adjustment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Organization credit balance adjusted by [amount]",
  "data": {
    // Organization object with updated credit balance
  }
}
```

**Implementation Details:**
- The endpoint is secured with JWT authentication and requires the `super_admin` role.
- The adjustment amount can be positive (to add credits) or negative (to remove credits).
- A reason for the adjustment is required for auditing purposes.
- A new entry is created in the `billing_events` table with the type `manual_adjustment`.
- All operations are performed within a database transaction to ensure data consistency.

## Error Handling

Both endpoints include comprehensive error handling:

- Invalid input validation (400 Bad Request)
- Authentication and authorization checks (401 Unauthorized, 403 Forbidden)
- Database errors (500 Internal Server Error)
- Not found errors (404 Not Found)

## Testing

The implementation includes test scripts for both Windows (BAT) and Unix (SH) environments:

- `test-superadmin-api.bat`
- `test-superadmin-api.sh`

These scripts test both valid and invalid requests to ensure proper error handling.

## Security Considerations

- All endpoints require JWT authentication.
- Role-based authorization ensures only users with the `super_admin` role can access these endpoints.
- All actions are logged for audit purposes.
- Database operations use parameterized queries to prevent SQL injection.