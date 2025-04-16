# API Endpoint to Schema Map

**Version:** 1.5 - Credit Consumption Refactoring
**Date:** 2025-04-14

This document maps core API endpoints to the primary database tables they interact with in `radorder_main` (Main) and `radorder_phi` (PHI), based on the final reconciled schemas and the implemented override/draft order flow. This is not exhaustive but covers key interactions. Assumes RESTful endpoints.

---

## Authentication (`/api/auth`)

-   **`POST /api/auth/register`**
    -   Writes: `organizations` (Main), `users` (Main), `email_verification_tokens` (Main)
    -   Reads: `organizations` (Check uniqueness if needed)
    -   **Constraint:** Strictly for initial Org + Admin user creation.
-   **`POST /api/auth/login`**
    -   Reads: `users` (Main)
    -   Writes: `sessions` (Main), `refresh_tokens` (Main), `users` (update `last_login`)
-   **`POST /api/auth/logout`**
    -   Writes: `refresh_tokens` (revoke), `sessions` (delete)
-   **`POST /api/auth/refresh`**
    -   Reads: `refresh_tokens` (Main), `users` (Main)
    -   Writes: `sessions` (Main), `refresh_tokens` (rotate/update)
-   **`POST /api/auth/verify-email`**
    -   Reads: `email_verification_tokens` (Main)
    -   Writes: `users` (update `email_verified`), `email_verification_tokens` (mark used)
-   **`POST /api/auth/request-password-reset`**
    -   Reads: `users` (Main)
    -   Writes: `password_reset_tokens` (Main)
-   **`POST /api/auth/reset-password`**
    -   Reads: `password_reset_tokens` (Main)
    -   Writes: `users` (update `password_hash`), `password_reset_tokens` (mark used)

## Organizations (`/api/organizations`)

