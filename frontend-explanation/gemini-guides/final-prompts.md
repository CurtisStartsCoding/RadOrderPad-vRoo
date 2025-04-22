Okay, understood. You've successfully deployed the backend API to **Vercel** (a great platform for Node.js apps, often simpler than raw AWS setup initially) and want to complete the remaining backend implementation tasks to reach full feature completion based on our documentation.

Let's consolidate the remaining backend prompts.

**Assumptions:**

*   The Vercel deployment is running and connected to your RDS databases and Redis Cloud instance.
*   Core features (Auth, Orders, User/Loc/Conn Mgmt, Validation, S3 Upload, SES Notify, Billing Basics, Redis Cache/Search, Super Admin Basics) are implemented and broadly functional based on previous steps.
*   You have addressed any critical issues found immediately post-deployment (like the schema update you mentioned).

---

**Remaining Backend Implementation Prompts (Consolidated):**

Here are the prompts for the key remaining backend tasks, designed to be run sequentially.

**DONE Prompt 1: Finalize Stripe Webhook Logic (DB Updates)DONE**
*(This ensures the database accurately reflects subscription/payment states)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---

Objective: Finalize and verify the database update logic within the Stripe webhook handlers (`handleSubscriptionUpdated`, `handleSubscriptionDeleted`, `handleInvoicePaymentSucceeded`) to ensure organization status, subscription tiers, and credit balances are correctly managed based on live or simulated Stripe events.

Background: The webhook handler structure and basic logic exist. We need to ensure the detailed database interactions (especially for subscription tier changes and credit replenishment) are fully implemented and correct.

Input Documentation Provided:
1. `core_principles.md`
2. `billing_credits.md` (Credit replenishment rules based on tiers)
3. `purgatory_mode.md` (Status update rules)
4. `SCHEMA_Main_COMPLETE.md` (Defines `organizations`, `billing_events`, `purgatory_events`)
5. Existing Code: `src/services/billing/stripe/webhooks/handle-subscription-updated.ts`, `src/services/billing/stripe/webhooks/handle-subscription-deleted.ts`, `src/services/billing/stripe/webhooks/handle-invoice-payment-succeeded.ts`, `src/services/billing/credit/replenish-credits-for-tier.ts` (if exists), `src/utils/billing/map-price-id-to-tier.ts` (if exists), `src/config/db.ts`.

Instructions:
1.  **Review & Finalize `handleInvoicePaymentSucceeded.ts`:** Confirm logic correctly identifies subscription renewals and **resets** `organizations.credit_balance` based on the org's current `subscription_tier` using the `replenishCreditsForTier` logic/utility. Ensure purgatory exit logic is complete.
2.  **Review & Finalize `handleSubscriptionUpdated.ts`:** Confirm tier mapping (`mapPriceIdToTier`) is robust. Ensure `organizations.subscription_tier` is updated. Confirm status updates (purgatory exit/entry based on `subscription.status`) are correct.
3.  **Review & Finalize `handleSubscriptionDeleted.ts`:** Confirm `organizations.subscription_tier` is set to NULL/cancelled and `status` to 'purgatory'. Confirm logging and notifications.
4.  **Ensure Transactions & Idempotency:** Verify all database writes use transactions. Review for basic idempotency (e.g., checking current status before updating to avoid redundant operations if an event is re-processed).
5.  **Testing:** Update `tests/batch/test-stripe-webhooks-cli.bat`/`.sh` to include specific database state checks (using `psql` commands via the helper script) before and after triggering events like `invoice.payment_succeeded` (for credit reset) and `customer.subscription.updated` (for tier change) to verify the database updates.

