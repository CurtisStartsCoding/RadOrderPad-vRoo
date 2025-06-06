Okay, here are comprehensive workflow descriptions for each role within the RadOrderPad system, based on the provided API documentation and common application logic.

---

====================
**ROLE: Physician (Referring Organization)**
====================

**Overview:**
The primary clinical user responsible for initiating radiology orders based on patient encounters. Their main focus is on providing accurate clinical indications and ensuring the medical necessity and appropriateness of the requested imaging study through the validation process.

**Key Responsibilities/Capabilities:**
*   Create new radiology orders.
*   Dictate clinical indications (text or voice).
*   Initiate and interact with the validation engine.
*   Respond to clarification prompts from the validation engine.
*   Override validation suggestions with clinical justification (after failed attempts).
*   Review final validation results (CPT/ICD-10 codes, compliance score, feedback).
*   Electronically sign finalized orders.
*   View their own order history and status.
*   Manage their own user profile settings.

**Primary Workflow (Order Creation & Validation):**
1.  **Login:** Authenticate into the RadOrderPad system (`POST /api/auth/login`).
2.  **Initiate Order:** Start a new order, potentially selecting a patient or initiating an "Unknown Patient" workflow (UI flow, may involve patient search).
4.  **Dictate Clinical Indication:** Enter the clinical reason for the study into the dictation form, either by typing or using voice input (`DictationForm.tsx`).
5.  **Submit for Validation:** Click "Process Order" / "Validate Dictation". The frontend sends the dictation and modality to the validation endpoint (`POST /api/orders/validate`). A draft order record is created in the backend.
6.  **Handle Validation Response:**
    *   **If Valid & Compliant:** The system returns suggested CPT/ICD-10 codes, compliance score, and feedback. The UI proceeds to the Validation View (`ValidationView.tsx`).
    *   **If Needs Clarification:** The system returns a prompt requesting more information. The UI displays the prompt, the physician adds clarification to the *existing* dictation text, and resubmits (`POST /api/orders/validate` with the *same* `orderId` and *cumulative* text). This loop can repeat (typically up to 3 attempts).
    *   **If Inappropriate/Failed Attempts:** After a set number of failed attempts (e.g., 3), the UI enables an "Override" option.
7.  **(Optional) Override:** If validation fails repeatedly, the physician clicks "Override", provides a clinical justification in a dialog (`OverrideDialog.tsx`), and submits (`POST /api/orders/validate` with `isOverrideValidation: true` flag and justification included in the text). The system processes the override, likely marking the order as such. The UI proceeds to the Validation View.
8.  **Review Validation:** On the Validation View screen, review the final suggested codes, feedback, and compliance information.
9.  **Proceed to Sign:** Click "Sign Order". The UI transitions to the Signature Form (`SignatureForm.tsx`).
10. **Sign Order:** Draw signature on the canvas and type full name for confirmation. Click "Submit Order" / "Sign & Queue for Admin". The frontend sends the final order data, including codes, status (`pending_admin`), and potentially signature data (or confirms signature upload), to the update endpoint (`PUT /api/orders/{orderId}`).
11. **Completion:** The order status is updated to `pending_admin` and moves to the Admin Queue. The physician might see a success message or be redirected to their dashboard.

**Key API Interactions:**
*   `POST /api/auth/login`
*   `POST /api/orders/validate` (potentially multiple times per order)
*   `PUT /api/orders/{orderId}` (for finalization/signing)
*   `GET /api/orders` (to view own order list)
*   `GET /api/orders/{orderId}` (to view own order details)
*   `GET /api/users/me`, `PATCH /api/users/me` (Profile management)

**Constraints:**
*   Cannot typically manage organization settings, users, locations, or connections.
*   Cannot perform the final administrative steps (adding detailed demographics/insurance, sending to radiology).
*   Validation workflow requires interaction and potential clarification/override steps.

---

====================
**ROLE: Admin Staff (Referring Organization)**
====================

**Overview:**
Responsible for the administrative processing of orders after they have been validated and signed by a physician. They ensure all necessary demographic, insurance, and supplemental information is present and accurate before transmitting the order to the selected radiology group.

