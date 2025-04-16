# Radiology Group Workflow

**Version:** 1.0
**Date:** 2025-04-11

This document describes the workflow for users within a Radiology Group (e.g., Schedulers, Pre-Authorization Staff, potentially Radiologists) interacting with orders received via RadOrderPad. The key principle is receiving complete, validated orders without direct RIS/scheduling system integration.

---

## Prerequisites

-   Radiology Group user account exists and is active (`users` table, role `scheduler`, `admin`, `radiologist`).
-   User belongs to a registered Radiology Group (`organizations` table).
-   An active relationship exists between the Radiology Group and one or more Referring Physician Groups (`organization_relationships` table).
-   Orders exist with `status = 'pending_radiology'` targeted to this Radiology Group.

## Steps

### 1. Accessing the Incoming Order Queue

1.  **Login:** Radiology group user logs into the RadOrderPad platform.
2.  **Dashboard/Queue View:** User navigates to the incoming order queue. This view displays orders with `status = 'pending_radiology'` where the `radiology_organization_id` matches their group.
3.  **Filtering & Sorting:** The queue should be filterable/sortable by:
    *   Referring Physician Group (`orders.referring_organization_id`)
    *   Priority (`orders.priority` - 'stat' vs 'routine')
    *   Modality (`orders.modality`)
    *   Date Received (`orders.created_at` or a status update timestamp)
    *   Validation Status (`orders.validation_status` - 'appropriate' vs 'override')

### 2. Order Triage & Prioritization (Bucket System)

The incoming queue implicitly or explicitly presents orders based on priority:

1.  **Bucket 1 (Highest Priority): Physician Overrides**
    *   Orders where `orders.validation_status = 'override'`.
    *   These require careful review by clinical or pre-auth staff due to deviation from standard appropriateness guidelines. Flagged visually in the queue.
2.  **Bucket 2: Advanced Imaging / Pre-Auth Needed**
    *   Orders for modalities typically requiring pre-authorization (MRI, CT, PET, Nuclear Medicine). Identified via `orders.final_cpt_code` or `orders.modality`.
    *   Routed internally to the Pre-Authorization team.
3.  **Bucket 3: Standard Orders**
    *   Routine orders (e.g., X-rays, some Ultrasounds) that may not need pre-auth but still require scheduling.

### 3. Viewing Full Order Details

1.  **Select Order:** User clicks on an order in the queue to view its details.
2.  **Comprehensive View:** The detail screen presents a read-only, consolidated view of the *entire* order package:
    *   Patient Demographics (`patients` table data)
    *   Insurance Information (`patient_insurance` table data)
    *   Referring Physician & Organization Details (`orders` cached fields or lookup)
    *   Clinical Dictation (`orders.original_dictation`, potentially appended text from `validation_attempts`)
    *   Final ICD-10 & CPT Codes (`orders.final_icd10_codes`, `orders.final_cpt_code`)
    *   Validation Summary (`orders.validation_status`, `orders.compliance_score`, `orders.validation_notes`, `orders.override_justification` if applicable)
    *   AUC Outcome (`orders.auc_outcome`, `orders.guideline_source`)
    *   Pasted Clinical Context (`patient_clinical_records` content)
    *   Links to Uploaded Documents (`document_uploads` - viewable/downloadable via secure links)

### 4. Processing the Order (External to RadOrderPad)

1.  **Pre-Authorization:** Using the complete information provided in RadOrderPad, the pre-auth team initiates the authorization process with the payer. The platform provides all necessary codes, clinical justification, and supporting documents in one place.
2.  **Scheduling:** Schedulers use the patient contact information and order details to contact the patient and schedule the exam in their *external* RIS/Scheduling system.

### 5. Exporting Order Data

1.  **Export Options:** From the order detail view, users can export the complete order package in various formats:
    *   **PDF:** A standardized, printable summary document.
    *   **CSV:** Structured data suitable for spreadsheets or batch import utilities.
    *   **JSON:** Machine-readable format for potential scripting or lightweight integration.
    *   **FHIR Resource (Future Enhancement):** Export as a FHIR ServiceRequest or related resources.
    *   **HL7 Message (Future Enhancement):** Export as an HL7 ORM message.
2.  **Use Case:** Radiology groups use these exports to manually enter or import order data into their own RIS, PACS, or billing systems. **RadOrderPad does not directly integrate.**

### 6. Updating Order Status (Optional)

1.  **Status Update:** Schedulers or other staff *can* optionally update the order status within RadOrderPad to reflect its real-world progress.
2.  **Available Statuses:** `scheduled`, `completed`, `cancelled`.
3.  **Backend Update:** Selecting a new status updates `orders.status` and logs an event in `order_history`.
4.  **Visibility:** This updated status becomes visible to the referring physician group on their dashboard, closing the loop.

### 7. Handling Information Requests (Optional)

1.  **Identify Missing Info:** If, despite the complete package, the radiology group identifies critical missing information *not* captured, they can potentially use an internal "Request Information" feature (linking to `information_requests` table).
2.  **Notification:** This could trigger a notification back to the referring group's admin staff queue. *(This adds complexity and deviates slightly from the "perfect order" principle, use judiciously)*.

### 8. (Planned) Result Return Loop

*See: `result_return_loop.md` (Future Scope)*
-   Mechanism for radiologists to potentially append final report text or status back to the referring physician via RadOrderPad.

---

## Data References

-   `users` (Main DB)
-   `organizations` (Main DB)
-   `organization_relationships` (Main DB)
-   `orders` (PHI DB)
-   `patients` (PHI DB)
-   `patient_insurance` (PHI DB)
-   `patient_clinical_records` (PHI DB)
-   `document_uploads` (PHI DB)
-   `validation_attempts` (PHI DB) - *Requires Reconciliation*
-   `order_history` (PHI DB)
-   `information_requests` (PHI DB)