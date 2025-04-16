# Super Admin Console & Capabilities

**Version:** 1.2 (Added PHI Access Caution)
**Date:** 2025-04-11

This document specifies the features, capabilities, and access levels for the Super Admin role within the RadOrderPad platform. The Super Admin console is a separate interface or section of the application accessible only to users with the `super_admin` role.

---

## 1. Purpose

-   **Platform Oversight:** Monitor the overall health, usage, and performance of the RadOrderPad system using real-time and historical data.
-   **Organization Management:** Manage registered organizations (Referring & Radiology).
-   **User Management:** Manage all user accounts across the platform.
-   **Billing & Credits Administration:** Oversee billing events, manage credit balances, and handle payment issues.
-   **Support & Troubleshooting:** Assist users, investigate issues, and perform necessary administrative actions.
-   **Analytics & Reporting:** Access platform-wide data for business intelligence and operational insights.
-   **Compliance & Auditing:** Access logs and perform administrative reviews.

## 2. Access

-   Login via the standard application login page.
-   Users with `role = 'super_admin'` are redirected to or given access to the Super Admin Console/Dashboard upon successful authentication.
-   Access should ideally be restricted by IP address whitelisting and potentially require Multi-Factor Authentication (MFA).

## 3. Key Features & Panels

### 3.1. Super Admin Dashboard & Real-Time Monitoring

*(This section provides the primary, at-a-glance view of system status. It MUST be designed to be **mobile responsive**, adapting layout and potentially data density for smaller screens.)*

*   **Core Principle:** Prioritize displaying **actionable, critical system health indicators and operational bottlenecks** prominently on the main dashboard view across all screen sizes. Less critical or historical data should be accessible via clear navigation or drill-down options to avoid overwhelming the user, especially on mobile.

*   **3.1.1. Key Performance Indicators (KPIs - Near-Real-Time / Recent Trends)**
    *   **System Throughput:**
        *   Orders Validated (Attempts - Last Hour / Last 24h)
        *   Orders Sent to Radiology (Last Hour / Last 24h)
        *   LLM Fallback Rate (Last Hour / Last 24h - %)
    *   **User Activity:**
        *   Active Users (Currently Logged In / Active in Last 15 Min)
        *   New Organization Sign-ups (Last 24h / Last 7d)
    *   **Financial Health:**
        *   Recent Payment Failures (Count - Last 24h)
        *   Organizations in Purgatory (Current Count)

*   **3.1.2. Operational Queues & Bottlenecks (Near-Real-Time)**
    *   **Pending Admin Queue:** Current count (`status = 'pending_admin'`). Trend indicator.
    *   **Pending Radiology Queue:** Current count (`status = 'pending_radiology'`). Trend indicator.
    *   **Average Time in Status:** Avg duration in `pending_admin`, `pending_radiology` (Last 24h).

*   **3.1.3. System Health & Performance (Real-Time / Near-Real-Time)**
    *   **API Performance:** Error Rate (%), Key Endpoint Latency (p90/p99).
    *   **Database Health (RDS):** CPU Util (%), Connection Count Alerts.
    *   **Cache Health (Redis):** Hit Rate (%), Memory Util (%).
    *   **LLM Service Status:** API Error Rate (%) - per provider.

*   **3.1.4. Alerts & Critical Issues (Real-Time Highlights)**
    *   Highlight critical thresholds being breached (High API errors, DB/Cache issues, High LLM/Payment failures, Purgatory spikes).

*   **3.1.5. Quick Links:** Links to deeper sections like Org Management, User Management, Billing Panel, etc. (Ensure these are usable on mobile).

### 3.2. Organization Management

*(Detailed management of specific organizations)*

-   **List Organizations:** View all registered organizations with search/filter capabilities (by name, NPI, type, status, account manager).
-   **View Organization Details:** Access detailed view of any organization, including:
    *   Profile information (`organizations` table data).
    *   Associated Users (`users` table filtered by org).
    *   Connection Relationships (`organization_relationships`).
    *   Billing History (`billing_events`).
    *   Credit Balance & Usage (`organizations.credit_balance`, `credit_usage_logs`).
    *   Purgatory History (`purgatory_events`).
-   **Actions:**
    *   **Edit Organization Profile:** Modify basic details.
    *   **Set Status:** Manually change `organizations.status` ('active', 'on_hold', 'purgatory', 'terminated'). Triggers `purgatory_events` logging.
    *   **Adjust Credit Balance:** Manually add or remove validation credits (logs entry in `billing_events` with type 'manual_adjustment').
    *   **Assign Account Manager:** Link an internal `super_admin` or dedicated support user (`users.id`) to an organization (`organizations.assigned_account_manager_id`).
    *   *(Future)* Manage organization-specific feature flags or settings.

