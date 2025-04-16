# Role-Based Access Control (RBAC)

**Version:** 1.2 (Standardized Admin Roles)
**Date:** 2025-04-11

This document defines user roles and their associated permissions within the RadOrderPad platform. Access is controlled based on the user's assigned role and their organization membership. **Only users with an `admin_*` role can register an organization.** All other users are added via invitation by their organization's admin.

---

## 1. Defined Roles

*(Stored in `users.role` column)*

**Within Referring Physician Group (`organizations.type = 'referring_practice'`):**

*   **`admin_referring`:** (Typically the Office Manager or Lead Physician who initially registers the organization)
    *   **CANNOT** be registered by anyone other than themselves during initial org setup.
    *   Manages organization profile (address, contact info, locations).
    *   Manages users within their organization (invite via CSV/manual, activate/deactivate, assign roles: `physician`, `admin_staff`).
    *   Manages billing information and subscription (via Stripe portal/integration).
    *   Initiates and approves/rejects connection requests with Radiology Groups.
    *   Views organization's credit balance and usage logs.
    *   Can view all orders originating from their organization.
*   **`physician`:**
    *   **CANNOT** register directly. Must be invited by their org `admin_referring`.
    *   Creates new orders (dictation, patient tagging).
    *   Submits orders for validation.
    *   Appends clarifications to orders.
    *   Overrides validation with justification.
    *   Digitally signs orders.
    *   Views status of orders they created or signed.
    *   Views validation feedback and history for their orders.
*   **`admin_staff`:** (Medical Assistant, Front Desk, etc.)
    *   **CANNOT** register directly. Must be invited by their org `admin_referring`.
    *   **Scope (V1):** This role currently covers duties often performed by both Medical Assistants and Front Desk staff, primarily focused on post-signature order finalization. *Future enhancements may introduce distinct roles if different permission levels within the platform are required.*
    *   Views orders created by physicians within their organization that are in `pending_admin` status.
    *   Accesses the "Paste EMR Summary" functionality for orders to append patient demographic, insurance, and clinical context.
    *   Adds supplemental documentation (labs, reports) to orders via paste or upload.
    *   Verifies/updates parsed patient demographic and insurance information appended to the order.
    *   **CANNOT** modify the physician's original dictation or the validation/signature status.
    *   Submits finalized orders to the linked Radiology Group (`pending_radiology` status).
    *   Views status of orders processed by them or originating from their organization.

**Within Radiology Group (`organizations.type = 'radiology_group'`):**

*   **`admin_radiology`:** (Typically Radiology Group Manager or IT who initially registers the organization)
    *   **CANNOT** be registered by anyone other than themselves during initial org setup.
    *   Manages organization profile and facility locations.
    *   Manages users within their organization (invite, activate/deactivate, assign roles: `scheduler`, `radiologist`).
    *   Manages billing information (for per-order charges).
    *   Approves/rejects connection requests from Referring Groups.
    *   Views all incoming orders for their group.
    *   Configures basic queue settings (if any).
*   **`scheduler`:** (Includes Pre-Auth Staff)
    *   **CANNOT** register directly. Must be invited by their org `admin_radiology`.
    *   Views incoming orders in the queue (`pending_radiology` status).
    *   Filters/sorts the queue (by priority, referring org, modality).
    *   Views full order details (clinical info, patient data, insurance, validation history).
    *   Uses order details for scheduling and pre-authorization processes (*external* to RadOrderPad).
    *   Exports order data (PDF, CSV, JSON).
    *   Updates order status (e.g., `scheduled`, `completed`, `cancelled`).
*   **`radiologist`:**
    *   **CANNOT** register directly. Must be invited by their org `admin_radiology`.
    *   (Future Scope) Views completed study details.
    *   (Future Scope) Potentially appends results or links to reports (`result_return_loop.md`).
    *   May have read-only access to relevant order details.

**Platform Level:**

*   **`super_admin`:**
    *   Full read/write access across all organizations and data (respecting PHI boundaries where feasible for tasks).
    *   Manages platform configuration.
    *   Manages all user accounts and organizations.
    *   Oversees billing, credits, and purgatory status for all orgs.
    *   Monitors system health, usage analytics, LLM performance, validation logs via the Super Admin Console.
    *   Handles support escalations and manual data adjustments.
    *   Accesses the Super Admin Panel.

---

## 2. Access Control Enforcement Points

*   **API Routes:** Middleware checks if the authenticated user's role has permission to access a specific endpoint (e.g., only `admin_referring` or `admin_radiology` can invite users to their respective orgs).
*   **Data Queries:** Database queries must include `WHERE` clauses filtering by `organization_id` based on the user's session, preventing users from seeing data outside their organization (unless they are `super_admin`).
*   **Resource Ownership:** Specific actions might require checking if the user owns the resource (e.g., a `physician` can only sign orders they created or are assigned to).
*   **UI Rendering:** Frontend hides/shows UI elements (buttons, menu items, data fields) based on the user's role.

---

## 3. Example Scenarios

*   A `physician` cannot view the billing page or invite users.
*   An `admin_staff` user cannot sign an order or modify original dictation.
*   A `scheduler` in Radiology Group A cannot see orders sent to Radiology Group B.
*   An `admin_referring` user cannot modify users in a Radiology Group.
*   A `super_admin` can view the `credit_usage_logs` for any organization.

---

## 4. Role Multiplicity (V1)

-   The current system design (`users.role` as a single text field) supports only **one primary role per user account**.
-   If a user needs distinct permissions requiring different roles (e.g., a physician who is also an `admin_referring`), they would currently require separate user accounts/logins for each role.
-   Support for assigning multiple roles to a single user account is a potential future enhancement.