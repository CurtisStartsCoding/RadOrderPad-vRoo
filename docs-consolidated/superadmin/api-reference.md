# Superadmin API Reference

This document provides a comprehensive reference for all superadmin API endpoints in the RadOrderPad platform. These endpoints are only accessible to users with the `super_admin` role.

## Authentication

All superadmin endpoints require authentication using a JWT token with the `super_admin` role. The token should be included in the `Authorization` header of the request:

```
Authorization: Bearer <token>
```

## Core Principles

The superadmin API is built on the following core principles:

1. **Centralized Administration**: Provides a centralized interface for managing all aspects of the RadOrderPad system
2. **Complete Visibility**: Superadmins have visibility into all organizations, users, and system activities
3. **Audit Trail**: All superadmin actions are logged for accountability and troubleshooting
4. **Granular Control**: Provides fine-grained control over system components including organizations, users, and prompt templates

## Organization Management Endpoints

### List Organizations

**Endpoint:** `GET /api/superadmin/organizations`

**Description:** Retrieves a list of all organizations in the system.

**Query Parameters:**
- `name` (optional): Filter by organization name
- `type` (optional): Filter by organization type (referring, radiology_group, both)
- `status` (optional): Filter by organization status (active, on_hold, purgatory, terminated)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Test Organization",
      "type": "referring",
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
      "billing_id": "cus_TEST123456",
      "credit_balance": 697,
      "subscription_tier": "tier_1",
      "status": "active",
      "assigned_account_manager_id": null,
      "created_at": "2025-04-13T16:34:44.148Z",
      "updated_at": "2025-04-21T04:25:09.592Z"
    },
    // Additional organizations...
  ]
}
```

### Get Organization Details

**Endpoint:** `GET /api/superadmin/organizations/{orgId}`

**Description:** Retrieves detailed information about a specific organization.

**URL Parameters:**
- `orgId`: The ID of the organization to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": 1,
      "name": "Test Organization",
      "type": "referring",
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
      "billing_id": "cus_TEST123456",
      "credit_balance": 697,
      "subscription_tier": "tier_1",
      "status": "active",
      "assigned_account_manager_id": null,
      "created_at": "2025-04-13T16:34:44.148Z",
      "updated_at": "2025-04-21T04:25:09.592Z"
    },
    "users": [
      // List of users in this organization
    ],
    "connections": [
      // List of connections with other organizations
    ],
    "billingHistory": [
      // List of billing events
    ]
  }
}
```

### Update Organization Status

**Endpoint:** `PUT /api/superadmin/organizations/{orgId}/status`

**Description:** Updates an organization's status.

**URL Parameters:**
- `orgId`: The ID of the organization to update

**Request Body:**
```json
{
  "status": "active",
  "reason": "Organization has completed verification process"
}
```

**Required Fields:**
- `status`: New status for the organization (active, on_hold, purgatory, terminated)

**Optional Fields:**
- `reason`: Reason for the status change

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "previousStatus": "on_hold",
    "newStatus": "active",
    "updatedAt": "2025-04-25T14:30:00.000Z"
  }
}
```

### Adjust Organization Credits

**Endpoint:** `POST /api/superadmin/organizations/{orgId}/credits/adjust`

**Description:** Adjusts an organization's credit balance.

**URL Parameters:**
- `orgId`: The ID of the organization to adjust credits for

**Request Body:**
```json
{
  "amount": 100,
  "reason": "Promotional credits for new feature launch"
}
```

**Required Fields:**
- `amount`: Amount of credits to add (positive) or remove (negative)
- `reason`: Reason for the credit adjustment

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "previousBalance": 697,
    "newBalance": 797,
    "adjustment": 100,
    "reason": "Promotional credits for new feature launch"
  }
}
```

## User Management Endpoints

### List Users

**Endpoint:** `GET /api/superadmin/users`

**Description:** Retrieves a list of all users in the system.

