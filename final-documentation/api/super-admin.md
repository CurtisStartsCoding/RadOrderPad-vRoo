# Super Admin API Reference

## Overview

Super admin endpoints provide system-wide administration capabilities for the RadOrderPad platform. These endpoints are only accessible to users with the `super_admin` role.

This document covers the **15 tested and verified endpoints**. Additional endpoints exist but require testing before documentation.

## Authentication

All endpoints require JWT authentication with `super_admin` role:

```
Authorization: Bearer <token>
```

## Organization Management

### List All Organizations

List all organizations in the system with optional filtering.

**Endpoint:** `GET /api/superadmin/organizations`

**Query Parameters:**
- `name` (optional): Filter by organization name
- `type` (optional): Filter by type (referring_practice, radiology_group)
- `status` (optional): Filter by status (active, on_hold, purgatory, terminated)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "count": 55,
  "data": [
    {
      "id": 12,
      "name": "Radiology Group 01eefded",
      "type": "radiology_group",
      "npi": null,
      "tax_id": null,
      "address_line1": null,
      "address_line2": null,
      "city": null,
      "state": null,
      "zip_code": null,
      "phone_number": null,
      "fax_number": null,
      "contact_email": null,
      "website": null,
      "logo_url": null,
      "billing_id": null,
      "credit_balance": 0,
      "subscription_tier": null,
      "status": "active",
      "assigned_account_manager_id": null,
      "created_at": "2025-05-17T01:33:39.530Z",
      "updated_at": "2025-05-17T01:33:39.530Z"
    }
  ]
}
```

### Get Organization Details

Get detailed information about a specific organization.

**Endpoint:** `GET /api/superadmin/organizations/:orgId`

**URL Parameters:**
- `orgId`: Organization ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Organization Name",
    "type": "referring_practice",
    "npi": "1234567890",
    "tax_id": "12-3456789",
    "address_line1": "789 Updated St",
    "address_line2": "Suite 200",
    "city": "Updated City",
    "state": "CA",
    "zip_code": "90210",
    "phone_number": "555-0123",
    "fax_number": "555-0124",
    "contact_email": "updated@example.com",
    "website": "https://updated.example.com",
    "logo_url": null,
    "billing_id": "cus_Q55EvOLM0E8h2W",
    "credit_balance": 897,
    "subscription_tier": null,
    "status": "active",
    "assigned_account_manager_id": null,
    "created_at": "2025-05-13T16:34:44.148Z",
    "updated_at": "2025-06-13T23:36:33.920Z"
  }
}
```

### Update Organization Status

Update an organization's operational status.

**Endpoint:** `PUT /api/superadmin/organizations/:orgId/status`

**URL Parameters:**
- `orgId`: Organization ID

**Request Body:**
```json
{
  "status": "active",
  "reason": "Organization verification completed"
}
```

**Required Fields:**
- `status`: One of `active`, `on_hold`, `purgatory`, `terminated`

**Optional Fields:**
- `reason`: Reason for status change

**Response:**
```json
{
  "success": true,
  "message": "Organization status updated to active",
  "data": {
    "id": 1,
    "name": "Updated Organization Name",
    "type": "referring_practice",
    "status": "active"
  }
}
```

### Adjust Organization Credits

Add or remove credits from an organization's balance.

**Endpoint:** `POST /api/superadmin/organizations/:orgId/credits/adjust`

**URL Parameters:**
- `orgId`: Organization ID

**Request Body:**
```json
{
  "amount": 100,
  "reason": "Promotional credits for beta testing"
}
```

**Required Fields:**
- `amount`: Credits to add (positive) or remove (negative)
- `reason`: Reason for adjustment

**Response:**
```json
{
  "success": true,
  "message": "Organization credit balance adjusted by 100",
  "data": {
    "id": 1,
    "name": "Updated Organization Name",
    "type": "referring_practice",
    "credit_balance": 997,
    "previous_balance": 897,
    "adjustment": 100
  }
}
```

## User Management

### List All Users

List all users across all organizations with filtering options.

**Endpoint:** `GET /api/superadmin/users`

**Query Parameters:**
- `email` (optional): Filter by email address
- `organizationId` (optional): Filter by organization ID
- `role` (optional): Filter by role
- `isActive` (optional): Filter by active status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "count": 163,
  "data": [
    {
      "id": 123,
      "email": "superadmin.20141244@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "super_admin",
      "is_active": true,
      "last_login": null,
      "created_at": "2025-06-13T23:36:32.514Z",
      "email_verified": false,
      "npi": null,
      "specialty": null,
      "phone_number": null,
      "organization_id": null,
      "organization_name": null,
      "organization_type": null
    }
  ]
}
```

### Get User Details

Get detailed information about a specific user.

**Endpoint:** `GET /api/superadmin/users/:userId`

**URL Parameters:**
- `userId`: User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test.physician@example.com",
    "first_name": "Valid Name",
    "last_name": "Physician",
    "role": "physician",
    "is_active": true,
    "last_login": "2025-05-23T02:31:22.444Z",
    "created_at": "2025-05-13T16:34:49.727Z",
    "email_verified": true,
    "npi": null,
    "specialty": null,
    "phone_number": "555-123-1234",
    "organization_id": 1,
    "organization_name": "Updated Organization Name",
    "organization_type": "referring_practice"
  }
}
```

### Update User Status

Activate or deactivate a user account.

**Endpoint:** `PUT /api/superadmin/users/:userId/status`

**URL Parameters:**
- `userId`: User ID

