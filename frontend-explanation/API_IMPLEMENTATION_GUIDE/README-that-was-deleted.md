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

### File Upload Endpoints Implementation

The file upload endpoints have been implemented and are now working correctly. These endpoints enable secure file uploads to AWS S3 using the presigned URL pattern.

#### Implementation Details

1. **POST /api/uploads/presigned-url**
   - Generates a presigned URL for direct S3 upload
   - Validates file type, size, and other parameters
   - Returns a presigned URL and file key to the client
   - Supports various document types (signature, insurance_card, lab_report, etc.)
   - Implements file size limits (20MB for PDFs, 5MB for other file types)

2. **POST /api/uploads/confirm**
   - Confirms that a file has been successfully uploaded to S3
   - Verifies the file exists in S3 before creating a database record
   - Creates a record in the document_uploads table in the PHI database
   - Associates the uploaded file with an order and/or patient
   - Implements proper validation and error handling

#### Security Considerations

The implementation follows the presigned URL pattern for enhanced security:
- The backend controls access and generates temporary, scoped credentials
- S3 bucket remains private with no public access
- Backend AWS credentials are not exposed to the client
- File uploads go directly to S3, offloading the backend API servers
- File type validation prevents uploading of potentially malicious files

#### Testing

Both endpoints have been tested using comprehensive test scripts:
- test-uploads-presigned-url.js/bat/sh for testing the presigned URL endpoint
- test-uploads-confirm.js/bat/sh for testing the confirm endpoint
- Tests include various scenarios: valid requests, missing fields, invalid file types, file size limits, authentication requirements

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