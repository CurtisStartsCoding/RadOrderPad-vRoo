API Endpoints Overview (Conceptual)

**Version:** 1.9 (Trial Feature Implementation)
**Date:** 2025-04-25

**Note:** This document provides a conceptual list of API endpoints based on the defined workflows and schema map. A formal OpenAPI/Swagger specification is recommended for definitive contract details.

---

## Base URL

`/api` (Example)

## Authentication (`/auth`)

-   `POST /auth/register`: Self-service Org + Admin registration. Requires CAPTCHA verification. Creates organization (with pending_verification status) and admin user records, sends verification email. **(Public Access)**
-   `POST /auth/login`: User login.
-   `POST /auth/logout`: User logout (revoke tokens).
-   `POST /auth/refresh`: Obtain new session token using refresh token.
-   `POST /auth/verify-email`: Verify email via token.
-   `POST /auth/request-password-reset`: Initiate password reset flow.
-   `POST /auth/reset-password`: Complete password reset using token.
-   `POST /auth/trial/register`: Register a new trial user with email, password, name, and specialty. Creates a trial user record and returns a trial JWT token. No organization association. **(Public Access)**
-   `POST /auth/trial/login`: Trial user login. Authenticates trial user credentials and returns a trial JWT token. **(Public Access)**

## Organizations (`/organizations`)

-   `GET /organizations/mine`: Get details of the authenticated user's organization. **(Authenticated)**
-   `PUT /organizations/mine`: Update details of the authenticated user's organization. **(Admin Role)** [Implemented]
-   `GET /organizations`: Search for potential partner organizations. Supports filtering by name, NPI, type, city, and state. Returns organizations excluding the user's own organization. **(Admin Role - admin_referring, admin_radiology)** [Implemented]

### Organization Locations (`/organizations/.../locations`)

-   `GET /organizations/mine/locations`: List locations for the user's own organization. **(Admin Role)** [Implemented]
-   `POST /organizations/mine/locations`: Add a new location to the user's own organization. **(Admin Role)** [Implemented]
-   `GET /organizations/mine/locations/{locationId}`: Get details of a specific location within the user's org. **(Admin Role)** [Implemented]
-   `PUT /organizations/mine/locations/{locationId}`: Update details of a specific location within the user's org. **(Admin Role)** [Implemented]
-   `DELETE /organizations/mine/locations/{locationId}`: Deactivate a location within the user's org (sets `is_active=false`). **(Admin Role)** [Implemented]
    *(Note: Consider if GET /organizations/{orgId}/locations is needed for SuperAdmin or specific partner visibility)*

## Users (`/users`)

-   `GET /users/me`: Get the authenticated user's profile information including role, organization, and personal details. **(Authenticated - Any Role)** [Implemented]
-   `PUT /users/me`: Update the authenticated user's own profile (limited fields: firstName, lastName, phoneNumber, specialty, npi). **(Authenticated - Any Role)** [Implemented]
-   `GET /users`: List users within the admin's organization with pagination, sorting, and filtering options. Supports filtering by role, status, and name search. Returns users with pagination metadata. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `POST /users/invite`: Invite new users to the admin's organization. **(Admin Role - admin_referring, admin_radiology)** [Implemented - See `implementation/user-invitation-implementation.md`]
-   `POST /users/accept-invitation`: Endpoint for invited users to set password and activate account. Creates a new user account based on the invitation details. **(Public Endpoint - Requires Valid Invitation Token)** [Implemented]
-   `GET /users/{userId}`: Get details of a specific user within the admin's org. Returns user profile only if the user belongs to the admin's organization. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `PUT /users/{userId}`: Update details of a specific user within the admin's org (including name, role, specialty, active status). Enforces organization boundaries and role assignment restrictions. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `DELETE /users/{userId}`: Deactivate a user within the admin's org. **(Admin Role - admin_referring, admin_radiology)** [Implemented]

### User Location Assignments (`/user-locations/.../locations`) - *Using user_locations join table*

