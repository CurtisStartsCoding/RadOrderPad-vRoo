# Prompt Registry

**Version:** 1.0
**Date:** 2025-04-11

This document defines the system for managing, versioning, and assigning LLM prompts used by the Validation Engine, enabling A/B testing and customization.

---

## 1. Purpose

-   **Modularity:** Separate prompt text from application code for easier updates and maintenance.
-   **Versioning:** Track changes to prompts over time.
-   **Customization:** Allow different prompts for specific scenarios (e.g., rare diseases, low confidence input).
-   **A/B Testing:** Assign different prompt versions to user groups to compare performance (accuracy, feedback quality, cost).

## 2. Database Tables (`radorder_main`)

### Table: `prompt_templates`

Stores the master copies of different prompt versions.

| Column             | Type      | Constraints                   | Description                                                     |
| ------------------ | --------- | ----------------------------- | --------------------------------------------------------------- |
| `id`               | `integer` | `PRIMARY KEY`, Auto-incrementing | Unique identifier for the prompt template                       |
| `name`             | `text`    | `NOT NULL`                    | Descriptive name (e.g., "Default Validation v2", "Rare Disease Feedback") |
| `type`             | `text`    | `NOT NULL`                    | Category ('default', 'rare_disease', 'low_confidence', etc.)    |
| `version`          | `text`    | `NOT NULL`                    | Version identifier (e.g., "1.0", "2025-Q2", "beta")             |
| `content_template` | `text`    | `NOT NULL`                    | The actual prompt text, using placeholders for dynamic data |
| `word_limit`       | `integer` |                               | Optional target word count for the LLM's feedback section       |
| `active`           | `boolean` | `NOT NULL`, `DEFAULT true`    | Whether this template is currently active/usable              |
| `created_at`       | `timestamp` | `DEFAULT now()`               | Timestamp created                                               |
| `updated_at`       | `timestamp` | `DEFAULT now()`               | Timestamp updated                                               |

**Example `content_template` Placeholder:**

```markdown
You are RadValidator...

POSTGRESQL DATABASE CONTEXT:
{{DATABASE_CONTEXT}}

USER DICTATION:
{{DICTATION_TEXT}}

Please analyze... Respond in JSON format...
- feedback: Brief educational note (target length: {{WORD_LIMIT}} words)
```

### Table: `prompt_assignments`

Assigns specific prompt templates to users (typically physicians) for A/B testing or targeted deployment.

| Column         | Type      | Constraints                                | Description                                                     |
| -------------- | --------- | ------------------------------------------ | --------------------------------------------------------------- |
| `id`           | `integer` | `PRIMARY KEY`, Auto-incrementing           | Unique identifier for the assignment                            |
| `physician_id` | `integer` | `NOT NULL`, `FK REFERENCES users(id)`      | The user (physician) this assignment applies to                 |
| `prompt_id`    | `integer` | `NOT NULL`, `FK REFERENCES prompt_templates(id)` | The specific prompt template assigned                           |
| `ab_group`     | `text`    |                                            | Identifier for the A/B test group (e.g., 'A', 'B', 'Control') |
| `assigned_on`  | `timestamp` | `DEFAULT now()`                            | Timestamp when the assignment was made or became active         |
| `is_active`    | `boolean` | `DEFAULT true`                             | Whether this specific assignment is currently active            |

*(Note: Assignment could potentially be at the organization level as well, requiring schema adjustment)*

## 3. Workflow Integration

1.  **Identify User:** When a validation request is initiated, identify the `user_id` of the physician submitting the order.
2.  **Lookup Assignment:** Query the `prompt_assignments` table for an active assignment for that `physician_id`.
3.  **Select Template:**
    *   If an active assignment exists, retrieve the `prompt_template` specified by `prompt_assignments.prompt_id`.
    *   If no active assignment exists, retrieve the currently active `prompt_template` where `type = 'default'`. Use a fallback mechanism (e.g., latest version) if multiple defaults are active.
4.  **Retrieve Content:** Get the `content_template` and `word_limit` from the selected `prompt_template`.
5.  **Build Prompt:** The `ValidationEngine` uses the retrieved `content_template`, replacing placeholders like `{{DATABASE_CONTEXT}}`, `{{DICTATION_TEXT}}`, `{{WORD_LIMIT}}` with the actual data for the current validation request.
6.  **Log Usage:** The `llm_validation_logs` entry should record the `prompt_template_id` that was used for the call.

## 4. Management

-   **Super Admin Role:** Super Admins should have the interface to create, edit, version, and activate/deactivate `prompt_templates`.
-   **A/B Testing Setup:** Super Admins or designated roles can create `prompt_assignments` to allocate users to different `ab_group`s using specific `prompt_id`s.
-   **Analysis:** Data from `llm_validation_logs` and `validation_attempts` can be analyzed, grouped by `prompt_template_id` or `ab_group`, to evaluate the effectiveness of different prompts (e.g., accuracy of code suggestions, quality of feedback, token cost).