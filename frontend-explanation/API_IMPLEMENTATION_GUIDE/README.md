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
   - **Key Endpoints**:
     - `GET /api/users/me` - Retrieves profile information for the authenticated user
     - `PUT /api/users/me` - Updates profile information for the authenticated user
     - `GET /api/users` - Lists all users belonging to the authenticated administrator's organization
     - `GET /api/users/{userId}` - Retrieves profile information for a specific user in the admin's organization
     - `PUT /api/users/{userId}` - Updates profile information for a specific user in the admin's organization
     - `DELETE /api/users/{userId}` - Deactivates a specific user in the admin's organization
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
- Working endpoints:
  - GET /api/connections
  - GET /api/connections/requests
  - POST /api/connections
  - POST /api/connections/{relationshipId}/approve (fixed - previously returned 500 error)
  - POST /api/connections/{relationshipId}/reject (fixed - previously returned 500 error)
  - DELETE /api/connections/{relationshipId} (fixed - previously returned 500 error)

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

### 7. User Management (90-100% Complete)
- Working endpoints:
  - GET /api/users/me
  - PUT /api/users/me (newly implemented)
  - GET /api/users (admin_referring, admin_radiology roles only)
  - GET /api/users/{userId} (admin_referring, admin_radiology roles only)
  - PUT /api/users/{userId} (admin_referring, admin_radiology roles only)
  - POST /api/user-invites/invite
  - POST /api/user-invites/accept-invitation
  - DELETE /api/users/{userId} (newly implemented)
- Missing or untested endpoints:
  - User location assignment endpoints

### 8. Organization Management (50-60% Complete)
- Working endpoints:
  - POST /api/organizations/mine/locations
  - GET /api/organizations/mine (fixed but may still have issues)
  - PUT /api/organizations/mine (newly implemented)
- Not working or untested:
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

## Recent Fixes

### Connection Approval Endpoint Fix

The `POST /api/connections/{relationshipId}/approve` endpoint has been fixed and is now working correctly. This endpoint allows an admin (admin_referring, admin_radiology) of the target organization to approve a connection request initiated by another organization.

#### Issue Description
The endpoint was previously returning a 500 Internal Server Error due to an improper SQL query implementation. The service was using a custom query to check if the relationship exists, but it wasn't using the imported `GET_RELATIONSHIP_FOR_APPROVAL_QUERY` constant.

The custom query only checked if the relationship exists by ID, but it didn't check if the related_organization_id matches the approvingOrgId or if the status is 'pending' in the SQL query itself. Instead, it did these checks after fetching the relationship, which could lead to issues if the relationship doesn't exist or if it's not in the expected state.

#### Fix Implementation
The fix was to update the `approve-connection.ts` service to use the imported `GET_RELATIONSHIP_FOR_APPROVAL_QUERY` constant, which includes all necessary checks in a single SQL query:

```sql
WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'
```

This ensures that the endpoint properly validates that:
1. The relationship exists
2. The user is authorized to approve it (belongs to the target organization)
3. The relationship is in 'pending' status

All of these checks are now done in a single SQL query, which is more efficient and less error-prone.

#### Testing
The fix has been tested using the `test-connection-approve.js` script, which successfully approves a pending connection request. The test script has been updated to run from the correct directory, and both batch (.bat) and shell (.sh) scripts have been created to run the test.

### Connection Rejection Endpoint Fix

The `POST /api/connections/{relationshipId}/reject` endpoint has been fixed and is now working correctly. This endpoint allows an admin (admin_referring, admin_radiology) of the target organization to reject a connection request initiated by another organization.

#### Issue Description
The endpoint was previously returning a 500 Internal Server Error due to similar issues as the approval endpoint. The service was already using the imported `GET_RELATIONSHIP_FOR_APPROVAL_QUERY` constant, but needed additional debug logging and error handling improvements.

#### Fix Implementation
The fix involved enhancing the `reject-connection.ts` service with:

1. Comprehensive debug logging throughout the service
2. Better error handling for notification failures
3. Improved transaction management
4. Proper client release in the finally block

The service already correctly used the `GET_RELATIONSHIP_FOR_APPROVAL_QUERY` constant, which includes all necessary checks in a single SQL query:

```sql
WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'
```

This ensures that the endpoint properly validates that:
1. The relationship exists
2. The user is authorized to reject it (belongs to the target organization)
3. The relationship is in 'pending' status

