You've hit on a critical point – while Roo Code has implemented the *individual pieces* of the API based on specific prompts and documentation, it doesn't inherently have the *holistic understanding* of how to chain these pieces together to execute a full user workflow. Providing a "cheater document" or a **Workflow API Usage Guide** is an excellent idea to bridge this gap for testing, frontend development, or even onboarding new developers (or AI instances!).

First, let's list the remaining prompts to achieve **functional backend completion** (excluding deep testing optimization, advanced optional features unless specified).

---

---

**API Workflow "Cheater" Document:**

Generating a full step-by-step guide for *every* API interaction would be extremely long and potentially brittle if the API changes slightly. However, I can provide a **structured outline** of the key workflows using the API endpoints, which you can give to Roo Code or use yourself.

**RadOrderPad API Workflow Guide (Conceptual)**

**(Note:** Assumes base URL is `https://api.radorderpad.com`. Requires valid JWT token in `Authorization: Bearer <token>` header for protected routes. Payloads are JSON.)

**Workflow 1: New Organization & User Onboarding**

1.  **Admin Self-Registers:** `POST /api/auth/register`
    *   **Actor:** Prospective Admin
    *   **Payload:** `{ organization: { name, type, ... }, user: { email, password, first_name, last_name, role: ('admin_referring'|'admin_radiology') } }`
    *   **Result:** Creates Org & Admin User (inactive, email unverified), creates Stripe Customer & saves `billing_id`. Triggers verification email.
    *   **DB:** Writes `organizations`, `users`, `email_verification_tokens` (Main DB). Calls Stripe API.
2.  **Admin Verifies Email:** User clicks link -> Hits (internal) verification endpoint tied to token.
    *   **Result:** Sets `users.email_verified = true`.
3.  **Admin Logs In:** `POST /api/auth/login`
    *   **Actor:** Verified Admin
    *   **Payload:** `{ email, password }`
    *   **Result:** Returns JWT token and user info.
    *   **DB:** Reads `users`, writes `sessions`/`refresh_tokens`.
4.  **Admin Adds Locations (Optional):** `POST /api/organizations/mine/locations`
    *   **Actor:** Logged-in Admin (Token needed)
    *   **Payload:** `{ name, address_line1, ... }`
    *   **Result:** Creates `locations` record.
    *   **DB:** Writes `locations` (Main DB).
5.  **Admin Invites User:** `POST /api/users/invite`
    *   **Actor:** Logged-in Admin (Token needed)
    *   **Payload:** `{ email, role: ('physician'|'admin_staff'|'scheduler'|'radiologist'), firstName, lastName, primaryLocationId? }`
    *   **Result:** Creates `user_invitations` record. Triggers invite email (SES).
    *   **DB:** Writes `user_invitations` (Main DB). Calls Notification Service.
6.  **Invited User Accepts:** User clicks link -> Directed to frontend page -> Sets password. Frontend calls `POST /api/users/accept-invitation`.
    *   **Actor:** Invited User (via frontend, needs token from link)
    *   **Payload:** `{ token, password }`
    *   **Result:** Creates `users` record from invitation details. Marks invitation used.
    *   **DB:** Reads `user_invitations`, writes `users` (Main DB).
7.  **New User Logs In:** `POST /api/auth/login`

**Workflow 2: Physician Creates & Submits Order (Success Path)**

1.  **Physician Logs In:** `POST /api/auth/login` -> Gets JWT token.
2.  **Physician Starts Order (Frontend):** Identifies patient locally (Name/DOB). Enters dictation.
3.  **First Validation:** `POST /api/orders/validate`
    *   **Actor:** Logged-in Physician (Token needed)
    *   **Payload:** `{ dictationText, patientInfo: { age?, gender? } }` (No `orderId`)
    *   **Result:** Backend creates draft `orders` record (status `pending_validation`), calls Validation Engine (LLM+RedisSearch/PG), logs `validation_attempts` (attempt 1), logs `credit_usage_logs` (IF using old model - REMOVED), returns `{ success: true, orderId: <NEW_ID>, validationResult: {...} }`. Assume `validationResult.validationStatus` is 'appropriate'.
    *   **DB:** Writes `orders` (PHI DB), `validation_attempts` (PHI DB). Reads `radorder_main` for context. Calls LLM.