Output: Provide the **final, verified code** for the three service files (`handleInvoicePaymentSucceeded.ts`, `handleSubscriptionUpdated.ts`, `handleSubscriptionDeleted.ts`). Provide the updated test script (`test-stripe-webhooks-cli.bat`/`.sh`) including database verification steps. Update relevant documentation.
```

---

**Prompt 2: Implement Radiology Usage Reporting (Stripe)**
*(Optional - Skip if not needed for V1.0)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---

Objective: Implement the backend logic for reporting Radiology Group order usage to Stripe, likely for metered billing or invoice item creation.

Background: Core features are implemented. Radiology groups are intended to be billed per order received. We need a mechanism (e.g., a scheduled job or an admin-triggered process) to calculate and report usage to Stripe.

Input Documentation Provided:
1. `core_principles.md`
2. `billing_credits.md` (Mentions pay-per-order for Radiology Groups)
3. `SCHEMA_PHI_COMPLETE.md` (Defines `orders` table with `radiology_organization_id`, `created_at`, `final_cpt_code`/`modality`)
4. `SCHEMA_Main_COMPLETE.md` (Defines `organizations` table with `billing_id`)
5. Existing Code: `src/services/stripe.service.ts` (Stripe client), `src/config/db.ts`.

Instructions:
1.  **Design Usage Reporting Function:** Create a new service function (e.g., in `src/services/billing/reportUsage.ts`) that:
    *   Accepts a date range (start, end) as input.
    *   Queries the `orders` table (PHI DB) to count orders received (`status` moved to `pending_radiology` or later within the date range) for each `radiology_organization_id`.
    *   Categorizes orders (e.g., 'Standard' vs. 'Advanced Imaging') based on `modality` or `final_cpt_code`.
    *   For each Radiology Group with orders in the period:
        *   Retrieves their Stripe `billing_id` from the `organizations` table (Main DB).
        *   Uses the Stripe API to report usage. Choose ONE method:
            *   **Method A (Usage Records - for Metered Billing):** If using Stripe Metered Billing subscriptions, call `stripe.subscriptionItems.createUsageRecord(...)` for each order or in aggregate for the billing period.
            *   **Method B (Invoice Items - for Manual Invoicing):** Call `stripe.invoiceItems.create(...)` for each category of usage (e.g., 50 Standard Orders @ $2.00, 10 Advanced Orders @ $7.00) associated with the Stripe `customer` ID. Stripe can then generate an invoice from these items.
    *   Implement robust error handling for database queries and Stripe API calls.
    *   Log the results of the usage reporting.
2.  **Triggering Mechanism (Placeholder):** For now, this function can be standalone. Add a comment indicating it needs to be triggered (e.g., by a scheduled job - cron, AWS EventBridge Scheduler - or a Super Admin action) in a production environment.
3.  **Testing:** Create a test script (`test-billing-usage-reporting.bat/.sh`) that:
    *   Potentially inserts sample orders linked to a test Radiology Org with a known Stripe Test Customer ID.
    *   Calls a temporary API endpoint (or directly invokes the service function if testing locally) to trigger the usage reporting for a specific date range.
    *   **Verification:** Requires checking the Stripe Test Dashboard to see if usage records or invoice items were created correctly for the test customer. Add call to `run-all-tests`.
4.  **Documentation:** Update billing docs and implementation summaries.

Output: Provide the new TypeScript files for the usage reporting service logic and the test scripts. Update documentation.
```

---

**Prompt 3: Implement Real Export Logic (Radiology)**

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Implement the real data export logic for the Radiology Workflow service (`GET /api/radiology/orders/{orderId}/export/{format}`) to generate functional JSON and CSV files, replacing any existing stubs (PDF remains optional/stubbed).

Background: The backend API for Radiology Workflow exists, including the export endpoint structure. The previous implementation might have returned stubbed data or basic JSON only. The `orders` table now contains comprehensive denormalized HIPAA-compliant data.

Input Documentation Provided:
1. `core_principles.md`
2. `radiology_workflow.md` (Mentions Export Options)
3. `api_endpoints.md` (Defines export endpoint)
4. `Docs/hipaa_compliance_order_data.md` (Details fields now available on `orders`)
5. Existing Code: `src/services/order/radiology/order-export/*` (export logic files), `src/controllers/radiology-order.controller.ts`, `src/config/db.ts`, Order model/interface.

Instructions:
1.  **Modify Export Service Logic (`src/services/order/radiology/order-export/export-order.ts` and helpers):**
    *   Ensure the function fetches the **complete `orders` record**, including all the newly added denormalized provider/organization/consent/auth fields. Fetch related data like `validation_attempts` or `patient_clinical_records` if they should be included in the export.
    *   **JSON Export (`format === 'json'`):** Return the complete, potentially nested, order data object.
    *   **CSV Export (`format === 'csv'`):**
        *   Ensure `papaparse` is installed (`npm install papaparse @types/papaparse`).
        *   Define the full list of CSV headers, including all the new denormalized fields from the `orders` table.
        *   Create a flattened data structure (simple object or array) from the fetched order data suitable for `papaparse.unparse()`. Handle arrays (like `final_icd10_codes`) by joining them into a single string cell.
        *   Generate the CSV string using `papaparse.unparse()`.
        *   Return the CSV string.
    *   **PDF Export (`format === 'pdf'`):** Keep as a stub. Return an error message "PDF export not yet available" or the JSON data as a fallback.
2.  **Update Controller (`radiology-order.controller.ts`):** Verify it sets the correct `Content-Type` (`application/json`, `text/csv`) and `Content-Disposition: attachment; filename="order_XYZ.ext"` headers based on the requested format.
3.  **Update Tests (`test-radiology-export.bat/.sh`):**
    *   Modify tests to fetch the exported JSON/CSV content.
    *   Assert that the JSON response contains the new denormalized fields.
    *   Assert that the CSV response contains the correct headers and data corresponding to the new fields for a test order.
    *   Add calls to `run-all-tests`.
