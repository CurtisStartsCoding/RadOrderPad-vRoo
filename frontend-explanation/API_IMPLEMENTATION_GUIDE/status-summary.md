# API Status Summary

This document provides a summary of the working and non-working endpoints in the RadOrderPad API, based on comprehensive testing performed against the production deployment.

## Working Endpoints

The following endpoints were tested and are working correctly in the production deployment:

### Authentication
- `POST /api/auth/login`: Works correctly for all roles (admin_staff, physician, admin_referring, super_admin, admin_radiology, scheduler, radiologist)

### Health Check
- `GET /health`: Health check endpoint

### Order Management
- `GET /api/orders`: List orders (tested with admin_staff, physician, and admin_referring roles)
- `GET /api/orders?status=pending_admin`: Filter orders by status
- `GET /api/orders?status=pending_validation`: Filter orders by status
- `GET /api/orders?status=all`: Get all orders regardless of status
- `GET /api/orders/{orderId}`: Get order details (tested with admin_staff role)
- `POST /api/orders/validate`: Validate dictation text and generate suggested CPT and ICD-10 codes (confirmed working, requires increased timeout of 30 seconds)
- `PUT /api/orders/{orderId}`: Update order with validation results and signature

### Radiology Order Management
- `GET /api/radiology/orders`: List radiology orders (tested with scheduler role)
- `GET /api/radiology/orders/{orderId}`: Get radiology order details
- `POST /api/radiology/orders/{orderId}/update-status`: Update radiology order status
- `GET /api/radiology/orders/{orderId}/export/{format}`: Export radiology order

### Admin Order Management
- `GET /api/admin/orders/queue`: List orders awaiting admin finalization (tested with admin_staff role)
- `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`: Send order to radiology (tested with admin_staff role)

### Connection Management
- `GET /api/connections`: List connections (tested with admin_referring role)
- `GET /api/connections/requests`: List pending incoming connection requests (tested with admin_referring role)
- `POST /api/connections/{relationshipId}/approve`: Approve a pending connection request (tested with admin_radiology role)
- `POST /api/connections/{relationshipId}/reject`: Reject a pending connection request (tested with admin_radiology role)
- `DELETE /api/connections/{relationshipId}`: Terminate an active connection (tested with admin_radiology role)

### Superadmin Management
- `GET /api/superadmin/organizations`: List all organizations (super_admin role only)
- `GET /api/superadmin/users`: List all users (super_admin role only)

### User Management
- `GET /api/users/me`: Get the profile of the currently authenticated user (tested with all roles)
- `PUT /api/users/me`: Update the profile of the currently authenticated user (tested with all roles)
- `GET /api/users`: List all users belonging to the authenticated administrator's organization (tested with admin_referring and admin_radiology roles)
- `POST /api/user-invites/invite`: Invite a new user to join the organization (tested with admin_referring role)
- `POST /api/user-invites/accept-invitation`: Accept an invitation and create a user account (public endpoint)

### Billing Management
- `POST /api/billing/create-checkout-session`: Create a Stripe checkout session for purchasing credit bundles
- `POST /api/billing/subscriptions`: Create a Stripe subscription for a specific pricing tier

## Endpoints with Method Restrictions

The following endpoints have specific method restrictions by design:

- `GET /api/auth/login`: Returns 404 "Route not found" error - This is by design as the login endpoint only accepts POST requests
- `POST /api/orders` (direct order creation): Returns 404 "Route not found" error - This is by design, as order creation is handled implicitly by the `/api/orders/validate` endpoint when called without an existing orderId

## Endpoints with Path Restrictions

The following endpoints have specific path restrictions by design:

- `GET /api/organizations`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use organization-specific endpoints instead.
- `GET /api/superadmin`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use specific superadmin endpoints like `GET /api/superadmin/users` or `GET /api/superadmin/organizations` instead

## Endpoints with Role Restrictions

The following endpoints work correctly but are restricted to specific roles:

- `GET /api/superadmin/organizations`: Works correctly and returns a list of all organizations (super_admin role only)
- `GET /api/superadmin/users`: Works correctly and returns a list of all users (super_admin role only)
- `GET /api/users`: Works correctly and returns a list of users in the authenticated user's organization (admin_referring and admin_radiology roles only)
- `GET /api/radiology/orders`: Works correctly but is restricted to scheduler and admin_radiology roles
- `GET /api/connections`: Works correctly but is restricted to admin_referring and admin_radiology roles
- `GET /api/connections/requests`: Works correctly but is restricted to admin_referring and admin_radiology roles
- `POST /api/user-invites/invite`: Works correctly but is restricted to admin_referring and admin_radiology roles

## Non-Working or Not Implemented Endpoints

The following endpoints were tested but are not currently working in the production deployment:

- `GET /api/organizations/mine`: Returns 501 "Not implemented yet" error - The endpoint exists but is not fully implemented
- `GET /api/billing`: Returns 404 "Route not found" error - The dist/routes/billing.routes.js file does not define a handler for the base GET / path. It only defines POST routes for creating checkout sessions and subscriptions.

## Implementation Recommendations for Frontend Developers

Based on the testing results, frontend developers should:

1. **Use the working endpoints** for core functionality:
   - Authentication
   - Order listing and filtering
   - Order validation (with CPT and ICD-10 code suggestions)
   - Order details retrieval
   - Sending orders to radiology
   - User invitation

2. **Be aware of role restrictions** when implementing features:
   - Ensure the user has the appropriate role before attempting to access role-restricted endpoints
   - Implement proper error handling for 403 Forbidden responses

3. **Handle timeouts appropriately** for the validation endpoint:
   - The validation endpoint can take 11-15 seconds to complete
   - Implement a loading state and progress indicator
   - Set request timeouts to at least 30 seconds

4. **Use implicit order creation** through the validation endpoint:
   - There is no separate endpoint for order creation
   - New orders are created by calling the validation endpoint without an orderId

5. **Implement proper error handling** for non-working endpoints:
   - Some endpoints may return 404 or 501 errors
   - Implement fallback behavior or disable features that rely on non-working endpoints

6. **Implement user invitation and acceptance functionality**:
   - Use the `POST /api/user-invites/invite` endpoint to invite new users
   - Ensure proper validation of email format and role
   - Handle 409 Conflict responses for duplicate invitations
   - Restrict invitation access to admin_referring and admin_radiology roles only
   - Implement a form for invited users to accept invitations using the `POST /api/user-invites/accept-invitation` endpoint
   - Validate password strength and required fields
   - Store the JWT token returned upon successful acceptance for authentication
|
7. **Consider implementing the missing GET /api/billing endpoint** if billing information is needed:
   - This would require backend changes to add the endpoint
   - In the meantime, consider using alternative approaches to display billing information