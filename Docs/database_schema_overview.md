# Database Schema Overview

**Version:** 1.1 - Reconciled
**Date:** 2025-04-11

This document provides a high-level overview of the two-database architecture used by RadOrderPad, designed for HIPAA compliance and logical data separation.

**Definitive Schemas:** Refer to `SCHEMA_Main_COMPLETE.md` and `SCHEMA_PHI_COMPLETE.md` for complete table definitions, columns, types, keys, and constraints reflecting the fully reconciled structure including multi-location support and all feature tables.

---

## 1. Architecture Principle

RadOrderPad employs **two physically separate PostgreSQL databases** to strictly segregate Protected Health Information (PHI) from operational and metadata.

1.  **`radorder_main` (Non-PHI Database):** Stores system configuration, user accounts, organization details (including locations), relationships, billing information, prompts, medical code references (ICD/CPT/Mappings/Markdown), LLM interaction logs (metadata only), credit usage, and other non-sensitive operational data.
2.  **`radorder_phi` (PHI Database):** Stores all data classified as PHI, including patient demographics, insurance details, clinical order content (dictations, indications, final codes/scores), validation attempt history, uploaded clinical documents, and pasted EMR context.

**Rationale:** This separation is a fundamental technical safeguard for HIPAA compliance, minimizing the attack surface for PHI and simplifying access control and auditing. Application logic is responsible for joining data across these databases when necessary, typically using non-sensitive IDs (`user_id`, `organization_id`, `order_id`, `location_id`).

---

## 2. `radorder_main` - Key Areas & Tables

*(Referencing definitive `SCHEMA_Main_COMPLETE.md`)*

-   **Organizations & Locations:** `organizations`, `locations`, `user_locations` (optional join) (Manages referring/radiology groups, their physical sites, and user assignments).
-   **Users:** `users`, `user_invitations` (Manages staff accounts within organizations).
-   **Relationships:** `organization_relationships` (Tracks links between referring and radiology groups).
-   **Authentication & Session:** `sessions`, `refresh_tokens`, `password_reset_tokens`, `email_verification_tokens` (Handles user login and security tokens).
-   **Billing & Credits:** `billing_events`, `credit_usage_logs`, `purgatory_events` (Tracks payments via Stripe, credit usage, and account suspensions).
-   **Medical Code Master Data:** `medical_icd10_codes`, `medical_cpt_codes`, `medical_cpt_icd10_mappings`, `medical_icd10_markdown_docs` (Reference data powering the validation engine).
-   **LLM & Validation Metadata:** `llm_validation_logs`, `prompt_templates`, `prompt_assignments` (Tracks LLM interactions and manages prompt configurations, *without storing PHI*).

---

## 3. `radorder_phi` - Key Areas & Tables

*(Referencing definitive `SCHEMA_PHI_COMPLETE.md`)*

-   **Patients:** `patients`, `patient_insurance` (Stores patient demographics and insurance details, linked via internal `pidn` and `patient.id`).
-   **Orders:** `orders` (The central table holding all clinical order details, including dictation text, status, assigned codes after validation, location context).
-   **Validation History:** `validation_attempts` (Logs the input, output, score, and feedback for *each pass* of the validation engine for a specific order).
-   **Clinical Context:** `patient_clinical_records` (Stores pasted EMR summaries, labs, supplemental docs).
-   **Supporting Order Data:** `order_history` (Immutable audit log of order status changes), `order_notes` (User-added notes), `document_uploads` (Links to uploaded files in S3), `information_requests` (Tracks requests for missing info).

---

## 4. Relationships Across Databases

-   **Logical Foreign Keys:** Relationships between tables in `radorder_main` and `radorder_phi` are logical, not enforced by database constraints. Application layer ensures integrity.
-   **Key Linking IDs:** `user_id`, `organization_id`, `order_id`, `location_id`.
-   **Example:** `radorder_phi.orders.created_by_user_id` references `radorder_main.users.id`.
-   **Example:** `radorder_phi.validation_attempts.llm_validation_log_id` (Nullable) references `radorder_main.llm_validation_logs.id`.

---

## 5. Schema Files

-   **`SCHEMA_Main_COMPLETE.md`:** Contains the full, reconciled DDL or detailed description for the `radorder_main` database.
-   **`SCHEMA_PHI_COMPLETE.md`:** Contains the full, reconciled DDL or detailed description for the `radorder_phi` database (including the fix for the nullable `llm_validation_log_id` in `validation_attempts`).
-   **`erd_plantuml.md`:** Provides a visual Entity-Relationship Diagram generated from these final, reconciled schemas.