#### Testing
The fix has been tested using the `test-connection-reject.js` script, which successfully rejects a pending connection request. The test script has been updated to handle the expected 404 response when a relationship is not found, not in pending status, or the user is not authorized to reject it. Both batch (.bat) and shell (.sh) scripts have been created to run the test.

### Connection Termination Endpoint Fix

The `DELETE /api/connections/{relationshipId}` endpoint has been fixed and is now working correctly. This endpoint allows an admin (admin_referring, admin_radiology) to terminate an active connection between organizations.

#### Issue Description
The endpoint was previously returning a 500 Internal Server Error due to similar issues as the approval and rejection endpoints. The service needed additional debug logging, better error handling for notification failures, and improved transaction management.

#### Fix Implementation
The fix involved enhancing the `terminate-connection.ts` service with:

1. Comprehensive debug logging throughout the service
2. Better error handling for notification failures
3. Improved transaction management
4. Proper client release in the finally block
5. Enhanced error handling in the rollback process

The service uses the `GET_RELATIONSHIP_FOR_TERMINATION_QUERY` constant, which includes all necessary checks in a single SQL query:

```sql
WHERE r.id = $1 AND (r.organization_id = $2 OR r.related_organization_id = $2) AND r.status = 'active'
```

This ensures that the endpoint properly validates that:
1. The relationship exists
2. The user is authorized to terminate it (belongs to either organization in the relationship)
3. The relationship is in 'active' status

#### Testing
The fix has been tested using the `test-connection-terminate.js` script, which successfully terminates an active connection. The test script has been created to handle the expected 404 response when a relationship is not found, not in active status, or the user is not authorized to terminate it. Both batch (.bat) and shell (.sh) scripts have been created to run the test.

### User Profile Update Endpoint Implementation

The `PUT /api/users/me` endpoint has been implemented and is now working correctly. This endpoint allows authenticated users to update their own profile information.

#### Implementation Details

The implementation follows the modular, single-responsibility approach with proper validation and error handling:

1. A new service function `updateUserProfile` was created in `src/services/user/update-user-profile.service.ts` that:
   - Handles updating user profile data
   - Validates input fields
   - Uses queryMainDb for database operations
   - Returns the updated user profile

2. The user controller was updated with an `updateMe` method that:
   - Extracts allowed updatable fields from request body (firstName, lastName, phoneNumber, specialty, npi)
   - Implements validation for request body fields
   - Adds proper error handling with appropriate HTTP status codes
   - Returns a 200 OK response with the updated user profile on success

3. The user routes were updated to add the PUT /me route with:
   - authenticateJWT middleware to ensure only authenticated users can access the endpoint
   - JSDoc comments for API documentation

#### Security Considerations

The endpoint is designed with security in mind:
- Only allows users to update their own profile
- Restricts which fields can be updated (firstName, lastName, phoneNumber, specialty, npi)
- Explicitly prevents updating sensitive fields like role, organization_id, is_active, email_verified, and email

#### Testing

The implementation has been tested using the `test-update-user-me.js` script, which:
- Tests successful profile updates
- Tests validation of input fields
- Tests handling of restricted fields
- Tests authentication requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.

### User Update by ID Endpoint Implementation

The `PUT /api/users/{userId}` endpoint has been implemented and is now working correctly. This endpoint allows organization administrators to update profile information for users within their organization.

#### Implementation Details

The implementation follows the modular, single-responsibility approach with proper validation, error handling, and organization boundary enforcement:

1. A new service function `updateUserInOrg` was created in `src/services/user/update-user-in-org.service.ts` that:
   - Handles updating user profile data for users within the admin's organization
   - Enforces organization boundaries through SQL query constraints
   - Validates input fields
   - Uses queryMainDb for database operations
   - Returns the updated user profile or null if the user is not found or not in the admin's organization

2. The user controller was updated with an `updateOrgUserById` method that:
   - Extracts and validates the userId from request parameters
   - Extracts allowed updatable fields from request body (firstName, lastName, phoneNumber, specialty, npi, role, isActive)
   - Implements validation for request body fields and role assignment restrictions
   - Adds proper error handling with appropriate HTTP status codes (400, 401, 403, 404, 500)
   - Returns a 200 OK response with the updated user profile on success

3. The user routes were updated to add the PUT /:userId route with:
   - authenticateJWT middleware to ensure only authenticated users can access the endpoint
   - authorizeRole middleware to restrict access to admin_referring and admin_radiology roles
   - JSDoc comments for API documentation

