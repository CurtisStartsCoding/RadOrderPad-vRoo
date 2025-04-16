# Validation Engine Overview

**Version:** 1.2 (Final Override/Draft Logic)
**Date:** 2025-04-11

This document provides a high-level overview of the RadOrderPad Validation Engine, which processes physician dictation to provide clinical decision support, code suggestions, and appropriateness scoring. It incorporates the core logic described in the Validation documentation and reflects the draft order and final override validation flow.

---

## 1. Purpose

The primary goal is to analyze the clinical context provided in a physician's dictation for a radiology order and determine:

1.  **Appropriateness:** Is the requested study (or an alternative) clinically appropriate based on the provided symptoms, history, and established guidelines (e.g., ACR Appropriateness Criteria)?
2.  **Coding:** What are the likely ICD-10 diagnosis codes and CPT procedure codes corresponding to the clinical scenario?
3.  **Feedback:** Provide concise, educational feedback to the physician, reinforcing correct ordering or guiding them towards more appropriate choices. This includes providing feedback *after* considering an override justification.
4.  **Scoring:** Assign a compliance/appropriateness score.

## 2. Core Components & Flow

*(Triggered by `POST /api/orders/validate` endpoint)*

1.  **Input:** Request payload containing:
    *   Physician's dictation text (cumulative, may include clarifications or override justification).
    *   `orderId` (optional, present on attempts after the first).
    *   `isOverrideValidation` flag (optional, boolean, indicates if this call follows override confirmation).
    *   Patient context (age, gender).
    *   Physician/Org context.
2.  **Draft Order Handling (Backend):**
    *   If `orderId` is missing: Create a new draft `orders` record (`status='pending_validation'`), obtain the new `orderId`.
    *   If `orderId` is present: Use the existing draft order context.
3.  **PHI Stripping:** Remove potential patient identifiers from the dictation text (`hipaa.ts`).
4.  **Keyword & Context Extraction:** Identify medical terms, imaging modalities, anatomy, laterality, and clinical conditions from the *current* input text (`dbUtils.ts`, `extractMedicalKeywords`, `extractClinicalContext`).
5.  **Database Context Generation:**
    *   **Cache Check (Redis):** Look up context based on keywords/hash (`redis-cache.ts`, `generateCachedDatabaseContext`).
    *   **Database Query (PostgreSQL - on cache miss):** Use extracted keywords to query `radorder_main` for relevant codes, mappings, markdown (`pgDbContextGenerator.ts`, `medical-codes-service.ts`).
    *   **Cache Population:** Store retrieved context in Redis.
6.  **Prompt Construction:**
    *   Select appropriate `prompt_template` (`prompt_registry.md`).
    *   **If `isOverrideValidation` is true:** Use a prompt template specifically designed to instruct the LLM to evaluate the clinical scenario *including the provided justification text* against guidelines.
    *   **Otherwise:** Use the standard validation prompt template.
    *   Build System Prompt (Role, Task, DB Context) and User Prompt (Sanitized Dictation/Justification Text, JSON format request).
7.  **LLM Orchestration:**
    *   Call the primary LLM (Claude 3.7) with the constructed prompts (`llm_orchestration.md`).
    *   Implement sequential fallbacks (Grok 3 -> GPT-4.0) if needed. Handle potential complete failure of all LLMs.
8.  **Response Processing:**
    *   Extract the structured JSON output from the LLM response.
    *   Parse fields: `diagnosisCodes`, `procedureCodes`, `validationStatus`, `complianceScore`, `feedback`.
9.  **Feedback Logic:**
    *   Adjust feedback length/content based on `rare_disease_trigger.md` logic.
    *   Format feedback according to `validation_feedback_logic.md`. Feedback now considers override justification if applicable.
10. **Logging:**
    *   Log LLM interaction metadata to `llm_validation_logs` (linked to `orderId`).
    *   Log the specific attempt details (input, output, score, attempt #) to `validation_attempts` (linked to `orderId`).
    *   Trigger credit usage logging via `BillingEngine` (linked to `orderId`).
11. **Output:** Return a structured response to the API handler, including:
    *   `success: true/false`
    *   `orderId` (the draft/existing order ID)
    *   `validationResult` (containing codes, status, score, feedback)
    *   Performance timings, cache stats (optional).

## 3. Key Technologies

-   Natural Language Processing (via LLMs: Claude, Grok, GPT)
-   PostgreSQL (for structured medical codes and mappings, draft orders)
-   Redis/RedisSearch (for caching and fast context retrieval)
-   Prompt Engineering (structured prompts incorporating database context, specific prompts for override validation)

## 4. Integration Points

-   Receives input from the Order Processing service (`/api/orders/validate` handler).
-   Reads/Writes `orders` table (PHI DB) for draft creation.
-   Queries `radorder_main` database tables (`medical_*`).
-   Interacts with Redis/RedisSearch (`Cache`).
-   Calls external LLM APIs (`Claude`, `Grok`, `GPT`).
-   Writes logs to `llm_validation_logs` (Main DB) and `validation_attempts` (PHI DB).
-   Triggers `BillingEngine` for credit deduction.
-   Uses prompts defined in `prompt_templates`.