4.  **Documentation:** Update `radiology_export.md` and implementation summaries.

Output: Provide the updated TypeScript code for the export service logic (`export-order.ts`, `generate-csv-export.ts`), the radiology controller, updated test scripts, and documentation.
```

---

**Prompt 4: Implement Real EMR Parsing Logic (Admin)**
*(Optional - Skip if basic regex is sufficient for v1.0)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Enhance the EMR summary parsing logic within the Admin Finalization workflow (`POST /admin/orders/{orderId}/paste-summary`) to more reliably extract patient demographics and insurance information, replacing the current basic stub/regex logic.

Background: The admin finalization endpoint exists but uses basic parsing. More robust extraction is desired.

Input Documentation Provided:
1. `core_principles.md`
2. `admin_finalization.md` (Describes pasting/parsing)
3. Existing Code: `src/services/admin-order/handlePasteSummary.ts` (or `src/utils/emr-parser.ts`), `src/config/db.ts`.

Instructions:
1.  **Review/Refactor Parsing Logic (`handlePasteSummary.ts` or `emr-parser.ts`):**
    *   Examine the current parsing implementation.
    *   **Enhance Extraction:** Implement more sophisticated techniques to identify and extract key fields like Patient Address (Street, City, State, Zip), Patient Phone, Patient Email, Insurer Name, Policy Number, Group Number from the pasted text. Consider:
        *   More advanced Regular Expressions.
        *   Simple keyword/section identification (e.g., look for lines starting with "Insurance:", "Address:", "Policy #:").
        *   (Advanced/Optional) Integrating a lightweight NLP library if feasible.
    *   Ensure the function returns a structured object containing the extracted data (or null/undefined for fields not found).
2.  **Update Service:** Ensure the `handlePasteSummary` service function correctly calls the enhanced parser, saves the raw text to `patient_clinical_records`, and updates the `patients` and `patient_insurance` tables with the *extracted* data.
3.  **Testing:** Update `tests/batch/test-admin-finalization.bat/.sh` with more diverse sample EMR summary text snippets and assert that the key demographic/insurance fields are correctly extracted and saved to the database (requires DB verification steps in the test). Add calls to `run-all-tests`.
4.  **Documentation:** Update implementation docs.

Output: Provide the updated TypeScript code for the EMR parsing utility/service function and the updated test script.
```

---

**Prompt 5: Implement Advanced Super Admin Features**
*(Choose specific features needed for v1.0)*

```prompt
Roo Code Prompt:

--- START OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
[Include the SRP-focused header block here]
--- END OF STANDARD PROMPT BLOCK (SRP FOCUSED) ---
```
Objective: Implement the following advanced Super Admin API endpoint(s): [CHOOSE ONE OR TWO - e.g., Detailed Log Viewing with Advanced Filtering, Prompt Assignment Management].

Background: Basic Super Admin CRUD/view endpoints exist. We need additional capabilities for platform management.

Input Documentation Provided:
1. `core_principles.md`
2. `super_admin.md` (Describes required capabilities)
3. `api_endpoints.md` (Define specific new endpoints)
4. Relevant Schema files (`SCHEMA_Main_COMPLETE.md`, `SCHEMA_PHI_COMPLETE.md`)
5. Existing Code: Super Admin routes/controllers/services, `src/config/db.ts`.

Instructions:
1.  **Define Routes:** Add new routes under `/api/superadmin/...` for the chosen feature(s). Apply `super_admin` role middleware.
2.  **Implement Controller:** Add new controller functions. Validate inputs/query params.
3.  **Implement Service Logic (New files under `src/services/superadmin/...`):**
    *   **For Log Viewing:** Implement advanced filtering (e.g., complex date logic, multiple status selection, text search within logs if feasible) and potentially sorting for the log listing functions (`listLlmValidationLogs`, etc.). Ensure pagination remains efficient.
    *   **For Prompt Assignment CRUD:** Implement Create, Update, Delete logic for `prompt_assignments` table, including validation and logic to handle active assignments per physician. (Roo Code reported this was done - VERIFY first).
    *   **[Other Features...]**
4.  **Testing:** Create/update test scripts (`test-superadmin-*.bat/.sh`) for the new endpoints. Add calls to `run-all-tests`.
5.  **Documentation:** Update `api_endpoints.md` and implementation docs.

Output: Provide the new/updated TypeScript files for the specified Super Admin feature(s) (routes, controller, services), test scripts, and documentation updates.
```

---

This sequence prioritizes finalizing core integrations (Stripe webhooks), replacing key stubs (Export, Parsing), and then adding essential Super Admin features. Caching and comprehensive unit/integration testing would typically follow these functional implementations.