# Authentication & Authorization

**Version:** 1.0
**Date:** 2025-04-11

This document details the user authentication and authorization mechanisms for RadOrderPad.

---

## 1. Authentication

Process of verifying a user's identity.

### 1.1. Registration

-   Covered in `onboarding_organizations.md`.
-   Initial admin user created during organization sign-up.
-   Other users created via invitation flow initiated by an admin.
-   Requires email verification via token (`email_verification_tokens`).

### 1.2. Login

1.  **Credentials:** User provides email and password via the frontend login form.
2.  **Backend Verification:**
    *   API receives credentials.
    *   Finds `users` record by email.
    *   Verifies `users.is_active = true` and `users.email_verified = true`.
    *   Compares provided password against `users.password_hash` using bcrypt's compare function.
3.  **Session Creation (On Success):**
    *   Generate a secure session token (e.g., JWT containing `user_id`, `organization_id`, `role`, expiration) signed with a strong secret key.
    *   Optionally, generate a secure refresh token (`refresh_tokens` table) for persistent sessions.
    *   Store session details if using server-side sessions (`sessions` table).
    *   Update `users.last_login` timestamp.
4.  **Token Delivery:** Return session token (and optionally refresh token) to the client. Frontend stores tokens securely (e.g., HttpOnly cookie for refresh token, memory/sessionStorage or secure cookie for session token).
5.  **Failure:** Return appropriate error message (e.g., "Invalid credentials", "Account inactive", "Email not verified"). Implement measures against brute-force attacks (e.g., rate limiting, account lockout after multiple failures).

### 1.3. Password Hashing

-   Use `bcrypt` library.
-   Store only the generated hash in `users.password_hash`.
-   Use an appropriate cost factor (e.g., 10-12) during hashing.

### 1.4. Password Reset

1.  **Request:** User enters their email address on the "Forgot Password" page.
2.  **Token Generation:** Backend verifies email exists, generates a unique, time-limited token, stores it (hashed) in `password_reset_tokens` linked to `user_id`, and sends a password reset link containing the token to the user's email (via SES).
3.  **Reset:** User clicks link, navigates to reset page, enters new password.
4.  **Verification:** Backend receives token and new password. Verifies token exists, is not expired, and not used. Updates `users.password_hash` with the hash of the new password. Marks the token as used in `password_reset_tokens`. Logs the user in (optional).

### 1.5. Email Verification

1.  **Trigger:** During registration or if admin re-sends verification.
2.  **Token Generation:** Backend generates unique, time-limited token, stores it in `email_verification_tokens`, sends link via SES.
3.  **Verification:** User clicks link. Backend verifies token (exists, not expired, not used), updates `users.email_verified = true`, marks token as used.

### 1.6. Session/Token Handling

-   **Session Token:** Included in the `Authorization: Bearer <token>` header of subsequent API requests. Backend middleware verifies token validity (signature, expiration) on protected routes.
-   **Refresh Token:** Used by the frontend to request a new session token when the current one expires, without requiring the user to log in again. Stored securely (HttpOnly cookie recommended). Backend verifies refresh token validity and issuance status (`refresh_tokens.is_revoked`) before issuing a new session token. Implement refresh token rotation for enhanced security.

## 2. Authorization

Process of determining what actions an authenticated user is allowed to perform.

### 2.1. Role-Based Access Control (RBAC)

-   Primary mechanism for authorization.
-   Roles and associated permissions are defined in `role_based_access.md`.
-   User's role is retrieved from the session token or database upon authentication.

### 2.2. Enforcement

-   **Middleware:** API routes are protected by middleware that:
    1.  Verifies a valid session token.
    2.  Extracts `user_id`, `organization_id`, and `role`.
    3.  Checks if the user's `role` has permission to access the requested endpoint/action.
-   **Service Layer Logic:** Business logic within services performs finer-grained checks:
    *   **Organization Scoping:** Ensuring users can only access/modify data belonging to their own `organization_id` (e.g., `SELECT * FROM orders WHERE id = ? AND referring_organization_id = ?`). Super Admins bypass this check.
    *   **Resource Ownership:** Checking if a user owns a specific resource before allowing modification (e.g., physician signing *their* order).
    *   **Status-Based Logic:** Preventing actions based on resource status (e.g., cannot edit a 'completed' order).

### 2.3. Super Admin Access

-   Users with the `super_admin` role bypass standard organization scoping rules but still require authentication.
-   Actions performed by Super Admins should be logged meticulously for auditing.

---

## Data References

-   `users` (Main DB)
-   `organizations` (Main DB)
-   `sessions` (Main DB)
-   `refresh_tokens` (Main DB)
-   `password_reset_tokens` (Main DB)
-   `email_verification_tokens` (Main DB)
-   `role_based_access.md` (Definition)
-   AWS SES (External)