# User Management Endpoint Implementations

## User Profile Update Endpoint Implementation

The `PUT /api/users/me` endpoint has been implemented and is now working correctly. This endpoint allows authenticated users to update their own profile information.

### Implementation Details

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

### Security Considerations

The endpoint is designed with security in mind:
- Only allows users to update their own profile
- Restricts which fields can be updated (firstName, lastName, phoneNumber, specialty, npi)
- Explicitly prevents updating sensitive fields like role, organization_id, is_active, email_verified, and email

### Testing

The implementation has been tested using the `test-update-user-me.js` script, which:
- Tests successful profile updates
- Tests validation of input fields
- Tests handling of restricted fields
- Tests authentication requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.

## User Update by ID Endpoint Implementation

The `PUT /api/users/{userId}` endpoint has been implemented and is now working correctly. This endpoint allows organization administrators to update profile information for users within their organization.

### Implementation Details

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

### Security Considerations

The endpoint is designed with security in mind:
- Enforces organization boundaries - admins can only update users within their own organization
- Implements role-based restrictions for role assignment:
  - admin_referring can only assign physician and admin_staff roles
  - admin_radiology can only assign scheduler and radiologist roles
- Prevents privilege escalation through role assignment restrictions
- Restricts which fields can be updated (firstName, lastName, phoneNumber, specialty, npi, role, isActive)
- Explicitly prevents updating sensitive fields like organization_id, email_verified, and email

### Testing

The implementation has been tested using the `test-update-org-user.js` script, which:
- Tests successful user updates within the admin's organization
- Tests organization boundary enforcement (cannot update users in other organizations)
- Tests role assignment restrictions
- Tests validation of input fields
- Tests authentication and authorization requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.

## User Deactivation Endpoint Implementation

The `DELETE /api/users/{userId}` endpoint has been implemented and is now working correctly. This endpoint allows organization administrators to deactivate users within their organization by setting their is_active flag to false.

### Implementation Details

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

### Security Considerations

The endpoint is designed with security in mind:
- Enforces organization boundaries - admins can only deactivate users within their own organization
- Prevents self-deactivation to avoid administrators accidentally locking themselves out of the system
- Implements a "soft delete" approach that preserves user records while preventing system access

### Testing

The implementation has been tested using the `test-deactivate-org-user.js` script, which:
- Tests successful user deactivation within the admin's organization
- Tests organization boundary enforcement (cannot deactivate users in other organizations)
- Tests self-deactivation prevention
- Tests validation of input parameters
- Tests authentication and authorization requirements

Both batch (.bat) and shell (.sh) scripts have been created to run the test.