4.  **Physician Reviews (Frontend):** UI moves to ValidationView. Shows 'appropriate' status, codes, feedback.
5.  **Physician Signs (Frontend):** UI moves to SignatureForm. Physician signs, types name. Clicks Submit.
6.  **Frontend File Upload Sequence:**
    *   Frontend calls `POST /api/uploads/presigned-url` with `{ filename: 'signature.png', contentType: 'image/png', context: 'order', contextId: <orderId> }`. Gets back URL & filePath.
    *   Frontend PUTs signature image data (as Blob) to the S3 URL.
    *   Frontend calls `POST /api/uploads/confirm` with `{ filePath, fileSize, documentType: 'signature', orderId: <orderId> }`. Gets back `{ success: true, documentId }`.
7.  **Finalize Order:** `PUT /api/orders/{orderId}`
    *   **Actor:** Logged-in Physician (Token needed)
    *   **Payload:** `{ final_validation_status: 'appropriate', final_compliance_score: X, final_cpt_code: '...', final_icd10_codes: '...', overridden: false, override_justification: null, signed_by_user_id: <physicianId>, signature_date: '...', signer_name: '...' }` (Plus potentially `patient_name_update` if temp patient).
    *   **Result:** Backend finds draft order, creates `patients` record if needed & links it, updates `orders` record with final validation state & signature info, sets `status = 'pending_admin'`. Logs 'signed' to `order_history`. Returns `{ success: true }`.
    *   **DB:** Updates `orders` (PHI DB), potentially writes `patients` (PHI DB), writes `order_history` (PHI DB), writes `document_uploads` (PHI DB via confirm step). Reads `users`/`orgs` (Main DB) for denormalization.

**Workflow 3: Physician Order with Override**

1.  **Login:** As above.
2.  **Start Order:** As above.
3.  **Validation Attempts 1, 2, 3:** `POST /api/orders/validate` called 3 times (with `orderId` after first call). Each time returns non-'appropriate' status. Frontend shows feedback banner. Physician adds clarification text.
    *   **DB:** Creates draft order on attempt 1. Creates `validation_attempts` records 1, 2, 3.
4.  **Override Justification (Frontend):** Physician clicks Override, enters justification in dialog.
5.  **Override Validation (Attempt 4):** `POST /api/orders/validate`
    *   **Actor:** Physician (Token needed)
    *   **Payload:** `{ orderId: <ID>, dictationText: "<cumulative_text>\n---Override Justification---\n<justification_text>", isOverrideValidation: true, patientInfo: {...} }`
    *   **Result:** Backend runs validation engine considering justification, logs `validation_attempts` (attempt 4), returns final `{ success: true, orderId: <ID>, validationResult: {...} }` (status might now be 'appropriate' or still 'inappropriate').
    *   **DB:** Writes `validation_attempts` (attempt 4). Reads `radorder_main`. Calls LLM.
6.  **Physician Reviews (Frontend):** UI moves to ValidationView. Shows final validation result, notes "Override Applied", shows justification.
7.  **Physician Signs (Frontend):** As above.
8.  **Frontend File Upload:** As above.
9.  **Finalize Order:** `PUT /api/orders/{orderId}`
    *   **Actor:** Physician (Token needed)
    *   **Payload:** `{ final_validation_status: <status_from_step_5>, final_compliance_score: <score_from_step_5>, ..., overridden: true, override_justification: "<justification_text>", signed_by_user_id: ..., signature_date: '...', signer_name: '...' }`
    *   **Result:** Backend updates `orders` record, sets `status = 'pending_admin'`, `overridden = true`, saves justification. Logs 'override', 'signed' to `order_history`. Returns `{ success: true }`.
    *   **DB:** Updates `orders`, writes `order_history`.

