# SCHEMA_Main.md (Reconciled Definitive - COMPLETE)

**Version:** 1.4 (Trial Feature Implementation)
**Date:** 2025-04-25

This document defines the **authoritative and fully expanded reconciled schema** for the **`radorder_main`** database (Non-PHI). It includes all tables and columns based on the initial specification and later feature requirements.

---

**Table: `organizations`**

| Column                      | Type                        | Constraints                                    | Description                                                   |
| --------------------------- | --------------------------- | ---------------------------------------------- | ------------------------------------------------------------- |
| `id`                        | `integer`                   | `PRIMARY KEY`, Auto-incrementing               | Primary key for the organization                              |
| `name`                      | `text`                      | `NOT NULL`                                     | Organization name                                             |
| `type`                      | `text`                      | `NOT NULL`                                     | Organization type ('referring_practice', 'radiology_group') |
| `npi`                       | `text`                      |                                                | Organization National Provider Identifier                     |
| `tax_id`                    | `text`                      |                                                | Organization tax ID/EIN                                       |
| `address_line1`             | `text`                      |                                                | First line of organization address                            |
| `address_line2`             | `text`                      |                                                | Second line of organization address                           |
| `city`                      | `text`                      |                                                | Organization city                                             |
| `state`                     | `text`                      |                                                | Organization state/province                                   |
| `zip_code`                  | `text`                      |                                                | Organization ZIP/postal code                                  |
| `phone_number`              | `text`                      |                                                | Organization main phone number                                |
| `fax_number`                | `text`                      |                                                | Organization fax number                                       |
| `contact_email`             | `text`                      |                                                | Organization contact email                                    |
| `website`                   | `text`                      |                                                | Organization website URL                                      |
| `logo_url`                  | `text`                      |                                                | URL to organization logo image                                |
| `billing_id`                | `text`                      |                                                | Stripe customer ID                                            |
| `credit_balance`            | `integer`                   | `NOT NULL`, `DEFAULT 0`                        | Current validation credit balance                             |
| `subscription_tier`         | `text`                      |                                                | e.g., 'tier_1', 'tier_2' (for referring groups)             |
| `status`                    | `text`                      | `NOT NULL`, `DEFAULT 'active'`                 | 'active', 'on_hold', 'purgatory', 'terminated'              |
| `assigned_account_manager_id` | `integer`                   | `FK REFERENCES users(id)` (Optional)           | User ID of internal account manager                         |
| `created_at`                | `timestamp without time zone` | `DEFAULT now()`                                | Timestamp when the organization was created                   |
| `updated_at`                | `timestamp without time zone` | `DEFAULT now()`                                | Timestamp when the organization was last updated              |

**Table: `locations`** *(NEW - For Multi-Location Support)*

| Column            | Type                        | Constraints                               | Description                                      |
| ----------------- | --------------------------- | ----------------------------------------- | ------------------------------------------------ |
| `id`              | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key for the location/facility            |
| `organization_id` | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | Parent organization                              |
| `name`            | `text`                      | `NOT NULL`                                | Location name (e.g., "Downtown Clinic")          |
| `address_line1`   | `text`                      |                                           | Location address                                 |
| `address_line2`   | `text`                      |                                           |                                                  |
| `city`            | `text`                      |                                           |                                                  |
| `state`           | `text`                      |                                           |                                                  |
| `zip_code`        | `text`                      |                                           |                                                  |
| `phone_number`    | `text`                      |                                           | Location specific phone                          |
| `is_active`       | `boolean`                   | `NOT NULL`, `DEFAULT true`                | Whether the location is active                   |
| `created_at`      | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp created                                |
| `updated_at`      | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp updated                                |

**Table: `users`**