-   **`GET /api/organizations/mine`** (Get user's own org)
    -   Reads: `organizations` (Main)
-   **`GET /api/organizations`** (Search for partners)
    -   Reads: `organizations` (Main)
-   **`PUT /api/organizations/mine`** (Update own org profile)
    -   Reads: `organizations` (Main)
    -   Writes: `organizations` (Main)
-   **`GET /api/organizations/{orgId}/locations`** (List locations)
    -   Reads: `locations` (Main)
-   **`POST /api/organizations/mine/locations`** (Admin adds location)
    -   Writes: `locations` (Main)
-   **`PUT /api/organizations/mine/locations/{locationId}`** (Admin updates location)
    -   Reads: `locations` (Main)
    -   Writes: `locations` (Main)
-   **`DELETE /api/organizations/mine/locations/{locationId}`** (Admin deactivates location)
    -   Writes: `locations` (Main)

## Users (`/api/users`)

-   **`GET /api/users/me`** (Get own user profile)
    -   Reads: `users` (Main), `locations` (Main)
-   **`GET /api/users`** (Admin gets users in their org)
    -   Reads: `users` (Main)
-   **`POST /api/users/invite`** (Admin invites users)
    -   Writes: `user_invitations` (Main)
-   **`POST /api/users/accept-invitation`** (Invited user sets password)
    -   Reads: `user_invitations` (Main)
    -   Writes: `users` (Main), `user_invitations` (update status)
-   **`PUT /api/users/{userId}`** (Admin updates user)
    -   Reads: `users` (Main)
    -   Writes: `users` (Main)
-   **`DELETE /api/users/{userId}`** (Admin deactivates user)
    -   Writes: `users` (Main)
-   **`POST /api/users/{userId}/locations/{locationId}`** (Admin assigns location)
    -   Writes: `user_locations` (Main)
-   **`DELETE /api/users/{userId}/locations/{locationId}`** (Admin unassigns location)
    -   Writes: `user_locations` (Main)

## Connections (`/api/connections`)

-   **`GET /api/connections`** (Get own org's connections)
    -   Reads: `organization_relationships` (Main), `organizations` (Main)
-   **`POST /api/connections`** (Request a connection)
    -   Writes: `organization_relationships` (Main)
-   **`POST /api/connections/{relationshipId}/approve`** (Approve request)
    -   Reads: `organization_relationships` (Main)
    *   Writes: `organization_relationships` (Main)
-   **`POST /api/connections/{relationshipId}/reject`** (Reject request)
    -   Reads: `organization_relationships` (Main)
    *   Writes: `organization_relationships` (Main)
-   **`DELETE /api/connections/{relationshipId}`** (Terminate connection)
    -   Reads: `organization_relationships` (Main)
    *   Writes: `organization_relationships` (Main)

## Orders (`/api/orders`) - Physician/General Access

-   **`POST /api/orders/start`** (Optional: Initiate patient tagging)
    -   Writes: `patients` (PHI)
-   **`POST /api/orders/validate`** (Submit dictation for validation/retry/override)
    -   Reads: `patients` (PHI), `prompt_templates`(Main), `prompt_assignments`(Main), `medical_*` tables (Main), Redis Cache, `orders` (PHI - Check for existing draft)
    -   Writes: **`orders` (PHI - Create draft on first call)**, `validation_attempts`(PHI), `llm_validation_logs`(Main), `order_history` (PHI - log validation attempt)
-   **`GET /api/orders`** (View orders)
    -   Reads: `orders` (PHI)
-   **`GET /api/orders/{orderId}`** (View specific order)
    -   Reads: `orders` (PHI), `patients` (PHI), `validation_attempts`(PHI), `order_history` (PHI)

## Orders - Submission & Finalization (`/api/orders`)

-   **`PUT /api/orders/{orderId}`** (Finalize/Update Order Upon Signature)
    -   Reads: `orders` (PHI - Verify draft), `users` (Main - Verify signer)
    *   Writes: **`orders` (PHI - Update** with final validation state, override info, signature, status='pending_admin'), **`patients` (PHI - Create if temporary patient info provided)**, `order_history` (PHI - log 'signed'), `document_uploads` (PHI - create signature record)

## Orders - Admin Actions (`/admin/orders`)

-   **`GET /admin/orders/queue`** (Get admin queue)
    -   Reads: `orders` (PHI)
-   **`POST /admin/orders/{orderId}/paste-summary`** (Paste EMR context)
    -   Reads: `orders` (PHI)
    *   Writes: `patient_clinical_records` (PHI), `patients` (PHI), `patient_insurance` (PHI)
-   **`POST /admin/orders/{orderId}/paste-supplemental`** (Paste extra docs)
    -   Reads: `orders` (PHI)
    *   Writes: `patient_clinical_records` (PHI)
-   **`POST /admin/orders/{orderId}/send-to-radiology`** (Finalize and send)
    -   Reads: `orders` (PHI), `organizations` (Main - Check credit balance)
    *   Writes: `orders` (PHI - update `status`), `order_history` (PHI), `organizations` (Main - decrement credit balance), `credit_usage_logs` (Main)
-   **`PUT /admin/orders/{orderId}/patient-info`** (Manually update patient)
    -   Writes: `patients` (PHI)
-   **`PUT /admin/orders/{orderId}/insurance-info`** (Manually update insurance)
    -   Writes: `patient_insurance` (PHI)

## Orders - Radiology Actions (`/radiology/orders`)

-   **`GET /radiology/orders/queue`** (View incoming queue)
    -   Reads: `orders` (PHI)
-   **`GET /radiology/orders/{orderId}`** (View full details)
    -   Reads: `orders` (PHI), `patients` (PHI), `patient_insurance` (PHI), `patient_clinical_records` (PHI), `document_uploads` (PHI), `validation_attempts`(PHI)
-   **`GET /radiology/orders/{orderId}/export/{format}`** (Export data)
    -   Reads: (Same as GET details)
-   **`POST /radiology/orders/{orderId}/update-status`** (Mark as scheduled, completed)
    -   Reads: `orders` (PHI)
    *   Writes: `orders` (PHI - update `status`), `order_history` (PHI)
-   **`POST /radiology/orders/{orderId}/request-info`** (Optional: Request info)
    -   Writes: `information_requests` (PHI)
-   **`POST /radiology/orders/{orderId}/results`** (Planned: Submit results)
    -   Writes: `orders` (PHI), `document_uploads` (PHI), `order_history` (PHI)

## File Uploads (`/uploads`)

-   **`POST /uploads/presigned-url`** (Request S3 upload URL)
    -   Reads: `orders` (PHI) or `patients` (PHI)
-   **`POST /uploads/confirm`** (Confirm S3 upload)
    *   Writes: `document_uploads` (PHI)
-   **`GET /uploads/{documentId}/download-url`** (Request S3 download URL)
    -   Reads: `document_uploads` (PHI), `orders` (PHI), `patients` (PHI)

## Billing (`/billing`)

-   **`POST /billing/create-checkout-session`** (Create Stripe checkout session)
    -   Reads: `organizations` (Main)
    -   Writes: `billing_events` (Main)
-   **`GET /billing/credit-balance`** (Get credit balance)
    -   Reads: `organizations` (Main)
-   **`GET /billing/credit-usage`** (Get credit usage history)
    -   Reads: `credit_usage_logs` (Main)

## Super Admin (`/superadmin`)

-   Interacts with almost all tables in `radorder_main` and potentially read-access to `radorder_phi`. Endpoint specifics defined in `super_admin.md`.
