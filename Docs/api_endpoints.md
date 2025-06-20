# API Endpoints Overview (Conceptual)

**Version:** 1.5 (Credit Consumption Refactoring)
**Date:** 2025-04-14

**Note:** This document provides a conceptual list of API endpoints based on the defined workflows and schema map. A formal OpenAPI/Swagger specification is recommended for definitive contract details.

---

## Base URL

`/api` (Example)

## Authentication (`/auth`)

-   `POST /auth/register`: Initial Org + Admin registration. **(Restricted Access)**
-   `POST /auth/login`: User login.
-   `POST /auth/logout`: User logout (revoke tokens).
-   `POST /auth/refresh`: Obtain new session token using refresh token.
-   `POST /auth/verify-email`: Verify email via token.
-   `POST /auth/request-password-reset`: Initiate password reset flow.
-   `POST /auth/reset-password`: Complete password reset using token.

## Organizations (`/organizations`)

-   `GET /organizations/mine`: Get details of the authenticated user's organization. **(Authenticated)**
-   `PUT /organizations/mine`: Update details of the authenticated user's organization. **(Admin Role)**
-   `GET /organizations`: Search for potential partner organizations. **(Admin Role)**

### Organization Locations (`/organizations/.../locations`)

-   `GET /organizations/mine/locations`: List locations for the user's own organization. **(Admin Role)**
-   `POST /organizations/mine/locations`: Add a new location to the user's own organization. **(Admin Role)**
-   `GET /organizations/mine/locations/{locationId}`: Get details of a specific location within the user's org. **(Admin Role)**
-   `PUT /organizations/mine/locations/{locationId}`: Update details of a specific location within the user's org. **(Admin Role)**
-   `DELETE /organizations/mine/locations/{locationId}`: Deactivate a location within the user's org (sets `is_active=false`). **(Admin Role)**
    *(Note: Consider if GET /organizations/{orgId}/locations is needed for SuperAdmin or specific partner visibility)*

## Users (`/users`)

-   `GET /users/me`: Get the authenticated user's profile. **(Authenticated)**
-   `PUT /users/me`: Update the authenticated user's own profile (limited fields). **(Authenticated)**
-   `GET /users`: List users within the admin's organization. **(Admin Role)**
-   `POST /users/invite`: Invite new users to the admin's organization. **(Admin Role)**
-   `POST /users/accept-invitation`: Endpoint for invited users to set password and activate account. **(Requires Valid Invitation Token)**
-   `GET /users/{userId}`: Get details of a specific user within the admin's org. **(Admin Role)**
-   `PUT /users/{userId}`: Update details of a specific user within the admin's org (including `primary_location_id`). **(Admin Role)**
-   `DELETE /users/{userId}`: Deactivate a user within the admin's org. **(Admin Role)**

### User Location Assignments (`/users/.../locations`) - *If using user_locations join table*

-   `GET /users/{userId}/locations`: List locations assigned to a specific user (within admin's org). **(Admin Role)**
-   `POST /users/{userId}/locations/{locationId}`: Assign a user to a location (within admin's org). **(Admin Role)**
-   `DELETE /users/{userId}/locations/{locationId}`: Unassign a user from a location (within admin's org). **(Admin Role)**

## Connections (`/connections`)

-   `GET /connections`: List connections for the admin's organization. **(Admin Role)**
-   `POST /connections`: Request a connection to another organization. **(Admin Role)**
-   `GET /connections/requests`: List pending incoming connection requests. **(Admin Role)**
-   `POST /connections/{relationshipId}/approve`: Approve a pending incoming request. **(Admin Role)**
-   `POST /connections/{relationshipId}/reject`: Reject a pending incoming request. **(Admin Role)**
-   `DELETE /connections/{relationshipId}`: Terminate an active connection. **(Admin Role)**

## Orders - Physician/General Access (`/orders`)

-   `POST /orders/start`: (Optional) Initiate patient tagging for a new order draft. **(Physician/Admin Staff Role)**
-   `POST /orders/validate`: Submits dictation for validation. **On first call for an order, creates a draft `orders` record and returns `orderId`.** Handles subsequent clarifications and the final override validation call (using provided `orderId` and `isOverrideValidation` flag). Triggers validation engine and logs attempts. No credit consumption occurs at this stage. Returns validation result and `orderId`. **Error Handling:** Must handle LLM unavailability gracefully (e.g., 503 response). **(Physician Role)**
-   `GET /orders`: List orders relevant to the user (e.g., created by them, for their org, including drafts). **(Authenticated)**
-   `GET /orders/{orderId}`: Get details of a specific order the user has access to. **(Authenticated)**

## Orders - Submission & Finalization (`/orders`)

-   `PUT /orders/{orderId}`: **(Finalization Endpoint)** Updates an existing draft order (identified by `orderId`) with final details upon signature. Saves final validated state (codes, score, status, notes), override info (`overridden`, `overrideJustification`), signature details (`signed_by_user_id`, `signature_date`), and sets status to `pending_admin`. **If the order corresponds to a temporary patient record (e.g., identified by specific flags or payload fields like `patient_name_update`), this endpoint is also responsible for creating the permanent patient record in the `patients` table using provided details and updating the `orders.patient_id` foreign key accordingly.** **Error Handling:** Must handle database write failures robustly (e.g., 500 response, logging). **(Physician Role)**

## Orders - Admin Actions (`/admin/orders`)

-   `POST /admin/orders/{orderId}/paste-summary`: Submit pasted EMR summary for parsing. **(Admin Staff Role)**
-   `POST /admin/orders/{orderId}/paste-supplemental`: Submit pasted supplemental documents. **(Admin Staff Role)**
-   `POST /admin/orders/{orderId}/send-to-radiology`: Finalize and send the order to the radiology group (updates status). **This endpoint consumes one credit from the organization's balance and logs the credit usage.** If the organization has insufficient credits, returns a 402 Payment Required error. **(Admin Staff Role)**
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

-   `POST /uploads/presigned-url`: Request a presigned URL for direct S3 upload. **(Authenticated - Context specific roles)**
-   `POST /uploads/confirm`: Confirm successful S3 upload and create DB record. **(Authenticated - Context specific roles)**

## Billing (`/billing`)

-   `POST /billing/create-checkout-session`: Create a Stripe checkout session for purchasing credit bundles. **(Admin Referring Role)**
-   `POST /billing/subscriptions`: Create a Stripe subscription for a specific pricing tier. Returns subscription details including client secret for payment confirmation if required. **(Admin Referring Role)**
-   `GET /billing/credit-balance`: Get the current credit balance for the organization. **(Admin Referring Role)**
-   `GET /billing/credit-usage`: Get credit usage history for the organization. **(Admin Referring Role)**

## Super Admin (`/superadmin`)

-   Endpoints corresponding to features outlined in `super_admin.md`. **(Super Admin Role ONLY)**