| Column                   | Type                        | Constraints                               | Description                                                                 |
| ------------------------ | --------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| `id`                     | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key for the user                                                    |
| `organization_id`        | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | ID of the organization the user belongs to                                |
| `primary_location_id`    | `integer`                   | `FK REFERENCES locations(id)` (Optional)  | Primary location assignment (alternative to user_locations)                 |
| `email`                  | `text`                      | `NOT NULL`, `UNIQUE`                      | User email address (used for login)                                         |
| `password_hash`          | `text`                      |                                           | Hashed user password                                                        |
| `first_name`             | `text`                      | `NOT NULL`                                | User first name                                                             |
| `last_name`              | `text`                      | `NOT NULL`                                | User last name                                                              |
| `role`                   | `text`                      | `NOT NULL`                                | User role ('admin_referring', 'admin_radiology', 'physician', 'admin_staff', 'radiologist', 'scheduler', 'super_admin') |
| `npi`                    | `text`                      |                                           | National Provider Identifier for healthcare providers                       |
| `signature_url`          | `text`                      |                                           | URL to the user's electronic signature image (optional)                     |
| `is_active`              | `boolean`                   | `NOT NULL`, `DEFAULT true`                | Whether the user account is active                                          |
| `last_login`             | `timestamp without time zone` |                                           | Timestamp of user's last login                                              |
| `created_at`             | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp when the user was created                                         |
| `updated_at`             | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp when the user was last updated                                    |
| `email_verified`         | `boolean`                   | `NOT NULL`, `DEFAULT false`               | Whether the user's email address has been verified                          |
| `specialty`              | `text`                      |                                           | Medical specialty of the user (for physicians and radiologists)             |
| `invitation_token`       | `text`                      |                                           | Token for user invitation process                                           |
| `invitation_sent_at`     | `timestamp without time zone` |                                           | Timestamp when invitation was sent                                          |
| `invitation_accepted_at` | `timestamp without time zone` |                                           | Timestamp when invitation was accepted                                      |
| `phone_number`           | `text`                      |                                           | User contact phone number                                                   |

**Table: `trial_users`**

Column                   | Type                        | Constraints                               | Description                                                                 |
------------------------ | --------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
`id`                     | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key for the trial user                                              |
`email`                  | `text`                      | `NOT NULL`, `UNIQUE`                      | Trial user email address (used for login)                                   |
`password_hash`          | `text`                      | `NOT NULL`                                | Hashed trial user password                                                  |
`first_name`             | `text`                      |                                           | Trial user first name                                                       |
`last_name`              | `text`                      |                                           | Trial user last name                                                        |
`specialty`              | `text`                      |                                           | Medical specialty (for trial physicians)                                    |
`validation_count`       | `integer`                   | `NOT NULL`, `DEFAULT 0`                   | Number of validations performed by the trial user                           |
`max_validations`        | `integer`                   | `NOT NULL`, `DEFAULT 10`                  | Maximum number of validations allowed for the trial user                    |
`created_at`             | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp when the trial user was created                                   |
`last_validation_at`     | `timestamp without time zone` |                                           | Timestamp of trial user's last validation                                   |

**Table: `user_locations`** *(NEW - Optional Join Table for Multi-Location)*

| Column        | Type      | Constraints                               | Description                                      |
| ------------- | --------- | ----------------------------------------- | ------------------------------------------------ |
| `id`          | `integer` | `PRIMARY KEY`, Auto-incrementing          | Primary key                                      |
| `user_id`     | `integer` | `NOT NULL`, `FK REFERENCES users(id)`     | Link to User                                     |
| `location_id` | `integer` | `NOT NULL`, `FK REFERENCES locations(id)` | Link to Location                                 |
|               |           | `UNIQUE (user_id, location_id)`           | Ensure unique assignment                         |

**Table: `organization_relationships`**

| Column                    | Type                        | Constraints                                                                 | Description                                          |
| ------------------------- | --------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------- |
| `id`                      | `integer`                   | `PRIMARY KEY`, Auto-incrementing                                            | Primary key for the relationship                     |
| `organization_id`         | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)`                                 | ID of the organization initiating the relationship |
| `related_organization_id` | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)`                                 | ID of the target organization                        |
| `status`                  | `text`                      | `NOT NULL`, `DEFAULT 'pending'`                                             | Status ('pending', 'active', 'rejected', 'purgatory', 'terminated') |
| `initiated_by_id`         | `integer`                   | `FK REFERENCES users(id)`                                                     | User ID who initiated the relationship               |
| `approved_by_id`          | `integer`                   | `FK REFERENCES users(id)`                                                     | User ID who approved/rejected the relationship     |
| `notes`                   | `text`                      |                                                                             | Notes about the relationship                         |
| `created_at`              | `timestamp without time zone` | `DEFAULT now()`                                                             | Timestamp when the relationship was created          |
| `updated_at`              | `timestamp without time zone` | `DEFAULT now()`                                                             | Timestamp when the relationship was last updated     |
|                           |                             | `UNIQUE (organization_id, related_organization_id)`                         | Ensure only one relationship pair exists             |