**Key Responsibilities/Capabilities:**
*   Monitor the queue of orders awaiting administrative finalization (`pending_admin`).
*   View detailed order information (including physician's dictation and validation results).
*   Add, verify, or update patient demographic information.
*   Add, verify, or update patient insurance information.
*   Attach supplemental documentation (e.g., from EMR, prior reports) via text paste or file upload.
*   Select the appropriate connected radiology group to send the order to.
*   Transmit the finalized order to the selected radiology group, consuming organizational credits.
*   View order history and status for the organization.
*   Manage their own user profile settings.

**Primary Workflow (Order Finalization & Sending):**
1.  **Login:** Authenticate into the RadOrderPad system (`POST /api/auth/login`).
2.  **Access Admin Queue:** Navigate to the administrative queue screen (`GET /api/admin/orders/queue` or similar endpoint fetching orders with `status=pending_admin`).
3.  **Select Order:** Choose an order from the queue to process.
4.  **Review Order Details:** View the complete order information submitted by the physician (`GET /api/orders/{orderId}` or data from queue).
5.  **(Optional) Update Patient Demographics:** If necessary, update patient details using the relevant form/API call (`PUT /api/admin/orders/{orderId}/patient-info` or similar).
6.  **(Optional) Update Insurance Information:** If necessary, update insurance details using the relevant form/API call (`PUT /api/admin/orders/{orderId}/insurance-info` or similar).
7.  **(Optional) Add Supplemental Information:** Paste relevant text from EMR (`POST /api/admin/orders/{orderId}/paste-supplemental`) or upload files (`POST /api/uploads/presigned-url` -> S3 Upload -> `POST /api/uploads/confirm`).
8.  **Select Radiology Partner:** Choose the destination radiology group from a UI dropdown populated by active connections (`GET /api/connections/established` filtered by type). Capture the `radiologyOrganizationId`.
9.  **Send to Radiology:** Click the "Send to Radiology" button. The frontend makes the API call (`POST /api/billing/send-to-radiology`), including the `orderId` and the selected `radiologyOrganizationId`.
10. **Backend Processing:** The backend verifies credits, updates the order status to `sent_to_radiology` (or `pending_radiology`), decrements credits, and logs the transaction.
11. **Confirmation:** The UI displays a success message, and the order is removed from the `pending_admin` queue.

**Key API Interactions:**
*   `POST /api/auth/login`
*   `GET /api/admin/orders/queue` (or equivalent GET /api/orders?status=pending_admin)
*   `GET /api/orders/{orderId}`
*   `PUT /api/admin/orders/{orderId}/patient-info` (or similar)
*   `PUT /api/admin/orders/{orderId}/insurance-info` (or similar)
*   `POST /api/admin/orders/{orderId}/paste-supplemental` (or similar)
*   `POST /api/uploads/presigned-url`, `POST /api/uploads/confirm` (for file uploads)
*   `GET /api/connections/established` (to populate partner list)
*   `POST /api/billing/send-to-radiology`
*   `GET /api/users/me`, `PATCH /api/users/me` (Profile management)

**Constraints:**
*   Cannot typically create, validate, or sign orders.
*   Workflow depends on orders being in the `pending_admin` state.
*   Sending orders requires sufficient organizational credits.
*   Can only send orders to actively connected radiology partners.
*   May have limited permissions compared to `admin_referring` (e.g., cannot manage users/org settings).

---

====================
**ROLE: Admin Referring (Referring Organization)**
====================

**Overview:**
Holds the highest level of administrative privileges within a referring organization. This role encompasses all the responsibilities of `admin_staff` and adds capabilities for managing the organization's profile, users, locations, connections, and billing.

**Key Responsibilities/Capabilities:**
*   All responsibilities of `admin_staff` (processing orders, sending to radiology).
*   Manage organization profile details (name, address, contact info, logo).
*   Manage organization locations (add, edit, deactivate).
*   Manage users within the organization (invite, edit roles/permissions, deactivate, assign to locations).
*   Manage connections with radiology organizations (request, view status, terminate).
*   Manage billing information and purchase credits (view balance, history, initiate purchases).
*   Configure organization-level settings.

**Primary Workflows:**
*   **Order Finalization:** Same as `admin_staff` workflow.
*   **Organization Management:**
    1.  Login (`POST /api/auth/login`).
    2.  Navigate to Organization Settings section.
    3.  View current profile (`GET /api/organizations/mine`).
    4.  Update profile sections (Basic Info, Address, Billing, etc.) via specific forms/modals (`PATCH /api/organizations/mine/...`).
    5.  Manage locations via Location Management screen (`GET/POST/PUT/DELETE /api/organizations/mine/locations/...`).
*   **User Management:**
    1.  Navigate to User Management section.
    2.  View users (`GET /api/users`).
    3.  Invite new users (`POST /api/user-invites/invite`).
    4.  Edit existing users (`PUT /api/users/{userId}`).
    5.  Manage user status (Activate/Deactivate) (`PATCH /api/users/{userId}/status`).
    6.  Assign/unassign users to locations (`POST/DELETE /api/user-locations/...`).
*   **Connection Management:**
    1.  Navigate to Connections section.
    2.  View established/pending connections (`GET /api/connections/...`).
    3.  Search for potential partners (`GET /api/organizations/search`).
    4.  Request new connections (`POST /api/connections/request`).
    5.  Terminate existing connections (`DELETE /api/connections/{relationshipId}`).
*   **Billing Management:**
    1.  Navigate to Billing section.
    2.  View billing overview/credit balance (`GET /api/billing`, `GET /api/billing/credit-balance`).
    3.  View usage history (`GET /api/billing/credit-usage`).
    4.  Initiate credit purchase (`POST /api/billing/create-checkout-session`).
    5.  Manage subscription (if applicable) (`POST /api/billing/subscriptions`).

**Key API Interactions:**
*   Includes all `admin_staff` APIs.
*   `/api/organizations/mine`, `/api/organizations/mine/*`
*   `/api/users`, `/api/users/{userId}`, `/api/users/{userId}/*`
*   `/api/user-invites/*`
*   `/api/user-locations/*`
*   `/api/connections/*`
*   `/api/billing/*`

**Constraints:**
*   Cannot typically create, validate, or sign clinical orders.
*   Actions are generally scoped to their own organization.

---

====================
**ROLE: Trial Physician**
====================

**Overview:**
A potential user evaluating the core dictation-to-validation functionality in a sandboxed environment without PHI or full account setup.

**Key Responsibilities/Capabilities:**
*   Register for a trial account with minimal information.
*   Log in to the trial sandbox.
*   Submit clinical dictations for validation (up to a predefined limit).
*   View the validation results (suggested codes, feedback).

**Primary Workflow (Trial Validation):**
1.  **(Optional) Register:** Access the trial registration page and submit email, password, name, specialty (`POST /api/auth/trial/register`). Receive a trial JWT token immediately or upon first login.
2.  **Login:** Authenticate using trial credentials (`POST /api/auth/trial/login`). Receive a trial JWT token.
3.  **Access Sandbox:** Navigate to the trial validation interface (`TrialValidationInterface.tsx`).
4.  **Select Modality:** Choose an imaging modality.
5.  **Enter Dictation:** Type or use voice input to enter clinical indications (`TrialDictationForm.tsx`).
6.  **Validate:** Click "Validate Dictation". The frontend sends the dictation and modality to the trial validation endpoint (`POST /api/orders/validate/trial`) using the trial token.
7.  **View Results:** The system processes the request (without storing PHI, decrementing the validation count) and returns the validation result. The UI displays the feedback and suggested codes (`TrialValidationView.tsx`).
8.  **Repeat/Finish:** Repeat steps 4-7 until the validation limit is reached or evaluation is complete. If the limit is reached, the API returns a 403 error, and the UI should prompt the user to upgrade or contact sales. Click "Validate Another Order" to reset the form.

**Key API Interactions:**
*   `POST /api/auth/trial/register`
*   `POST /api/auth/trial/login`
*   `POST /api/orders/validate/trial`

**Constraints:**
*   Strictly limited number of validations.
*   No access to patient records, order history, connections, or administrative features.
*   No PHI is stored or processed beyond the transient validation request.
*   Cannot finalize or sign orders.
*   No clarification or override loops in the validation process.

---

====================
**ROLE: Scheduler (Radiology Organization)**
====================

**Overview:**
Manages the flow of incoming orders within the radiology organization, schedules procedures, and updates order statuses. Acts as a primary point of contact for administrative aspects of received orders.

**Key Responsibilities/Capabilities:**
*   Monitor the queue of incoming orders (`pending_radiology` status).
*   View detailed information for received orders.
*   Update the status of orders (e.g., to `scheduled`, `completed`, `cancelled`).
*   Enter scheduling information (date, time, facility, technologist - if applicable).
*   Request additional clinical information or clarification from the referring organization if needed.
*   View order history and status for the radiology organization.
*   Manage their own user profile settings.

**Primary Workflow (Order Processing & Scheduling):**
1.  **Login:** Authenticate into the RadOrderPad system (`POST /api/auth/login`).
2.  **Access Radiology Queue:** Navigate to the incoming order queue screen (`GET /api/radiology/orders` filtered by status, e.g., `pending_radiology`).
3.  **Select Order:** Choose an order from the queue to process.
4.  **Review Order Details:** View the complete order information, including patient details, clinical indication, codes, and any attached documents (`GET /api/radiology/orders/{orderId}`).
5.  **(Optional) Request Information:** If more information is needed, use the "Request Information" feature (`POST /api/radiology/orders/{orderId}/request-info`). Specify the type and details of the information needed. This may change the order status or flag it.
6.  **Schedule Procedure:** (Often done in external RIS/Scheduling system, but status updated here) Once scheduled, update the order status.
7.  **Update Status:** Use the "Update Status" action (`POST /api/radiology/orders/{orderId}/update-status`). Select the new status (e.g., `scheduled`) and provide relevant details (e.g., scheduled date/time).
8.  **Monitor Progress:** Continue monitoring the queue for orders needing action or status updates (e.g., moving from `scheduled` to `completed` after the exam).

**Key API Interactions:**
*   `POST /api/auth/login`
*   `GET /api/radiology/orders` (with various filters)
*   `GET /api/radiology/orders/{orderId}`
*   `POST /api/radiology/orders/{orderId}/update-status`
*   `POST /api/radiology/orders/{orderId}/request-info`
*   `GET /api/users/me`, `PATCH /api/users/me` (Profile management)

**Constraints:**
*   Cannot typically perform clinical reads or generate final radiology reports.
*   Cannot manage organization settings, users (beyond own profile), locations, or connections.
*   Workflow primarily focuses on orders received by their organization.

---

====================
**ROLE: Admin Radiology (Radiology Organization)**
====================

**Overview:**
Holds the highest level of administrative privileges within a radiology organization. This role encompasses all the responsibilities of a `scheduler` and adds capabilities for managing the organization's profile, users, locations, and connections with referring practices.

**Key Responsibilities/Capabilities:**
*   All responsibilities of `scheduler` (managing incoming orders, updating status, requesting info).
*   Manage organization profile details.
*   Manage organization locations.
*   Manage users within the radiology organization (invite, edit roles, deactivate, assign locations).
*   Manage connections with referring organizations (view requests, approve, reject, terminate).
*   View billing/usage reports related to their organization's activity (potentially).
*   Configure organization-level settings specific to the radiology group.

**Primary Workflows:**
*   **Order Processing:** Same as `scheduler` workflow.
*   **Organization Management:** Similar to `admin_referring`, but focused on the radiology group's profile and settings (`GET /api/organizations/mine`, `PATCH /api/organizations/mine/...`, `GET/POST/PUT/DELETE /api/organizations/mine/locations/...`).
*   **User Management:** Similar to `admin_referring`, managing users within their *own* radiology group (`GET /api/users`, `POST /api/user-invites/invite`, `PUT /api/users/{userId}`, etc.).
*   **Connection Management:**
    1.  Login (`POST /api/auth/login`).
    2.  Navigate to Connections section.
    3.  View incoming requests from referring orgs (`GET /api/connections/requests` or similar).
    4.  Approve or Reject incoming requests (`POST /api/connections/{relationshipId}/approve|reject`).
    5.  View established connections (`GET /api/connections/established`).
    6.  Terminate connections if necessary (`DELETE /api/connections/{relationshipId}`).

**Key API Interactions:**
*   Includes all `scheduler` APIs.
*   `/api/organizations/mine`, `/api/organizations/mine/*`
*   `/api/users`, `/api/users/{userId}`, `/api/users/{userId}/*`
*   `/api/user-invites/*`
*   `/api/user-locations/*`
*   `/api/connections/*` (Approve/Reject/Terminate focus)

**Constraints:**
*   Cannot typically perform clinical reads or generate final radiology reports.
*   Cannot create or validate orders originating from referring practices.
*   Actions are generally scoped to their own organization and its connections.

---

====================
**ROLE: Radiologist (Radiology Organization)**
====================

**Overview:**
The clinical expert within the radiology organization responsible for interpreting imaging studies and generating diagnostic reports.

**Key Responsibilities/Capabilities:**
*   View assigned or relevant orders in the worklist/queue.
*   Access complete order details, including clinical indications, patient history, and attached documents/images.
*   (Future) Dictate or enter findings and impressions for the radiology report.
*   (Future) Finalize and sign radiology reports.
*   Manage their own user profile settings.

**Primary Workflow (Order Interpretation - Includes Future State):**
1.  **Login:** Authenticate into the RadOrderPad system (`POST /api/auth/login`).
2.  **Access Worklist:** Navigate to their assigned worklist or the general radiology queue (`GET /api/radiology/orders` potentially filtered for 'scheduled' or 'ready for read').
3.  **Select Order:** Choose an order to interpret.
4.  **Review Case:** View all order details, clinical information, and associated images/documents (`GET /api/radiology/orders/{orderId}`). This might involve integration with a PACS viewer.
5.  **(Future) Generate Report:** Dictate or type findings and impression.
6.  **(Future) Submit Results:** Finalize the report (`POST /api/radiology/orders/{orderId}/results`). The system updates the order status (e.g., to `results_available`) and potentially notifies the referring physician.

**Key API Interactions:**
*   `POST /api/auth/login`
*   `GET /api/radiology/orders`
*   `GET /api/radiology/orders/{orderId}`
*   (Future) `POST /api/radiology/orders/{orderId}/results`
*   `GET /api/users/me`, `PATCH /api/users/me` (Profile management)

**Constraints:**
*   Primarily focused on clinical interpretation tasks.
*   Does not typically handle scheduling, administrative tasks, or organization management.

---

====================
**ROLE: Super Admin**
====================

**Overview:**
Has complete administrative control over the entire RadOrderPad platform, including all organizations, users, system settings, and monitoring capabilities.

**Key Responsibilities/Capabilities:**
*   View and manage all organizations (create, edit, change status, adjust credits).
*   View and manage all users across all organizations (create, edit, change status, reset passwords, manage roles).
*   Manage system-wide settings and configurations.
*   Manage LLM prompt templates and assignments.
*   Monitor system health, performance, and resource usage.
*   View comprehensive system logs (validation, credit usage, security, audit).
*   Export and analyze trial user data for monitoring trial usage and conversion metrics.
*   Manage system alerts and notifications.
*   Oversee platform billing and subscription management (potentially).

**Primary Workflows:**
*   **Platform Oversight:**
    1.  Login (`POST /api/auth/login`).
    2.  Access the Super Admin Dashboard.
    3.  Monitor system health (`GET /api/superadmin/system/health`).
    4.  Review performance metrics and analytics (`GET /api/superadmin/system/metrics`, `/api/superadmin/system/analytics/...`).
    5.  Check system logs for errors or unusual activity (`GET /api/superadmin/logs/...`).
*   **Organization Management:**
    1.  List/Search organizations (`GET /api/superadmin/organizations`).
    2.  View specific organization details (`GET /api/superadmin/organizations/{orgId}`).
    3.  Update organization status (active, purgatory, terminated) (`PUT /api/superadmin/organizations/{orgId}/status`).
    4.  Adjust organization credits (`POST /api/superadmin/organizations/{orgId}/credits/adjust`).
    5.  Export trial user data for analysis (`scripts/export-trial-users-with-tunnel.js`).
*   **User Management:**
    1.  List/Search all users (`GET /api/superadmin/users`).
    2.  View specific user details (`GET /api/superadmin/users/{userId}`).
    3.  Update user status (`PUT /api/superadmin/users/{userId}/status`).
    4.  Manage user roles/permissions.
*   **Prompt Management:**
    1.  List/View prompt templates (`GET /api/superadmin/prompts/templates`).
    2.  Create/Edit/Delete templates (`POST/PUT/DELETE /api/superadmin/prompts/templates/...`).
    3.  Manage template assignments (`GET/POST/PUT/DELETE /api/superadmin/prompts/assignments/...`).

**Key API Interactions:**
*   `POST /api/auth/login`
*   All endpoints under `/api/superadmin/*`

**Constraints:**
*   None within the application itself. Highest level of privilege. Requires careful use due to system-wide impact.

---