**Request Body:**
```json
{
  "isActive": true,
  "reason": "User completed training requirements"
}
```

**Required Fields:**
- `isActive`: Boolean status

**Optional Fields:**
- `reason`: Reason for status change

**Response:**
```json
{
  "success": true,
  "message": "User status updated to active",
  "data": {
    "id": 1,
    "email": "test.physician@example.com",
    "first_name": "Valid Name",
    "last_name": "Physician",
    "is_active": true
  }
}
```

## System Logs

All logs endpoints return paginated results. The system actively logs validation attempts, credit usage, and purgatory events as they occur.

### Get Validation Logs

View LLM validation logs with basic filtering.

**Endpoint:** `GET /api/superadmin/logs/validation`

**Query Parameters:**
- `organization_id` (optional): Filter by organization
- `user_id` (optional): Filter by user
- `date_range_start` (optional): Start date (YYYY-MM-DD)
- `date_range_end` (optional): End date (YYYY-MM-DD)
- `status` (optional): Filter by validation status
- `llm_provider` (optional): Filter by provider
- `model_name` (optional): Filter by model
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "order_id": 456,
      "validation_attempt_id": 789,
      "user_id": 101,
      "organization_id": 202,
      "llm_provider": "Anthropic",
      "model_name": "claude-3.7",
      "prompt_template_id": 303,
      "prompt_tokens": 1500,
      "completion_tokens": 500,
      "total_tokens": 2000,
      "latency_ms": 2500,
      "status": "appropriate",
      "error_message": null,
      "created_at": "2025-04-20T14:30:00.000Z",
      "user_name": "John Doe",
      "organization_name": "ABC Medical Group"
    }
  ],
  "pagination": {
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

### Get Enhanced Validation Logs

View validation logs with advanced filtering and search capabilities.

**Endpoint:** `GET /api/superadmin/logs/validation/enhanced`

**Query Parameters:**
All parameters from basic validation logs plus:
- `statuses`: Comma-separated validation statuses
- `llm_providers`: Comma-separated providers
- `model_names`: Comma-separated model names
- `search_text`: Text search across fields
- `date_preset`: Preset date ranges (today, yesterday, last_7_days, last_30_days, this_month, last_month)
- `sort_by`: Sort field (created_at, latency_ms, total_tokens, status)
- `sort_direction`: Sort direction (asc, desc)

### Get Credit Usage Logs

View credit consumption history across organizations.

**Endpoint:** `GET /api/superadmin/logs/credits`

**Query Parameters:**
- `organization_id` (optional): Filter by organization
- `user_id` (optional): Filter by user
- `date_range_start` (optional): Start date (YYYY-MM-DD)
- `date_range_end` (optional): End date (YYYY-MM-DD)
- `action_type` (optional): Filter by action type
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "organization_id": 202,
      "user_id": 101,
      "order_id": 456,
      "validation_attempt_id": 789,
      "tokens_burned": 1,
      "action_type": "order_submission",
      "created_at": "2025-04-20T14:30:00.000Z",
      "user_name": "John Doe",
      "organization_name": "ABC Medical Group"
    }
  ],
  "pagination": {
    "total": 500,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

### Get Purgatory Events

View organizations moved to/from purgatory status.

**Endpoint:** `GET /api/superadmin/logs/purgatory`

**Query Parameters:**
- `organization_id` (optional): Filter by organization
- `date_range_start` (optional): Start date (YYYY-MM-DD)
- `date_range_end` (optional): End date (YYYY-MM-DD)
- `status` (optional): Filter by status (to_purgatory, from_purgatory)
- `reason` (optional): Filter by reason
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "organization_id": 202,
      "reason": "Suspicious activity detected",
      "triggered_by": "super_admin",
      "triggered_by_id": 101,
      "status": "to_purgatory",
      "created_at": "2025-04-20T14:30:00.000Z",
      "resolved_at": null,
      "organization_name": "ABC Medical Group",
      "triggered_by_name": "Admin User"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

## Prompt Management

### List Prompt Templates

View all LLM prompt templates in the system.

**Endpoint:** `GET /api/superadmin/prompts/templates`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "name": "Comprehensive Imaging Order Validation",
      "type": "default",
      "version": "1.0",
      "is_active": true,
      "created_at": "2025-05-01T10:00:00.000Z"
    }
  ]
}
```

### List Prompt Assignments

View all prompt assignments to physicians.

**Endpoint:** `GET /api/superadmin/prompts/assignments`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "physician_id": 1,
      "prompt_id": 1,
      "ab_group": null,
      "assigned_on": "2025-05-01T10:00:00.000Z"
    }
  ]
}
```

**Note:** Additional prompt management endpoints (create, update, delete) are planned but not yet tested.

## Error Responses

All endpoints return standard error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

**Status Codes:**
- `200` OK - Request successful
- `400` Bad Request - Invalid parameters
- `401` Unauthorized - Authentication required
- `403` Forbidden - Insufficient permissions
- `404` Not Found - Resource not found
- `500` Internal Server Error

## Notes

1. All endpoints require `super_admin` role
2. All actions are logged for audit purposes
3. Organization status changes affect all users in that organization
4. When an organization is in purgatory:
   - Users can still login
   - All actions are blocked with message: "Your organization is out of credits. Contact your practice manager."
   - A banner should display the purgatory status
5. Credit adjustments should be tracked in billing history with admin details and reason
6. User status changes are immediate
7. Only list operations for prompts are currently tested; create/update/delete require testing