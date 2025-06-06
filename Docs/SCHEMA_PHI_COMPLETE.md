# SCHEMA_PHI.md (Reconciled Definitive - COMPLETE)

**Version:** 1.3 - Added HIPAA Compliance Fields
**Date:** 2025-04-20

This document defines the **authoritative and fully expanded reconciled schema** for the **`radorder_phi`** database (PHI-enabled). It includes all tables and columns based on the initial specification and later feature requirements, including the `overridden` flag for orders and HIPAA compliance fields.

---

**Table: `patients`**

| Column          | Type                        | Constraints                   | Description                                      |
| --------------- | --------------------------- | ----------------------------- | ------------------------------------------------ |
| `id`            | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Internal primary key for the patient             |
| `pidn`          | `text`                      | `UNIQUE`                      | Platform-internal unique patient ID              |
| `organization_id` | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.organizations.id` |
| `mrn`           | `text`                      |                               | External Medical Record Number (optional)        |
| `first_name`    | `text`                      | `NOT NULL`                    | Patient first name                               |
| `last_name`     | `text`                      | `NOT NULL`                    | Patient last name                                |
| `middle_name`   | `text`                      |                               | Patient middle name                              |
| `date_of_birth` | `text`                      | `NOT NULL`                    | Patient date of birth (e.g., YYYY-MM-DD)         |
| `gender`        | `text`                      | `NOT NULL`                    | Patient gender (e.g., 'Male', 'Female', 'Other') |
| `address_line1` | `text`                      |                               | Patient address line 1                           |
| `address_line2` | `text`                      |                               | Patient address line 2                           |
| `city`          | `text`                      |                               | Patient city                                     |
| `state`         | `text`                      |                               | Patient state/province                           |
| `zip_code`      | `text`                      |                               | Patient ZIP/postal code                          |
| `phone_number`  | `text`                      |                               | Patient contact phone number                     |
| `email`         | `text`                      |                               | Patient contact email                            |
| `created_at`    | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when patient record was created        |
| `updated_at`    | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when patient record was last updated   |

**Table: `patient_insurance`**

| Column                       | Type                        | Constraints                   | Description                                        |
| ---------------------------- | --------------------------- | ----------------------------- | -------------------------------------------------- |
| `id`                         | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the insurance record               |
| `patient_id`                 | `integer`                   | `NOT NULL`, `FK REFERENCES patients(id)` | Link to the patient record                     |
| `is_primary`                 | `boolean`                   | `DEFAULT false`               | Indicates if this is the primary insurance         |
| `insurer_name`               | `text`                      | `NOT NULL`                    | Name of the insurance company                      |
| `policy_number`              | `text`                      | `NOT NULL`                    | Insurance policy number                            |
| `group_number`               | `text`                      |                               | Insurance group number                             |
| `plan_type`                  | `text`                      |                               | Type of insurance plan (e.g., PPO, HMO)          |
| `policy_holder_name`         | `text`                      |                               | Name of the policy holder if not the patient     |
| `policy_holder_relationship` | `text`                      |                               | Relationship of policy holder to patient         |
| `policy_holder_date_of_birth`| `text`                      |                               | DOB of the policy holder                         |
| `verification_status`        | `text`                      | `DEFAULT 'not_verified'`      | Status of insurance verification                 |
| `verification_date`          | `timestamp without time zone` |                               | Timestamp when insurance was last verified       |
| `created_at`                 | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when insurance record was created      |
| `updated_at`                 | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when insurance record was last updated |

**Table: `orders`**

| Column                        | Type                        | Constraints                   | Description                                                       |
| ----------------------------- | --------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| `id`                          | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the order                                         |
| `order_number`                | `text`                      | `NOT NULL`, `UNIQUE`          | Unique identifier for the order within the platform             |
| `patient_id`                  | `integer`                   | `NOT NULL`, `FK REFERENCES patients(id)` | Link to the patient                                             |
| `referring_organization_id`   | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.organizations.id`                    |
| `radiology_organization_id`   | `integer`                   |                               | Logical FK to `radorder_main.organizations.id` (NULL when physician creates order, assigned later by admin) |
| `originating_location_id`     | `integer`                   |                               | Logical FK to `radorder_main.locations.id` (Referring Location) |
| `target_facility_id`          | `integer`                   |                               | Logical FK to `radorder_main.locations.id` (Target Radiology Loc)|
| `created_by_user_id`          | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id` (Physician/MA)           |
| `signed_by_user_id`           | `integer`                   |                               | Logical FK to `radorder_main.users.id` (Physician who signed)   |
| `updated_by_user_id`          | `integer`                   |                               | Logical FK to `radorder_main.users.id` (Last user to update)    |
| `status`                      | `text`                      | `NOT NULL`, `DEFAULT 'draft'` | Order status ('draft', 'pending_validation', 'pending_admin', 'pending_radiology', 'override_pending_signature', 'scheduled', 'completed', 'cancelled', 'results_available', 'results_acknowledged') |
| `priority`                    | `text`                      | `NOT NULL`, `DEFAULT 'routine'` | Order priority ('routine', 'stat')                              |
| `original_dictation`          | `text`                      |                               | Initial dictation text from the physician                       |
| `clinical_indication`         | `text`                      |                               | Final/parsed clinical indication text                           |
| `modality`                    | `text`                      |                               | Requested imaging modality (e.g., MRI, CT)                    |
| `body_part`                   | `text`                      |                               | Target body part                                                |
| `laterality`                  | `text`                      |                               | 'Left', 'Right', 'Bilateral', 'None'                            |
| `final_cpt_code`              | `text`                      |                               | Final suggested/validated CPT code stored on the order          |
| `final_cpt_code_description`  | `text`                      |                               | Description of the final CPT code                               |
| `final_icd10_codes`           | `text`                      |                               | Final suggested/validated ICD-10 codes (comma-separated?)       |
| `final_icd10_code_descriptions`| `text`                     |                               | Descriptions of the final ICD-10 codes                          |
| `is_contrast_indicated`       | `boolean`                   |                               | Whether contrast is indicated                                     |
| `patient_pregnant`            | `text`                      |                               | Patient pregnancy status ('Yes', 'No', 'Unknown')               |
| `patient_pregnancy_notes`     | `text`                      |                               | Notes related to pregnancy                                        |
| `authorization_number`        | `text`                      |                               | Pre-authorization number if obtained                            |
| `authorization_status`        | `text`                      |                               | Status of pre-authorization                                       |
| `authorization_date`          | `timestamp without time zone` |                               | Date pre-authorization was obtained                             |
| `signature_date`              | `timestamp without time zone` |                               | Timestamp when the order was digitally signed                   |
| `scheduled_date`              | `timestamp without time zone` |                               | Date/time the exam is scheduled                                 |
| `pdf_url`                     | `text`                      |                               | Link to a generated PDF summary of the order (optional)         |
| `patient_name`                | `text`                      |                               | Cached patient name for display                                 |
| `patient_dob`                 | `text`                      |                               | Cached patient DOB for display                                  |
| `patient_gender`              | `text`                      |                               | Cached patient gender for display                               |
| `patient_mrn`                 | `text`                      |                               | Cached patient MRN for display                                  |
| `insurance_provider`          | `text`                      |                               | Cached primary insurance provider for display                   |
| `insurance_policy_number`     | `text`                      |                               | Cached primary policy number for display                        |
| `contrast`                    | `text`                      |                               | Specific contrast agent details if applicable                   |
| `special_instructions`        | `text`                      |                               | Special instructions for the radiology team                     |
| `prep_instructions`           | `text`                      |                               | Patient preparation instructions                                |
| `final_validation_status`     | `text`                      |                               | Final validation status ('appropriate', 'inappropriate', 'override') |
| `final_compliance_score`      | `integer`                   |                               | Final compliance score (e.g., 1-9)                              |
| `final_validation_notes`      | `text`                      |                               | Final feedback/notes from validation                            |
| `validated_at`                | `timestamp without time zone` |                               | Timestamp of the final validation/override                      |
| `referring_physician_name`    | `text`                      |                               | Cached referring physician name                                 |
| `referring_physician_npi`     | `text`                      |                               | Cached referring physician NPI                                  |
| `radiology_organization_name` | `text`                      |                               | Cached name of the target radiology group                       |
| `auc_outcome`                 | `text`                      |                               | Appropriate Use Criteria outcome code/description               |
| `guideline_source`            | `text`                      |                               | Source of the AUC guideline used (e.g., ACR Select)           |
| `override_justification`      | `text`                      |                               | Physician's justification text for overriding validation        |
| `overridden`                  | `boolean`                   | `NOT NULL`, `DEFAULT false`   | Flag indicating if physician overrode validation recommendation |
| `is_urgent_override`          | `boolean`                   | `DEFAULT false`               | Flag if override was due to urgency                             |
| `final_report_text`           | `text`                      |                               | Pasted text of the final report (Result Return Loop)          |
| `results_acknowledged_at`     | `timestamp without time zone` |                               | Timestamp when referring user acknowledged results            |
| `created_at`                  | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when order was initially created                      |
| `updated_at`                  | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when order was last updated                           |
| `referring_physician_phone`   | `varchar(20)`               |                               | Referring physician phone number (HIPAA)                        |
| `referring_physician_email`   | `varchar(100)`              |                               | Referring physician email address (HIPAA)                       |
| `referring_physician_fax`     | `varchar(20)`               |                               | Referring physician fax number (HIPAA)                          |
| `referring_physician_address` | `varchar(255)`              |                               | Referring physician address (HIPAA)                             |
| `referring_physician_city`    | `varchar(100)`              |                               | Referring physician city (HIPAA)                                |
| `referring_physician_state`   | `varchar(2)`                |                               | Referring physician state (HIPAA)                               |
| `referring_physician_zip`     | `varchar(10)`               |                               | Referring physician zip code (HIPAA)                            |
| `referring_physician_specialty` | `varchar(100)`            |                               | Referring physician specialty (HIPAA)                           |
| `referring_physician_license` | `varchar(50)`               |                               | Referring physician license number (HIPAA)                      |
| `referring_organization_address` | `varchar(255)`           |                               | Referring organization address (HIPAA)                          |
| `referring_organization_city` | `varchar(100)`              |                               | Referring organization city (HIPAA)                             |
| `referring_organization_state` | `varchar(2)`               |                               | Referring organization state (HIPAA)                            |
| `referring_organization_zip`  | `varchar(10)`               |                               | Referring organization zip code (HIPAA)                         |
| `referring_organization_phone` | `varchar(20)`              |                               | Referring organization phone number (HIPAA)                     |
| `referring_organization_fax`  | `varchar(20)`               |                               | Referring organization fax number (HIPAA)                       |
| `referring_organization_email` | `varchar(100)`             |                               | Referring organization email address (HIPAA)                    |
| `referring_organization_tax_id` | `varchar(20)`             |                               | Referring organization tax ID (HIPAA)                           |
| `referring_organization_npi`  | `varchar(10)`               |                               | Referring organization NPI (HIPAA)                              |
| `radiology_organization_address` | `varchar(255)`           |                               | Radiology organization address (HIPAA)                          |
| `radiology_organization_city` | `varchar(100)`              |                               | Radiology organization city (HIPAA)                             |
| `radiology_organization_state` | `varchar(2)`               |                               | Radiology organization state (HIPAA)                            |
| `radiology_organization_zip`  | `varchar(10)`               |                               | Radiology organization zip code (HIPAA)                         |
| `radiology_organization_phone` | `varchar(20)`              |                               | Radiology organization phone number (HIPAA)                     |
| `radiology_organization_fax`  | `varchar(20)`               |                               | Radiology organization fax number (HIPAA)                       |
| `radiology_organization_email` | `varchar(100)`             |                               | Radiology organization email address (HIPAA)                    |
| `radiology_organization_tax_id` | `varchar(20)`             |                               | Radiology organization tax ID (HIPAA)                           |
| `radiology_organization_npi`  | `varchar(10)`               |                               | Radiology organization NPI (HIPAA)                              |
| `patient_consent_obtained`    | `boolean`                   |                               | Whether patient consent was obtained (HIPAA)                    |
| `patient_consent_date`        | `timestamp without time zone` |                               | Date patient consent was obtained (HIPAA)                       |
| `insurance_authorization_number` | `varchar(50)`            |                               | Insurance authorization number (HIPAA)                          |
| `insurance_authorization_date` | `timestamp without time zone` |                              | Date insurance authorization was obtained (HIPAA)               |
| `insurance_authorization_contact` | `varchar(100)`          |                               | Insurance authorization contact person (HIPAA)                  |
| `medical_necessity_documentation` | `text`                  |                               | Medical necessity documentation (HIPAA)                         |

**Table: `validation_attempts`** *(NEW - For Validation History)*

| Column                       | Type                        | Constraints                   | Description                                                    |
| ---------------------------- | --------------------------- | ----------------------------- | -------------------------------------------------------------- |
| `id`                         | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the validation attempt                         |
| `order_id`                   | `integer`                   | `NOT NULL`, `FK REFERENCES orders(id)` | Link to the order being validated                            |
| `attempt_number`             | `integer`                   | `NOT NULL`                    | Sequence number of the attempt (1, 2, 3)                       |
| `validation_input_text`      | `text`                      | `NOT NULL`                    | The full dictation text submitted for this attempt             |
| `validation_outcome`         | `text`                      | `NOT NULL`                    | Result status ('appropriate', 'needs_clarification', 'inappropriate') |
| `generated_icd10_codes`      | `text`                      |                               | ICD-10 codes suggested by LLM for *this attempt*             |
| `generated_cpt_codes`        | `text`                      |                               | CPT codes suggested by LLM for *this attempt*                |
| `generated_feedback_text`    | `text`                      |                               | Feedback text generated for *this attempt*                   |
| `generated_compliance_score` | `integer`                   |                               | Compliance score generated for *this attempt*                |
| `is_rare_disease_feedback`   | `boolean`                   | `NOT NULL`, `DEFAULT false`   | Flag indicating if rare disease logic modified feedback      |
| `llm_validation_log_id`      | `bigint`                    |                               | **NULLABLE.** Logical FK to `radorder_main.llm_validation_logs.id` |
| `user_id`                    | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id` (User who submitted)  |
| `created_at`                 | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp of this validation attempt                           |