**Table: `sessions`**

| Column       | Type                        | Constraints                   | Description             |
| ------------ | --------------------------- | ----------------------------- | ----------------------- |
| `id`         | `text`                      | `PRIMARY KEY`                 | Session ID (e.g., UUID) |
| `user_id`    | `integer`                   | `FK REFERENCES users(id)`     | Associated user         |
| `expires_at` | `timestamp without time zone` | `NOT NULL`                    | Session expiry time     |
| `created_at` | `timestamp without time zone` | `DEFAULT now()`               | Timestamp created       |

**Table: `refresh_tokens`**

| Column       | Type                        | Constraints                   | Description                    |
| ------------ | --------------------------- | ----------------------------- | ------------------------------ |
| `id`         | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key                    |
| `user_id`    | `integer`                   | `NOT NULL`, `FK REFERENCES users(id)` | Associated user                |
| `token`      | `text`                      | `NOT NULL`, `UNIQUE`          | The refresh token value        |
| `token_id`   | `text`                      | `NOT NULL`, `UNIQUE`          | Identifier for the token family |
| `expires_at` | `timestamp without time zone` | `NOT NULL`                    | Token expiry time              |
| `issued_at`  | `timestamp without time zone` | `NOT NULL`, `DEFAULT now()`   | Timestamp issued               |
| `is_revoked` | `boolean`                   | `NOT NULL`, `DEFAULT false`   | If the token has been revoked  |
| `ip_address` | `text`                      |                               | IP address of issuance         |
| `user_agent` | `text`                      |                               | User agent of issuance         |
| `created_at` | `timestamp without time zone` | `DEFAULT now()`               | Timestamp created              |

**Table: `password_reset_tokens`**

| Column       | Type                        | Constraints                   | Description             |
| ------------ | --------------------------- | ----------------------------- | ----------------------- |
| `id`         | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key             |
| `user_id`    | `integer`                   | `NOT NULL`, `FK REFERENCES users(id)` | Associated user         |
| `token`      | `text`                      | `NOT NULL`, `UNIQUE`          | The reset token value   |
| `expires_at` | `timestamp without time zone` | `NOT NULL`                    | Token expiry time       |
| `used`       | `boolean`                   | `NOT NULL`, `DEFAULT false`   | If the token was used   |
| `created_at` | `timestamp without time zone` | `DEFAULT now()`               | Timestamp created       |

**Table: `email_verification_tokens`**

| Column       | Type                        | Constraints                   | Description                 |
| ------------ | --------------------------- | ----------------------------- | --------------------------- |
| `id`         | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key                 |
| `user_id`    | `integer`                   | `NOT NULL`, `FK REFERENCES users(id)` | Associated user             |
| `token`      | `text`                      | `NOT NULL`, `UNIQUE`          | The verification token value |
| `expires_at` | `timestamp without time zone` | `NOT NULL`                    | Token expiry time           |
| `used`       | `boolean`                   | `NOT NULL`, `DEFAULT false`   | If the token was used       |
| `created_at` | `timestamp without time zone` | `DEFAULT now()`               | Timestamp created           |

**Table: `user_invitations`**

| Column               | Type                        | Constraints                               | Description                  |
| -------------------- | --------------------------- | ----------------------------------------- | ---------------------------- |
| `id`                 | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key                  |
| `organization_id`    | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | Target organization          |
| `invited_by_user_id` | `integer`                   | `FK REFERENCES users(id)`                 | User who sent the invitation |
| `email`              | `text`                      | `NOT NULL`                                | Email address invited        |
| `role`               | `text`                      | `NOT NULL`                                | Role assigned                |
| `token`              | `text`                      | `NOT NULL`, `UNIQUE`                      | Invitation token value       |
| `expires_at`         | `timestamp without time zone` | `NOT NULL`                                | Token expiry time            |
| `status`             | `text`                      | `NOT NULL`, `DEFAULT 'pending'`           | 'pending', 'accepted', etc.  |
| `created_at`         | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp created            |
| `updated_at`         | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp updated            |

**Table: `billing_events`**

