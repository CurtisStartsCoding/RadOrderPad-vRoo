# UI Step Flow Logic

**Version:** 1.4 (Updated Order Creation Endpoint)
**Date:** 2025-06-09

This document outlines the high-level screen sequences and UI state transitions for the primary user workflows in RadOrderPad. It complements the detailed workflow documents (`physician_order_flow.md`, etc.).

---

## 1. Physician Order Creation Flow

-   **Initial State:** Physician Dashboard / New Order Screen (`PhysicianInterface`)
    -   `PatientInfoCard` shows placeholder "Unknown Patient". Button shows "Add Patient".
    -   `DictationForm` is ready. "Process Order" button disabled.
    -   `OrderProgressIndicator` shows Step 1 (Dictation).
    -   `orderId` state is `null`.
-   **Action:** Click "Add Patient" -> `PatientIdentificationDictation` dialog -> Identify patient.
-   **State Update:** `PatientInfoCard` updates with Name/DOB. `activePatient` state updated (still temporary ID=0).
-   **Action:** Dictate clinical reason -> Click "Process Order" (Attempt 1).
    -   UI shows loading state (`isProcessingValidation = true`). `attemptCount` = 1.
    -   Frontend calls `POST /api/orders/validate` with only `dictationText`.
    -   Backend performs stateless validation (no database records created except LLM logs).
    -   Frontend updates `validationResult` state.
    -   **On Success (`appropriate`):** Move to Step 2 (`ValidationView`).
    -   **On Failure (`needs_clarification` / `inappropriate`, Attempts < 3):** Show feedback banner in `DictationForm`. Remain Step 1.
-   **Action:** Click "Add Clarification" -> Dictate -> Click "Process Order" (Attempt 2/3).
    -   UI shows loading state. `attemptCount` increments.
    -   Frontend calls `POST /api/orders/validate` with cumulative text (still stateless, no `orderId`).
    -   Backend performs stateless validation, returns result.
    -   Frontend updates `validationResult`.
    -   Flow repeats: either success -> **Step 2 (ValidationView)**, or failure -> show feedback + "Add Clarification" / "Override Validation".
-   **Action:** Click "Override Validation" (After Attempt 3 failure).
    -   `OverrideDialog` opens.
-   **Action:** Enter justification -> Click "Confirm Override".
    -   `OverrideDialog` closes. UI shows loading state. `attemptCount` increments (e.g., to 4).
    -   Frontend calls `POST /api/orders/validate` with cumulative text + justification and `isOverrideValidation=true` flag (still stateless).
    -   Backend runs final validation considering justification, returns final result.
    -   Frontend updates `validationResult` with this final outcome, ensures `overridden = true` and `overrideJustification` are set.
    -   `OrderProgressIndicator` moves to Step 2.
    -   UI transitions to show `ValidationView`.
-   **Step 2: Validation View** (`ValidationView` component)
    -   Displays summary based on the *final* `validationResult` state (which includes override info if applicable).
    -   Action buttons: "Edit Dictation" (goes back to Step 1), "Sign Order".
-   **Action:** Click "Sign Order".
    -   `OrderProgressIndicator` moves to Step 3.
    -   UI transitions to show `SignatureForm`.
-   **Step 3: Signature Step** (`SignatureForm` component)
    -   Displays final confirmation/attestation.
    -   Physician signs -> Types name -> Clicks "Submit Order".
    -   UI shows loading state (`isSubmitting = true`).
    -   `handleSubmitOrder` function runs: calls API (**`POST /api/orders`**), sending the final payload including patient info, validation result, signature data, and override information if applicable.
    -   **This is where the order is actually created in the database.**
    -   **On Success:** `handleOrderSubmitted` callback triggered. Success `toast`. State resets. Redirect.
    -   **On Failure:** Error `toast`. UI remains on Signature step.

## 2. Admin Staff Finalization Flow

-   **Initial State:** Admin Dashboard / Order Queue
    -   `DataTable` shows orders with status `pending_admin`.
-   **Action:** Click on an order row.
    -   Navigate to Order Detail Screen.
    -   Displays existing order info (Patient, Dictation, Validation).
    -   Shows `PasteInputBox` for EMR Summary. Insurance/Contact fields may be empty or partially filled.
-   **Action:** Paste EMR Summary -> Click "Process Paste".
    -   UI shows loading state.
    -   Backend parses data.
    -   UI updates: Insurance fields, Contact fields, potentially Labs/History section populated. `patient_clinical_records` updated.
    -   Admin verifies/edits parsed data.
-   **Conditional Step:** If order requires supplemental docs (e.g., PET):
    -   Second `PasteInputBox` (or `FileInput`) appears.
    -   Admin pastes/uploads supplemental info -> Click "Add".
    -   `patient_clinical_records` or `document_uploads` updated.
-   **Action:** Click "Send to Radiology Group".
    -   UI shows loading state.
    -   Backend updates order status to `pending_radiology`.
    -   **On Success:** Success message displayed. Redirect to Queue.
    -   **On Failure:** Error message displayed.

## 3. Radiology Group Workflow

-   **Initial State:** Radiology Dashboard / Incoming Queue
    -   `DataTable` shows orders with status `pending_radiology`. Orders flagged for 'Override' (`orders.overridden = true`) are highlighted. Filters available.
-   **Action:** Click on an order row.
    -   Navigate to Read-Only Order Detail Screen (`OrderDetailView`).
    -   Displays all consolidated order information, including `override_justification` if present.
    -   Export buttons (PDF, CSV, JSON, etc.) are visible.
    -   Status update dropdown/buttons might be present (e.g., "Mark as Scheduled").
-   **Action:** Click Export button (e.g., "Export PDF").
    -   Backend generates the file.
    -   File download is initiated by the browser.
-   **Action:** Select new status (e.g., "Scheduled") -> Click "Update Status".
    -   UI shows loading state.
    -   Backend updates `orders.status` and `order_history`.
    -   **On Success:** Status in the queue view updates. Confirmation message.
    -   **On Failure:** Error message.

## 4. Organization Linking Flow (Admin)

-   **Initial State:** Admin Dashboard -> Connections Panel.
    -   Lists existing connections and pending incoming requests. "Find Partner" button visible.
-   **Action:** Click "Find Partner".
    -   Navigate to Search Organizations Screen.
    -   Enter search criteria -> Click "Search".
    -   Display search results.
-   **Action:** Click "Request Connection" next to a search result.
    -   Confirmation message shown. Request sent in backend.
-   **Handling Incoming Request:**
    -   Admin sees pending request in Connections Panel.
    -   Action buttons: "Approve", "Reject".
    -   Click "Approve" -> Status updates to 'Active'.
    -   Click "Reject" -> Status updates to 'Rejected'.