-   `GET /user-locations/{userId}/locations`: List locations assigned to a specific user (within admin's org). **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `POST /user-locations/{userId}/locations/{locationId}`: Assign a user to a location (within admin's org). **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `DELETE /user-locations/{userId}/locations/{locationId}`: Unassign a user from a location (within admin's org). **(Admin Role - admin_referring, admin_radiology)** [Implemented]

## Connections (`/connections`)

- `GET /connections`: List connections for the admin's organization. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
- `POST /connections`: Request a connection to another organization. Uses `targetOrgId` parameter. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
- `GET /connections/requests`: List pending incoming connection requests. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `POST /connections/{relationshipId}/approve`: Approve a pending incoming request. Updates relationship status to 'active' and notifies the initiating organization. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `POST /connections/{relationshipId}/reject`: Reject a pending incoming request. Updates relationship status to 'rejected' and notifies the initiating organization. **(Admin Role - admin_referring, admin_radiology)** [Implemented]
-   `DELETE /connections/{relationshipId}`: Terminate an active connection. Updates relationship status to 'terminated'. **(Admin Role - admin_referring, admin_radiology)** [Implemented]

## Orders - Physician/General Access (`/orders`)

-   `POST /orders/start`: (Optional) Initiate patient tagging for a new order draft. **(Physician/Admin Staff Role)**
-   `POST /orders/validate`: Submits dictation for validation. **On first call for an order, creates a draft `orders` record and returns `orderId`.** Handles subsequent clarifications and the final override validation call (using provided `orderId` and `isOverrideValidation` flag). Triggers validation engine and logs attempts. No credit consumption occurs at this stage. Returns validation result and `orderId`. **Error Handling:** Must handle LLM unavailability gracefully (e.g., 503 response). **(Physician Role)**
-   `POST /orders/validate/trial`: Submits dictation for validation in trial mode. Does not create any PHI records. Checks the trial user's validation count against their maximum allowed validations. Increments the validation count on successful validation. Returns validation result only. **Error Handling:** Returns 403 Forbidden when validation limit is reached. Must handle LLM unavailability gracefully (e.g., 503 response). **(Trial User Role)**
-   `GET /orders`: List orders relevant to the user (e.g., created by them, for their org, including drafts). **(Authenticated)**
-   `GET /orders/{orderId}`: Get details of a specific order the user has access to. **(Authenticated)**

## Orders - Submission & Finalization (`/orders`)

-   `PUT /orders/{orderId}`: **(Finalization Endpoint)** Updates an existing draft order (identified by `orderId`) with final details upon signature. Saves final validated state (codes, score, status, notes), override info (`overridden`, `overrideJustification`), signature details (`signed_by_user_id`, `signature_date`), and sets status to `pending_admin`. **If the order corresponds to a temporary patient record (e.g., identified by specific flags or payload fields like `patient_name_update`), this endpoint is also responsible for creating the permanent patient record in the `patients` table using provided details and updating the `orders.patient_id` foreign key accordingly.** **Error Handling:** Must handle database write failures robustly (e.g., 500 response, logging). **(Physician Role)**

## Orders - Admin Actions (`/admin/orders`)

-   `GET /admin/orders/queue`: List orders awaiting admin finalization (status = 'pending_admin'). Supports pagination, sorting, and filtering. Returns orders with pagination metadata. **(Admin Staff Role)**
-   `POST /admin/orders/{orderId}/paste-summary`: Submit pasted EMR summary for parsing. Updates patient contact information (address, phone, email) and insurance details (insurer, policy number, group number, policy holder). **(Admin Staff Role)**
-   `POST /admin/orders/{orderId}/paste-supplemental`: Submit pasted supplemental documents. **(Admin Staff Role)**
-   `POST /admin/orders/{orderId}/send-to-radiology`: Finalize and send the order to the radiology group (updates status). **This endpoint consumes one credit from the organization's balance and logs the credit usage.** If the organization has insufficient credits, returns a 402 Payment Required error. **(Admin Staff Role)**
-   `POST /admin/orders/{orderId}/send-to-radiology-fixed`: Fixed implementation of the send-to-radiology endpoint that properly handles database connections for PHI and Main databases. Functionally identical to the original endpoint. **(Admin Staff Role)**
-   `PUT /admin/orders/{orderId}/patient-info`: Manually update parsed patient info. **(Admin Staff Role)**
-   `PUT /admin/orders/{orderId}/insurance-info`: Manually update parsed insurance info. **(Admin Staff Role)**

## Orders - Radiology Actions (`/radiology/orders`)

-   `GET /radiology/orders`: Get the queue of incoming orders for the radiology group. **(Scheduler/Radiology Admin Role)**
-   `GET /radiology/orders/{orderId}`: Get full details of an incoming order. **(Scheduler/Radiology Admin Role)**
-   `GET /radiology/orders/{orderId}/export/{format}`: Export order data (pdf, csv, json, etc.). **(Scheduler/Radiology Admin Role)**
-   `POST /radiology/orders/{orderId}/update-status`: Update the order status (scheduled, completed). **(Scheduler Role)**
-   `POST /radiology/orders/{orderId}/request-info`: (Optional) Request missing information from referring group. **(Scheduler/Radiology Admin Role)**
-   `POST /radiology/orders/{orderId}/results`: (Planned) Endpoint for submitting results back. **(Radiologist Role - Future)**

## File Uploads (`/uploads`)

-   `POST /uploads/presigned-url`: Request a presigned URL for direct S3 upload. **(Authenticated - physician, admin_referring, admin_radiology, radiologist, admin_staff roles)** [Implemented]
-   `POST /uploads/confirm`: Confirm successful S3 upload and create DB record. **(Authenticated - physician, admin_referring, admin_radiology, radiologist, admin_staff roles)** [Implemented]
-   `GET /uploads/{documentId}/download-url`: Generate a presigned URL for downloading a previously uploaded document. Verifies the requesting user has permission to access the document (belongs to the same organization associated with the document's order/patient). **(Authenticated)** [Implemented]

## Billing (`/billing`)

-   `GET /billing`: Get billing overview including subscription status, credit balance, and Stripe subscription details. **(Admin Referring or Admin Radiology Role)** [Implemented]
-   `POST /billing/create-checkout-session`: Create a Stripe checkout session for purchasing credit bundles. **(Admin Referring Role)**
-   `POST /billing/subscriptions`: Create a Stripe subscription for a specific pricing tier. Returns subscription details including client secret for payment confirmation if required. **(Admin Referring Role)**
-   `GET /billing/credit-balance`: Get the current credit balance for the organization. **(Admin Referring Role)** [Implemented]
-   `GET /billing/credit-usage`: Get credit usage history for the organization. **(Admin Referring Role)** [Implemented]

## Super Admin (`/superadmin`)

### Organizations (`/superadmin/organizations`)

-   `GET /superadmin/organizations`: List all organizations with optional filtering by name, type, and status. **(Super Admin Role)**
-   `GET /superadmin/organizations/{orgId}`: Get detailed information about a specific organization, including users, connections, and billing history. **(Super Admin Role)**
-   `PUT /superadmin/organizations/{orgId}/status`: Update an organization's status (active, on_hold, purgatory, terminated). Handles side effects like logging purgatory events and updating organization relationships. **(Super Admin Role)**
-   `POST /superadmin/organizations/{orgId}/credits/adjust`: Adjust an organization's credit balance with a reason. Logs the adjustment in billing events. **(Super Admin Role)**

### Users (`/superadmin/users`)

-   `GET /superadmin/users`: List all users with optional filtering by organization, email, role, and active status. **(Super Admin Role)**
-   `GET /superadmin/users/{userId}`: Get detailed information about a specific user, including organization and assigned locations. **(Super Admin Role)**
-   `PUT /superadmin/users/{userId}/status`: Update a user's active status. **(Super Admin Role)**

### Prompt Templates (`/superadmin/prompts/templates`)

-   `POST /superadmin/prompts/templates`: Create a new prompt template. **(Super Admin Role)**
-   `GET /superadmin/prompts/templates`: List prompt templates with optional filtering (type, active, version). **(Super Admin Role)**
-   `GET /superadmin/prompts/templates/{templateId}`: Get a specific prompt template by ID. **(Super Admin Role)**
-   `PUT /superadmin/prompts/templates/{templateId}`: Update an existing prompt template. **(Super Admin Role)**
-   `DELETE /superadmin/prompts/templates/{templateId}`: Delete (soft delete) a prompt template. **(Super Admin Role)**

### Prompt Assignments (`/superadmin/prompts/assignments`)

-   `POST /superadmin/prompts/assignments`: Create a new prompt assignment, assigning a template to a physician. **(Super Admin Role)**
-   `GET /superadmin/prompts/assignments`: List prompt assignments with optional filtering (physician_id, prompt_id, is_active, ab_group). **(Super Admin Role)**
-   `GET /superadmin/prompts/assignments/{assignmentId}`: Get a specific prompt assignment by ID. **(Super Admin Role)**
-   `PUT /superadmin/prompts/assignments/{assignmentId}`: Update an existing prompt assignment. **(Super Admin Role)**
-   `DELETE /superadmin/prompts/assignments/{assignmentId}`: Delete a prompt assignment. **(Super Admin Role)**

### System Logs (`/superadmin/logs`)

- `GET /superadmin/logs/validation`: List LLM validation logs with optional filtering (organization_id, user_id, date range, status, llm_provider, model_name). **(Super Admin Role)**
- `GET /superadmin/logs/validation/enhanced`: List LLM validation logs with advanced filtering capabilities including multiple status selection, text search, date presets, and sorting options. **(Super Admin Role)**
- `GET /superadmin/logs/credits`: List credit usage logs with optional filtering (organization_id, user_id, date range, action_type). **(Super Admin Role)**
- `GET /superadmin/logs/purgatory`: List purgatory events with optional filtering (organization_id, date range, status, reason). **(Super Admin Role)**
