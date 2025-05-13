# API Endpoint to Schema Map

**Version:** 1.7 - Super Admin Logs Implementation
**Date:** 2025-04-25

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
-   **`POST /api/auth/trial/register`**
    -   Writes: `trial_users` (Main)
    -   Reads: `trial_users` (Main), `users` (Main) (Check uniqueness)
    -   **Constraint:** Public endpoint for trial user registration.
-   **`POST /api/auth/trial/login`**
    -   Reads: `trial_users` (Main)
    -   **Note:** No session tracking for trial users, just JWT token generation and user profile retrieval.
-   **`GET /api/auth/trial/me`**
    -   Reads: `trial_users` (Main)
    -   **Note:** Validates JWT token and returns trial user profile and validation usage information.
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

## Users (`/api/users`) and User Invites (`/api/user-invites`)

-   **`GET /api/users/me`** (Get own user profile)
    -   Reads: `users` (Main), `locations` (Main)
-   **`GET /api/users`** (Admin gets users in their org)
    -   Reads: `users` (Main)
-   **`POST /api/user-invites/invite`** (Admin invites users)
    -   Writes: `user_invitations` (Main)
-   **`POST /api/user-invites/accept-invitation`** (Invited user sets password)
    -   Reads: `user_invitations` (Main)
    -   Writes: `users` (Main), `user_invitations` (update status)
-   **`PUT /api/users/{userId}`** (Admin updates user)
    -   Reads: `users` (Main)
    -   Writes: `users` (Main)
-   **`DELETE /api/users/{userId}`** (Admin deactivates user)
    -   Writes: `users` (Main)
-   **`POST /api/user-locations/{userId}/locations/{locationId}`** (Admin assigns location)
    -   Writes: `user_locations` (Main)
-   **`DELETE /api/user-locations/{userId}/locations/{locationId}`** (Admin unassigns location)
    -   Writes: `user_locations` (Main)

## Connections (`/api/connections`)