**Query Parameters:**
- `email` (optional): Filter by user email
- `organizationId` (optional): Filter by organization ID
- `role` (optional): Filter by user role (admin_referring, admin_radiology, physician, admin_staff, radiologist, scheduler, super_admin)
- `isActive` (optional): Filter by active status
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 4,
      "email": "test.admin_staff@example.com",
      "first_name": "Test",
      "last_name": "AdminStaff",
      "role": "admin_staff",
      "is_active": true,
      "last_login": "2025-04-22T16:52:43.291Z",
      "created_at": "2025-04-21T16:06:38.559Z",
      "email_verified": true,
      "npi": null,
      "specialty": null,
      "phone_number": null,
      "organization_id": 1,
      "organization_name": "Test Organization",
      "organization_type": "referring"
    },
    // Additional users...
  ]
}
```

### Get User Details

**Endpoint:** `GET /api/superadmin/users/{userId}`

**Description:** Retrieves detailed information about a specific user.

**URL Parameters:**
- `userId`: The ID of the user to retrieve

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "test.physician@example.com",
    "first_name": "Test",
    "last_name": "Physician",
    "role": "physician",
    "is_active": true,
    "last_login": "2025-04-22T16:52:43.463Z",
    "created_at": "2025-04-13T16:34:49.727Z",
    "email_verified": true,
    "npi": null,
    "specialty": null,
    "phone_number": null,
    "organization_id": 1,
    "organization_name": "Test Organization",
    "organization_type": "referring",
    "assigned_locations": [
      // List of assigned locations
    ],
    "activity_history": [
      // List of recent activity
    ]
  }
}
```

### Update User Status

**Endpoint:** `PUT /api/superadmin/users/{userId}/status`

**Description:** Updates a user's active status.

**URL Parameters:**
- `userId`: The ID of the user to update

**Request Body:**
```json
{
  "isActive": true,
  "reason": "User has completed training"
}
```

**Required Fields:**
- `isActive`: New active status for the user

**Optional Fields:**
- `reason`: Reason for the status change

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "previousStatus": false,
    "newStatus": true,
    "updatedAt": "2025-04-25T14:30:00.000Z"
  }
}
```

## System Logs Endpoints

### Get Validation Logs

**Endpoint:** `GET /api/superadmin/logs/validation`

**Description:** Retrieves LLM validation logs with basic filtering capabilities.

**Query Parameters:**
- `organization_id` (optional): Filter by organization ID
- `user_id` (optional): Filter by user ID
- `date_range_start` (optional): Filter by start date (YYYY-MM-DD)
- `date_range_end` (optional): Filter by end date (YYYY-MM-DD)
- `status` (optional): Filter by validation status
- `llm_provider` (optional): Filter by LLM provider
- `model_name` (optional): Filter by model name
- `limit` (optional): Number of items per page (default: 50, max: 100)
- `offset` (optional): Offset for pagination (default: 0)

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
    },
    // Additional log entries...
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

**Endpoint:** `GET /api/superadmin/logs/validation/enhanced`

**Description:** Retrieves LLM validation logs with advanced filtering capabilities.

**Query Parameters:**
- All parameters from the basic endpoint, plus:
- `statuses` (optional): Comma-separated list of validation statuses
- `llm_providers` (optional): Comma-separated list of LLM providers
- `model_names` (optional): Comma-separated list of model names
- `search_text` (optional): Text search across relevant fields
- `date_preset` (optional): Predefined date range (today, yesterday, last_7_days, last_30_days, this_month, last_month)
- `sort_by` (optional): Field to sort by (created_at, latency_ms, total_tokens, status)
- `sort_direction` (optional): Sort direction (asc, desc)

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
      "organization_name": "ABC Medical Group",
      "prompt_template_name": "Validation Template v3"
    },
    // Additional log entries...
  ],
  "pagination": {
    "total": 1000,
    "limit": 50,
    "offset": 0,
    "has_more": true
  }
}
```

### Get Credit Usage Logs

**Endpoint:** `GET /api/superadmin/logs/credits`

**Description:** Retrieves credit usage logs with filtering capabilities.

**Query Parameters:**
- `organization_id` (optional): Filter by organization ID
- `user_id` (optional): Filter by user ID
- `date_range_start` (optional): Filter by start date (YYYY-MM-DD)
- `date_range_end` (optional): Filter by end date (YYYY-MM-DD)
- `action_type` (optional): Filter by action type
- `limit` (optional): Number of items per page (default: 50, max: 100)
- `offset` (optional): Offset for pagination (default: 0)

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
    },
    // Additional log entries...
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