**Workflow 4: Admin Finalizes Order**

1.  **Admin Logs In:** `POST /api/auth/login` -> Gets JWT.
2.  **Admin Views Queue (Frontend):** UI calls `GET /api/admin/orders/queue` (or `GET /api/orders?status=pending_admin...`). Gets list of orders.
3.  **Admin Selects Order (Frontend):** UI navigates to detail page, calls `GET /api/orders/{orderId}`. Gets full order details.
4.  **Admin Pastes EMR:** `POST /api/admin/orders/{orderId}/paste-summary`
    *   **Actor:** Logged-in Admin Staff (Token needed)
    *   **Payload:** `{ pastedText: "..." }`
    *   **Result:** Backend parses text, updates `patients` (contact info), `patient_insurance`, saves raw text to `patient_clinical_records`. Returns `{ success: true }`. Frontend refetches order details.
    *   **DB:** Writes `patient_clinical_records`, updates `patients`, `patient_insurance` (PHI DB).
5.  **Admin Adds Supplemental (Optional):** `POST /api/admin/orders/{orderId}/paste-supplemental` or File Upload Flow.
6.  **Admin Sends to Radiology:** `POST /api/admin/orders/{orderId}/send-to-radiology`
    *   **Actor:** Logged-in Admin Staff (Token needed)
    *   **Payload:** `{}`
    *   **Result:** Backend checks org status & credits. If OK: **decrements credits**, logs `credit_usage_logs`, updates `orders.status` to `pending_radiology`, logs `order_history`. Returns `{ success: true }`. If credits low/org suspended, returns 402/403 error.
    *   **DB:** Reads `organizations` (Main DB), writes `organizations` (Main DB - credits), writes `credit_usage_logs` (Main DB), updates `orders` (PHI DB), writes `order_history` (PHI DB).

**(Continue with Radiology Workflow, Connection Mgmt, User Mgmt similarly)**

This guide provides the sequence and purpose of API calls for the main workflows. You can give this to Roo Code as context when asking it to build frontend features or write integration tests.









You are absolutely right to call out the inconsistencies and confusion in my previous responses regarding the remaining tasks and Stripe's status. My apologies for the conflicting information and lack of clarity. You need a definitive, ordered list of what's left for the backend and the full API workflow guide.

Let's reset and provide exactly that in one comprehensive response.

**Part 1: Final Remaining Backend Implementation Prompts (in Order)**

Based on our latest understanding (Core workflows, Admin functions, Validation w/ LLM, S3 Upload, SES Notify, Redis Cache/Search, Billing Basics/Webhooks, Super Admin Basics are structurally DONE), here are the final prompts to reach backend feature completion *before* comprehensive testing or deployment optimization:

**(Prerequisite: Ensure your database schema is correct and reference data is loaded)**

---

**Prompt 1: Finalize Stripe Webhook DB Logic (VERIFY/COMPLETE)**
*(Ensures database accurately reflects subscription/payment states)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Final Verification and potential refinement of the database update logic within the Stripe webhook handlers (`handleSubscriptionUpdated`, `handleSubscriptionDeleted`, `handleInvoicePaymentSucceeded`) to ensure organization status, subscription tiers, and credit balances are correctly managed based on live or simulated Stripe events.

Background: Webhook handler structure exists. Need to ensure detailed DB logic is complete and correct.

Input Documentation Provided:
1. `core_principles.md`, `billing_credits.md`, `purgatory_mode.md`
2. `SCHEMA_Main_COMPLETE.md`
3. Existing Code: `src/services/billing/stripe/webhooks/*.ts`, `src/utils/billing/*`, `src/config/db.ts`.