**Table: `order_history`**

| Column          | Type                        | Constraints                   | Description                                          |
| --------------- | --------------------------- | ----------------------------- | ---------------------------------------------------- |
| `id`            | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the history event                    |
| `order_id`      | `integer`                   | `NOT NULL`, `FK REFERENCES orders(id)` | Link to the order                                    |
| `user_id`       | `integer`                   |                               | Logical FK to `radorder_main.users.id` (User action) |
| `event_type`    | `text`                      | `NOT NULL`                    | Type of event ('created', 'validated', 'signed', 'admin_finalized', 'sent_to_radiology', 'scheduled', 'completed', 'cancelled', 'results_added', 'results_acknowledged', 'override', 'clarification_added') |
| `previous_status`| `text`                      |                               | Order status before the event                        |
| `new_status`    | `text`                      |                               | Order status after the event                         |
| `details`       | `text`                      |                               | Additional details about the event (e.g., override reason snippet, validation attempt #) |
| `created_at`    | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp of the event                               |

**Table: `order_notes`**

| Column       | Type                        | Constraints                   | Description                                |
| ------------ | --------------------------- | ----------------------------- | ------------------------------------------ |
| `id`         | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the note                   |
| `order_id`   | `integer`                   | `NOT NULL`, `FK REFERENCES orders(id)` | Link to the order                          |
| `user_id`    | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id`     |
| `note_type`  | `text`                      | `NOT NULL`                    | Type of note (e.g., 'internal', 'clinical', 'scheduling') |
| `note_text`  | `text`                      | `NOT NULL`                    | The content of the note                    |
| `is_internal`| `boolean`                   | `DEFAULT false`               | If the note is for internal staff only     |
| `created_at` | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp note created                     |
| `updated_at` | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp note updated                     |

**Table: `document_uploads`**

| Column              | Type                        | Constraints                   | Description                                          |
| ------------------- | --------------------------- | ----------------------------- | ---------------------------------------------------- |
| `id`                | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key for the upload record                    |
| `user_id`           | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id` (Uploader)    |
| `order_id`          | `integer`                   | `FK REFERENCES orders(id)` (Optional) | Link to order if applicable                          |
| `patient_id`        | `integer`                   | `FK REFERENCES patients(id)` (Optional) | Link to patient if applicable                        |
| `document_type`     | `text`                      | `NOT NULL`                    | User-defined or system type ('insurance_card', 'lab_report', 'signature', 'prior_imaging', 'supplemental', 'final_report') |
| `filename`          | `text`                      | `NOT NULL`                    | Original filename provided by the user               |
| `file_path`         | `text`                      | `NOT NULL`, `UNIQUE`          | The full key/path of the object in the S3 bucket     |
| `file_size`         | `integer`                   | `NOT NULL`                    | File size in bytes                                   |
| `mime_type`         | `text`                      |                               | File MIME type (e.g., 'image/png', 'application/pdf') |
| `processing_status` | `text`                      | `DEFAULT 'uploaded'`          | Status ('uploaded', 'processing', 'processed', 'failed') |
| `processing_details`| `text`                      |                               | Notes from any post-upload processing (e.g., OCR)    |
| `content_extracted` | `text`                      |                               | Extracted text content (optional)                    |
| `uploaded_at`       | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp of successful upload confirmation        |

**Table: `patient_clinical_records`**

| Column             | Type                        | Constraints                   | Description                                               |
| ------------------ | --------------------------- | ----------------------------- | --------------------------------------------------------- |
| `id`               | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key                                               |
| `patient_id`       | `integer`                   | `NOT NULL`, `FK REFERENCES patients(id)` | Link to the patient                                       |
| `order_id`         | `integer`                   | `FK REFERENCES orders(id)` (Optional) | Link to order if associated with a specific order       |
| `record_type`      | `text`                      | `NOT NULL`                    | Type ('emr_summary_paste', 'supplemental_docs_paste', 'lab', 'medication', 'diagnosis', 'prior_imaging_report') |
| `content`          | `text`                      | `NOT NULL`                    | Raw pasted text content or structured data                |
| `parsed_data`      | `jsonb`                     |                               | Structured data extracted from content (optional)         |
| `source_system`    | `text`                      |                               | EMR source if known (e.g., 'Athena', 'eCW', 'Manual')     |
| `record_date`      | `date`                      |                               | Date associated with the record (e.g., lab date)          |
| `added_by_user_id` | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id` (User who added) |
| `added_at`         | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when record was added                           |
| `updated_at`       | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when record was updated                         |

**Table: `information_requests`**

| Column                     | Type                        | Constraints                   | Description                                                  |
| -------------------------- | --------------------------- | ----------------------------- | ------------------------------------------------------------ |
| `id`                       | `integer`                   | `PRIMARY KEY`, Auto-incrementing | Primary key                                                  |
| `order_id`                 | `integer`                   | `NOT NULL`, `FK REFERENCES orders(id)` | Link to the order requiring info                           |
| `requested_by_user_id`     | `integer`                   | `NOT NULL`                    | Logical FK to `radorder_main.users.id` (User requesting)   |
| `requesting_organization_id`| `integer`                  | `NOT NULL`                    | Logical FK to `radorder_main.organizations.id` (Org requesting) |
| `target_organization_id`   | `integer`                  | `NOT NULL`                    | Logical FK to `radorder_main.organizations.id` (Org to provide info) |
| `requested_info_type`      | `text`                      | `NOT NULL`                    | Type of info needed (e.g., 'labs', 'prior_imaging', 'clarification') |
| `requested_info_details`   | `text`                      | `NOT NULL`                    | Specific details of the request                            |
| `status`                   | `text`                      | `NOT NULL`, `DEFAULT 'pending'` | Status ('pending', 'fulfilled', 'cancelled')               |
| `requested_at`             | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp when request was made                            |
| `fulfilled_at`             | `timestamp without time zone` |                               | Timestamp when info was provided                           |
| `fulfilled_by_record_id`   | `integer`                   | `FK REFERENCES patient_clinical_records(id)` (Optional) | Link to `patient_clinical_records` providing the info    |
| `fulfilled_by_document_id` | `integer`                   | `FK REFERENCES document_uploads(id)` (Optional) | Link to `document_uploads` providing the info              |
| `created_at`               | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp record created                                     |
| `updated_at`               | `timestamp without time zone` | `DEFAULT CURRENT_TIMESTAMP`   | Timestamp record updated                                     |
