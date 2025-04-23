# User Invitation Implementation

**Version:** 1.1
**Date:** 2025-04-23
**Status:** Implemented

This document details the implementation of the user invitation functionality in the RadOrderPad platform, allowing organization admins to invite new users to their organization and for invited users to accept invitations and create their accounts.

---

## 1. Overview

The user invitation feature enables organization administrators (`admin_referring` or `admin_radiology`) to invite new users to join their organization with specific roles. The implementation follows the modular architecture principles outlined in `core_principles.md`, with a focus on single responsibility and maintainability.

## 2. Implementation Details

### 2.1 API Endpoints

The following endpoints have been implemented:

- `POST /api/users/invite`: Allows organization admins to invite new users
  - **Authorization:** Requires JWT token with `admin_referring` or `admin_radiology` role
  - **Request Body:** `{ "email": "user@example.com", "role": "physician" }`
  - **Response:** `{ "success": true, "message": "Invitation sent successfully" }`

- `POST /api/users/accept-invitation`: Allows invited users to accept invitations and create their accounts
  - **Authorization:** Public endpoint (no authentication required)
  - **Request Body:** `{ "token": "invitation_token", "password": "secure_password", "first_name": "John", "last_name": "Doe" }`
  - **Response:** `{ "success": true, "token": "jwt_token", "user": { user_details } }`

### 2.2 Components

#### 2.2.1 Routes

- `src/routes/user-invite.routes.ts`: Defines the routes for user invitation and acceptance
- Updated `src/routes/index.ts` to include the routes

#### 2.2.2 Controller

- `src/controllers/user-invite.controller.ts`: Handles request validation and orchestrates the invitation and acceptance processes

#### 2.2.3 Service

- `src/services/user-invite/invite-user.service.ts`: Core business logic for user invitation
- `src/services/user-invite/accept-invitation.service.ts`: Core business logic for invitation acceptance
- `src/services/user-invite/index.ts`: Barrel file for service exports

#### 2.2.4 Utilities

- `src/utils/validation.ts`: Email validation utility
- `src/utils/token.utils.ts`: JWT token generation utility

### 2.3 Database Interactions

The implementation interacts with the following tables in the main database:

- `users`: Stores user account information
- `user_invitations`: Stores invitation details including token, expiry, and status

### 2.4 Notification Integration

The implementation leverages the existing notification service:

- Uses `NotificationManager.sendInviteEmail()` to send invitation emails
- Email includes organization name, inviter name, and a secure token

## 3. Workflow

### 3.1 Invitation Process

1. Admin submits invitation request with email and role
2. System validates input (email format, role validity)
3. System checks for existing user or pending invitation
4. System generates a secure token and sets expiry (7 days)
5. System stores invitation in database
6. System sends invitation email
7. User receives email with invitation link

### 3.2 Acceptance Process

1. User clicks on invitation link in email
2. Frontend displays a form to set password and provide name
3. User submits the form with token, password, first name, and last name
4. System validates the token and checks if it's still valid
5. System creates a new user account with the provided information
6. System marks the invitation as accepted
7. System generates a JWT token for the new user
8. User is logged in and redirected to the appropriate page

## 4. Security Considerations

- Only organization admins can invite users
- Invitation tokens are cryptographically secure (32 bytes)
- Tokens have a limited validity period (7 days)
- Email validation prevents invalid addresses
- Password validation ensures minimum security requirements
- Database transactions ensure atomicity of user creation and invitation update

## 5. Testing

Test scripts have been created to verify the functionality:

- `debug-scripts/vercel-tests/test-user-invite.bat` (Windows)
- `debug-scripts/vercel-tests/test-user-invite.sh` (Unix)
- `debug-scripts/vercel-tests/test-accept-invitation.bat` (Windows)
- `debug-scripts/vercel-tests/test-accept-invitation.sh` (Unix)

These scripts test various scenarios including:
- Valid invitation requests and acceptances
- Invalid email formats
- Invalid roles
- Invalid tokens
- Missing parameters
- Weak passwords
- Unauthorized access attempts

## 6. Future Enhancements

- Implement invitation resending functionality
- Add ability to cancel pending invitations
- Support bulk invitations via CSV upload (partially implemented in onboarding flow)
- Add configurable invitation expiry periods
- Implement email verification for self-registered users

---

## Related Documentation

- `onboarding_organizations.md`: Details the overall onboarding process
- `role_based_access.md`: Defines user roles and permissions
- `notification_service.md`: Describes the email notification system
- `api_endpoints.md`: Lists all API endpoints