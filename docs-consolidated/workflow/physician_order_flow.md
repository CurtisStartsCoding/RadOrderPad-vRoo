# Physician Order Workflow

**Version:** 1.4 (Credit Consumption Refactoring)
**Date:** 2025-04-14

This document describes the end-to-end workflow for a physician using RadOrderPad to submit a radiology order via the PWA interface (optimized for mobile/tablet), reflecting the implemented override flow and draft order pattern.

---

## Prerequisites

-   Physician user account exists and is active (`users` table).
-   Physician belongs to a registered Referring Physician Group (`organizations` table).
-   Physician is logged into the platform.

## Steps

### 1. Session Initialization & Patient Tagging

1.  **Login:** Physician logs in using email and password.
2.  **Dashboard View:** Physician sees the main order entry screen/dashboard (`PhysicianInterface`).
3.  **Initial Patient State:** `PatientInfoCard` displays placeholder info ("Unknown Patient") with a temporary ID. "Add Patient" button is visible.
4.  **Add Patient Info:** Physician clicks "Add Patient" on the `PatientInfoCard`.
5.  **Dictate Patient Details:** `PatientIdentificationDictation` dialog opens. Physician uses the interface to speak or type the patient's full name and date of birth. Clicks "Identify Patient".
6.  **Confirm Details:** System parses input. May show a `SuggestionsDialog` for confirmation. Physician selects the correct interpretation or confirms manual entry.
7.  **UI Update:** `PatientIdentificationDictation` dialog closes. `PatientInfoCard` updates to show the confirmed Patient Name and DOB. The patient ID remains temporary (e.g., 0) until final submission if it's a new patient entry via this flow. Button changes to "Edit Patient".

### 2. Clinical Dictation

1.  **Focus on Dictation Area:** Physician interacts with the main `DictationForm` text area.
2.  **Dictate Clinical Reason:** Physician dictates (or types) the clinical scenario, reason for the study, relevant history, and symptoms. Voice input is activated via the `Mic` button.
3.  **Text Display:** Dictated/typed text appears in the input area.
4.  **Submit for Validation:** Physician clicks "Process Order". Button is enabled only if dictation length > 20 characters.

### 3. Stateless Validation Loop (Attempts 1-N)

1.  **Backend Request (Attempt 1):** Frontend sends the dictation text and physician/org context to the backend validation endpoint (e.g., **`/api/orders/validate`**). No `orderId`, `patientInfo`, or `radiologyOrganizationId` is sent initially. `attemptCount` increments to 1.
2.  **Stateless Validation (Backend):** The `/validate` endpoint handler processes the request without creating any database records in the `orders` or `validation_attempts` tables.
3.  **Validation Engine Trigger:** The request is processed by the Validation Engine (`validation_engine_overview.md`). LLM orchestration occurs (`llm_orchestration.md`).
4.  **Logging (Attempt 1):** Only `llm_validation_logs` are updated in Main DB. No PHI records are created at this stage. No credit is consumed.
5.  **Feedback Delivery (Attempt 1):** Backend returns the validation result (`validationStatus`, `complianceScore`, `feedback`, codes) to the frontend. No `orderId` is returned. Frontend stores the `validationResult` state.
6.  **UI Display & Decision Point (All Attempts):**
    *   **If `validationStatus` is 'valid' (and not an override validation):**
        a.  `validationFeedback` is cleared.
        b.  `OrderProgressIndicator` moves to Step 2.
        c.  UI transitions to show `ValidationView`. Proceed to Step 5 (Validation Review).
    *   **If `validationStatus` is 'invalid' or 'warning' (and attempts < 3):**
        a.  `validationFeedback` state is set with the returned feedback message.
        b.  `DictationForm` displays the `ValidationFeedbackBanner` (Yellow/Red).
        c.  Physician sees feedback and "Add Clarification" button.
        d.  Physician clicks "Add Clarification". A separator is added to the text area.
        e.  Physician dictates/types additional information.
        f.  Physician clicks "Process Order" again. Frontend sends the *combined* original + appended text to `/api/orders/validate`. No `orderId` is sent. `attemptCount` increments.
        g.  **Backend Request (Attempts 2, 3):** Backend processes the request in a stateless manner. Proceeds to Validation Engine (Step 3.3). Only logs to `llm_validation_logs` (Step 3.4). Returns result (Step 3.5). Loop continues at Step 3.6.
    *   **If `validationStatus` is 'invalid' or 'warning' (and attempts = 3):**
        a.  `ValidationFeedbackBanner` is displayed.
        b.  Primary action becomes "Override Validation".
        c.  Proceed to Step 4 (Override).

