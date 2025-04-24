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
   - [Connection Management Details](./connection-management-details.md) - Detailed information about connection endpoints
   - [Connection Testing](./connection-testing.md) - Guide for testing connection endpoints
   - **Key Endpoint**: `GET /api/connections/requests` - Lists pending incoming connection requests (see [SQL Implementation Patterns](#sql-implementation-patterns))
7. [Organization Management](./organization-management.md) - Organization-related endpoints
8. [User Management](./user-management.md) - User-related endpoints
   - [User Invitation Details](./user-invitation-details.md) - Detailed implementation of user invitation feature
   - **Key Endpoint**: `GET /api/users/me` - Retrieves profile information for the authenticated user
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

### SQL Implementation Patterns

During our testing and analysis, we identified important SQL implementation patterns that frontend developers should be aware of:

#### LEFT JOIN vs JOIN for Nullable Relationships

When working with the `GET /api/connections/requests` endpoint, we discovered a critical SQL pattern:

- **Issue**: Using standard `JOIN` operations can cause queries to fail when joined records have null values
- **Solution**: Using `LEFT JOIN` instead preserves the main record even when joined tables have no matching records
- **Example**: The connection requests endpoint joins the organization_relationships table with organizations and users tables
- **Impact**: This pattern is essential when querying data that involves optional relationships

This pattern is documented in detail in the [Connection Management Details](./connection-management-details.md) document.

## Testing Tools

### Token Generator

A comprehensive token generator script is provided to simplify API testing across different user roles. This script generates authentication tokens for all roles in the system and saves them to separate files.

#### Usage

1. Run the token generator script:
   ```
   node generate-all-role-tokens.js
   ```

2. The script will:
   - Generate tokens for all 7 roles (admin_staff, physician, admin_referring, super_admin, admin_radiology, scheduler, radiologist)
   - Save each token to a separate file in the `tokens` directory
   - Create convenience scripts for setting environment variables

3. Use the generated tokens for testing endpoints with different role permissions:
   ```javascript
   // Example: Using the admin_referring token
   const token = fs.readFileSync('tokens/admin_referring-token.txt', 'utf8');
   
   // Make API request with the token
   const response = await axios.post('https://api.radorderpad.com/api/user-invites/invite',
     { email: 'test.user@example.com', role: 'physician' },
     { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }
   );
   ```

4. Alternatively, use the convenience scripts to set environment variables:
   - Windows: `set-token-env-vars.bat`
   - PowerShell: `Set-TokenEnvVars.ps1`

### Testing User Invitation Endpoints

The user invitation system has been thoroughly tested and fixed to ensure proper functionality. Here's how the endpoints were tested:

1. **User Invite Endpoint (`POST /api/user-invites/invite`)**:
   - Tested with admin_referring token (required role)
   - Verified successful invitation creation (201 Created)
   - Tested error cases: invalid email format, missing fields, insufficient permissions

2. **Accept Invitation Endpoint (`POST /api/user-invites/accept-invitation`)**:
   - Tested with various token scenarios
   - Verified proper validation of invitation tokens
   - Tested error cases: invalid token, missing required fields, weak password

3. **Routing Configuration Fix**:
   - Fixed middleware conflict by changing the mounting path for user-invite routes from '/users' to '/user-invites'
   - This resolved authentication issues where the wrong middleware was being applied

For detailed implementation information, see the [User Invitation Details](./user-invitation-details.md) document.

## Implementation Status by Area

This section provides a comprehensive overview of the implementation status across all API areas:

### 1. Connection Management (100% Complete)
- All endpoints are working and tested:
  - GET /api/connections
  - GET /api/connections/requests
  - POST /api/connections
  - POST /api/connections/{relationshipId}/approve
  - POST /api/connections/{relationshipId}/reject
  - DELETE /api/connections/{relationshipId}

### 2. Authentication & User Invitation (100% Complete)
- All endpoints are working and tested:
  - POST /api/auth/login
  - POST /api/auth/register
  - POST /api/user-invites/invite
  - POST /api/user-invites/accept-invitation

### 3. Radiology Workflow (80-90% Complete)
- Most endpoints are working and tested:
  - GET /api/radiology/orders
  - GET /api/radiology/orders/{orderId}
  - POST /api/radiology/orders/{orderId}/update-status
  - GET /api/radiology/orders/{orderId}/export/{format}
  - POST /api/radiology/orders/{orderId}/request-info (implemented but may not have specific tests)

### 4. Order Management (90-100% Complete)
- All core endpoints are working and tested:
  - GET /api/orders (with filtering)
  - GET /api/orders/{orderId}
  - POST /api/orders/validate
  - PUT /api/orders/{orderId}

### 5. Admin Order Management (90-100% Complete)
- Key endpoints are working and tested:
  - GET /api/admin/orders/queue
  - POST /api/admin/orders/{orderId}/send-to-radiology-fixed
  - POST /api/admin/orders/{orderId}/paste-summary
  - POST /api/admin/orders/{orderId}/paste-supplemental
  - PUT /api/admin/orders/{orderId}/patient-info
  - PUT /api/admin/orders/{orderId}/insurance-info

### 6. Billing Management (60-70% Complete)
- Core endpoints are working:
  - POST /api/billing/create-checkout-session
  - POST /api/billing/subscriptions
- Missing endpoints:
  - GET /api/billing (not implemented)
  - GET /api/billing/credit-balance (not implemented)
  - GET /api/billing/credit-usage (not implemented)
- Internal webhook handling and credit management are implemented

### 7. User Management (60-70% Complete)
- Working endpoints:
  - GET /api/users/me
  - POST /api/user-invites/invite
  - POST /api/user-invites/accept-invitation
- Missing or untested endpoints:
  - PUT /users/me
  - GET /users
  - GET /users/{userId}
  - PUT /users/{userId}
  - DELETE /users/{userId}
  - User location assignment endpoints

### 8. Organization Management (40-50% Complete)
- Working endpoints:
  - POST /api/organizations/mine/locations
  - GET /api/organizations/mine (fixed but may still have issues)
- Not working or untested:
  - PUT /api/organizations/mine (returns 501 "Not implemented yet")
  - GET /api/organizations (by design)
  - GET /api/organizations/{organizationId} (by design)
  - PUT /api/organizations/{organizationId} (by design)
  - Location management endpoints (GET, PUT, DELETE)

### 9. Superadmin Management (50-60% Complete)
- Working endpoints:
  - GET /api/superadmin/organizations
  - GET /api/superadmin/users
- Other superadmin endpoints may not be implemented or tested

### 10. Uploads (0% Complete)
- Blocked by S3 setup:
  - POST /api/uploads/presigned-url
  - POST /api/uploads/confirm
  - GET /uploads/{documentId}/download-url