**Endpoint:** `GET /api/superadmin/logs/purgatory`

**Description:** Retrieves purgatory events with filtering capabilities.

**Query Parameters:**
- `organization_id` (optional): Filter by organization ID
- `date_range_start` (optional): Filter by start date (YYYY-MM-DD)
- `date_range_end` (optional): Filter by end date (YYYY-MM-DD)
- `status` (optional): Filter by status (to_purgatory, from_purgatory)
- `reason` (optional): Filter by reason
- `limit` (optional): Number of items per page (default: 50, max: 100)
- `offset` (optional): Offset for pagination (default: 0)

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
    },
    // Additional log entries...
  ],
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "has_more": false
  }
}
```

## Prompt Management Endpoints

The following endpoints provide functionality for managing LLM prompt templates and assignments:

### Create Prompt Template

**Endpoint:** `POST /api/superadmin/prompts/templates`

**Description:** Create a new prompt template.

### List Prompt Templates

**Endpoint:** `GET /api/superadmin/prompts/templates`

**Description:** List prompt templates with optional filtering.

### Get Prompt Template

**Endpoint:** `GET /api/superadmin/prompts/templates/{templateId}`

**Description:** Get a specific prompt template by ID.

### Update Prompt Template

**Endpoint:** `PUT /api/superadmin/prompts/templates/{templateId}`

**Description:** Update an existing prompt template.

### Delete Prompt Template

**Endpoint:** `DELETE /api/superadmin/prompts/templates/{templateId}`

**Description:** Delete (soft delete) a prompt template.

### Create Prompt Assignment

**Endpoint:** `POST /api/superadmin/prompts/assignments`

**Description:** Create a new prompt assignment, assigning a template to a physician.

### List Prompt Assignments

**Endpoint:** `GET /api/superadmin/prompts/assignments`

**Description:** List prompt assignments with optional filtering.

### Get Prompt Assignment

**Endpoint:** `GET /api/superadmin/prompts/assignments/{assignmentId}`

**Description:** Get a specific prompt assignment by ID.

### Update Prompt Assignment

**Endpoint:** `PUT /api/superadmin/prompts/assignments/{assignmentId}`

**Description:** Update an existing prompt assignment.

### Delete Prompt Assignment

**Endpoint:** `DELETE /api/superadmin/prompts/assignments/{assignmentId}`

**Description:** Delete a prompt assignment.

## Error Handling

All superadmin endpoints return standard HTTP status codes:

- 200 OK: The request was successful
- 400 Bad Request: The request was invalid or cannot be served
- 401 Unauthorized: Authentication is required or has failed
- 403 Forbidden: The authenticated user does not have permission to access the requested resource
- 404 Not Found: The requested resource could not be found
- 500 Internal Server Error: An error occurred on the server

Error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Implementation Status

Based on the test files and API documentation, the superadmin functionality appears to be fully implemented. The following endpoints have corresponding test files:

### Core Organization and User Management
- GET /api/superadmin/organizations
- GET /api/superadmin/organizations/{orgId}
- PUT /api/superadmin/organizations/{orgId}/status
- POST /api/superadmin/organizations/{orgId}/credits/adjust
- GET /api/superadmin/users
- GET /api/superadmin/users/{userId}
- PUT /api/superadmin/users/{userId}/status

### System Logs
- GET /api/superadmin/logs/validation
- GET /api/superadmin/logs/validation/enhanced
- GET /api/superadmin/logs/credits
- GET /api/superadmin/logs/purgatory

### Prompt Management
- POST /api/superadmin/prompts/templates
- GET /api/superadmin/prompts/templates
- GET /api/superadmin/prompts/templates/{templateId}
- PUT /api/superadmin/prompts/templates/{templateId}
- DELETE /api/superadmin/prompts/templates/{templateId}

### Prompt Assignments
- POST /api/superadmin/prompts/assignments
- GET /api/superadmin/prompts/assignments
- GET /api/superadmin/prompts/assignments/{assignmentId}
- PUT /api/superadmin/prompts/assignments/{assignmentId}
- DELETE /api/superadmin/prompts/assignments/{assignmentId}