| Column               | Type                        | Constraints                               | Description                                                      |
| -------------------- | --------------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `id`                 | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key                                                      |
| `organization_id`    | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | Organization related to the event                              |
| `event_type`         | `text`                      | `NOT NULL`                                | 'charge', 'subscription_payment', 'top_up', 'credit_grant', 'manual_adjustment', 'payment_failed' |
| `amount_cents`       | `integer`                   |                                           | Amount in cents (positive or negative for adjustments)         |
| `currency`           | `text`                      | `NOT NULL`, `DEFAULT 'usd'`               | Currency code                                                    |
| `payment_method_type`| `text`                      |                                           | e.g., 'card', 'ach'                                              |
| `stripe_event_id`    | `text`                      |                                           | ID from Stripe event (if applicable)                             |
| `stripe_invoice_id`  | `text`                      |                                           | ID from Stripe invoice (if applicable)                           |
| `stripe_charge_id`   | `text`                      |                                           | ID from Stripe charge (if applicable)                            |
| `description`        | `text`                      |                                           | Human-readable description                                       |
| `created_at`         | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp of the billing event                                   |

**Table: `credit_usage_logs`**

| Column                  | Type                        | Constraints                               | Description                                                    |
| ----------------------- | --------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `id`                    | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key                                                    |
| `organization_id`       | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | Organization consuming the credit                            |
| `user_id`               | `integer`                   | `NOT NULL`, `FK REFERENCES users(id)`     | User performing the action                                     |
| `order_id`              | `integer`                   | `NOT NULL`                                | Logical FK to `radorder_phi.orders.id`                       |
| `validation_attempt_id` | `integer`                   |                                           | Logical FK to `radorder_phi.validation_attempts.id` (Optional) |
| `tokens_burned`         | `integer`                   | `NOT NULL`, `DEFAULT 1`                   | Number of credits consumed                                     |
| `action_type`           | `text`                      | `NOT NULL`                                | 'validate', 'clarify', 'override_validate'                     |
| `created_at`            | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp of credit consumption                                |

**Table: `purgatory_events`**

| Column            | Type                        | Constraints                               | Description                                      |
| ----------------- | --------------------------- | ----------------------------------------- | ------------------------------------------------ |
| `id`              | `integer`                   | `PRIMARY KEY`, Auto-incrementing          | Primary key                                      |
| `organization_id` | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | Organization affected                            |
| `reason`          | `text`                      | `NOT NULL`                                | Reason for entering purgatory (e.g., 'payment_failed') |
| `triggered_by`    | `text`                      |                                           | Source ('stripe_webhook', 'super_admin')         |
| `triggered_by_id` | `integer`                   | `FK REFERENCES users(id)` (Optional)      | Super admin user ID if manually triggered        |
| `status`          | `text`                      | `NOT NULL`, `DEFAULT 'active'`            | Status of the purgatory event ('active', 'resolved') |
| `created_at`      | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp when purgatory started                 |
| `resolved_at`     | `timestamp without time zone` |                                           | Timestamp when resolved                          |

**Table: `llm_validation_logs`**

| Column                  | Type                        | Constraints                               | Description                                                    |
| ----------------------- | --------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `id`                    | `bigint`                    | `PRIMARY KEY`, Auto-incrementing          | Primary key (bigint for potentially high volume)             |
| `order_id`              | `integer`                   | `NOT NULL`                                | Logical FK to `radorder_phi.orders.id`                       |
| `validation_attempt_id` | `integer`                   | `NOT NULL`                                | Logical FK to `radorder_phi.validation_attempts.id`          |
| `user_id`               | `integer`                   | `NOT NULL`, `FK REFERENCES users(id)`     | User initiating the validation                                 |
| `organization_id`       | `integer`                   | `NOT NULL`, `FK REFERENCES organizations(id)` | User's organization                                          |
| `llm_provider`          | `text`                      | `NOT NULL`                                | 'anthropic', 'xai', 'openai'                                   |
| `model_name`            | `text`                      | `NOT NULL`                                | Specific model used (e.g., 'claude-3-7-sonnet-20250219')     |
| `prompt_template_id`    | `integer`                   | `FK REFERENCES prompt_templates(id)`      | Prompt template used (if applicable)                         |
| `prompt_tokens`         | `integer`                   |                                           | Input tokens used                                              |
| `completion_tokens`     | `integer`                   |                                           | Output tokens generated                                        |
| `total_tokens`          | `integer`                   |                                           | Total tokens for the call                                      |
| `latency_ms`            | `integer`                   |                                           | API call latency in milliseconds                             |
| `status`                | `text`                      | `NOT NULL`                                | 'success', 'failed', 'fallback_success (...)', 'fallback_failed (...)' |
| `error_message`         | `text`                      |                                           | Error details if failed                                        |
| `raw_response_digest`   | `text`                      |                                           | Hash/digest of raw response for debugging (optional, non-PHI) |
| `created_at`            | `timestamp without time zone` | `DEFAULT now()`                           | Timestamp of the LLM call attempt                              |