### 4. Override Flow (After 3 Failed Attempts)

1.  **Override Option:** The `ValidationFeedbackBanner` prominently displays an "Override Validation" button.
2.  **Initiate Override:** Physician clicks "Override Validation".
3.  **Justification:** `OverrideDialog` appears, requiring the physician to dictate or type a clinical justification (minimum 20 characters).
4.  **Confirm Override & Final Validation:** Physician submits the justification by clicking "Confirm Override" in the dialog.
    a.  Frontend constructs the final input: (Cumulative Dictation Text + Override Justification Text).
    b.  Frontend calls **`/api/orders/validate`** one last time, sending the combined text and a flag `isOverrideValidation=true`. No `orderId` is sent. `attemptCount` increments (e.g., to 4).
    c.  **Backend:** Receives request. Recognizes it's an override validation. Runs Validation Engine, potentially using adjusted prompts considering the justification. Only logs to `llm_validation_logs`. No credit is consumed.
    d.  **Feedback:** Backend returns the *final* validation result (which might now be 'appropriate' or still 'inappropriate', with feedback considering the justification).
5.  **Local State Update:** Frontend receives the final validation result. It updates the `validationResult` state with this new outcome, but also ensures `overridden = true` and `overrideJustification` (from the dialog) are stored in the state.
6.  **UI Transition:** `OverrideDialog` closes. `OrderProgressIndicator` moves to Step 2. UI transitions to show `ValidationView`. Proceed to Step 5 (Validation Review).

### 5. Validation Review

1.  **Display Summary:** Frontend shows the `ValidationView` component, displaying the results from the *last* validation call (including any feedback on the justification).
2.  **Review:** Physician reviews the summary, which includes:
    *   Clinical Information (original dictation + clarifications).
    *   Final Validation Feedback (considering justification if override occurred).
    *   Override Justification (if applicable).
    *   Final Extracted Codes (ICD/CPT).
    *   AUC Compliance status (displays "Override Applied" if overridden, otherwise reflects final validation status).
3.  **Decision:** Physician can either go "Back to Dictation" (returns to Step 2) or proceed to sign.
4.  **Proceed:** Physician clicks "Sign Order".

### 6. Signature & Submission

1.  **Display Signature Pad:** `OrderProgressIndicator` moves to Step 3. Frontend shows the `SignatureForm` component.
2.  **Sign:** Physician draws their signature in the canvas.
3.  **Confirm:** Physician types their full name for confirmation/attestation.
4.  **Submit Final Order:** Physician clicks "Submit Order" (or variant text).
5.  **Backend Persistence:**
     *   Frontend sends the complete order payload (including patient info, dictation, final validated state, override info, signature details) to the backend endpoint responsible for creating and finalizing the order (e.g., `POST /api/orders`).
     *   **This is the first time an actual order record is created in the database.**
     *   Backend creates a new order record in the `orders` table.
     *   **The backend creates a new patient record in the `patients` table using the provided details and sets the `orders.patient_id` foreign key accordingly.**
     *   Backend populates the `orders` record with all the details received in the payload (final validation fields, `overridden`, `override_justification`, `signed_by_user_id`, `signature_date`, final `status = 'pending_admin'`).
     *   Backend saves the signature image via `file_upload_service.md` (`document_uploads` record).
     *   Backend logs events ('created', 'override' if applicable, 'signed') in `order_history`.
     *   Backend creates a record in `validation_attempts` to store the final validation result.
6.  **Confirmation:** UI shows a success `toast` message. `PhysicianInterface` state resets for a new order. User is effectively returned to the starting state.

---

## Data References

-   `users` (Main DB)
-   `organizations` (Main DB)
-   `patients` (PHI DB) - **Created only during order finalization**
-   `orders` (PHI DB) - **Created only during order finalization**
-   `validation_attempts` (PHI DB) - **Created only during order finalization**
-   `llm_validation_logs` (Main DB) - **Created during stateless validation**
-   `order_history` (PHI DB) - **Created only during order finalization**
-   `document_uploads` (PHI DB) - **Created only during order finalization** (For signature image)