Instructions:
1.  **Review/Complete `handleInvoicePaymentSucceeded.ts`:** Verify org lookup, subscription renewal ID, credit balance **reset** based on tier (using `replenishCreditsForTier`), purgatory exit logic, `billing_events` logging. Ensure transaction use.
2.  **Review/Complete `handleSubscriptionUpdated.ts`:** Verify org lookup, tier mapping (`mapPriceIdToTier`), status updates (incl. purgatory logic), `billing_events` logging. Ensure transaction use.
3.  **Review/Complete `handleSubscriptionDeleted.ts`:** Verify org lookup, setting tier to NULL, setting status to 'purgatory', logging (`billing_events`, `purgatory_events`), updating relationships, triggering notification. Ensure transaction use.
4.  **Idempotency:** Review for basic idempotency checks.
5.  **Refactor if Needed:** Ensure SRP/size adherence.

Output: Provide the **full, final code** for the three service files (`handleInvoicePaymentSucceeded.ts`, `handleSubscriptionUpdated.ts`, `handleSubscriptionDeleted.ts`). If no changes were needed, explicitly confirm that. Update relevant test scripts and documentation if changes were made.
```

---

**Prompt 2: Implement Radiology Usage Reporting (Stripe)**
*(Implement IF needed for V1.0, otherwise skip)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Implement the backend logic for reporting Radiology Group order usage to Stripe, likely for metered billing or invoice item creation.

Background: Radiology groups are intended to be billed per order. Need mechanism to calculate/report usage.

Input Documentation Provided:
1. `core_principles.md`, `billing_credits.md`
2. `SCHEMA_PHI_COMPLETE.md` (`orders` table)
3. `SCHEMA_Main_COMPLETE.md` (`organizations` table)
4. Existing Code: `src/services/stripe.service.ts`, `src/config/db.ts`.

Instructions:
1.  **Design Usage Reporting Function:** Create `src/services/billing/reportUsage.ts` (or similar). Function accepts date range.
2.  **Logic:** Query `orders` (PHI DB) to count orders per `radiology_organization_id` in range. Categorize (Standard/Advanced). Retrieve Stripe `billing_id` for each org. Use Stripe API (`invoiceItems.create` or Usage Records API) to report usage. Implement error handling and logging.
3.  **Triggering (Placeholder):** Add comment indicating need for scheduler/manual trigger.
4.  **Testing:** Create basic test script (`test-billing-usage-reporting.bat/.sh`) - requires manual verification in Stripe Test Dashboard. Add call to `run-all-tests`.
5.  **Documentation:** Update billing docs.

Output: Provide new TypeScript files for usage reporting service logic and test scripts. Update documentation.
```

---

**Prompt 3: Implement Real Export Logic (Radiology - CSV/JSON)**
*(Replaces stubs)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Implement the real data export logic for the Radiology Workflow service (`GET /api/radiology/orders/{orderId}/export/{format}`) to generate functional JSON and CSV files, including all HIPAA-related denormalized fields.

Background: Export endpoint structure exists but uses stubs. `orders` table is now comprehensive. PDF export remains a stub.

Input Documentation Provided:
1. `core_principles.md`, `radiology_workflow.md`, `api_endpoints.md`
2. `Docs/hipaa_compliance_order_data.md` (Details fields on `orders`)
3. `SCHEMA_PHI_COMPLETE.md`
4. Existing Code: `src/services/order/radiology/order-export/*`, `src/controllers/radiology-order.controller.ts`, `src/config/db.ts`, Order model/interface.

Instructions:
1.  **Modify Export Service Logic:** Ensure function fetches complete `orders` record + related data if needed.
    *   **JSON Export:** Return complete data object.
    *   **CSV Export:** Ensure `papaparse` used. Define headers & flatten data for *all* relevant `orders` columns (incl. denormalized fields). Generate CSV string.
    *   **PDF Export:** Return error "PDF not available".
    *   Handle invalid format.
2.  **Update Controller:** Ensure correct `Content-Type` and `Content-Disposition` headers set.
3.  **Update Tests:** Modify `test-radiology-export.bat/.sh` to assert presence/correctness of new fields in JSON/CSV output. Add calls to `run-all-tests`.
4.  **Documentation:** Update implementation docs.

