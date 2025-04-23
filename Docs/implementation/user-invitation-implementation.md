# User Invitation Implementation

**Version:** 1.0
**Date:** 2025-04-23
**Status:** Implemented

This document details the implementation of the user invitation functionality in the RadOrderPad platform, allowing organization admins to invite new users to their organization.

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

### 2.2 Components

#### 2.2.1 Routes

- `src/routes/user-invite.routes.ts`: Defines the route for user invitation
- Updated `src/routes/index.ts` to include the new routes

#### 2.2.2 Controller

- `src/controllers/user-invite.controller.ts`: Handles request validation and orchestrates the invitation process

#### 2.2.3 Service

- `src/services/user-invite/invite-user.service.ts`: Core business logic for user invitation
- `src/services/user-invite/index.ts`: Barrel file for service exports

#### 2.2.4 Utilities

- `src/utils/validation.ts`: Email validation utility

### 2.3 Database Interactions

The implementation interacts with the following tables in the main database:

- `users`: Checks if a user with the provided email already exists
- `user_invitations`: Stores invitation details including token, expiry, and status

### 2.4 Notification Integration

The implementation leverages the existing notification service:

- Uses `NotificationManager.sendInviteEmail()` to send invitation emails
- Email includes organization name, inviter name, and a secure token

## 3. Workflow

1. Admin submits invitation request with email and role
2. System validates input (email format, role validity)
3. System checks for existing user or pending invitation
4. System generates a secure token and sets expiry (7 days)
5. System stores invitation in database
6. System sends invitation email
7. User receives email and can follow link to complete registration

## 4. Security Considerations

- Only organization admins can invite users
- Invitation tokens are cryptographically secure (32 bytes)
- Tokens have a limited validity period (7 days)
- Email validation prevents invalid addresses

## 5. Testing

Test scripts have been created to verify the functionality:

- `debug-scripts/vercel-tests/test-user-invite.bat` (Windows)
- `debug-scripts/vercel-tests/test-user-invite.sh` (Unix)

These scripts test various scenarios including:
- Valid invitation requests
- Invalid email formats
- Invalid roles
- Missing parameters
- Unauthorized access attempts

## 6. Future Enhancements

- Implement invitation resending functionality
- Add ability to cancel pending invitations
- Support bulk invitations via CSV upload (partially implemented in onboarding flow)
- Add configurable invitation expiry periods

---

## Related Documentation

- `onboarding_organizations.md`: Details the overall onboarding process
- `role_based_access.md`: Defines user roles and permissions
- `notification_service.md`: Describes the email notification system
- `api_endpoints.md`: Lists all API endpoints