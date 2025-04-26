# RadOrderPad API Implementation Guide

This guide provides detailed information about the API endpoints available in the RadOrderPad application, based on comprehensive testing performed against the production deployment at `https://api.radorderpad.com`.

## Overview

The RadOrderPad API is organized into several logical sections:

1. [Authentication](./authentication.md) - Login and token management
2. [Health Check](./health.md) - System status endpoint
3. [Order Management](./order-management.md) - Endpoints for managing orders
4. [Admin Finalization](./admin-finalization-api-guide.md) - Detailed guide for the admin finalization workflow and "Send to Radiology" functionality
   - [Admin Finalization API Specification](./openapi-admin-finalization.yaml) - OpenAPI specification focused on the admin finalization workflow
5. [Radiology Order Management](./radiology-order-management.md) - Endpoints for radiology orders
6. [Superadmin Management](./superadmin-management.md) - Superadmin-specific endpoints
   - [Superadmin Logs](./superadmin-logs.md) - Detailed implementation of the Super Admin logs endpoints for system monitoring
7. [Connection Management](./connection-management.md) - Managing connections between organizations
   - [Connection Management Details](./connection-management-details.md) - Detailed information about connection endpoints
   - [Connection Testing](./connection-testing.md) - Guide for testing connection endpoints
   - [Connection Management API Specification](./openapi-connection-management.yaml) - OpenAPI specification focused on connection management
   - **Key Endpoint**: `GET /api/connections/requests` - Lists pending incoming connection requests (see [SQL Implementation Patterns](#sql-implementation-patterns))
8. [Organization Management](./organization-management.md) - Organization-related endpoints
   - [Organizations/Mine Fix](./organizations-mine-fix.md) - Detailed documentation of the fix for the organizations/mine endpoint
   - [Organizations/Mine Summary](./organizations-mine-summary.md) - Summary of recent improvements to the organizations/mine endpoint
9. [User Management](./user-management.md) - User-related endpoints
   - [User Invitation Details](./user-invitation-details.md) - Detailed implementation of user invitation feature
   - [User Location Assignment Guide](./user-location-assignment-guide.md) - Detailed guide for implementing user location assignment functionality
   - [User Management API Specification](./openapi-user-management.yaml) - OpenAPI specification focused on user management, invitation, and location assignment
   - **Key Endpoints**:
     - `GET /api/users/me` - Retrieves profile information for the authenticated user
     - `PUT /api/users/me` - Updates profile information for the authenticated user
     - `GET /api/users` - Lists all users belonging to the authenticated administrator's organization
     - `GET /api/users/{userId}` - Retrieves profile information for a specific user in the admin's organization
     - `PUT /api/users/{userId}` - Updates profile information for a specific user in the admin's organization
     - `DELETE /api/users/{userId}` - Deactivates a specific user in the admin's organization
10. [Billing Management](./billing-management.md) - Billing and subscription endpoints
11. [Uploads Management](./uploads-management.md) - File upload endpoints
    - **Key Endpoints**:
      - `POST /api/uploads/presigned-url` - Generates a presigned URL for uploading a file to S3
      - `POST /api/uploads/confirm` - Confirms a file upload and creates a database record
12. [Validation Engine](./validation-engine.md) - Clinical indications processing and code assignment
    - [Validation Workflow Guide](./validation-workflow-guide.md) - Detailed explanation of the validation workflow
    - [Validation Engine Integration](./validation-engine-integration.md) - Technical guide for frontend integration
    - [Validation-Focused API Specification](./openapi-validation-focused.yaml) - OpenAPI specification focused on the validation engine
13. [Workflow Guide](./workflow-guide.md) - End-to-end API workflow examples
14. [Status Summary](./status-summary.md) - Overview of working and non-working endpoints
15. [Trial Feature](./trial_feature.md) - Implementation of the Physician Trial Sandbox feature
16. [Recent Implementations](./README-recent-implementations.md) - Detailed documentation of recent API implementations and fixes

## OpenAPI Specifications

To make the API documentation more manageable and focused, we've created separate OpenAPI specification files for key functional areas:

1. **[Validation Engine API Specification](./openapi-validation-focused.yaml)** - Focused on the validation engine that processes clinical indications and assigns CPT and ICD-10 codes
   - Detailed schemas for validation requests and responses
   - Examples of different validation scenarios
   - Comprehensive documentation of the validation workflow

2. **[Admin Finalization API Specification](./openapi-admin-finalization.yaml)** - Focused on the admin finalization workflow
   - Endpoints for managing the admin order queue
   - Patient and insurance information updates
   - The critical "Send to Radiology" functionality
   - Dual database architecture considerations

3. **[Connection Management API Specification](./openapi-connection-management.yaml)** - Focused on connection management between organizations
   - Creating and managing connection requests
   - Approving and rejecting connections
   - SQL implementation patterns for nullable relationships

4. **[User Management API Specification](./openapi-user-management.yaml)** - Focused on user management
   - User profile management
   - User invitation system
   - User location assignment

These modular specifications provide more detailed documentation for specific functional areas, making the API documentation easier to navigate and understand.

## Core Functionality

### Validation Engine

The RadOrderPad validation engine is the heart of the system, processing clinical indications from physician dictation to assign appropriate CPT and ICD-10 codes. This functionality is critical for ensuring accurate medical coding and compliance with clinical guidelines.

Key aspects of the validation engine include:

1. **LLM Orchestration**
   - Primary: Claude 3.7
   - Fallbacks: Grok 3 → GPT-4.0
   - Uses specialized prompts for different validation scenarios

2. **Validation Workflow**
   - Initial dictation → Validation processing → Clarification loop (if needed) → Override flow (after 3 failed attempts) → Finalization
   - Each step is clearly documented with API endpoints and request/response formats

3. **Best Practices for Clinical Dictation**
   - Patient demographics (age, gender)
   - Clinical symptoms (location, duration, severity)
   - Relevant history (prior diagnoses, treatments)
   - Clinical reasoning (suspected diagnosis, reason for study)

For detailed implementation guidance, refer to the validation documentation linked in the overview section.

### Admin Finalization Workflow

The Admin Finalization workflow is a critical part of the system that allows administrative staff to add EMR context and send orders to radiology after they've been signed by physicians.

Key aspects of the admin finalization workflow include:

1. **Dual Database Architecture**
   - PHI Database: Contains Protected Health Information (patient data, orders, clinical indications)
   - Main Database: Contains non-PHI data (organizations, users, credit balances)
   - Proper transaction management across both databases

2. **Admin Workflow Steps**
   - Access the Queue: Admin staff access the queue of pending admin orders
   - Add Patient Information: Update patient demographics (address, city, state, zip code, etc.)
   - Add Insurance Information: Update insurance details if applicable
   - Add Supplemental Documentation: Paste any supplemental documentation from EMR
   - Final Review: Review all information for accuracy
   - Send to Radiology: Finalize the order and send it to the radiology group

3. **Credit Management**
   - Checks organization credit balance before sending to radiology
   - Decrements credits upon successful submission
   - Handles insufficient credit scenarios

For detailed implementation guidance, refer to the admin finalization documentation linked in the overview section.

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
- `trial_physician` - Trial users with limited access

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

### 1. Admin Finalization (100% Complete)
- Working endpoints:
  - GET /api/admin/orders/queue
  - POST /api/admin/orders/{orderId}/send-to-radiology-fixed
  - POST /api/admin/orders/{orderId}/paste-summary
  - POST /api/admin/orders/{orderId}/paste-supplemental
  - PUT /api/admin/orders/{orderId}/patient-info
  - PUT /api/admin/orders/{orderId}/insurance-info
- Fixed issues:
  - Database connection issue in send-to-radiology endpoint
  - Proper transaction management across PHI and Main databases
  - Credit consumption and validation

### 2. Connection Management (100% Complete)
- Working endpoints:
  - GET /api/connections
  - GET /api/connections/requests
  - POST /api/connections
  - POST /api/connections/{relationshipId}/approve (fixed - previously returned 500 error)
  - POST /api/connections/{relationshipId}/reject (fixed - previously returned 500 error)
  - DELETE /api/connections/{relationshipId} (fixed - previously returned 500 error)

### 3. Authentication & User Invitation (100% Complete)
- All endpoints are working and tested:
  - POST /api/auth/login
  - POST /api/auth/register
  - POST /api/user-invites/invite
  - POST /api/user-invites/accept-invitation
  - POST /api/auth/trial/register (new)
  - POST /api/auth/trial/login (new)

### 4. Radiology Workflow (80-90% Complete)
- Most endpoints are working and tested:
  - GET /api/radiology/orders
  - GET /api/radiology/orders/{orderId}
  - POST /api/radiology/orders/{orderId}/update-status
  - GET /api/radiology/orders/{orderId}/export/{format}
  - POST /api/radiology/orders/{orderId}/request-info (implemented but may not have specific tests)

### 5. Order Management (90-100% Complete)
- All core endpoints are working and tested:
  - GET /api/orders (with filtering)
  - GET /api/orders/{orderId}
  - POST /api/orders/validate
  - PUT /api/orders/{orderId}
  - POST /api/orders/validate/trial (new)

### 6. Billing Management (100% Complete)
- All endpoints are working and tested:
  - GET /api/billing (implemented - billing overview for organization admins)
  - POST /api/billing/create-checkout-session
  - POST /api/billing/subscriptions
  - GET /api/billing/credit-balance (implemented)
  - GET /api/billing/credit-usage (implemented)
- Internal webhook handling and credit management are implemented

### 7. User Management (100% Complete)
- Working endpoints:
  - GET /api/users/me
  - PUT /api/users/me (implemented)
  - GET /api/users (admin_referring, admin_radiology roles only)
  - GET /api/users/{userId} (admin_referring, admin_radiology roles only)
  - PUT /api/users/{userId} (admin_referring, admin_radiology roles only)
  - POST /api/user-invites/invite
  - POST /api/user-invites/accept-invitation
  - DELETE /api/users/{userId} (implemented)
  - GET /api/user-locations/{userId}/locations (implemented)
  - POST /api/user-locations/{userId}/locations/{locationId} (implemented)
  - DELETE /api/user-locations/{userId}/locations/{locationId} (implemented)

### 8. Organization Management (80-90% Complete)
- Working endpoints:
  - POST /api/organizations/mine/locations
  - GET /api/organizations/mine (fixed but may still have issues)
  - PUT /api/organizations/mine (implemented)
  - GET /api/organizations (implemented - search for potential partner organizations)
  - GET /api/organizations/mine/locations/{locationId} (implemented)
  - PUT /api/organizations/mine/locations/{locationId} (implemented)
  - DELETE /api/organizations/mine/locations/{locationId} (implemented)
- Not working or untested:
  - GET /api/organizations/{organizationId} (by design)
  - PUT /api/organizations/{organizationId} (by design)

### 9. Superadmin Management (100% Complete)
- Working endpoints:
  - GET /api/superadmin/organizations - List all organizations with filtering
  - GET /api/superadmin/organizations/{orgId} - Get detailed organization info
  - PUT /api/superadmin/organizations/{orgId}/status - Update organization status
  - POST /api/superadmin/organizations/{orgId}/credits/adjust - Adjust organization credits
  - GET /api/superadmin/users - List all users with filtering
  - GET /api/superadmin/users/{userId} - Get detailed user info
  - PUT /api/superadmin/users/{userId}/status - Update user status
  - GET /api/superadmin/logs/validation - Basic validation logs
  - GET /api/superadmin/logs/validation/enhanced - Enhanced validation logs with advanced filtering
  - GET /api/superadmin/logs/credits - Credit usage logs
  - GET /api/superadmin/logs/purgatory - Purgatory events logs
  - All prompt template endpoints (/api/superadmin/prompts/templates/*)
  - All prompt assignment endpoints (/api/superadmin/prompts/assignments/*)

### 10. Uploads Management (100% Complete)
- Working endpoints:
  - POST /api/uploads/presigned-url - Generates a presigned URL for direct S3 upload
  - POST /api/uploads/confirm - Confirms successful S3 upload and creates a database record in the PHI database
  - GET /api/uploads/{documentId}/download-url - Generates a presigned URL for downloading a previously uploaded file
- Full end-to-end testing implemented:
  - Complete flow from getting presigned URL to confirming upload and downloading files
  - Test scripts demonstrate the expected behavior with proper error handling
  - Tests handle the case where S3 upload is skipped (due to lack of permissions in test environments)
  - Comprehensive error handling and edge case testing
  - Authorization checks ensure users can only access files associated with their organization

### 11. Trial Feature (100% Complete)
- Working endpoints:
  - POST /api/auth/trial/register - Register a trial user
  - POST /api/auth/trial/login - Login as a trial user
  - POST /api/orders/validate/trial - Submit dictation for validation as a trial user
- Full implementation with:
  - Separate trial_users table in the Main database
  - Validation count tracking and limiting
  - No PHI storage for trial users
  - Proper authentication and authorization

## Recent Fixes

For a comprehensive overview of all recent implementations and fixes, see the [Recent Implementations](./README-recent-implementations.md) document.

### Super Admin Logs Implementation

The Super Admin logs endpoints have been implemented to provide comprehensive visibility into system activities. These endpoints allow Super Admins to monitor and troubleshoot the platform with robust filtering, pagination, and sorting capabilities.

Key aspects of the implementation include:

1. **Four Log Types**
   - Basic LLM validation logs (`GET /api/superadmin/logs/validation`)
   - Enhanced LLM validation logs with advanced filtering (`GET /api/superadmin/logs/validation/enhanced`)
   - Credit usage logs (`GET /api/superadmin/logs/credits`)
   - Purgatory events (`GET /api/superadmin/logs/purgatory`)

2. **Advanced Filtering Capabilities**
   - Multiple status selection
   - Text search across relevant fields
   - Date presets for common time ranges
   - Sorting options

3. **Efficient Database Queries**
   - Parameterized queries to prevent SQL injection
   - Pagination to handle large volumes of log data
   - Joins with related tables to include user and organization names

For detailed implementation information, see the [Superadmin Logs](./superadmin-logs.md) document.

### Trial Feature Implementation

The Physician Trial Sandbox feature has been implemented to allow physicians to register for a limited trial account focused solely on testing the dictation-validation workflow. This feature provides a way for physicians to try the validation engine without full registration or PHI involvement.

Key aspects of the implementation include:

1. **Separate Trial User Management**
   - New `trial_users` table in the Main database
   - Limited validation count (default: 10)
   - No PHI storage

2. **Trial-specific Endpoints**
   - `POST /api/auth/trial/register` - Register a trial user
   - `POST /api/auth/trial/login` - Login as a trial user
   - `POST /api/orders/validate/trial` - Submit dictation for validation as a trial user

3. **Security Considerations**
   - Complete separation between trial user data/workflows and production data/workflows
   - No interaction with the PHI database
   - Proper validation of trial user credentials

For detailed implementation information, see the [Trial Feature](./trial_feature.md) document.

### Admin Finalization "Send to Radiology" Fix

The `POST /api/admin/orders/{orderId}/send-to-radiology-fixed` endpoint has been implemented to fix issues with the original send-to-radiology endpoint. This endpoint is critical for the admin finalization workflow, allowing administrative staff to send validated and signed orders to radiology organizations.

#### Issue Description
The original endpoint was failing with a 500 error due to database connection issues. The root cause was:
- The endpoint needed to interact with both PHI and Main databases
- It was using a single database connection (PHI) to try to access tables in both databases
- It was using incorrect column names for the order_history table

#### Fix Implementation
The fix includes:
- Proper dual database connections for PHI and Main databases
- Transaction management across both databases
- Correct column names for the order_history table
- Credit balance validation and consumption
- Comprehensive error handling

For detailed implementation information, see the [Admin Finalization API Guide](./admin-finalization-api-guide.md) document.