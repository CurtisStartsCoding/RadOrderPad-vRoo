# Validation Feedback Logic

**Version:** 1.1 (Schema Reconciled)
**Date:** 2025-04-11

This document outlines how clinical validation feedback is generated, structured, scored, and displayed to the referring physician.

---

## 1. Feedback Goals

-   **Actionable:** Clearly indicate whether the order is appropriate or if more information/changes are needed.
-   **Educational:** Provide concise reasoning based on guidelines (like ACR AUC) or clinical context ("Teachable Moment").
-   **Consistent:** Maintain a professional and helpful tone.
-   **Contextual:** Adapt feedback length and detail based on the situation (e.g., standard vs. rare disease).

## 2. Feedback Components (Output from LLM/Validation Engine via `/api/orders/validate`)

The validation engine is expected to return these key feedback components within its JSON response (`validationResult` object):

-   **`validationStatus`:** Categorical outcome.
    -   `'appropriate'`: Order aligns with guidelines based on provided info.
    -   `'needs_clarification'`: More clinical detail is required to determine appropriateness.
    -   `'inappropriate'`: The requested study is generally not indicated for the scenario; alternatives may be suggested.
-   **`complianceScore`:** Numerical score reflecting appropriateness (e.g., 1-9 based on ACR scale, or 0-100).
-   **`feedback`:** Textual explanation and educational content.
    -   *Standard Length:* ~40 words (configurable per prompt template).
    -   *Rare Disease Length:* ~95-100 words (triggered by `rare_disease_trigger.md` logic).
    -   *Override Validation Feedback:* May include commentary on the provided justification.
-   **`suggestedICD10Codes`:** Array of `{code, description}` objects.
-   **`suggestedCPTCodes`:** Array of `{code, description}` objects.

## 3. UI Presentation (`DictationForm` & `ValidationView`)

-   **During Dictation Loop (`DictationForm`):**
    *   If `validationStatus` is *not* 'appropriate' (e.g., 'needs_clarification', 'inappropriate'), the `ValidationFeedbackBanner` is displayed.
    *   **Visual State:** Banner color/icon reflects severity (Yellow/Red).
    *   **Content:** Shows score, feedback text, suggested codes.
    *   **Actions:** "Add Clarification" button shown if `attemptCount < 3`. "Override Validation" button shown if `attemptCount >= 3`.
-   **After Final Validation/Override (`ValidationView`):**
    *   Displays the *final* `validationResult` state.
    *   Shows overall status (Compliant/Override Applied).
    *   Shows the final `complianceScore`.
    *   Shows the final `feedback` text (which might be feedback on the override justification).
    *   Shows the final `suggestedICD10Codes` and `suggestedCPTCodes`.
    *   Shows the `overrideJustification` text if applicable.

## 4. Handling Clarifications

1.  **Trigger:** User clicks "Add Clarification" in the `ValidationFeedbackBanner` (attempts 1 or 2).
2.  **UI Change:** Separator added to `DictationForm` text area.
3.  **Input:** Physician dictates/types additional details.
4.  **Re-Submit:** Physician clicks "Process Order".
5.  **Backend Process:** Frontend calls `POST /api/orders/validate` with the *combined* text and the `orderId`. Validation Engine processes.
6.  **Feedback Update:** `DictationForm` updates with the new validation result and feedback banner if still not 'appropriate'.

## 5. Storing Feedback History

-   Each validation pass (initial submission, clarifications, final override validation) triggered by `POST /api/orders/validate` is logged as a distinct record in the `validation_attempts` table (PHI DB).
-   This table stores:
    *   `order_id`: Links attempt to the draft/final order.
    *   `attempt_number`: Sequence (1, 2, 3, 4+).
    *   `validation_input_text`: **Full cumulative text** sent for this attempt (including clarifications/justification).
    *   `validation_outcome`: Status returned by LLM for this attempt.
    *   `generated_feedback_text`: Feedback returned by LLM for this attempt.
    *   `generated_compliance_score`: Score returned by LLM for this attempt.
    *   `generated_icd10_codes`, `generated_cpt_codes`: Codes suggested for this attempt.
    *   `is_rare_disease_feedback`: Flag if rare disease logic triggered.
-   The *final* outcome state (codes, score, status, notes, override info) held in the frontend after the last validation call is persisted to the main `orders` record during the final submission (`PUT /api/orders/{orderId}`).

---

## Data References

-   `orders` (PHI DB)
-   `validation_attempts` (PHI DB)
-   `prompt_templates` (Main DB)
-   `rare_disease_trigger.md` (Logic Definition)
-   UI Components: `DictationForm`, `ValidationView`, `ValidationFeedbackBanner`