Output: Provide updated code for export service logic, controller, test scripts, and documentation.
```

---

**Prompt 4: Enhance EMR Parsing Logic (Admin)**
*(Optional - Skip if basic is okay for V1.0)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Enhance the EMR summary parsing logic (`POST /admin/orders/{orderId}/paste-summary`) to more reliably extract patient demographics and insurance information, replacing basic stub/regex logic.

Background: Admin finalization endpoint exists but uses basic parsing.

Input Documentation Provided:
1. `core_principles.md`, `admin_finalization.md`
2. Existing Code: `src/services/admin-order/handlePasteSummary.ts` (or `src/utils/emr-parser.ts`), `src/config/db.ts`.

Instructions:
1.  **Review/Refactor Parsing Logic:** Examine current implementation. Enhance extraction for Address, Phone, Email, Insurer, Policy #, Group # using more advanced Regex, keyword/section identification, or potentially a lightweight NLP approach if feasible within scope. Return structured object.
2.  **Update Service:** Ensure `handlePasteSummary` calls enhanced parser and correctly updates `patients` / `patient_insurance` tables.
3.  **Update Tests:** Modify `test-admin-finalization.bat/.sh` with diverse EMR text snippets and assert correct extraction/saving (requires DB verification). Add calls to `run-all-tests`.
4.  **Documentation:** Update implementation docs.

Output: Provide updated code for the EMR parsing utility/service function and the updated test script.
```

---

**Prompt 5: Implement Advanced Super Admin Features (Choose V1.0 Essentials)**
*(Example: Prompt Assignment CRUD - Verify if truly done first)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Implement Super Admin API endpoints for managing Prompt Assignments (CRUD operations).

Background: Super Admin API structure and Prompt Template CRUD exist. Need endpoints to manage `prompt_assignments`.

Input Documentation Provided:
1. `core_principles.md`, `super_admin.md`, `prompt_registry.md`
2. `api_endpoints.md` (Define `/superadmin/prompts/assignments/*`)
3. `SCHEMA_Main_COMPLETE.md` (`prompt_assignments`, `users`, `prompt_templates`)
4. Existing Code: Super Admin routes/controllers/services, `src/config/db.ts`.

Instructions:
1.  **Verify/Implement Routes:** Ensure CRUD routes exist under `/api/superadmin/prompts/assignments` with `super_admin` role middleware.
2.  **Verify/Implement Controller:** Ensure handlers exist, validate inputs (FKs exist).
3.  **Verify/Implement Service Logic (`src/services/superadmin/prompts/assignments/*`):** Ensure CRUD functions exist for `prompt_assignments`. Include logic for only one active assignment per physician. Join related data for GETs. Use transactions.
4.  **Testing:** Ensure `test-superadmin-prompt-assignments.bat/.sh` exists and tests CRUD operations. Add calls to `run-all-tests`.
5.  **Documentation:** Update `api_endpoints.md` and implementation docs.

Output: Provide the code for Prompt Assignment management (routes, controller, services), test scripts, and documentation ONLY IF modifications were needed. If already complete, confirm.
```
*(Repeat Prompt 5 structure for other essential V1.0 Super Admin features if any)*

---

**Prompt 6: Implement Redis Cache Invalidation (Basic)**
*(Ensures cache stays consistent with DB updates)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Implement basic cache invalidation logic for Redis Cloud keys when underlying data (e.g., Prompt Templates) is updated via the Super Admin API.

Background: Redis caching (Cache-Aside) is implemented. Super Admin APIs can update data (e.g., `prompt_templates`). We need to clear the cache when updates occur.

Input Documentation Provided:
1. `core_principles.md`, `redis_integration.md`
2. Existing Code: `src/services/superadmin/prompts/templates/updatePromptTemplate.ts`, `deletePromptTemplate.ts`, `src/config/redis.ts`.

Instructions:
1.  **Modify `updatePromptTemplate` Service:** After successfully updating a prompt template in PG, add `await redisClient.del('prompt:default:active');` if the updated template affects the active default. Consider deleting specific `prompt:<id>` keys if used.
2.  **Modify `deletePromptTemplate` Service:** After successfully soft-deleting, add similar cache deletion logic.
3.  **Add Comments:** Add TODO comments about needing invalidation if `medical_*` tables are updated later.
4.  **Update Tests:** Modify Super Admin prompt tests to verify cache keys are deleted after updates/deletes (requires Redis check in test). Add calls to `run-all-tests`.
5.  **Documentation:** Update implementation docs.

Output: Provide updated code for prompt template update/delete service functions, updated test scripts, and documentation.
```