**Table: `prompt_templates`**

| Column             | Type                        | Constraints                   | Description                                                     |
| ------------------ | --------------------------- | ----------------------------- | --------------------------------------------------------------- |
| `id`               | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Unique identifier for the prompt template                       |
| `name`             | `text`                      | `NOT NULL`                    | Descriptive name (e.g., "Default Validation v2", "Rare Disease Feedback") |
| `type`             | `text`                      | `NOT NULL`                    | Category ('default', 'rare_disease', 'low_confidence', etc.)    |
| `version`          | `text`                      | `NOT NULL`                    | Version identifier (e.g., "1.0", "2025-Q2", "beta")             |
| `content_template` | `text`                      | `NOT NULL`                    | The actual prompt text, using placeholders like {{PLACEHOLDER}} |
| `word_limit`       | `integer`                   |                               | Optional target word count for the LLM's feedback section       |
| `active`           | `boolean`                   | `NOT NULL`, `DEFAULT true`    | Whether this template is currently active/usable              |
| `created_at`       | `timestamp without time zone` | `DEFAULT now()`               | Timestamp created                                               |
| `updated_at`       | `timestamp without time zone` | `DEFAULT now()`               | Timestamp updated                                               |

**Table: `prompt_assignments`**

| Column         | Type                        | Constraints                                | Description                                                     |
| -------------- | --------------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| `id`           | `integer`                   | `PRIMARY KEY`, Auto-incrementing           | Unique identifier for the assignment                            |
| `physician_id` | `integer`                   | `NOT NULL`, `FK REFERENCES users(id)`      | The user (physician) this assignment applies to                 |
| `prompt_id`    | `integer`                   | `NOT NULL`, `FK REFERENCES prompt_templates(id)` | The specific prompt template assigned                           |
| `ab_group`     | `text`                      |                                            | Identifier for the A/B test group (e.g., 'A', 'B', 'Control') |
| `assigned_on`  | `timestamp without time zone` | `DEFAULT now()`                            | Timestamp when the assignment was made or became active         |
| `is_active`    | `boolean`                   | `NOT NULL`, `DEFAULT true`                 | Whether this specific assignment is currently active            |

**Table: `medical_cpt_codes`**

| Column                     | Type                        | Constraints     | Description                                          |
| -------------------------- | --------------------------- | --------------- | ---------------------------------------------------- |
| `cpt_code`                 | `text`                      | `PRIMARY KEY`   | CPT code identifier                                  |
| `description`              | `text`                      |                 | Human-readable description of the procedure          |
| `allergy_considerations`   | `text`                      |                 |                                                      |
| `alternatives`             | `text`                      |                 |                                                      |
| `body_part`                | `text`                      |                 | Body part targeted by this procedure                 |
| `category`                 | `text`                      |                 |                                                      |
| `complexity`               | `text`                      |                 |                                                      |
| `contraindications`        | `text`                      |                 |                                                      |
| `contrast_use`             | `text`                      |                 | Whether contrast is typically used                   |
| `equipment_needed`         | `text`                      |                 |                                                      |
| `imaging_protocol`         | `text`                      |                 |                                                      |
| `laterality`               | `text`                      |                 | Whether the procedure is performed on a specific side |
| `mobility_considerations`  | `text`                      |                 |                                                      |
| `modality`                 | `text`                      |                 | Imaging modality (MRI, CT, X-Ray, etc.)              |
| `notes`                    | `text`                      |                 |                                                      |
| `patient_preparation`      | `text`                      |                 | Instructions for patient preparation                 |
| `pediatrics`               | `text`                      |                 |                                                      |
| `post_procedure_care`      | `text`                      |                 |                                                      |
| `procedure_duration`       | `text`                      |                 |                                                      |
| `radiotracer`              | `text`                      |                 |                                                      |
| `regulatory_notes`         | `text`                      |                 |                                                      |
| `relative_radiation_level` | `text`                      |                 |                                                      |
| `sedation`                 | `text`                      |                 |                                                      |
| `special_populations`      | `text`                      |                 |                                                      |
| `typical_dose`             | `text`                      |                 |                                                      |
| `typical_findings`         | `text`                      |                 |                                                      |
| `imported_at`              | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when this code was imported                |
| `updated_at`               | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when this code was last updated            |

