# RadOrderPad API Implementation Guide

This guide provides detailed information about the API endpoints available in the RadOrderPad application, based on comprehensive testing performed against the production deployment at `https://api.radorderpad.com`.

## Overview

The RadOrderPad API is organized into several logical sections:

1. [Authentication](./authentication.md) - Login and token management
2. [Health Check](./health.md) - System status endpoint
3. [Order Management](./order-management.md) - Endpoints for managing orders
4. [Radiology Order Management](./radiology-order-management.md) - Endpoints for radiology orders
5. [Superadmin Management](./superadmin-management.md) - Superadmin-specific endpoints
6. [Connection Management](./connection-management.md) - Managing connections between organizations
7. [Organization Management](./organization-management.md) - Organization-related endpoints
8. [User Management](./user-management.md) - User-related endpoints
9. [Billing Management](./billing-management.md) - Billing and subscription endpoints
10. [Validation Engine](./validation-engine.md) - Clinical indications processing and code assignment
11. [Workflow Guide](./workflow-guide.md) - End-to-end API workflow examples
12. [Status Summary](./status-summary.md) - Overview of working and non-working endpoints

## API Conventions

### Base URL

All API endpoints are relative to the base URL:
```
https://api.radorderpad.com
```

### Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

See the [Authentication](./authentication.md) section for details on obtaining a token.

### Request Format

- All request bodies should be in JSON format
- Include the `Content-Type: application/json` header with all requests that include a body

### Response Format

All responses are in JSON format and typically follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data specific to the endpoint
  }
}
```

Or in case of an error:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": {
    // Additional error details (optional)
  }
}
```

### Error Handling

The API uses standard HTTP status codes:

- 200 OK - Request succeeded
- 400 Bad Request - Invalid request parameters
- 401 Unauthorized - Missing or invalid authentication
- 403 Forbidden - Authenticated but not authorized for the requested resource
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server-side error

### Pagination

Endpoints that return lists of items typically support pagination with these query parameters:

- `page` - Page number (default: 1)
- `limit` - Number of items per page (default: 20)
- `sortBy` - Field to sort by (default varies by endpoint)
- `sortOrder` - Sort direction ("asc" or "desc", default: "desc")

Paginated responses include a pagination object:

```json
{
  "items": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

## Role-Based Access Control

The API implements role-based access control (RBAC) with these roles:

- `admin_staff` - Administrative staff at referring organizations
- `physician` - Physicians at referring organizations
- `admin_referring` - Administrators at referring organizations
- `super_admin` - System administrators
- `admin_radiology` - Administrators at radiology organizations
- `scheduler` - Schedulers at radiology organizations
- `radiologist` - Radiologists at radiology organizations

Each endpoint specifies which roles are authorized to access it.

## Implementation Notes

This documentation is based on comprehensive testing of the API. Some endpoints may be marked as:

- **Working** - Fully implemented and tested
- **Partially Working** - Implemented but with limitations or issues
- **Not Implemented** - Endpoint exists in documentation but returns 404 or 501
- **Restricted** - Endpoint exists but has method or role restrictions

See the [Status Summary](./status-summary.md) for a complete list of endpoint statuses.