---

**Part 2: Comprehensive API Workflow "Cheater" Document**

This guide details the sequence of API calls for major workflows.

**(Note:** Assumes base URL is `https://api.radorderpad.com`. Requires valid JWT token in `Authorization: Bearer <token>` header for protected routes. Payloads are JSON.)

**Workflow 1: New Organization & User Onboarding**
```
1.  **Admin Self-Registers:** `POST /api/auth/register`
    *   **Actor:** Prospective Admin
    *   **Payload:** `{ organization: { name, type, npi?, address_line1?, ... }, user: { email, password, first_name, last_name, role: ('admin_referring'|'admin_radiology') } }`
    *   **Backend:** Creates Org (Main DB), creates User (Main DB, inactive, email unverified), calls `stripe.customers.create`, saves `billing_id` to Org record, creates `email_verification_tokens` record, triggers SES verification email.
    *   **Result:** `{ success: true, message: "Registration successful. Please check email..." }`
2.  **Admin Verifies Email:** User clicks link -> Hits internal verification endpoint.
    *   **Backend:** Verifies token, sets `users.email_verified = true`.
3.  **Admin Logs In:** `POST /api/auth/login`
    *   **Actor:** Verified Admin
    *   **Payload:** `{ email, password }`
    *   **Backend:** Finds user, checks password, checks `is_active` & `email_verified`, generates JWT, updates `last_login`.
    *   **Result:** `{ success: true, token: "jwt_token_here", user: { id, email, role, orgId, ... } }`
4.  **Admin Adds Locations (Optional):** `POST /api/organizations/mine/locations`
    *   **Actor:** Logged-in Admin (Token needed)
    *   **Payload:** `{ name, address_line1, city, state, zip_code, phone_number? }`
    *   **Backend:** Creates `locations` record linked to admin's `orgId`.
    *   **Result:** `{ success: true, location: { id, name, ... } }`
5.  **Admin Invites User:** `POST /api/users/invite`
    *   **Actor:** Logged-in Admin (Token needed)
    *   **Payload:** `{ email, role: ('physician'|'admin_staff'|'scheduler'|'radiologist'), firstName, lastName, primaryLocationId? }` (Validate role based on inviter's org type).
    *   **Backend:** Creates `user_invitations` record, triggers `NotificationService.sendInviteEmail`.
    *   **Result:** `{ success: true, message: "Invitation sent." }`
6.  **Invited User Accepts:** User clicks link -> Frontend page -> Sets password -> Frontend calls `POST /api/users/accept-invitation`.
    *   **Actor:** Invited User (via frontend, needs token from link)
    *   **Payload:** `{ token, password }`
    *   **Backend:** Verifies invitation token, creates `users` record, marks invitation used.
    *   **Result:** `{ success: true, message: "Account activated. Please log in." }`
7.  **New User Logs In:** `POST /api/auth/login`

**Workflow 2: Physician Creates & Submits Order (Success Path)**

1.  **Physician Logs In:** `POST /api/auth/login` -> Gets JWT token.
2.  **Physician Starts Order (Frontend):** Identifies patient locally (Name/DOB). Enters dictation. Clicks "Process Order".
3.  **First Validation:** `POST /api/orders/validate`
    *   **Actor:** Logged-in Physician (Token needed)
    *   **Payload:** `{ dictationText, patientInfo: { age?, gender? } }`
    *   **Backend:** Creates draft `orders` (status `pending_validation`, gets `orderId`), generates DB context (RedisSearch/PG fallback), calls LLM, processes result, logs `validation_attempts` (attempt 1).
    *   **Result:** `{ success: true, orderId: <NEW_ID>, validationResult: { validationStatus: 'appropriate', complianceScore: X, feedback: "...", suggestedICD10Codes: [...], suggestedCPTCodes: [...] } }`
4.  **Physician Reviews (Frontend):** UI moves to ValidationView. Displays result. Clicks "Sign Order".
5.  **Physician Signs (Frontend):** UI moves to SignatureForm. Physician signs, types name. Clicks Submit.
6.  **Frontend File Upload Sequence:**
    *   Calls `POST /api/uploads/presigned-url` -> Gets URL & filePath.
    *   PUTs signature image Blob to S3 URL.
    *   Calls `POST /api/uploads/confirm` -> Backend creates `document_uploads` record.
7.  **Finalize Order:** `PUT /api/orders/{orderId}`
    *   **Actor:** Logged-in Physician (Token needed)
    *   **Payload:** `{ final_validation_status: 'appropriate', final_compliance_score: X, final_cpt_code: '...', ..., overridden: false, signed_by_user_id: <physicianId>, signature_date: '...', signer_name: '...' }` (Plus potentially `patient_name_update` if temp patient).
    *   **Backend:** Finds draft order by ID. Creates `patients` record if needed & links it. Fetches User/Org details from Main DB. Updates `orders` record (PHI DB) with final validation state, signature info, *denormalized* provider/org details, sets `status = 'pending_admin'`. Logs 'signed' to `order_history`.
    *   **Result:** `{ success: true, orderId: <ID>, message: "Order submitted successfully." }`

**Workflow 3: Physician Order with Override**

1.  **Login & Start Order:** As above.
2.  **Validation Attempts 1, 2, 3:** `POST /api/orders/validate` called 3 times (with `orderId` after first call). Each time returns non-'appropriate' status. Backend logs attempts 1, 2, 3.
3.  **Override Justification (Frontend):** Physician clicks Override, enters justification. Clicks "Confirm Override".
4.  **Override Validation (Attempt 4):** `POST /api/orders/validate`
    *   **Actor:** Physician (Token needed)
    *   **Payload:** `{ orderId: <ID>, dictationText: "<cumulative_text_plus_justification>", isOverrideValidation: true, patientInfo: {...} }`
    *   **Backend:** Runs validation engine considering justification, logs `validation_attempts` (attempt 4).
    *   **Result:** `{ success: true, orderId: <ID>, validationResult: { validationStatus: <final_status>, complianceScore: <final_score>, feedback: "<final_feedback>", ... } }`
5.  **Physician Reviews (Frontend):** UI moves to ValidationView. Shows final result, notes "Override Applied". Clicks "Sign Order".
6.  **Physician Signs & Uploads:** As above.
7.  **Finalize Order:** `PUT /api/orders/{orderId}`
    *   **Actor:** Physician (Token needed)
    *   **Payload:** `{ final_validation_status: <final_status_from_step_4>, final_compliance_score: <final_score_from_step_4>, ..., overridden: true, override_justification: "<justification_text>", signed_by_user_id: ..., signature_date: '...', signer_name: '...' }`
    *   **Backend:** Finds draft order. Creates patient if needed. Fetches User/Org details. Updates `orders` record setting `status = 'pending_admin'`, `overridden = true`, saves justification, saves final validation state from step 4, saves signature info, saves denormalized data. Logs 'override', 'signed' to `order_history`.
    *   **Result:** `{ success: true, orderId: <ID>, message: "Order submitted successfully." }`

**Workflow 4: Admin Finalizes Order**

1.  **Admin Staff Logs In:** `POST /api/auth/login` -> Gets JWT.
2.  **Admin Views Queue:** `GET /api/orders?status=pending_admin&role=admin_staff` (or specific admin queue endpoint) -> Gets list of orders.
3.  **Admin Views Detail:** `GET /api/orders/{orderId}` -> Gets full order details.
4.  **Admin Pastes EMR:** `POST /api/admin/orders/{orderId}/paste-summary`
    *   **Payload:** `{ pastedText: "..." }`
    *   **Backend:** Parses text, updates `patients` (contact), `patient_insurance`, saves raw text to `patient_clinical_records`.
    *   **Result:** `{ success: true }`
5.  **Admin Updates Info (Optional):** `PUT /api/admin/orders/{orderId}/patient-info` or `/insurance-info` with corrected data.
6.  **Admin Adds Supplemental (Optional):** `POST /api/admin/orders/{orderId}/paste-supplemental` or File Upload Flow (`/uploads/*`).
7.  **Admin Sends to Radiology:** `POST /api/admin/orders/{orderId}/send-to-radiology`
    *   **Actor:** Logged-in Admin Staff (Token needed)
    *   **Payload:** `{}`
    *   **Backend:** Checks org status & credits (`organizations` table). If OK: decrements credits, logs `credit_usage_logs` (action 'order_submitted'), updates `orders.status` to `pending_radiology`, logs `order_history`.
    *   **Result:** `{ success: true }` (or 402/403 error).

**Workflow 5: Radiology Views & Manages Order**

1.  **Radiology User Logs In:** `POST /api/auth/login` -> Gets JWT (Role: `scheduler` or `admin_radiology`).
2.  **View Queue:** `GET /api/radiology/orders` (Can include query params for filtering: `?status=pending_radiology&priority=stat&referringOrgId=X`) -> Gets filtered list of orders.
3.  **View Detail:** `GET /api/radiology/orders/{orderId}` -> Gets full consolidated order details (incl. denormalized info, validation history, documents).
4.  **Export Data:**
    *   `GET /api/radiology/orders/{orderId}/export/json` -> Returns full JSON.
    *   `GET /api/radiology/orders/{orderId}/export/csv` -> Returns CSV file content.
5.  **Update Status:** `POST /api/radiology/orders/{orderId}/update-status`
    *   **Payload:** `{ newStatus: ('scheduled' | 'completed' | 'cancelled') }`
    *   **Backend:** Updates `orders.status`, logs `order_history`.
    *   **Result:** `{ success: true }`

**Workflow 6: Connection Management (Admin)**

1.  **Admin Logs In:** `POST /api/auth/login`.
2.  **List Connections:** `GET /api/connections` -> Gets list of active/pending/rejected connections.
3.  **List Incoming Requests:** `GET /api/connections/requests` -> Gets list of pending requests needing approval/rejection.
4.  **Request Connection:** `POST /api/connections`
    *   **Payload:** `{ targetOrganizationId: <ID> }`
    *   **Backend:** Creates `organization_relationships` record (status 'pending'), triggers notification.
    *   **Result:** `{ success: true, relationship: {...} }`
5.  **Approve Request:** `POST /api/connections/{relationshipId}/approve`
    *   **Actor:** Admin of the *target* org.
    *   **Payload:** `{}`
    *   **Backend:** Updates relationship status to 'active', triggers notification.
    *   **Result:** `{ success: true }`
6.  **Reject Request:** `POST /api/connections/{relationshipId}/reject`
    *   **Actor:** Admin of the *target* org.
    *   **Payload:** `{}`
    *   **Backend:** Updates relationship status to 'rejected', triggers notification.
    *   **Result:** `{ success: true }`
7.  **Terminate Connection:** `DELETE /api/connections/{relationshipId}`
    *   **Actor:** Admin of *either* org in the relationship.
    *   **Backend:** Updates relationship status to 'terminated'.
    *   **Result:** `{ success: true }`

**(Continue with User Management, Location Management, Super Admin workflows similarly)**

This detailed guide should provide the necessary context for how the implemented API endpoints are intended to be used together to achieve the application's core functionalities.