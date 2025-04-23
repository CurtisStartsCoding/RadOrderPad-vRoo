# User Invitation Implementation Details

This document provides detailed information about the implementation of the user invitation feature in the RadOrderPad API.

## Overview

The user invitation feature allows organization administrators (`admin_referring` or `admin_radiology`) to invite new users to join their organization with specific roles. When an invitation is sent, the system generates a secure token, stores it in the database, and sends an email to the invited user with a link to complete their registration.

## API Endpoint

### POST /api/users/invite

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

## Implementation Details

### Backend Components

1. **Routes**
   - `src/routes/user-invite.routes.ts`: Defines the route for user invitation
   - Updated `src/routes/index.ts` to include the new routes

2. **Controller**
   - `src/controllers/user-invite.controller.ts`: Handles request validation and orchestrates the invitation process

3. **Service**
   - `src/services/user-invite/invite-user.service.ts`: Core business logic for user invitation
   - `src/services/user-invite/index.ts`: Barrel file for service exports

4. **Utilities**
   - `src/utils/validation.ts`: Email validation utility

### Database Interactions

The implementation interacts with the following tables in the main database:

- `users`: Checks if a user with the provided email already exists
- `user_invitations`: Stores invitation details including token, expiry, and status

### Workflow

1. Admin submits invitation request with email and role
2. System validates input (email format, role validity)
3. System checks for existing user or pending invitation
4. System generates a secure token and sets expiry (7 days)
5. System stores invitation in database
6. System sends invitation email
7. User receives email and can follow link to complete registration

### Security Considerations

- Only organization admins can invite users
- Invitation tokens are cryptographically secure (32 bytes)
- Tokens have a limited validity period (7 days)
- Email validation prevents invalid addresses

## Testing

The endpoint has been thoroughly tested with the following test cases:

1. Valid invitation request
2. Invalid email format
3. Invalid role
4. Duplicate invitation
5. Missing email
6. Missing role
7. Non-admin token (should fail with 403)
8. No token (should fail with 401)

All tests have been successfully completed, confirming that the endpoint is working correctly.

## Frontend Integration

To integrate this endpoint with the frontend:

1. Create a user invitation form with fields for email and role
2. Implement validation for the email field
3. Implement a dropdown for role selection with valid roles
4. Send a POST request to `/api/users/invite` with the email and role
5. Handle success and error responses appropriately
6. Display appropriate messages to the user

## Future Enhancements

- Implement invitation resending functionality
- Add ability to cancel pending invitations
- Support bulk invitations via CSV upload
- Add configurable invitation expiry periods

## Related Documentation

- `user-management.md`: General user management endpoints
- `authentication.md`: Authentication endpoints
- `organization-management.md`: Organization management endpoints