**Table: `medical_icd10_codes`**

| Column                       | Type                        | Constraints     | Description                                        |
| ---------------------------- | --------------------------- | --------------- | -------------------------------------------------- |
| `icd10_code`                 | `text`                      | `PRIMARY KEY`   | ICD-10 code identifier                             |
| `description`                | `text`                      |                 | Human-readable description of the diagnosis        |
| `associated_symptom_clusters`| `text`                      |                 |                                                    |
| `block`                      | `text`                      |                 |                                                    |
| `block_description`          | `text`                      |                 |                                                    |
| `category`                   | `text`                      |                 |                                                    |
| `chapter`                    | `text`                      |                 |                                                    |
| `clinical_notes`             | `text`                      |                 | Clinical information about this diagnosis          |
| `contraindications`          | `text`                      |                 |                                                    |
| `follow_up_recommendations`  | `text`                      |                 |                                                    |
| `imaging_modalities`         | `text`                      |                 | Recommended imaging modalities for this diagnosis  |
| `inappropriate_imaging_risk` | `integer`                   |                 |                                                    |
| `is_billable`                | `boolean`                   |                 |                                                    |
| `keywords`                   | `text`                      |                 |                                                    |
| `parent_code`                | `text`                      |                 |                                                    |
| `primary_imaging`            | `text`                      |                 |                                                    |
| `priority`                   | `text`                      |                 | Clinical priority level for this diagnosis         |
| `secondary_imaging`          | `text`                      |                 |                                                    |
| `typical_misdiagnosis_codes` | `text`                      |                 |                                                    |
| `imported_at`                | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when this code was imported              |
| `updated_at`                 | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP` | Timestamp when this code was last updated          |

**Table: `medical_cpt_icd10_mappings`**

| Column                | Type                        | Constraints                                         | Description                                      |
| --------------------- | --------------------------- | --------------------------------------------------- | ------------------------------------------------ |
| `id`                  | `integer`                   | `PRIMARY KEY`, Auto-incrementing                    | Primary key for the mapping                      |
| `icd10_code`          | `text`                      | `FK REFERENCES medical_icd10_codes(icd10_code)`     | Reference to ICD-10 code                         |
| `cpt_code`            | `text`                      | `FK REFERENCES medical_cpt_codes(cpt_code)`         | Reference to CPT code                            |
| `appropriateness`     | `integer`                   |                                                     | Appropriateness score (e.g., 1-9 from ACR)       |
| `evidence_level`      | `text`                      |                                                     | Level of evidence supporting this pairing        |
| `evidence_source`     | `text`                      |                                                     | Source of evidence for this pairing (e.g., ACR) |
| `evidence_id`         | `text`                      |                                                     | Specific ID within the evidence source           |
| `enhanced_notes`      | `text`                      |                                                     | Additional notes/context for the mapping         |
| `refined_justification` | `text`                      |                                                     | Specific justification for the appropriateness score |
| `guideline_version`   | `text`                      |                                                     | Version of the guideline used                    |
| `last_updated`        | `date`                      |                                                     | Date guideline was last checked/updated          |
| `imported_at`         | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`                         | Timestamp when this mapping was imported         |
| `updated_at`          | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`                         | Timestamp when this mapping was last updated     |

**Table: `medical_icd10_markdown_docs`**

| Column        | Type                        | Constraints                                         | Description                                                      |
| ------------- | --------------------------- | --------------------------------------------------- | ---------------------------------------------------------------- |
| `id`          | `integer`                   | `PRIMARY KEY`, Auto-incrementing                    | Primary key for the markdown document                            |
| `icd10_code`  | `text`                      | `NOT NULL`, `UNIQUE`, `FK REFERENCES medical_icd10_codes(icd10_code)` | Reference to the ICD-10 code                     |
| `content`     | `text`                      |                                                     | Markdown content with detailed information about the diagnosis |
| `file_path`   | `text`                      |                                                     | Path to source markdown file if applicable                       |
| `import_date` | `timestamp without time zone` |                                                     | Date when this document was imported                             |