-   **`GET /api/connections`** (Get own org's connections)
    -   Reads: `organization_relationships` (Main), `organizations` (Main)
-   **`GET /api/connections/requests`** (List pending incoming connection requests)
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

-   **`POST /api/orders/validate`** (Submit dictation for validation/retry/override)
    -   Reads: `patients` (PHI), `prompt_templates`(Main), `prompt_assignments`(Main), `medical_*` tables (Main), Redis Cache, `orders` (PHI - Check for existing draft)
    -   Writes: **`orders` (PHI - Create draft on first call)**, `validation_attempts`(PHI), `llm_validation_logs`(Main), `order_history` (PHI - log validation attempt)
-   **`POST /api/orders/validate/trial`** (Trial user validation)
    -   Reads: `trial_users` (Main), `prompt_templates`(Main), `medical_*` tables (Main), Redis Cache
    -   Writes: `trial_users` (Main - update validation_count), `llm_validation_logs`(Main)
    -   **Constraint:** Limited to trial users, no PHI storage, validation count enforced
-   **`GET /api/orders`** (View orders)
    -   Reads: `orders` (PHI)
-   **`GET /api/orders/{orderId}`** (View specific order)
    -   Reads: `orders` (PHI), `patients` (PHI), `validation_attempts`(PHI), `order_history` (PHI)
-   **`POST /api/orders/{orderId}/admin-update`** (Add administrative updates to an order)
    -   Reads: `orders` (PHI)
    -   Writes: `orders` (PHI), `order_history` (PHI)

## Orders - Submission & Finalization (`/api/orders`)

-   **`PUT /api/orders/{orderId}`** (Finalize/Update Order Upon Signature)
    -   Reads: `orders` (PHI - Verify draft), `users` (Main - Verify signer)
    *   Writes: **`orders` (PHI - Update** with final validation state, override info, signature, status='pending_admin'), **`patients` (PHI - Create if temporary patient info provided)**, `order_history` (PHI - log 'signed'), `document_uploads` (PHI - create signature record)

## Orders - Admin Actions (`/api/admin/orders`)

-   **`GET /api/admin/orders/queue`** (Get admin queue)
    -   Reads: `orders` (PHI)
-   **`POST /api/admin/orders/{orderId}/paste-summary`** (Paste EMR context)
    -   Reads: `orders` (PHI)
    *   Writes: `patient_clinical_records` (PHI), `patients` (PHI), `patient_insurance` (PHI)
-   **`POST /api/admin/orders/{orderId}/paste-supplemental`** (Paste extra docs)
    -   Reads: `orders` (PHI)
    *   Writes: `patient_clinical_records` (PHI)
-   **`POST /api/admin/orders/{orderId}/send-to-radiology`** (Finalize and send)
    -   Reads: `orders` (PHI), `organizations` (Main - Check credit balance)
    *   Writes: `orders` (PHI - update `status`), `order_history` (PHI), `organizations` (Main - decrement credit balance), `credit_usage_logs` (Main)
-   **`POST /api/admin/orders/{orderId}/send-to-radiology-fixed`** (Fixed implementation for finalize and send)
    -   Reads: `orders` (PHI), `organizations` (Main - Check credit balance)
    *   Writes: `orders` (PHI - update `status`), `order_history` (PHI), `organizations` (Main - decrement credit balance), `credit_usage_logs` (Main)
    *   **Note:** Uses separate database connections for PHI and Main databases to fix the connection issue
-   **`PUT /api/admin/orders/{orderId}/patient-info`** (Manually update patient)
    -   Writes: `patients` (PHI)
-   **`PUT /api/admin/orders/{orderId}/insurance-info`** (Manually update insurance)
    -   Writes: `patient_insurance` (PHI)

## Orders - Radiology Actions (`/api/radiology/orders`)

-   **`GET /api/radiology/orders`** (View incoming queue)
    -   Reads: `orders` (PHI)
-   **`GET /api/radiology/orders/{orderId}`** (View full details)
    -   Reads: `orders` (PHI), `patients` (PHI), `patient_insurance` (PHI), `patient_clinical_records` (PHI), `document_uploads` (PHI), `validation_attempts`(PHI)
-   **`GET /api/radiology/orders/{orderId}/export/{format}`** (Export data)
    -   Reads: (Same as GET details)
-   **`POST /api/radiology/orders/{orderId}/update-status`** (Mark as scheduled, completed)
    -   Reads: `orders` (PHI)
    *   Writes: `orders` (PHI - update `status`), `order_history` (PHI)
-   **`POST /api/radiology/orders/{orderId}/request-info`** (Request additional information)
    -   Reads: `orders` (PHI - Verify order exists and belongs to radiology org)
    -   Writes: `information_requests` (PHI), `order_history` (PHI - log information request)
-   **`POST /api/radiology/orders/{orderId}/results`** (Planned: Submit results)
    -   Writes: `orders` (PHI), `document_uploads` (PHI), `order_history` (PHI)

## File Uploads (`/api/uploads`)

-   **`POST /api/uploads/presigned-url`** (Request S3 upload URL)
    -   Reads: `orders` (PHI) or `patients` (PHI)
-   **`POST /api/uploads/confirm`** (Confirm S3 upload)
    *   Writes: `document_uploads` (PHI)
-   **`GET /api/uploads/{documentId}/download-url`** (Request S3 download URL)
    -   Reads: `document_uploads` (PHI), `orders` (PHI), `patients` (PHI)

## Billing (`/api/billing`)

-   **`GET /api/billing`** (Get billing overview)
    -   Reads: `organizations` (Main), Stripe API (Customer, Subscription)
-   **`POST /api/billing/create-checkout-session`** (Create Stripe checkout session)
    -   Reads: `organizations` (Main)
    -   Writes: `billing_events` (Main)
-   **`POST /api/billing/subscriptions`** (Create Stripe subscription)
    -   Reads: `organizations` (Main)
    -   Writes: `organizations` (Main), `billing_events` (Main)
-   **`GET /api/billing/credit-balance`** (Get credit balance)
    -   Reads: `organizations` (Main)
-   **`GET /api/billing/credit-usage`** (Get credit usage history)
    -   Reads: `credit_usage_logs` (Main)

## Super Admin (`/api/superadmin`)

### Organizations and Users

-   **`GET /api/superadmin/organizations`** (List all organizations)
    -   Reads: `organizations` (Main)
-   **`GET /api/superadmin/organizations/{orgId}`** (Get organization by ID)
    -   Reads: `organizations` (Main), `users` (Main), `organization_relationships` (Main), `billing_events` (Main)
-   **`PUT /api/superadmin/organizations/{orgId}/status`** (Update organization status)
    -   Reads: `organizations` (Main)
    -   Writes: `organizations` (Main), `purgatory_events` (Main), `organization_relationships` (Main)
-   **`POST /api/superadmin/organizations/{orgId}/credits/adjust`** (Adjust organization credits)
    -   Reads: `organizations` (Main)
    -   Writes: `organizations` (Main), `billing_events` (Main)
-   **`GET /api/superadmin/users`** (List all users)
    -   Reads: `users` (Main), `organizations` (Main)
-   **`GET /api/superadmin/users/{userId}`** (Get user by ID)
    -   Reads: `users` (Main), `organizations` (Main), `user_locations` (Main), `locations` (Main)
-   **`PUT /api/superadmin/users/{userId}/status`** (Update user status)
    -   Reads: `users` (Main), `organizations` (Main)
    -   Writes: `users` (Main)

### Prompt Templates and Assignments

-   **`POST /api/superadmin/prompts/templates`** (Create prompt template)
    -   Writes: `prompt_templates` (Main)
-   **`GET /api/superadmin/prompts/templates`** (List prompt templates)
    -   Reads: `prompt_templates` (Main)
-   **`GET /api/superadmin/prompts/templates/{templateId}`** (Get prompt template)
    -   Reads: `prompt_templates` (Main)
-   **`PUT /api/superadmin/prompts/templates/{templateId}`** (Update prompt template)
    -   Reads: `prompt_templates` (Main)
    -   Writes: `prompt_templates` (Main)
-   **`DELETE /api/superadmin/prompts/templates/{templateId}`** (Delete prompt template)
    -   Reads: `prompt_templates` (Main)
    -   Writes: `prompt_templates` (Main)
-   **`POST /api/superadmin/prompts/assignments`** (Create prompt assignment)
    -   Reads: `prompt_templates` (Main), `users` (Main)
    -   Writes: `prompt_assignments` (Main)
-   **`GET /api/superadmin/prompts/assignments`** (List prompt assignments)
    -   Reads: `prompt_assignments` (Main), `prompt_templates` (Main), `users` (Main)
-   **`GET /api/superadmin/prompts/assignments/{assignmentId}`** (Get prompt assignment)
    -   Reads: `prompt_assignments` (Main), `prompt_templates` (Main), `users` (Main)
-   **`PUT /api/superadmin/prompts/assignments/{assignmentId}`** (Update prompt assignment)
    -   Reads: `prompt_assignments` (Main), `prompt_templates` (Main), `users` (Main)
    -   Writes: `prompt_assignments` (Main)
-   **`DELETE /api/superadmin/prompts/assignments/{assignmentId}`** (Delete prompt assignment)
    -   Reads: `prompt_assignments` (Main)
    -   Writes: `prompt_assignments` (Main)

### System Logs

-   **`GET /api/superadmin/logs/validation`** (List LLM validation logs)
    -   Reads: `llm_validation_logs` (Main), `users` (Main), `organizations` (Main)
    -   **Description:** Retrieves LLM validation logs with basic filtering (organization_id, user_id, date range, status, llm_provider, model_name)
-   **`GET /api/superadmin/logs/validation/enhanced`** (List enhanced LLM validation logs)
    -   Reads: `llm_validation_logs` (Main), `users` (Main), `organizations` (Main), `prompt_templates` (Main)
    -   **Description:** Retrieves LLM validation logs with advanced filtering capabilities including multiple status selection, text search, date presets, and sorting options
-   **`GET /api/superadmin/logs/credits`** (List credit usage logs)
    -   Reads: `credit_usage_logs` (Main), `users` (Main), `organizations` (Main)
    -   **Description:** Retrieves credit usage logs with filtering (organization_id, user_id, date range, action_type)
-   **`GET /api/superadmin/logs/purgatory`** (List purgatory events)
    -   Reads: `purgatory_events` (Main), `organizations` (Main), `users` (Main)
    -   **Description:** Retrieves purgatory events with filtering (organization_id, date range, status, reason)
