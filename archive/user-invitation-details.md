# User Invitation Implementation Details

This document provides detailed information about the implementation of the user invitation feature in the RadOrderPad API.

## Overview

The user invitation feature allows organization administrators (`admin_referring` or `admin_radiology`) to invite new users to join their organization with specific roles. When an invitation is sent, the system generates a secure token, stores it in the database, and sends an email to the invited user with a link to complete their registration.

## API Endpoints

### POST /api/user-invites/invite

**Description:** Invites a new user to join the organization by sending an email with a secure invitation link.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Request Body:**
```json
{
  "email": "new.user@example.com",
  "role": "physician"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Invitation sent successfully"
}
```

**Error Responses:**
- 400 Bad Request: If the email format is invalid or the role is not valid
  ```json
  {
    "success": false,
    "message": "Invalid email format"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Invalid role. Valid roles are: physician, admin_staff, scheduler, radiologist"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Email and role are required"
  }
  ```

- 401 Unauthorized: If the user is not authenticated
  ```json
  {
    "message": "Authorization header missing"
  }
  ```
  or
  ```json
  {
    "message": "Invalid or expired token"
  }
  ```

- 403 Forbidden: If the user does not have the appropriate role
  ```json
  {
    "message": "Access denied: Insufficient permissions",
    "requiredRoles": ["admin_referring", "admin_radiology"],
    "userRole": "physician"
  }
  ```

- 409 Conflict: If an invitation is already pending for this email address
  ```json
  {
    "success": false,
    "message": "An invitation is already pending for this email address"
  }
  ```

- 500 Internal Server Error: If there is a server error

### POST /api/user-invites/accept-invitation

**Description:** Allows invited users to accept invitations and create their accounts.

**Authentication:** None required (public endpoint)

**Request Body:**
```json
{
  "token": "invitation_token_from_email",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "jwt_token_for_authentication",
  "user": {
    "id": 123,
    "email": "john.doe@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "physician",
    "organization_id": 456,
    "is_active": true,
    "email_verified": true,
    "created_at": "2025-04-23T17:30:00.000Z",
    "updated_at": "2025-04-23T17:30:00.000Z"
  }
}
```

**Error Responses:**
- 400 Bad Request: If the token is invalid or expired
  ```json
  {
    "success": false,
    "message": "Invalid invitation token"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Invitation has already been used or expired"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Invitation has expired"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Token, password, first name, and last name are required"
  }
  ```
  or
  ```json
  {
    "success": false,
    "message": "Password must be at least 8 characters long"
  }
  ```

- 409 Conflict: If a user with the email already exists
  ```json
  {
    "success": false,
    "message": "User with this email already exists"
  }
  ```

- 500 Internal Server Error: If there is a server error

## Implementation Details

### Backend Components

1. **Routes**
   - `src/routes/user-invite.routes.ts`: Defines the route for user invitation
   - Updated `src/routes/index.ts` to include the new routes

2. **Controller**
   - `src/controllers/user-invite.controller.ts`: Handles request validation and orchestrates the invitation and acceptance processes

3. **Service**
   - `src/services/user-invite/invite-user.service.ts`: Core business logic for user invitation
   - `src/services/user-invite/accept-invitation.service.ts`: Core business logic for invitation acceptance
   - `src/services/user-invite/index.ts`: Barrel file for service exports

4. **Utilities**
   - `src/utils/validation.ts`: Email validation utility
   - `src/utils/token.utils.ts`: JWT token generation utility

### Database Interactions

The implementation interacts with the following tables in the main database:

- `users`: Checks if a user with the provided email already exists (for invitation) and creates new user records (for acceptance)
- `user_invitations`: Stores invitation details including token, expiry, and status, and updates status when invitations are accepted

### Workflow

#### Invitation Process

1. Admin submits invitation request with email and role
2. System validates input (email format, role validity)
3. System checks for existing user or pending invitation
4. System generates a secure token and sets expiry (7 days)
5. System stores invitation in database
6. System sends invitation email
7. User receives email with invitation link

#### Acceptance Process

1. User clicks on invitation link in email
2. Frontend displays a form to set password and provide name
3. User submits the form with token, password, first name, and last name
4. System validates the token and checks if it's still valid
5. System creates a new user account with the provided information
6. System marks the invitation as accepted
7. System generates a JWT token for the new user
8. User is logged in and redirected to the appropriate page

### Security Considerations

- Only organization admins can invite users
- Invitation tokens are cryptographically secure (32 bytes)
- Tokens have a limited validity period (7 days)
- Email validation prevents invalid addresses
- Password validation ensures minimum security requirements (8+ characters)
- Passwords are securely hashed using bcrypt before storage
- Database transactions ensure atomicity of user creation and invitation update

## Testing

Both endpoints have been thoroughly tested with the following test cases:

### Invitation Endpoint Tests

1. Valid invitation request
2. Invalid email format
3. Invalid role
4. Duplicate invitation
5. Missing email
6. Missing role
7. Non-admin token (should fail with 403)
8. No token (should fail with 401)

### Acceptance Endpoint Tests

1. Valid invitation acceptance
2. Invalid token
3. Expired token
4. Already used token
5. Missing required fields
6. Weak password
7. User already exists

### Test Scripts and Tools

Test scripts have been created for both Windows and Unix environments:
- `debug-scripts/vercel-tests/test-user-invite.bat` and `.sh`
- `debug-scripts/vercel-tests/test-accept-invitation.bat` and `.sh`

#### Token Generator Tool

To facilitate testing with different user roles, a comprehensive token generator script has been created:
- `generate-all-role-tokens.js` - Generates tokens for all 7 roles in the system

This script:
1. Logs in with test credentials for each role
2. Saves the tokens to separate files in a `tokens` directory
3. Creates convenience scripts for setting environment variables

Using this tool significantly simplifies testing role-based permissions for the invitation endpoints, as it provides ready access to admin_referring and admin_radiology tokens required for sending invitations.

### Routing Configuration Fix

During testing, a middleware conflict was identified where both user-location routes and user-invite routes were mounted at the same path ('/users'), causing authentication issues. This was fixed by:

1. Changing the mounting path for user-invite routes from '/users' to '/user-invites' in src/routes/index.ts
2. Updating all test scripts and documentation to reflect the new endpoint paths
3. Verifying that both endpoints work correctly with the new configuration

All tests have been successfully completed against the production server, confirming that the endpoints are working correctly with the fixed routing configuration.

## Frontend Integration

### Invitation Form Integration

To integrate the invitation endpoint with the frontend:

1. Create a user invitation form with fields for email and role
2. Implement validation for the email field
3. Implement a dropdown for role selection with valid roles
4. Send a POST request to `/api/user-invites/invite` with the email and role
5. Handle success and error responses appropriately
6. Display appropriate messages to the user

### Acceptance Form Integration

To integrate the acceptance endpoint with the frontend:

1. Create a route in the frontend application to handle invitation links (e.g., `/accept-invitation?token=xyz`)
2. Extract the token from the URL query parameters
3. Create a form with fields for password, first name, and last name
4. Implement validation for all fields (especially password strength)
5. Send a POST request to `/api/user-invites/accept-invitation` with the token and form data
6. On success, store the returned JWT token for authentication
7. Redirect the user to the appropriate dashboard based on their role
8. Handle error responses with appropriate user feedback

## Future Enhancements

- Implement invitation resending functionality
- Add ability to cancel pending invitations
- Support bulk invitations via CSV upload
- Add configurable invitation expiry periods

## Related Documentation

- `user-management.md`: General user management endpoints
- `authentication.md`: Authentication endpoints
- `organization-management.md`: Organization management endpoints