### 3.3. User Management

*(Detailed management of specific user accounts)*

-   **List Users:** View all users across all organizations with search/filter (by email, name, org, role, status).
-   **View User Details:** Access detailed view of any user account.
-   **Actions:**
    *   **Edit User Profile:** Modify name, role, NPI, etc.
    *   **Activate/Deactivate User:** Toggle `users.is_active`.
    *   **Verify Email Manually:** Set `users.email_verified = true`.
    *   **Send Password Reset Link:** Trigger password reset flow for a user.
    *   **Impersonate User (Use with extreme caution & auditing):** Ability to log in as a specific user for troubleshooting. Requires strict controls and logging.

### 3.4. Billing & Credits Panel

*(Financial administration)*

-   **View Billing Events:** Display `billing_events` log with filters (org, date, type). Exportable.
-   **View Credit Usage:** Display `credit_usage_logs` with filters (org, user, date). Exportable.
-   **Sync Stripe Data:** Button to manually trigger sync with Stripe (e.g., update customer details, check subscription status).
-   **Manual Credit Grant:** Interface to grant credits to specific organizations (logs to `billing_events`).
-   **View Purgatory Events:** Display `purgatory_events` log.

### 3.5. Validation & LLM Analytics

*(Platform intelligence and performance monitoring)*

- **View LLM Logs:** Display `llm_validation_logs` with filters (org, user, model, status, date). Analyze fallback rates, latencies, token usage per model.
- **View Validation Attempts:** (Requires **audited** access to PHI DB or aggregated non-PHI view) Analyze validation outcomes, scores, feedback effectiveness, override reasons (`validation_attempts` data). Filterable by org, physician, date range. **Access must adhere to minimum necessary principle.**

- **Prompt Management:** Comprehensive interface for managing validation prompts:
  * **Prompt List:** View all prompt templates with filtering and sorting options
  * **Prompt Editor:** Create and edit prompts with syntax highlighting and validation
  * **Version Control:** Track changes, compare versions, and roll back when needed
  * **Testing Interface:** Test prompts with sample cases before deployment
  * **A/B Testing:** Set up experiments to compare prompt effectiveness
  * **Analytics Dashboard:** View performance metrics by prompt version
  * **Documentation Panel:** Access contextual help and best practices
  * For detailed information, see [Prompt Management UI](./prompt_management_ui.md)

- **Rare Disease Stats:** Report on frequency of rare disease trigger activations.

### 3.6. Compliance & Auditing

*(Access to logs for audit and review)*

-   **View Order History:** Access `order_history` (PHI DB) for detailed audit trails of specific order lifecycles. Filterable by order ID, user, event type, date. **Access must be audited.**
-   **View PHI Access Logs:** (Requires `PHIAccessService` implementation or equivalent DB audit logging) Access logs detailing which users (including Super Admins) accessed specific PHI records (e.g., viewing order details, patient records). **Essential for HIPAA compliance.**
-   **Export Logs:** Ability to export relevant logs (billing, credits, LLM, PHI access audit trails) in standard formats (CSV) for compliance reviews.
-   **Links to Monitoring:** Quick links back to relevant AWS CloudWatch dashboards or other monitoring tools for deeper infrastructure investigation.

---

## 4. PHI Access Considerations for Super Admins

-   **Minimum Necessary:** Super Admin access to PHI tables (`radorder_phi`) must be strictly limited to what is absolutely necessary for specific, authorized tasks like troubleshooting critical order processing errors or responding to compliance audits. Routine analytics should rely on de-identified or aggregated data where possible.
-   **Auditing:** All Super Admin access to PHI data (read or write, though writes should be exceptionally rare and controlled) **must be logged** in an immutable audit trail (e.g., database audit logs, dedicated PHI access log service). Logs should record the Super Admin user ID, the specific record(s) accessed, the timestamp, and the reason for access (if feasible).
-   **Break-Glass Procedures:** Consider implementing "break-glass" procedures for elevated PHI access, requiring justification and potentially secondary approval for non-standard troubleshooting.
-   **Training:** Super Admins must receive specific training on HIPAA privacy and security rules and the importance of minimizing PHI access.

---

## Data References

-   Access to nearly all tables in `radorder_main`.
-   **Strictly controlled, audited, and minimized access** potentially required for specific tables in `radorder_phi` (e.g., `orders`, `validation_attempts`, `order_history`, `patients`) for authorized troubleshooting, analytics, and audit purposes, respecting HIPAA minimum necessary principle.
-   Stripe API (External)
-   AWS CloudWatch Metrics/Logs (External)

