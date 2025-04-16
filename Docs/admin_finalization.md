# Admin Staff Finalization Workflow

**Version:** 1.1 (Credit Consumption Refactoring)
**Date:** 2025-04-14

This document describes the workflow for administrative staff (e.g., Medical Assistants) in the referring physician's office to finalize an order after it has been signed by the physician. This typically involves adding necessary demographic, insurance, and clinical context information required by the radiology group or payers.

---

This workflow involves *appending* necessary demographic, insurance, and clinical context to an order *after* it has been clinically validated and signed by the physician. The original dictation and validated/signed components remain immutable.


## Prerequisites

-   Admin Staff user account exists and is active (`users` table, role `admin_staff`).
-   User belongs to the correct Referring Physician Group (`organizations` table).
-   An order exists with `status = 'pending_admin'`, created and signed by a physician in the same organization.
-   Admin staff has access to the practice's EMR (e.g., Athena, eClinicalWorks).
-   Organization has sufficient credits for order submission (`organizations.credit_balance > 0`).

## Steps

### 1. Accessing the Queue

1.  **Login:** Admin staff logs into the RadOrderPad platform.
2.  **Dashboard/Queue View:** User navigates to the order queue, filtered to show orders with `status = 'pending_admin'` for their organization.
3.  **Select Order:** User selects the order they need to process.

### 2. Adding EMR Context

1.  **Open Order Detail:** The order detail view displays the information already captured (Patient Name, DOB, PIDN, Physician, Dictation, Validation Result, Codes). It also presents input areas for missing context.
2.  **Switch to EMR:** Admin staff navigates to the patient's chart in their EMR system (Athena, eCW, etc.).
3.  **Copy EMR Summary:** User copies relevant sections from the EMR's patient summary page. This typically includes:
    *   Patient Demographics (Address, Phone, Email - if not already captured)
    *   Insurance Information (Primary/Secondary Carrier, Policy #, Group #, Subscriber Info)
    *   Relevant Clinical History (Problem List, Allergies, Recent Labs, Prior Imaging Reports, Relevant Consult Notes).
4.  **Paste into RadOrderPad:** User returns to RadOrderPad and pastes the copied EMR content into the designated "Paste EMR Summary" `PasteInputBox` component.
5.  **Trigger Parsing:** User clicks "Process Paste" or similar button.
6.  **Backend Parsing:**
    *   Backend receives the pasted text.
    *   An NLP or structured parsing routine attempts to extract key fields:
        *   Patient Contact: Address, Phone, Email
        *   Insurance: Carrier, Policy, Group, Subscriber
        *   Clinical Data: Keywords, Labs (e.g., Creatinine), Diagnoses.
    *   The raw pasted text is stored in `patient_clinical_records` (PHI DB) with `record_type = 'emr_summary_paste'`.
    *   Extracted structured data updates corresponding fields in:
        *   `patients` table (address, phone, email).
        *   `patient_insurance` table (creates/updates insurance records).
        *   Potentially adds structured data to `patient_clinical_records.parsed_data` (JSONB).
7.  **UI Update & Verification:** The UI refreshes, displaying the parsed information in dedicated fields (e.g., Insurance Card section, Patient Contact section). Admin staff visually verifies the accuracy of the parsed data and makes manual corrections if needed directly in the UI fields.

### 3. Handling Supplemental Documentation (Conditional)

1.  **System Check:** Based on the validated `cpt_code` or `modality` associated with the order, the system checks if supplemental documentation is typically required by payers (e.g., for PET scans, certain complex MRIs, oncology follow-ups).
2.  **Prompt for Docs:** If required, the UI displays a prompt and a second `PasteInputBox` labeled "Paste Supplemental Labs/Reports".
3.  **Copy/Paste Supplemental:** Admin staff copies required documents (e.g., recent PSA lab results, pathology reports, prior relevant imaging reports) from the EMR or other sources.
4.  **Paste into RadOrderPad:** User pastes the content into the supplemental docs box.
5.  **Store Supplemental:** Backend saves this content in `patient_clinical_records` with `record_type = 'supplemental_docs_paste'` or potentially triggers `file_upload_service.md` if actual files (PDFs) are uploaded instead of pasted text.

### 4. Final Review & Submission

1.  **Review Complete Order:** Admin staff reviews the complete order package displayed on the screen, ensuring all necessary information (patient, insurance, clinical context, dictation, codes, supplemental docs if needed) is present and accurate.
2.  **Credit Check:** System verifies that the organization has sufficient credits (`organizations.credit_balance > 0`) to submit the order. If credits are insufficient, a warning is displayed and the "Send to Radiology" button is disabled.
3.  **Send to Radiology:** User clicks the "Send to Radiology Group" or "Submit Final Order" button.
4.  **Backend Update:**
    *   Backend verifies credit availability again.
    *   Backend updates the `orders` record status to `pending_radiology`.
    *   Backend consumes one credit from the organization's balance (`organizations.credit_balance -= 1`).
    *   An event ('finalized_by_admin', 'sent_to_radiology') is logged in `order_history`.
    *   Credit usage is logged in `credit_usage_logs` with `action_type = 'order_submitted'`.
5.  **Queue Update:** The order disappears from the `pending_admin` queue and now appears in the queue for the linked Radiology Group.
6.  **Confirmation:** UI shows a success message. Admin staff returns to their queue.

---

## Data References

-   `users` (Main DB)
-   `organizations` (Main DB)
-   `credit_usage_logs` (Main DB)
-   `orders` (PHI DB)
-   `patients` (PHI DB)
-   `patient_insurance` (PHI DB)
-   `patient_clinical_records` (PHI DB)
-   `order_history` (PHI DB)
-   `document_uploads` (PHI DB) (If file uploads are used for supplemental docs)