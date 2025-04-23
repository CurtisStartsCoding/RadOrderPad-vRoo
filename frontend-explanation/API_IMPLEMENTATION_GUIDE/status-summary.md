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
- `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`: Send order to radiology (tested with admin_staff role)

### Connection Management
- `GET /api/connections`: List connections (tested with admin_referring role)

### Superadmin Management
- `GET /api/superadmin/organizations`: List all organizations (super_admin role only)
- `GET /api/superadmin/users`: List all users (super_admin role only)

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
- `GET /api/users`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use `GET /api/superadmin/users` to list all users (super_admin role only)
- `GET /api/superadmin`: Returns 404 "Route not found" error - This is by design as the route is not defined for the base path. Use specific superadmin endpoints like `GET /api/superadmin/users` or `GET /api/superadmin/organizations` instead

## Endpoints with Role Restrictions

The following endpoints work correctly but are restricted to specific roles:

- `GET /api/superadmin/organizations`: Works correctly and returns a list of all organizations (super_admin role only)
- `GET /api/superadmin/users`: Works correctly and returns a list of all users (super_admin role only)
- `GET /api/radiology/orders`: Works correctly but is restricted to scheduler and admin_radiology roles
- `GET /api/connections`: Works correctly but is restricted to admin_referring and admin_radiology roles

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

6. **Consider implementing the missing GET /api/billing endpoint** if billing information is needed:
   - This would require backend changes to add the endpoint
   - In the meantime, consider using alternative approaches to display billing information