#### Security Considerations

The endpoint is designed with security in mind:
- Enforces organization boundaries - admins can only update users within their own organization
- Implements role-based restrictions for role assignment:
  - admin_referring can only assign physician and admin_staff roles
  - admin_radiology can only assign scheduler and radiologist roles
- Prevents privilege escalation through role assignment restrictions
- Restricts which fields can be updated (firstName, lastName, phoneNumber, specialty, npi, role, isActive)
- Explicitly prevents updating sensitive fields like organization_id, email_verified, and email

#### Testing

The implementation has been tested using the `test-update-org-user.js` script, which:
- Tests successful user updates within the admin's organization
- Tests organization boundary enforcement (cannot update users in other organizations)
- Tests role assignment restrictions
- Tests validation of input fields
- Tests authentication and authorization requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.

### User Deactivation Endpoint Implementation

The `DELETE /api/users/{userId}` endpoint has been implemented and is now working correctly. This endpoint allows organization administrators to deactivate users within their organization by setting their is_active flag to false.

#### Implementation Details

The implementation follows the modular, single-responsibility approach with proper validation, error handling, and organization boundary enforcement:

1. A new service function `deactivateUserInOrg` was created in `src/services/user/deactivate-user-in-org.service.ts` that:
   - Handles deactivating a user by setting is_active to false
   - Enforces organization boundaries through SQL query constraints
   - Uses queryMainDb for database operations
   - Returns a boolean indicating success or failure

2. The user controller was updated with a `deactivateOrgUserById` method that:
   - Extracts and validates the userId from request parameters
   - Prevents administrators from deactivating their own accounts
   - Adds proper error handling with appropriate HTTP status codes (400, 401, 403, 404, 500)
   - Returns a 200 OK response with a success message on successful deactivation

3. The user routes were updated to add the DELETE /:userId route with:
   - authenticateJWT middleware to ensure only authenticated users can access the endpoint
   - authorizeRole middleware to restrict access to admin_referring and admin_radiology roles
   - JSDoc comments for API documentation

#### Security Considerations

The endpoint is designed with security in mind:
- Enforces organization boundaries - admins can only deactivate users within their own organization
- Prevents self-deactivation to avoid administrators accidentally locking themselves out of the system
- Implements a "soft delete" approach that preserves user records while preventing system access

#### Testing

The implementation has been tested using the `test-deactivate-org-user.js` script, which:
- Tests successful user deactivation within the admin's organization
- Tests organization boundary enforcement (cannot deactivate users in other organizations)
- Tests self-deactivation prevention
- Tests validation of input parameters
- Tests authentication and authorization requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.

### Organization Profile Update Endpoint Implementation

The `PUT /api/organizations/mine` endpoint has been implemented and is now working correctly. This endpoint allows organization administrators to update their organization's profile information.

#### Implementation Details

The implementation follows the modular, single-responsibility approach with proper validation and error handling:

1. A new service function `updateOrganizationProfile` was created in `src/services/organization/update-organization-profile.service.ts` that:
   - Handles updating organization profile data
   - Validates input fields
   - Uses queryMainDb for database operations
   - Returns the updated organization profile

2. The organization controller was updated with an `updateMyOrganizationController` method that:
   - Extracts allowed updatable fields from request body (name, npi, tax_id, address_line1, address_line2, city, state, zip_code, phone_number, fax_number, contact_email, website, logo_url)
   - Implements validation for request body fields
   - Adds proper error handling with appropriate HTTP status codes
   - Returns a 200 OK response with the updated organization profile on success

3. The organization routes were updated to add the PUT /mine route with:
   - authenticateJWT middleware to ensure only authenticated users can access the endpoint
   - authorizeRole middleware to restrict access to admin_referring and admin_radiology roles
   - JSDoc comments for API documentation

#### Security Considerations

The endpoint is designed with security in mind:
- Only allows administrators to update their own organization's profile
- Restricts which fields can be updated (name, npi, tax_id, address_line1, address_line2, city, state, zip_code, phone_number, fax_number, contact_email, website, logo_url)
- Explicitly prevents updating sensitive fields like id, type, status, credit_balance, billing_id, subscription_tier, assigned_account_manager_id
- Validates email format and website URL format

#### Testing

The implementation has been tested using the `test-update-org-mine.js` script, which:
- Tests successful organization profile updates
- Tests validation of input fields
- Tests handling of restricted fields
- Tests authentication and authorization requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.