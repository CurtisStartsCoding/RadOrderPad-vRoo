# Thorough Normalization Audit Report

Generated on: 4/15/2025, 5:21:12 PM

## Summary

- Total unique files affected: 664
- Total pattern matches found: 420483

## Directory Breakdown

- **Data\batches**: 95 files (14.3%)
- **Docs\implementation**: 77 files (11.6%)
- **.**: 40 files (6.0%)
- **Docs**: 29 files (4.4%)
- **test-results**: 21 files (3.2%)
- **test-results\llm-validation**: 19 files (2.9%)
- **old_code**: 17 files (2.6%)
- **tests\batch**: 13 files (2.0%)
- **src\routes**: 12 files (1.8%)
- **tests\e2e**: 12 files (1.8%)
- **src\services\order\radiology\details**: 9 files (1.4%)
- **src\services\order\radiology\query\order-builder**: 9 files (1.4%)
- **src\controllers\admin-order**: 7 files (1.1%)
- **src\controllers\connection**: 7 files (1.1%)
- **src\controllers\radiology**: 7 files (1.1%)
- **src\services\billing\stripe**: 7 files (1.1%)
- **src\services\location**: 7 files (1.1%)
- **src\services\order\radiology**: 7 files (1.1%)
- **src\utils\database**: 7 files (1.1%)
- **test-results\e2e**: 7 files (1.1%)
- **tests**: 7 files (1.1%)
- **db-migrations**: 6 files (0.9%)
- **src\controllers\location\organization**: 6 files (0.9%)
- **src\controllers\uploads**: 6 files (0.9%)
- **src\services\auth\organization**: 6 files (0.9%)
- **src\services\auth\user**: 6 files (0.9%)
- **src\services\billing\stripe\webhooks**: 6 files (0.9%)
- **src\services\connection\services**: 6 files (0.9%)
- **src\services\location\services**: 6 files (0.9%)
- **src\services\notification\services\connection-notifications**: 6 files (0.9%)
- **src\services\order\admin\handlers**: 6 files (0.9%)
- **src\middleware\auth**: 5 files (0.8%)
- **src\models**: 5 files (0.8%)
- **src\models\order**: 5 files (0.8%)
- **src\services\connection\queries\request**: 5 files (0.8%)
- **src\services\notification**: 5 files (0.8%)
- **src\services\notification\templates\connection**: 5 files (0.8%)
- **src\services\notification\templates**: 5 files (0.8%)
- **src\services\order\admin**: 5 files (0.8%)
- **src\services\order\admin\types**: 5 files (0.8%)
- **src\services\upload**: 5 files (0.8%)
- **src\services\validation**: 5 files (0.8%)
- **src\utils\text-processing\medical-terms**: 5 files (0.8%)
- **old_code\src\services\notification\services\connection**: 4 files (0.6%)
- **old_code\src\services\order\admin**: 4 files (0.6%)
- **src\config**: 4 files (0.6%)
- **src\controllers\auth**: 4 files (0.6%)
- **src\controllers\location\user**: 4 files (0.6%)
- **src\controllers\order-management\handlers**: 4 files (0.6%)
- **src\controllers\order-management\validation**: 4 files (0.6%)
- **src\services\location\queries\user**: 4 files (0.6%)
- **src\services\location\services\user-location-management**: 4 files (0.6%)
- **src\services\location\user**: 4 files (0.6%)
- **src\services\notification\email-sender**: 4 files (0.6%)
- **src\services\notification\manager**: 4 files (0.6%)
- **src\services\notification\services**: 4 files (0.6%)
- **src\services\notification\services\connection\request**: 4 files (0.6%)
- **src\services\order\admin\clinical-record-manager**: 4 files (0.6%)
- **src\services\order\admin\order-status-manager**: 4 files (0.6%)
- **src\services\order\admin\utils\query-builder**: 4 files (0.6%)
- **src\services\order\radiology\order-export**: 4 files (0.6%)
- **src\services\order\validation**: 4 files (0.6%)
- **src\utils\llm\providers**: 4 files (0.6%)
- **src\utils\response**: 4 files (0.6%)
- **src\utils\text-processing\keyword-extractor**: 4 files (0.6%)
- **Data\tables**: 3 files (0.5%)
- **src\controllers**: 3 files (0.5%)
- **src\controllers\billing**: 3 files (0.5%)
- **src\controllers\connection\list**: 3 files (0.5%)
- **src\controllers\connection\validation-utils**: 3 files (0.5%)
- **src\controllers\superadmin\organizations**: 3 files (0.5%)
- **src\controllers\superadmin\users**: 3 files (0.5%)
- **src\services\billing\credit**: 3 files (0.5%)
- **src\services\billing\stripe\webhooks\handle-invoice-payment-failed**: 3 files (0.5%)
- **src\services\billing\stripe\webhooks\handle-subscription-updated**: 3 files (0.5%)
- **src\services\connection**: 3 files (0.5%)
- **src\services\connection\queries\approve**: 3 files (0.5%)
- **src\services\connection\queries\list**: 3 files (0.5%)
- **src\services\connection\queries\terminate**: 3 files (0.5%)
- **src\services\connection\services\request-connection-helpers**: 3 files (0.5%)
- **src\services\location\manager**: 3 files (0.5%)
- **src\services\notification\email-sender\test-mode**: 3 files (0.5%)
- **src\services\notification\services\connection\approval**: 3 files (0.5%)
- **src\services\notification\services\connection\rejection**: 3 files (0.5%)
- **src\services\notification\services\connection\termination**: 3 files (0.5%)
- **src\services\order\admin\insurance**: 3 files (0.5%)
- **src\services\order\admin\patient**: 3 files (0.5%)
- **src\services\order\admin\patient-manager**: 3 files (0.5%)
- **src\services\order\admin\validation\insurance**: 3 files (0.5%)
- **src\services\order\admin\validation\patient**: 3 files (0.5%)
- **src\services\order\finalize**: 3 files (0.5%)
- **src\services\order\radiology\query**: 3 files (0.5%)
- **src\services\order\radiology\query\order-builder\metadata-filters**: 3 files (0.5%)
- **src\services\order\validation\attempt-tracking**: 3 files (0.5%)
- **src\services**: 3 files (0.5%)
- **src\services\superadmin\organizations**: 3 files (0.5%)
- **src\services\superadmin\users**: 3 files (0.5%)
- **src\utils\llm**: 3 files (0.5%)
- **src\utils\response\normalizer**: 3 files (0.5%)
- **src\utils\response\validator**: 3 files (0.5%)
- **src\utils\text-processing\code-extractor\common**: 3 files (0.5%)
- **src\utils\text-processing**: 3 files (0.5%)
- **old_code\src\controllers\connection**: 2 files (0.3%)
- **old_code\src\utils\response**: 2 files (0.3%)
- **old_code\src\utils\text-processing**: 2 files (0.3%)
- **src\controllers\location**: 2 files (0.3%)
- **src\controllers\order-management\error-handling**: 2 files (0.3%)
- **src\controllers\order-management**: 2 files (0.3%)
- **src\services\auth**: 2 files (0.3%)
- **src\services\auth\token**: 2 files (0.3%)
- **src\services\billing\errors**: 2 files (0.3%)
- **src\services\billing**: 2 files (0.3%)
- **src\services\connection\queries**: 2 files (0.3%)
- **src\services\connection\queries\reject**: 2 files (0.3%)
- **src\services\location\queries\create**: 2 files (0.3%)
- **src\services\location\queries\deactivate**: 2 files (0.3%)
- **src\services\location\queries\get**: 2 files (0.3%)
- **src\services\location\queries\list**: 2 files (0.3%)
- **src\services\location\queries\update**: 2 files (0.3%)
- **src\services\order\admin\utils**: 2 files (0.3%)
- **src\services\order\admin\validation**: 2 files (0.3%)
- **src\services\order\finalize\authorization**: 2 files (0.3%)
- **src\services\order\finalize\signature**: 2 files (0.3%)
- **src\services\order\finalize\transaction**: 2 files (0.3%)
- **src\services\order\finalize\update**: 2 files (0.3%)
- **src\services\order\radiology\export\csv-export**: 2 files (0.3%)
- **src\services\order\radiology\export**: 2 files (0.3%)
- **Data**: 1 files (0.2%)
- **Docs\prompt_examples**: 1 files (0.2%)
- **migrations**: 1 files (0.2%)
- **old_code\src\controllers**: 1 files (0.2%)
- **old_code\src\middleware**: 1 files (0.2%)
- **old_code\src\services\billing\stripe**: 1 files (0.2%)
- **old_code\src\services\connection\services**: 1 files (0.2%)
- **old_code\src\services\location\services**: 1 files (0.2%)
- **old_code\src\services\notification\email-sender**: 1 files (0.2%)
- **old_code\src\services\order\admin\utils**: 1 files (0.2%)
- **old_code\src\services\order\radiology\export**: 1 files (0.2%)
- **old_code\src\services\order\radiology**: 1 files (0.2%)
- **old_code\src\services\order\radiology\query\order-builder**: 1 files (0.2%)
- **old_code\src\services\order\validation**: 1 files (0.2%)
- **old_code\src\services\order**: 1 files (0.2%)
- **old_code\src\services**: 1 files (0.2%)
- **src\controllers\superadmin**: 1 files (0.2%)
- **src**: 1 files (0.2%)
- **src\services\location\queries**: 1 files (0.2%)
- **src\services\notification\services\connection**: 1 files (0.2%)
- **src\services\order\admin\__tests__**: 1 files (0.2%)
- **src\services\order**: 1 files (0.2%)
- **src\services\superadmin**: 1 files (0.2%)
- **src\utils\text-processing\code-extractor\cpt**: 1 files (0.2%)
- **src\utils\text-processing\code-extractor\icd10**: 1 files (0.2%)
- **src\utils\text-processing\code-extractor**: 1 files (0.2%)
- **src\utils**: 1 files (0.2%)
- **tests\batch\test-results**: 1 files (0.2%)

## Results by Pattern

### Field Name Variations

- Files affected: 483
- Total matches: 218701

#### Directory Breakdown

- **Data\batches**: 95 files (19.7%)
- **Docs\implementation**: 51 files (10.6%)
- **.**: 30 files (6.2%)
- **Docs**: 29 files (6.0%)
- **old_code**: 17 files (3.5%)
- **test-results\llm-validation**: 16 files (3.3%)
- **test-results**: 12 files (2.5%)
- **tests\e2e**: 12 files (2.5%)
- **tests\batch**: 9 files (1.9%)
- **src\controllers\radiology**: 7 files (1.4%)
- **db-migrations**: 6 files (1.2%)
- **src\controllers\admin-order**: 6 files (1.2%)
- **src\controllers\connection**: 6 files (1.2%)
- **tests**: 6 files (1.2%)
- **src\controllers\location\organization**: 5 files (1.0%)
- **src\controllers\uploads**: 5 files (1.0%)
- **src\services\billing\stripe**: 5 files (1.0%)
- **src\services\connection\services**: 5 files (1.0%)
- **src\services\order\admin\handlers**: 5 files (1.0%)
- **src\services\order\radiology\query\order-builder**: 5 files (1.0%)
- **src\services\order\admin\types**: 4 files (0.8%)
- **src\services\order\radiology**: 4 files (0.8%)
- **src\services\upload**: 4 files (0.8%)
- **Data\tables**: 3 files (0.6%)
- **src\controllers\auth**: 3 files (0.6%)
- **src\controllers\location\user**: 3 files (0.6%)
- **src\controllers\order-management\handlers**: 3 files (0.6%)
- **src\controllers\order-management\validation**: 3 files (0.6%)
- **src\middleware\auth**: 3 files (0.6%)
- **src\services\billing\stripe\webhooks**: 3 files (0.6%)
- **src\services\connection\queries\request**: 3 files (0.6%)
- **src\services\notification**: 3 files (0.6%)
- **src\utils\database**: 3 files (0.6%)
- **src\utils\llm\providers**: 3 files (0.6%)
- **src\utils\response**: 3 files (0.6%)
- **src\utils\response\validator**: 3 files (0.6%)
- **old_code\src\controllers\connection**: 2 files (0.4%)
- **old_code\src\services\order\admin**: 2 files (0.4%)
- **old_code\src\utils\response**: 2 files (0.4%)
- **src\controllers\billing**: 2 files (0.4%)
- **src\controllers\connection\list**: 2 files (0.4%)
- **src\controllers\connection\validation-utils**: 2 files (0.4%)
- **src\controllers**: 2 files (0.4%)
- **src\controllers\superadmin\organizations**: 2 files (0.4%)
- **src\controllers\superadmin\users**: 2 files (0.4%)
- **src\models**: 2 files (0.4%)
- **src\models\order**: 2 files (0.4%)
- **src\routes**: 2 files (0.4%)
- **src\services\connection\queries\approve**: 2 files (0.4%)
- **src\services\connection\queries\terminate**: 2 files (0.4%)
- **src\services\connection\services\request-connection-helpers**: 2 files (0.4%)
- **src\services\location\manager**: 2 files (0.4%)
- **src\services\location\queries\user**: 2 files (0.4%)
- **src\services\location\services\user-location-management**: 2 files (0.4%)
- **src\services\location\user**: 2 files (0.4%)
- **src\services\notification\manager**: 2 files (0.4%)
- **src\services\notification\templates**: 2 files (0.4%)
- **src\services\order\admin\clinical-record-manager**: 2 files (0.4%)
- **src\services\order\admin\order-status-manager**: 2 files (0.4%)
- **src\services\order\validation**: 2 files (0.4%)
- **src\services**: 2 files (0.4%)
- **src\services\validation**: 2 files (0.4%)
- **src\utils\text-processing\code-extractor\common**: 2 files (0.4%)
- **Data**: 1 files (0.2%)
- **Docs\prompt_examples**: 1 files (0.2%)
- **old_code\src\controllers**: 1 files (0.2%)
- **old_code\src\middleware**: 1 files (0.2%)
- **old_code\src\services\billing\stripe**: 1 files (0.2%)
- **old_code\src\services\connection\services**: 1 files (0.2%)
- **old_code\src\services\location\services**: 1 files (0.2%)
- **old_code\src\services\order\radiology\export**: 1 files (0.2%)
- **old_code\src\services\order\validation**: 1 files (0.2%)
- **old_code\src\services\order**: 1 files (0.2%)
- **old_code\src\services**: 1 files (0.2%)
- **old_code\src\utils\text-processing**: 1 files (0.2%)
- **src\controllers\location**: 1 files (0.2%)
- **src\controllers\order-management\error-handling**: 1 files (0.2%)
- **src\controllers\order-management**: 1 files (0.2%)
- **src**: 1 files (0.2%)
- **src\services\auth\organization**: 1 files (0.2%)
- **src\services\billing\credit**: 1 files (0.2%)
- **src\services\billing\errors**: 1 files (0.2%)
- **src\services\billing**: 1 files (0.2%)
- **src\services\billing\stripe\webhooks\handle-invoice-payment-failed**: 1 files (0.2%)
- **src\services\billing\stripe\webhooks\handle-subscription-updated**: 1 files (0.2%)
- **src\services\connection\queries**: 1 files (0.2%)
- **src\services\connection\queries\list**: 1 files (0.2%)
- **src\services\connection\queries\reject**: 1 files (0.2%)
- **src\services\connection**: 1 files (0.2%)
- **src\services\location**: 1 files (0.2%)
- **src\services\location\queries\deactivate**: 1 files (0.2%)
- **src\services\location\services**: 1 files (0.2%)
- **src\services\notification\services**: 1 files (0.2%)
- **src\services\order\finalize\transaction**: 1 files (0.2%)
- **src\services\order\finalize**: 1 files (0.2%)
- **src\services\order\finalize\update**: 1 files (0.2%)
- **src\services\order\radiology\details**: 1 files (0.2%)
- **src\services\order\radiology\export\csv-export**: 1 files (0.2%)
- **src\services\order\radiology\query**: 1 files (0.2%)
- **src\services\order\validation\attempt-tracking**: 1 files (0.2%)
- **src\services\superadmin\organizations**: 1 files (0.2%)
- **src\services\superadmin\users**: 1 files (0.2%)
- **src\utils\llm**: 1 files (0.2%)
- **src\utils\response\normalizer**: 1 files (0.2%)
- **src\utils\text-processing\code-extractor\cpt**: 1 files (0.2%)
- **src\utils\text-processing\code-extractor\icd10**: 1 files (0.2%)
- **src\utils\text-processing\code-extractor**: 1 files (0.2%)
- **src\utils\text-processing\medical-terms**: 1 files (0.2%)
- **test-results\e2e**: 1 files (0.2%)

#### Top Affected Files

- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (107446 matches)
  - Unique matches: `cpt_codes`, `cpt`, `status`, `score`, `icd10_codes`, `icd10`
  - Sample context:
    ```
    4: BEGIN;
5: 
6: -- Table: medical_cpt_codes
7: CREATE TABLE IF NOT EXISTS medical_cpt_codes (
8:   "cpt_code" text NOT NULL,
    ```
    ```
    5: 
6: -- Table: medical_cpt_codes
7: CREATE TABLE IF NOT EXISTS medical_cpt_codes (
8:   "cpt_code" text NOT NULL,
9:   "description" text,
    ```
    ... and 50009 more matches
- **Data\tables\cpt_icd10_mappings.sql** (8139 matches)
  - Unique matches: `cpt`, `icd10`, `icd10_codes`, `cpt_codes`, `score`, `status`
  - Sample context:
    ```
    1: -- medical_cpt_icd10_mappings data
2: BEGIN;
3: 
    ```
    ```
    4: -- Create table if it doesn't exist
5: 
6: CREATE TABLE IF NOT EXISTS medical_cpt_icd10_mappings (
7:   "id" serial PRIMARY KEY,
8:   "icd10_code" text REFERENCES medical_icd10_codes(icd10_code),
    ```
    ... and 1917 more matches
- **Data\batches\93_batch.sql** (2015 matches)
  - Unique matches: `icd10_codes`, `icd10`, `status`
  - Sample context:
    ```
    1: -- Batch 93 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z79.89', 'Other long term (current) drug therapy', NULL, 'Z77-Z99', 'Persons with potential health hazards related to family and personal history and certain conditions influencing health status (Z77-Z99)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'Z79.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z79.890', 'Hormone replacement therapy', NULL, 'Z77-Z99', 'Persons with potential health hazards related to family and personal history and certain conditions influencing health status (Z77-Z99)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Z79.89', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z79.891', 'Long term (current) use of opiate analgesic', NULL, 'Z77-Z99', 'Persons with potential health hazards related to family and personal history and certain conditions influencing health status (Z77-Z99)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Z79.89', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches
- **Data\tables\icd10_markdown_docs.sql** (1869 matches)
  - Unique matches: `icd10`, `icd10_codes`
  - Sample context:
    ```
    1: -- medical_icd10_markdown_docs data
2: BEGIN;
3: 
    ```
    ```
    4: -- Create table if it doesn't exist
5: 
6: CREATE TABLE IF NOT EXISTS medical_icd10_markdown_docs (
7:   "id" serial PRIMARY KEY,
8:   "icd10_code" text NOT NULL UNIQUE REFERENCES medical_icd10_codes(icd10_code),
    ```
    ... and 933 more matches
- **Data\batches\92_batch.sql** (1580 matches)
  - Unique matches: `icd10_codes`, `icd10`, `status`
  - Sample context:
    ```
    1: -- Batch 92 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z45.49', 'Encounter for adjustment and management of other implanted nervous system device', NULL, 'Z40-Z53', 'Encounters for other specific health care (Z40-Z53)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Z45.4', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z45.8', 'Encounter for adjustment and management of other implanted devices', NULL, 'Z40-Z53', 'Encounters for other specific health care (Z40-Z53)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'Z45', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z45.81', 'Encounter for adjustment or removal of breast implant', NULL, 'Z40-Z53', 'Encounters for other specific health care (Z40-Z53)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'Z45.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches
- **Data\batches\91_batch.sql** (1545 matches)
  - Unique matches: `icd10_codes`, `icd10`, `status`
  - Sample context:
    ```
    1: -- Batch 91 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z11.7', 'Encounter for testing for latent tuberculosis infection', NULL, 'Z00-Z13', 'Persons encountering health services for examinations (Z00-Z13)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Z11', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z11.8', 'Encounter for screening for other infectious and parasitic diseases', NULL, 'Z00-Z13', 'Persons encountering health services for examinations (Z00-Z13)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Z11', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Z11.9', 'Encounter for screening for infectious and parasitic diseases, unspecified', NULL, 'Z00-Z13', 'Persons encountering health services for examinations (Z00-Z13)', NULL, 'Chapter 21: Factors influencing health status and contact with health services (Z00-Z99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Z11', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches
- **Data\batches\90_batch.sql** (1169 matches)
  - Unique matches: `icd10_codes`, `icd10`, `status`
  - Sample context:
    ```
    1: -- Batch 90 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Y92.043', 'Driveway of boarding-house as the place of occurrence of the external cause', NULL, 'Y90-Y99', 'Supplementary factors related to causes of morbidity classified elsewhere (Y90-Y99)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Y92.04', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Y92.044', 'Garage of boarding-house as the place of occurrence of the external cause', NULL, 'Y90-Y99', 'Supplementary factors related to causes of morbidity classified elsewhere (Y90-Y99)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Y92.04', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Y92.045', 'Swimming-pool of boarding-house as the place of occurrence of the external cause', NULL, 'Y90-Y99', 'Supplementary factors related to causes of morbidity classified elsewhere (Y90-Y99)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Y92.04', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches
- **Data\batches\13_batch.sql** (1139 matches)
  - Unique matches: `icd10_codes`, `icd10`, `status`, `score`
  - Sample context:
    ```
    1: -- Batch 13 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('F98.8', 'Other specified behavioral and emotional disorders with onset usually occurring in childhood and adolescence', NULL, 'F90-F98', 'Behavioral and emotional disorders with onset usually occurring in childhood and adolescence (F90-F98)', NULL, 'Chapter 5: Mental, Behavioral and Neurodevelopmental disorders (F01-F99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'F98', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('F99', 'Mental disorder, not otherwise specified', NULL, 'F99', 'Unspecified mental disorder (F99)', NULL, 'Chapter 5: Mental, Behavioral and Neurodevelopmental disorders (F01-F99)', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G00', 'Bacterial meningitis, not elsewhere classified', NULL, 'G00-G09', 'Inflammatory diseases of the central nervous system (G00-G09)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches
- **Data\batches\55_batch.sql** (1079 matches)
  - Unique matches: `icd10_codes`, `icd10`, `status`, `score`
  - Sample context:
    ```
    1: -- Batch 55 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Q91.2', 'Trisomy 18, translocation', NULL, 'Q90-Q99', 'Chromosomal abnormalities, not elsewhere classified (Q90-Q99)', NULL, 'Chapter 17: Congenital malformations, deformations and chromosomal abnormalities (Q00-Q99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Q91', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Q91.3', 'Trisomy 18, unspecified', NULL, 'Q90-Q99', 'Chromosomal abnormalities, not elsewhere classified (Q90-Q99)', NULL, 'Chapter 17: Congenital malformations, deformations and chromosomal abnormalities (Q00-Q99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Q91', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('Q91.4', 'Trisomy 13, nonmosaicism (meiotic nondisjunction)', NULL, 'Q90-Q99', 'Chromosomal abnormalities, not elsewhere classified (Q90-Q99)', NULL, 'Chapter 17: Congenital malformations, deformations and chromosomal abnormalities (Q00-Q99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'Q91', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches
- **Data\batches\57_batch.sql** (1037 matches)
  - Unique matches: `icd10_codes`, `icd10`, `score`, `status`
  - Sample context:
    ```
    1: -- Batch 57 of medical_icd10_codes inserts
2: BEGIN;
3: 
    ```
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('S00.24', 'External constriction of eyelid and periocular area', NULL, 'S00-S09', 'Injuries to the head (S00-S09)', NULL, 'Chapter 19: Injury, poisoning and certain other consequences of external causes (S00-T88)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'S00.2', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('S00.241', 'External constriction of right eyelid and periocular area', NULL, 'S00-S09', 'Injuries to the head (S00-S09)', NULL, 'Chapter 19: Injury, poisoning and certain other consequences of external causes (S00-T88)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'S00.24', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('S00.242', 'External constriction of left eyelid and periocular area', NULL, 'S00-S09', 'Injuries to the head (S00-S09)', NULL, 'Chapter 19: Injury, poisoning and certain other consequences of external causes (S00-T88)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'S00.24', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 499 more matches

### Normalization Functions

- Files affected: 22
- Total matches: 138

#### Directory Breakdown

- **Docs\implementation**: 6 files (27.3%)
- **.**: 4 files (18.2%)
- **src\utils\response**: 3 files (13.6%)
- **src\utils\response\normalizer**: 3 files (13.6%)
- **old_code\src\utils\response**: 2 files (9.1%)
- **Data**: 1 files (4.5%)
- **Data\tables**: 1 files (4.5%)
- **old_code**: 1 files (4.5%)
- **src\utils\response\validator**: 1 files (4.5%)

#### Top Affected Files

- **Docs\implementation\normalizer-refactoring.md** (26 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    7: ## Overview
8: 
9: This document details the refactoring of the `utils/response/normalizer.ts` file, which was identified as having multiple functions (2 functions in 89 lines). The refactoring follows the extreme refactoring principles established for the project.
10: 
11: ## Original Structure
    ```
    ```
    11: ## Original Structure
12: 
13: The original `normalizer.ts` file contained:
14: 
15: 1. Two functions:
    ```
    ... and 21 more matches
- **old_code\response-processing.ts** (26 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    54:     
55:     // Normalize field names (handle potential casing issues)
56:     const normalizedResponse = normalizeResponseFields(parsedResponse);
57:     
58:     // Validate required fields
    ```
    ```
    57:     
58:     // Validate required fields
59:     validateRequiredFields(normalizedResponse);
60:     
61:     // Ensure validationStatus is a valid enum value
    ```
    ... and 18 more matches
- **src\utils\response\processor.ts** (19 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    1: import { ValidationResult, ValidationStatus } from '../../models';
2: import { normalizeResponseFields, normalizeCodeArray } from './normalizer';
3: import { validateRequiredFields, validateValidationStatus } from './validator';
4: import { extractPartialInformation } from './extractor';
    ```
    ```
    39:     
40:     // Normalize field names (handle potential casing issues)
41:     const normalizedResponse = normalizeResponseFields(parsedResponse);
42:     
43:     // Validate required fields
    ```
    ... and 10 more matches
- **Docs\implementation\response-processing-refactoring.md** (10 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    19: }
20: 
21: function normalizeResponseFields(response: any): any {
22:   // 50+ lines of code
23: }
    ```
    ```
    31: }
32: 
33: function normalizeCodeArray(codes: any): Array<{ code: string; description: string }> {
34:   // 30+ lines of code
35: }
    ```
    ... and 4 more matches
- **src\utils\response\normalizer\index.ts** (9 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    1: /**
2:  * Response normalizer functions
3:  */
4: 
    ```
    ```
    4: 
5: // Import functions
6: import { normalizeResponseFields } from './normalize-response-fields';
7: import { normalizeCodeArray } from './normalize-code-array';
8: 
    ```
    ... and 5 more matches
- **old_code\src\utils\response\normalizer.ts** (8 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    4:  * Normalize response field names to handle casing issues
5:  */
6: export function normalizeResponseFields(response: any): any {
7:   const normalized: any = {};
8:   
    ```
    ```
    5:  */
6: export function normalizeResponseFields(response: any): any {
7:   const normalized: any = {};
8:   
9:   // Map of possible field names to normalized field names
    ```
    ... and 5 more matches
- **src\utils\response\normalizer\normalize-response-fields.ts** (7 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    4:  * Normalize response field names to handle casing issues
5:  */
6: export function normalizeResponseFields(response: any): any {
7:   const normalized: any = {};
8:   
    ```
    ```
    5:  */
6: export function normalizeResponseFields(response: any): any {
7:   const normalized: any = {};
8:   
9:   // Map of possible field names to normalized field names
    ```
    ... and 4 more matches
- **package-lock.json** (5 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    3203:       "license": "ISC",
3204:       "dependencies": {
3205:         "normalize-path": "^3.0.0",
3206:         "picomatch": "^2.0.4"
3207:       },
    ```
    ```
    3707:         "is-binary-path": "~2.1.0",
3708:         "is-glob": "~4.0.1",
3709:         "normalize-path": "~3.0.0",
3710:         "readdirp": "~3.6.0"
3711:       },
    ```
    ... and 2 more matches
- **Docs\implementation\refactoring-plan.md** (4 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    116:     - index.ts
117: 
118: 13. [DONE] `utils/response/normalizer.ts` (2 functions, 89 lines) - refactored into normalizer/ directory with:
119:     - normalize-response-fields.ts
120:     - normalize-code-array.ts
    ```
    ```
    117: 
118: 13. [DONE] `utils/response/normalizer.ts` (2 functions, 89 lines) - refactored into normalizer/ directory with:
119:     - normalize-response-fields.ts
120:     - normalize-code-array.ts
121:     - index.ts
    ```
    ... and 1 more matches
- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (3 matches)
  - Unique matches: `normalize`
  - Sample context:
    ```
    48180: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (136, 'E20.0', '70551', 6, 'Moderate', 'Bollerslev J, et al. European Society of Endocrinology Clinical Guideline: Treatment of chronic hypoparathyroidism in adults. Eur J Endocrinol. 2023;188(6):G33-G54. Section 5.4, p.G45.', 'ESE_2023_Chronic_Hypoparathyroidism', 'Brain MRI without contrast is moderately appropriate (6/9) for idiopathic hypoparathyroidism in specific scenarios. Most valuable when: (1) neurological symptoms persist despite calcium normalization (serum calcium <8.5 mg/dL); (2) seizures occur without metabolic explanation; (3) cognitive changes develop over time. While CT is superior for detecting basal ganglia calcifications (sensitivity 98% vs 35% for MRI), MRI better evaluates associated brain parenchymal changes and white matter abnormalities (sensitivity 87% vs 43% for CT). MRI should be considered when patients demonstrate persistent neurological symptoms despite calcium levels >7.5 mg/dL, phosphate <5.5 mg/dL, and normal magnesium levels. MRI offers zero radiation exposure compared to head CT (2-4 mSv). Timing recommendation: perform after biochemical confirmation of hypoparathyroidism (PTH <15 pg/mL with hypocalcemia) and following initial calcium/vitamin D replacement therapy. Guidelines: The ACR Appropriateness Criteria(R) does not have a specific rating for brain MRI in idiopathic hypoparathyroidism.
48181: 
48182: The ESE guidelines recommend neuroimaging in patients with chronic hypoparathyroidism who develop neurological symptoms, noting that while CT is preferred for calcifications, MRI may be valuable for evaluating other neurological manifestations.', 'Brain MRI without contrast is moderately appropriate (6/9) for idiopathic hypoparathyroidism. Most valuable for evaluating persistent neurological symptoms, seizures, or cognitive changes despite normalized calcium levels. While less sensitive than CT for calcifications (35% vs 98%), MRI better detects parenchymal and white matter changes with zero radiation exposure.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
48183: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (160, 'E34.9', '74170', 7, 'Moderate', 'ACR Appropriateness Criteria(R): Incidental Adrenal Mass, 2022, p.3-5', 'ACR_2022_Incidental_Adrenal_Masses', 'CT of the adrenal glands with and without contrast (74170) for unspecified endocrine disorder (E34.9) is most appropriate when: 1) Evaluating adrenal masses >1cm detected on prior imaging; 2) Investigating suspected adrenal adenoma with washout protocol (>60% absolute washout or >40% relative washout indicating benign adenoma); 3) Assessing for pheochromocytoma in patients with plasma metanephrines >4x upper limit of normal; 4) Evaluating Cushing''s syndrome with ACTH levels <5 pg/mL or >20 pg/mL with failed suppression test (cortisol >1.8 microg/dL). Less appropriate for vague endocrine symptoms without biochemical confirmation. Radiation dose is approximately 8-10 mSv, higher than MRI (0 mSv) but with superior spatial resolution (0.5mm vs 2-3mm). CT sensitivity for adrenal masses is 95-100% vs 90-95% for MRI, though MRI offers better tissue characterization for lesions >1cm. Should be performed within 4 weeks of biochemical diagnosis. Guidelines: The ACR rates CT adrenal with and without contrast as 8/9 for characterization of indeterminate adrenal masses >1cm. For suspected functional adrenal disorders, the Endocrine Society Clinical Practice Guidelines (2016) recommend CT with contrast as first-line imaging (strong recommendation, moderate evidence) after biochemical confirmation, particularly for primary aldosteronism, Cushing''s syndrome, and pheochromocytoma. The non-specific nature of E34.9 reduces the appropriateness rating slightly to 7/9.', 'CT adrenal with and without contrast is usually appropriate (7/9) for unspecified endocrine disorders when biochemical testing suggests specific adrenal pathology. Most valuable for characterizing adrenal masses >1cm and determining functional status. Limited utility without biochemical confirmation, and MRI may be preferred in young patients to avoid radiation exposure.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
48184: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (138, 'E21.3', '78072', 9, 'High', 'ACR Appropriateness Criteria(R) Parathyroid Imaging, 2022, p.3-5', 'ACR_2022_Parathyroid_Imaging', 'CPT 78072 is a valid code for parathyroid scintigraphy with SPECT/CT, highly appropriate (9/9) for hyperparathyroidism (E21.3). Most valuable for: (1) biochemically confirmed primary hyperparathyroidism (PTH >65 pg/mL, calcium >10.5 mg/dL) requiring surgical intervention; (2) persistent/recurrent hyperparathyroidism after failed surgery; (3) preoperative localization before minimally invasive parathyroidectomy. SPECT/CT demonstrates superior sensitivity (88-90%) and specificity (94-98%) compared to planar imaging alone (sensitivity 60-80%, specificity 75-90%) or ultrasound (sensitivity 76-82%, specificity 85-90%). Radiation exposure is moderate (5-8 mSv), lower than 4D-CT (10-15 mSv). Optimal timing: within 3 months before planned surgical intervention, with imaging performed 15-20 minutes after radiotracer injection for early phase and 1.5-2 hours for delayed phase. Guidelines: The ACR rates 99mTc-sestamibi SPECT/CT as 9/9 (usually appropriate) for preoperative localization in biochemically confirmed primary hyperparathyroidism. The Society of Nuclear Medicine and Molecular Imaging (SNMMI) and European Association of Nuclear Medicine (EANM) 2021 practice guidelines strongly recommend SPECT/CT as the preferred nuclear medicine technique for parathyroid adenoma localization, citing improved anatomical correlation and reduced false positives compared to planar imaging alone.', 'Parathyroid SPECT/CT is highly appropriate (9/9) for hyperparathyroidism, particularly for preoperative localization of adenomas in biochemically confirmed disease (elevated PTH >65 pg/mL, calcium >10.5 mg/dL). It offers superior sensitivity/specificity over planar imaging or ultrasound alone, with moderate radiation exposure (5-8 mSv), and is most valuable before minimally invasive parathyroidectomy or for persistent/recurrent disease.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
    ```
    ```
    51460: 
51461: Evidence_Source: Yates M, et al. BSR guideline on the management of polymyalgia rheumatica. Rheumatology. 2023;62(5):1618-1628.', 'Musculoskeletal ultrasound is highly appropriate (8/9) for PMR evaluation, particularly when patients present with bilateral shoulder/hip pain, elevated inflammatory markers (ESR >40mm/hr), and age >50 years. Key advantages include detection of characteristic findings (subacromial-subdeltoid bursitis >2mm, biceps tenosynovitis >1mm) without radiation, though sensitivity decreases after steroid initiation.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
51462: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (856, 'M35.3', '73221', 7, 'Moderate', 'Dejaco C, et al. 2023 EULAR/ACR points to consider for the use of imaging in the diagnosis and management of polymyalgia rheumatica. Ann Rheum Dis. 2023;82(6):748-757.', 'EULAR_ACR_2023_PMR_Imaging', 'MRI is valuable in PMR when ultrasound findings are equivocal or when deeper tissue assessment is needed. Most appropriate when: 1) Atypical presentation with shoulder/hip pain but ESR <40mm/hr or CRP <10mg/L; 2) Suspected concurrent disorders (rotator cuff pathology, labral tears); 3) Poor response to corticosteroids (<70% symptom improvement after 2 weeks of prednisone 15mg daily). MRI demonstrates peribursal edema (>3mm thickness), glenohumeral synovitis, and hip synovitis with sensitivity of 85-95% compared to ultrasound (70-80%). Ultrasound remains first-line (no radiation, cost-effective at $100-200 vs. MRI $800-1200). MRI is recommended after 2-4 weeks of inadequate treatment response or when symptoms persist despite normalized inflammatory markers. Guidelines: The ACR Appropriateness Criteria(R) rates MRI for PMR as 7/9 when ultrasound is inconclusive or unavailable.
51463: 
51464: The guidelines recommend ultrasound as first-line imaging, with MRI reserved for cases with diagnostic uncertainty or atypical features, particularly when evaluating for alternative diagnoses.', 'MRI for PMR is appropriate (7/9) primarily when: ultrasound is inconclusive, atypical clinical features exist, or treatment response is suboptimal. MRI offers superior soft tissue contrast for detecting subtle inflammatory changes but is limited by cost and accessibility. Patient selection should prioritize cases with diagnostic uncertainty or suspected alternative pathology.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
    ```
    ... and 1 more matches

### JSON Structure Handling

- Files affected: 37
- Total matches: 131

#### Directory Breakdown

- **.**: 6 files (16.2%)
- **tests**: 5 files (13.5%)
- **tests\batch**: 4 files (10.8%)
- **tests\e2e**: 4 files (10.8%)
- **old_code**: 3 files (8.1%)
- **src\utils\llm\providers**: 3 files (8.1%)
- **Docs\implementation**: 2 files (5.4%)
- **Docs**: 1 files (2.7%)
- **old_code\src\services\order\validation**: 1 files (2.7%)
- **old_code\src\services\order**: 1 files (2.7%)
- **old_code\src\services**: 1 files (2.7%)
- **src\controllers\order-management\handlers**: 1 files (2.7%)
- **src\services\order\admin**: 1 files (2.7%)
- **src\services\order\radiology\export**: 1 files (2.7%)
- **src\services\order\validation\attempt-tracking**: 1 files (2.7%)
- **src\services\validation**: 1 files (2.7%)
- **src\utils\response**: 1 files (2.7%)

#### Top Affected Files

- **tests\stripe-webhooks.test.js** (14 matches)
  - Unique matches: `JSON.stringify`, `JSON.parse`
  - Sample context:
    ```
    30:   const timestamp = Math.floor(Date.now() / 1000);
31:   
32:   // Important: Use the exact same JSON.stringify result for both signature generation and the request
33:   // Different JSON.stringify calls can produce slightly different results due to whitespace/ordering
34:   const payloadString = JSON.stringify(payload);
    ```
    ```
    31:   
32:   // Important: Use the exact same JSON.stringify result for both signature generation and the request
33:   // Different JSON.stringify calls can produce slightly different results due to whitespace/ordering
34:   const payloadString = JSON.stringify(payload);
35:   
    ```
    ... and 12 more matches
- **old_code\response-processing.ts** (12 matches)
  - Unique matches: `jsonContent`, `jsonBlockMatch`, `jsonObjectMatch`, `JSON.parse`
  - Sample context:
    ```
    14:     // Extract JSON from the response
15:     // The response might be wrapped in markdown code blocks like ```json ... ```
16:     let jsonContent = responseContent;
17:     
18:     // Try to extract JSON from code blocks
    ```
    ```
    17:     
18:     // Try to extract JSON from code blocks
19:     const jsonBlockMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
20:     if (jsonBlockMatch) {
21:       jsonContent = jsonBlockMatch[1].trim();
    ```
    ... and 7 more matches
- **src\utils\response\processor.ts** (12 matches)
  - Unique matches: `jsonContent`, `jsonBlockMatch`, `jsonObjectMatch`, `JSON.parse`
  - Sample context:
    ```
    13:     // Extract JSON from the response
14:     // The response might be wrapped in markdown code blocks like ```json ... ```
15:     let jsonContent = responseContent;
16:     
17:     // Try to extract JSON from code blocks
    ```
    ```
    16:     
17:     // Try to extract JSON from code blocks
18:     const jsonBlockMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
19:     if (jsonBlockMatch) {
20:       jsonContent = jsonBlockMatch[1].trim();
    ```
    ... and 7 more matches
- **test-direct-prompt.js** (11 matches)
  - Unique matches: `jsonBlockMatch`, `jsonObjectMatch`, `JSON.stringify`, `jsonContent`, `JSON.parse`
  - Sample context:
    ```
    104:   
105:   // Try to extract JSON from code blocks
106:   const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
107:   if (jsonBlockMatch) {
108:     return jsonBlockMatch[1].trim();
    ```
    ```
    105:   // Try to extract JSON from code blocks
106:   const jsonBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
107:   if (jsonBlockMatch) {
108:     return jsonBlockMatch[1].trim();
109:   }
    ```
    ... and 8 more matches
- **tests\e2e\test-helpers.js** (11 matches)
  - Unique matches: `JSON.parse`, `JSON.stringify`
  - Sample context:
    ```
    45:   let data = {};
46:   if (fs.existsSync(dataFile)) {
47:     data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
48:   }
49:   
    ```
    ```
    49:   
50:   data[key] = value;
51:   fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
52:   
53:   return value;
    ```
    ... and 9 more matches
- **tests\llm-validation-flow-test.js** (8 matches)
  - Unique matches: `JSON.stringify`
  - Sample context:
    ```
    168: function logResult(testCase, result) {
169:   const logFile = path.join(resultsDir, `${testCase.id}-result.json`);
170:   fs.writeFileSync(logFile, JSON.stringify(result, null, 2));
171:   console.log(`Results for test case ${testCase.id} saved to ${logFile}`);
172: }
    ```
    ```
    217:     console.error(`Error generating dictation: ${error.message}`);
218:     if (error.response) {
219:       console.error(`Response data: ${JSON.stringify(error.response.data)}`);
220:     }
221:     throw error;
    ```
    ... and 6 more matches
- **tests\file-upload.test.js** (6 matches)
  - Unique matches: `JSON.stringify`
  - Sample context:
    ```
    22: 
23:   if (body) {
24:     options.body = JSON.stringify(body);
25:   }
26: 
    ```
    ```
    52:     
53:     // Log the response for debugging
54:     console.log('Presigned URL Response:', JSON.stringify(response, null, 2));
55:     
56:     // Assertions
    ```
    ... and 4 more matches
- **test-validation-engine.js** (4 matches)
  - Unique matches: `JSON.stringify`
  - Sample context:
    ```
    35:         'Authorization': `Bearer ${JWT_TOKEN}`
36:       },
37:       body: JSON.stringify({
38:         dictationText: testCase.dictation,
39:         patientInfo: {
    ```
    ```
    63:       console.log(`Compliance Score: ${result.complianceScore}`);
64:       console.log(`Feedback: ${result.feedback ? result.feedback.substring(0, 100) + '...' : 'N/A'}`);
65:       console.log(`Suggested ICD-10 Codes: ${JSON.stringify(result.suggestedICD10Codes || [])}`);
66:       console.log(`Suggested CPT Codes: ${JSON.stringify(result.suggestedCPTCodes || [])}`);
67:       
    ```
    ... and 2 more matches
- **old_code\llm-client.ts** (3 matches)
  - Unique matches: `JSON.stringify`
  - Sample context:
    ```
    115:         'anthropic-version': '2023-06-01'
116:       },
117:       body: JSON.stringify({
118:         model: modelName,
119:         max_tokens: config.llm.maxTokens,
    ```
    ```
    171:         'Authorization': `Bearer ${apiKey}`
172:       },
173:       body: JSON.stringify({
174:         model: modelName,
175:         messages: [
    ```
    ... and 1 more matches
- **src\services\order\admin\test-emr-parser.js** (3 matches)
  - Unique matches: `JSON.stringify`
  - Sample context:
    ```
    16: console.log('Test Case 1:');
17: const result1 = parseEmrSummary(text1);
18: console.log(JSON.stringify(result1, null, 2));
19: 
20: // Test case 2: Extract insurance information
    ```
    ```
    30: console.log('\nTest Case 2:');
31: const result2 = parseEmrSummary(text2);
32: console.log(JSON.stringify(result2, null, 2));
33: 
34: // Test case 3: Handle different formats of information
    ```
    ... and 1 more matches

### Field Mapping and Transformation

- Files affected: 93
- Total matches: 431

#### Directory Breakdown

- **.**: 13 files (14.0%)
- **Docs\implementation**: 9 files (9.7%)
- **old_code**: 8 files (8.6%)
- **tests\e2e**: 7 files (7.5%)
- **src\utils\text-processing\medical-terms**: 4 files (4.3%)
- **tests\batch**: 4 files (4.3%)
- **src\utils\text-processing\keyword-extractor**: 3 files (3.2%)
- **old_code\src\utils\response**: 2 files (2.2%)
- **src\controllers\radiology**: 2 files (2.2%)
- **src\services\order\admin\patient**: 2 files (2.2%)
- **src\services\order\admin\patient-manager**: 2 files (2.2%)
- **src\services\order\admin\utils\query-builder**: 2 files (2.2%)
- **src\utils\database**: 2 files (2.2%)
- **src\utils\response**: 2 files (2.2%)
- **src\utils\response\normalizer**: 2 files (2.2%)
- **src\utils\response\validator**: 2 files (2.2%)
- **tests**: 2 files (2.2%)
- **Docs**: 1 files (1.1%)
- **old_code\src\controllers**: 1 files (1.1%)
- **old_code\src\middleware**: 1 files (1.1%)
- **old_code\src\services\billing\stripe**: 1 files (1.1%)
- **old_code\src\services\order\admin**: 1 files (1.1%)
- **old_code\src\services\order\admin\utils**: 1 files (1.1%)
- **old_code\src\services\order\radiology\export**: 1 files (1.1%)
- **old_code\src\services\order\radiology**: 1 files (1.1%)
- **old_code\src\services**: 1 files (1.1%)
- **old_code\src\utils\text-processing**: 1 files (1.1%)
- **src\controllers\auth**: 1 files (1.1%)
- **src\controllers\connection**: 1 files (1.1%)
- **src\controllers\order-management\handlers**: 1 files (1.1%)
- **src\controllers\uploads**: 1 files (1.1%)
- **src\middleware\auth**: 1 files (1.1%)
- **src\services\billing\stripe\webhooks\handle-invoice-payment-failed**: 1 files (1.1%)
- **src\services\connection\services**: 1 files (1.1%)
- **src\services\order\admin**: 1 files (1.1%)
- **src\services\order\admin\handlers**: 1 files (1.1%)
- **src\services\order\admin\__tests__**: 1 files (1.1%)
- **src\services\order\radiology\export\csv-export**: 1 files (1.1%)
- **src\services\order\radiology\order-export**: 1 files (1.1%)
- **src\services\superadmin\users**: 1 files (1.1%)
- **src\services\upload**: 1 files (1.1%)
- **src\services\validation**: 1 files (1.1%)

#### Top Affected Files

- **tests\e2e\test-helpers.js** (46 matches)
  - Unique matches: `join(`, `toLowerCase(`, `split(`
  - Sample context:
    ```
    14: const config = {
15:   baseUrl: testConfig.api.baseUrl,
16:   resultsDir: path.join(__dirname, '../../test-results/e2e')
17: };
18: 
    ```
    ```
    32:   // Append to scenario-specific log if provided
33:   if (scenarioName) {
34:     const logFile = path.join(config.resultsDir, `${scenarioName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.log`);
35:     fs.appendFileSync(logFile, logMessage + '\n');
36:   }
    ```
    ... and 41 more matches
- **Docs\physician_dictation_experience_with_override_schema_update.md** (38 matches)
  - Unique matches: `map(`, `trim(`, `join(`, `toLowerCase(`, `split(`
  - Sample context:
    ```
    36:     <nav aria-label="Progress">
37:       <ol role="list" className="flex items-center space-x-2 sm:space-x-3">
38:         {steps.map((step, stepIdx) => (
39:           <li key={step.name} className={cn('flex items-center', stepIdx !== steps.length - 1 ? 'pr-2 sm:pr-3' : '')}>
40:             {step.id < currentStep ? (
    ```
    ```
    136:   const validateForm = (): boolean => {
137:     // Name is required
138:     if (!name.trim()) {
139:       toast({
140:         title: "Missing Information",
    ```
    ... and 33 more matches
- **old_code\admin-order.service.ts** (23 matches)
  - Unique matches: `join(`, `fieldMap`, `Object.entries`, `trim(`
  - Sample context:
    ```
    96:           const patientUpdateQuery = `
97:             UPDATE patients
98:             SET ${patientUpdateFields.join(', ')}, updated_at = NOW()
99:             WHERE id = $${valueIndex}
100:           `;
    ```
    ```
    146:             const insuranceUpdateQuery = `
147:               UPDATE patient_insurance
148:               SET ${insuranceUpdateFields.join(', ')}, updated_at = NOW()
149:               WHERE id = $${valueIndex}
150:             `;
    ```
    ... and 21 more matches
- **check-refactored-files.js** (19 matches)
  - Unique matches: `join(`
  - Sample context:
    ```
    27:     if (fs.statSync(refactoredPath).isDirectory()) {
28:       const files = fs.readdirSync(refactoredPath);
29:       console.log(`   Files in directory: ${files.join(', ')}`);
30:     }
31:   } else {
    ```
    ```
    39:   checkExists(
40:     '1. Auth Middleware',
41:     path.join('src', 'middleware', 'auth.middleware.ts'),
42:     path.join('src', 'middleware', 'auth')
43:   );
    ```
    ... and 17 more matches
- **old_code\response-processing.ts** (18 matches)
  - Unique matches: `trim(`, `fieldMap`, `Object.entries`, `toLowerCase(`, `join(`, `statusMap`, `map(`, `split(`
  - Sample context:
    ```
    19:     const jsonBlockMatch = responseContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
20:     if (jsonBlockMatch) {
21:       jsonContent = jsonBlockMatch[1].trim();
22:     }
23:     
    ```
    ```
    26:       const jsonObjectMatch = responseContent.match(/(\{[\s\S]*\})/);
27:       if (jsonObjectMatch) {
28:         jsonContent = jsonObjectMatch[1].trim();
29:       }
30:     }
    ```
    ... and 14 more matches
- **old_code\database-context.ts** (14 matches)
  - Unique matches: `map(`, `join(`, `toLowerCase(`
  - Sample context:
    ```
    60:     SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
61:     FROM medical_icd10_codes
62:     WHERE ${keywords.map((_, index) => 
63:       `description ILIKE $${index + 1} OR 
64:        clinical_notes ILIKE $${index + 1} OR 
    ```
    ```
    64:        clinical_notes ILIKE $${index + 1} OR 
65:        keywords ILIKE $${index + 1}`
66:     ).join(' OR ')}
67:     LIMIT 10
68:   `;
    ```
    ... and 12 more matches
- **src\utils\database\context-generator.ts** (12 matches)
  - Unique matches: `map(`, `join(`
  - Sample context:
    ```
    22:     SELECT icd10_code, description, clinical_notes, imaging_modalities, primary_imaging
23:     FROM medical_icd10_codes
24:     WHERE ${keywords.map((_, index) => 
25:       `description ILIKE $${index + 1} OR 
26:        clinical_notes ILIKE $${index + 1} OR 
    ```
    ```
    26:        clinical_notes ILIKE $${index + 1} OR 
27:        keywords ILIKE $${index + 1}`
28:     ).join(' OR ')}
29:     LIMIT 10
30:   `;
    ```
    ... and 10 more matches
- **Docs\implementation\query-builder-refactoring.md** (10 matches)
  - Unique matches: `fieldMap`, `Object.entries`, `join(`
  - Sample context:
    ```
    57:  * @param idField Name of the ID field (default: 'id')
58:  * @param idValue Value of the ID
59:  * @param fieldMap Optional mapping of object keys to database columns
60:  * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
61:  * @param returnFields Fields to return (default: ['id'])
    ```
    ```
    67:   idField: string = 'id',
68:   idValue: any,
69:   fieldMap?: { [key: string]: string },
70:   includeTimestamp: boolean = true,
71:   returnFields: string[] = ['id']
    ```
    ... and 7 more matches
- **old_code\src\services\order\admin\utils\query-builder.ts** (10 matches)
  - Unique matches: `fieldMap`, `Object.entries`, `join(`
  - Sample context:
    ```
    17:  * @param idField Name of the ID field (default: 'id')
18:  * @param idValue Value of the ID
19:  * @param fieldMap Optional mapping of object keys to database columns
20:  * @param includeTimestamp Whether to include updated_at = NOW() (default: true)
21:  * @param returnFields Fields to return (default: ['id'])
    ```
    ```
    27:   idField: string = 'id',
28:   idValue: any,
29:   fieldMap?: { [key: string]: string },
30:   includeTimestamp: boolean = true,
31:   returnFields: string[] = ['id']
    ```
    ... and 7 more matches
- **src\services\order\admin\emr-parser.ts** (10 matches)
  - Unique matches: `trim(`
  - Sample context:
    ```
    17:   const addressMatch = text.match(addressRegex);
18:   if (addressMatch) {
19:     parsedData.patientInfo!.address = addressMatch[1]?.trim();
20:     parsedData.patientInfo!.city = addressMatch[2]?.trim();
21:     parsedData.patientInfo!.state = addressMatch[3]?.trim();
    ```
    ```
    18:   if (addressMatch) {
19:     parsedData.patientInfo!.address = addressMatch[1]?.trim();
20:     parsedData.patientInfo!.city = addressMatch[2]?.trim();
21:     parsedData.patientInfo!.state = addressMatch[3]?.trim();
22:     parsedData.patientInfo!.zipCode = addressMatch[4]?.trim();
    ```
    ... and 8 more matches

### Validation and Verification

- Files affected: 283
- Total matches: 1086

#### Directory Breakdown

- **Docs\implementation**: 45 files (15.9%)
- **Docs**: 27 files (9.5%)
- **.**: 23 files (8.1%)
- **Data\batches**: 18 files (6.4%)
- **test-results\llm-validation**: 18 files (6.4%)
- **tests\e2e**: 11 files (3.9%)
- **old_code**: 7 files (2.5%)
- **tests\batch**: 7 files (2.5%)
- **tests**: 6 files (2.1%)
- **src\controllers\location\organization**: 5 files (1.8%)
- **src\controllers\uploads**: 5 files (1.8%)
- **src\services\order\admin\handlers**: 5 files (1.8%)
- **src\utils\text-processing\medical-terms**: 5 files (1.8%)
- **src\controllers\connection**: 4 files (1.4%)
- **src\controllers\order-management\validation**: 4 files (1.4%)
- **src\services\billing\stripe**: 4 files (1.4%)
- **old_code\src\services\order\admin**: 3 files (1.1%)
- **src\controllers\connection\validation-utils**: 3 files (1.1%)
- **src\controllers\location\user**: 3 files (1.1%)
- **src\controllers\order-management\handlers**: 3 files (1.1%)
- **src\middleware\auth**: 3 files (1.1%)
- **src\routes**: 3 files (1.1%)
- **src\services\auth\organization**: 3 files (1.1%)
- **src\services\auth\user**: 3 files (1.1%)
- **src\services\billing\stripe\webhooks**: 3 files (1.1%)
- **src\services\connection\queries\request**: 3 files (1.1%)
- **src\services\order\admin\order-status-manager**: 3 files (1.1%)
- **src\services\order\radiology\order-export**: 3 files (1.1%)
- **src\utils\response\validator**: 3 files (1.1%)
- **Data\tables**: 2 files (0.7%)
- **old_code\src\utils\text-processing**: 2 files (0.7%)
- **src\controllers\billing**: 2 files (0.7%)
- **src\controllers**: 2 files (0.7%)
- **src\services\billing\credit**: 2 files (0.7%)
- **src\services\location**: 2 files (0.7%)
- **src\services\order\admin\clinical-record-manager**: 2 files (0.7%)
- **src\services\order\admin\validation\insurance**: 2 files (0.7%)
- **src\services\order\admin\validation\patient**: 2 files (0.7%)
- **src\services\order\finalize\authorization**: 2 files (0.7%)
- **src\utils\response**: 2 files (0.7%)
- **src\utils\text-processing\keyword-extractor**: 2 files (0.7%)
- **Data**: 1 files (0.4%)
- **Docs\prompt_examples**: 1 files (0.4%)
- **old_code\src\controllers\connection**: 1 files (0.4%)
- **old_code\src\middleware**: 1 files (0.4%)
- **old_code\src\services\billing\stripe**: 1 files (0.4%)
- **old_code\src\services\order\radiology**: 1 files (0.4%)
- **old_code\src\services\order**: 1 files (0.4%)
- **old_code\src\utils\response**: 1 files (0.4%)
- **src\controllers\location**: 1 files (0.4%)
- **src**: 1 files (0.4%)
- **src\models\order**: 1 files (0.4%)
- **src\services\billing**: 1 files (0.4%)
- **src\services\connection\queries**: 1 files (0.4%)
- **src\services\location\queries\deactivate**: 1 files (0.4%)
- **src\services\location\queries\update**: 1 files (0.4%)
- **src\services\location\queries\user**: 1 files (0.4%)
- **src\services\location\user**: 1 files (0.4%)
- **src\services\order\admin\types**: 1 files (0.4%)
- **src\services\order\admin\validation**: 1 files (0.4%)
- **src\services\order\admin\__tests__**: 1 files (0.4%)
- **src\services\order\finalize\transaction**: 1 files (0.4%)
- **src\services\order\finalize\update**: 1 files (0.4%)
- **src\services\order\radiology\query\order-builder**: 1 files (0.4%)
- **src\services\order\validation**: 1 files (0.4%)
- **src\utils\text-processing\code-extractor\common**: 1 files (0.4%)
- **test-results\e2e**: 1 files (0.4%)

#### Top Affected Files

- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (65 matches)
  - Unique matches: `check`, `verification`, `validate`, `verify`
  - Sample context:
    ```
    46: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('73085', 'Radiologic examination, elbow; arthrography, radiological supervision and interpretation', 'Screen for iodinated contrast allergies. Have emergency medications available. Consider premedication for patients with prior contrast reactions.', 'MRI elbow without contrast (73221), MRI elbow with contrast (73222), MR arthrography elbow (73222 with 24220), CT arthrography elbow (73201 with 24220), Ultrasound elbow (76881/76882)', 'Elbow', 'Diagnostic arthrography', 'Moderate', 'Absolute: Severe contrast allergy. Relative: Pregnancy, active infection at injection site, significant coagulopathy, recent trauma with suspected fracture.', 'Intra-articular iodinated contrast', 'Fluoroscopy unit, sterile tray with syringes, needles, local anesthetic, iodinated contrast, sterile drapes, and personal protective equipment.', 'Fluoroscopic guidance for needle placement and contrast injection. Standard radiographic views include AP, lateral, and oblique projections of the elbow after contrast administration to evaluate joint space, capsule, and ligamentous structures.', 'Unilateral', 'Patient must be able to position the elbow for imaging. May require assistance for patients with limited mobility.', 'X-ray with fluoroscopy', 'Often performed as a preliminary study before MR arthrography or as an alternative when MRI is contraindicated. Provides excellent evaluation of joint space and capsular integrity.', 'No specific preparation required. Patient should remove jewelry and metal objects from the area to be imaged. Informed consent should be obtained.', 'Use weight-based contrast dosing. Consider sedation for young children. Minimize radiation exposure using dose reduction techniques and limited fluoroscopy time.', 'Monitor for delayed contrast reaction for 30 minutes. Patient may resume normal activities. Advise to report persistent pain, swelling, or signs of infection.', '30-45 minutes', 'None', 'Requires radiologist supervision. Separate CPT code 24220 is used for the injection procedure.', 'Low', 'Generally not required for adults. May be considered for pediatric patients or adults with severe anxiety or inability to cooperate.', 'Pregnancy: Perform only if benefits outweigh risks; use abdominal shielding. Elderly: Consider reduced contrast dose for patients with renal impairment.', '0.1-0.3 mSv', 'Joint space abnormalities, loose bodies, osteochondral defects, ligament tears (particularly ulnar collateral ligament), capsular abnormalities, synovial pathology, and communication with adjacent bursae.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
47: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('74249', 'Radiological examination, gastrointestinal tract, upper, air contrast, with specific high density barium, effervescent agent, with or without glucagon; with small intestine follow-through', 'Barium sulfate is generally considered hypoallergenic. Rare allergic reactions to additives in barium preparations may occur. Glucagon may cause nausea, vomiting, or allergic reactions in sensitive individuals.', '74246 (Upper GI series with KUB), 74176 (CT abdomen without contrast), 74177 (CT abdomen with contrast), 74178 (CT abdomen without and with contrast), 74181 (MRI abdomen without contrast), 74183 (MRI abdomen with and without contrast), 78264 (Gastric emptying study), 91110 (Wireless capsule endoscopy)', 'Upper gastrointestinal tract and small intestine', 'Diagnostic Gastrointestinal Imaging', 'Moderate', 'Absolute: Suspected or known perforation of the GI tract, complete obstruction, toxic megacolon. Relative: Recent GI surgery, severe dysphagia, pregnancy (benefit must outweigh risk), suspected aspiration risk, severe debilitation.', 'Positive oral contrast (high-density barium) with effervescent agent', 'Fluoroscopy unit with digital imaging capability, overhead tube for spot radiographs, tilting table, compression paddles, high-density barium sulfate suspension, effervescent agent (typically sodium bicarbonate and tartaric acid), optional glucagon for hypotonia, drinking cups, straws.', 'Patient ingests high-density barium sulfate suspension and effervescent agent to distend the stomach with gas. Fluoroscopic examination of esophagus, stomach, and duodenum is performed with patient in multiple positions. After completion of the double-contrast upper GI portion, additional images are obtained at timed intervals (typically 30, 60, and 120 minutes) to follow the contrast through the small intestine until it reaches the ileocecal valve.', 'Not applicable', 'Requires patient to stand, lie supine, prone, and in oblique positions during the examination. Limited mobility patients may require assistance or modified positioning. Examination table must accommodate patient weight and size.', 'X-ray (Fluoroscopy)', 'This examination combines a double-contrast upper GI study with small bowel follow-through, providing comprehensive evaluation of the upper gastrointestinal tract and small intestine in a single examination. It is particularly useful for evaluating suspected small bowel disease when cross-sectional imaging is not available or contraindicated.', 'NPO (nothing by mouth) for 8-12 hours prior to examination. Clear liquids may be permitted up to 4 hours before the procedure. Medications may be taken with small sips of water. Patients should be instructed to avoid smoking and chewing gum prior to the examination.', 'Modified technique and reduced radiation dose for pediatric patients. Barium concentration and volume adjusted based on patient age and size. Immobilization devices may be necessary for young children. Consider alternative studies with less radiation exposure when appropriate.', 'Resume normal diet unless otherwise instructed. Encourage fluid intake to prevent constipation. Stool may appear white or light-colored for 24-72 hours. Mild laxatives may be recommended if constipation occurs.', '60-120 minutes (includes waiting time for contrast to transit through small bowel)', 'None', 'Requires physician supervision. Documentation of medical necessity required for Medicare reimbursement. Appropriate use criteria (AUC) consultation required under PAMA for advanced diagnostic imaging services.', 'Medium', 'Generally not required. Anxious patients may benefit from mild oral anxiolysis per institutional protocol. Pediatric patients occasionally require sedation based on age and cooperation level.', 'Elderly patients may require assistance with positioning and may have delayed transit times. Pregnant patients should only undergo this examination when benefits clearly outweigh risks; consider ultrasound or MRI as alternatives when possible. Patients with swallowing disorders may require modified techniques.', '3-6 mSv', 'Mucosal abnormalities, ulcerations, masses, strictures, diverticula, hiatal hernia, gastroesophageal reflux, inflammatory changes, motility disorders, small bowel obstruction, Crohn''s disease, malabsorption patterns, and other structural or functional abnormalities of the upper GI tract and small intestine.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
48: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('74400', 'Urography (pyelography), intravenous, with or without KUB, with or without tomography', 'Pre-medication protocol for patients with prior contrast reactions: 13-hour protocol with prednisone 50mg PO at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg PO 1 hour before procedure', 'CT urography (74178), MR urography (74183), Retrograde pyelography (74420), Renal ultrasound (76770), Radionuclide renal scan (78707-78709)', 'Urinary tract', 'Diagnostic urography', 'Moderate', 'Absolute: previous severe reaction to iodinated contrast media, GFR <30 mL/min/1.73m2 (unless emergency). Relative: GFR 30-45 mL/min/1.73m2, pregnancy, breastfeeding, hyperthyroidism, pheochromocytoma, multiple myeloma', 'Intravenous iodinated contrast', 'Radiographic table with overhead tube, digital radiography system, contrast injector, emergency medications and equipment for contrast reactions', 'Scout image, followed by sequential radiographs at specific intervals after IV contrast administration: immediate (nephrogram phase), 5 minutes (pyelogram phase), 15 minutes (ureterogram phase), and post-void images. Additional tomographic images as needed for better visualization', 'Bilateral', 'Patient must be able to remain still in supine position for duration of exam, may require assistance with positioning for post-void images', 'X-ray', 'Largely replaced by CT urography (74178) for most indications, but still useful for specific applications including evaluation of collecting system anatomy and urinary tract dynamics', 'NPO for 4 hours prior to procedure, adequate hydration before contrast administration, serum creatinine check within 30 days for patients with risk factors for renal dysfunction', 'Reduced contrast dose based on weight, consideration of alternative non-contrast studies when possible, tailored radiation dose reduction techniques, may require parental presence for comfort', 'Increased fluid intake for 24 hours, monitor for delayed contrast reactions, observe for signs of contrast-induced nephropathy in high-risk patients', '30-45 minutes', 'None', 'Requires documentation of medical necessity, appropriate use criteria consultation for Medicare patients under PAMA regulations', 'Medium', 'Not routinely required, but may be considered for pediatric patients or adults with severe anxiety or inability to cooperate', 'Pregnancy: consider alternative non-radiation studies when possible. Elderly: increased risk of contrast-induced nephropathy, adjust hydration protocols accordingly. Renal insufficiency: consider alternative imaging or reduced contrast dose', '3-4 mSv', 'Urinary tract obstruction, filling defects, ureteral strictures, congenital anomalies, urinary tract calculi, renal masses, vesicoureteral reflux, urinary extravasation', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
49: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('75559', 'Cardiac MRI for morphology and function without contrast material; with stress imaging', 'No contrast agents used in this procedure. Pharmacologic stress agents (adenosine, regadenoson, dobutamine) may cause adverse reactions in some patients.', '75557 (Cardiac MRI for morphology and function without contrast), 75563 (Cardiac MRI for morphology and function without and with contrast), 78451-78454 (Myocardial perfusion imaging with SPECT), 93350-93352 (Stress echocardiography), 75574 (CT angiography of coronary arteries)', 'Heart', 'Cardiac Imaging', 'High', 'Absolute: Implanted cardiac devices not MRI-compatible, ferromagnetic cerebral aneurysm clips, certain cochlear implants, metal in eyes. Relative: Claustrophobia, inability to lie flat, severe obesity exceeding table weight limit, pregnancy (first trimester), unstable cardiac conditions for stress portion (unstable angina, severe arrhythmias, severe heart failure).', 'No contrast', '1.5T or 3T MRI scanner with cardiac package, ECG gating equipment, cardiac coils, emergency resuscitation equipment, pharmacologic stress agents (adenosine, regadenoson, or dobutamine), monitoring equipment for vital signs during stress portion.', 'Cardiac-gated MRI sequences including cine imaging at rest and during pharmacologic stress (adenosine, regadenoson, or dobutamine). Protocol includes short-axis and long-axis views of the left ventricle, with assessment of wall motion and perfusion during stress. Sequences typically include steady-state free precession (SSFP) cine imaging, T1-weighted imaging, and potentially T2-weighted imaging.', 'Not applicable', 'Patient must lie supine and still for extended periods. Arms positioned above head. Respiratory gating may require breath-holding capabilities. Limited accommodation for severe kyphosis or inability to lie flat.', 'MRI', 'Cardiac MRI with stress provides comprehensive assessment of cardiac function and perfusion without radiation exposure. It is particularly valuable for evaluating ischemic heart disease, cardiomyopathies, and myocardial viability. The stress portion helps identify inducible ischemia.', 'NPO for 4-6 hours prior to exam. Patient should avoid caffeine for 24 hours and medications that may interfere with stress testing as directed by ordering physician. Patients should wear comfortable clothing and remove all metallic objects. Screening for MRI safety contraindications required.', 'Protocol modifications based on patient size and heart rate. Sedation may be required for younger children. Pharmacologic stress agents dosing must be adjusted by weight. Congenital heart disease evaluation is a common indication in pediatric population.', 'Routine post-MRI care. After pharmacologic stress, patients should be monitored until heart rate and blood pressure return to baseline. Patients may resume normal activities and diet immediately after the procedure.', '60-90 minutes', 'None', 'Requires physician supervision during pharmacologic stress portion. Follows ACR Practice Parameter for Performing and Interpreting Cardiac Magnetic Resonance Imaging (MRI).', 'None', 'Generally not required for adults. Light sedation may be considered for patients with severe claustrophobia. Pediatric patients may require sedation based on age and cooperation level.', 'Elderly patients may require additional monitoring during stress portion. Patients with renal dysfunction benefit from this non-contrast protocol. Pregnant patients should undergo risk-benefit assessment, particularly for stress portion.', '0 mSv (no ionizing radiation)', 'Wall motion abnormalities, stress-induced perfusion defects, ventricular function assessment (ejection fraction, volumes, mass), myocardial viability, ischemia, cardiomyopathies, valvular disease, congenital heart defects, and cardiac masses.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
50: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('75573', 'Computed tomographic angiography, heart, coronary arteries and bypass grafts (when present), with contrast material, including 3D image postprocessing (including evaluation of cardiac structure and morphology, assessment of cardiac function, and evaluation of venous structures, if performed)', 'Premedication protocol for patients with history of contrast reactions: typically 13-hour protocol with prednisone 50mg PO at 13, 7, and 1 hour before exam, plus diphenhydramine 50mg PO/IV 1 hour before exam. Emergency medications and equipment must be readily available.', '75571 (Calcium scoring CT), 75574 (CT angiography, heart, coronary arteries only), 78451-78454 (Myocardial perfusion imaging), 93350-93352 (Echocardiography), 93452-93461 (Cardiac catheterization), 75557-75563 (Cardiac MRI)', 'Heart, coronary arteries, and bypass grafts (when present)', 'Cardiac CT Angiography', 'High', 'Absolute: severe renal impairment (eGFR <30 mL/min/1.73m2), history of severe contrast reaction. Relative: pregnancy, moderate renal impairment (eGFR 30-45 mL/min/1.73m2), metformin therapy, hyperthyroidism, multiple myeloma.', 'Intravenous iodinated contrast required', '64+ slice CT scanner with cardiac capabilities, ECG monitoring equipment, dual-head power injector, emergency medications and equipment, 3D post-processing workstation.', 'ECG-gated acquisition with prospective or retrospective gating based on heart rate and rhythm. Contrast timing using bolus tracking or test bolus. Nitroglycerin administration (0.4-0.8mg SL) immediately before scan unless contraindicated. 3D post-processing including multiplanar reformats, maximum intensity projections, and volume rendering.', 'Not applicable', 'Patient must be able to lie flat and hold breath for 10-15 seconds. Arms positioned above head. Weight limit based on scanner specifications (typically 450-500 lbs).', 'CT', 'Provides comprehensive evaluation of coronary anatomy and cardiac structure/function in a single examination. Superior to coronary CTA alone (75574) when functional assessment is needed. Radiation dose optimization techniques should be employed including tube current modulation, prospective gating when possible, and iterative reconstruction.', 'NPO 4 hours prior except medications with small sips of water. Heart rate control with beta-blockers may be required to achieve target heart rate <65 bpm. Avoid caffeine for 12 hours prior. Patient should practice breath-holding. IV access required.', 'Rarely performed in pediatrics; limited to specific indications such as coronary anomalies, Kawasaki disease, or post-operative congenital heart disease. Protocols should be weight-based with dose reduction techniques. Sedation often required for children under 7 years.', 'Observe for 15-30 minutes post-contrast. Encourage oral hydration. Resume normal activities as tolerated. Resume metformin per institutional protocol if applicable.', '15-30 minutes', 'None', 'Requires documented medical necessity. May require prior authorization from insurance. Appropriate use criteria documentation required under PAMA.', 'Medium', 'Not routinely required for adults. Light anxiolysis may be considered for claustrophobic patients. Pediatric patients may require moderate sedation or general anesthesia.', 'Pregnancy: avoid unless absolutely necessary. Renal impairment: consider alternative non-contrast studies or reduced contrast protocols. Elderly: may require more aggressive heart rate control and have higher risk of contrast-induced nephropathy.', '5-15 mSv', 'Coronary artery stenosis, plaque characterization, bypass graft patency, anomalous coronary arteries, cardiac chamber size and function, cardiac masses, pericardial disease, and great vessel abnormalities.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ```
    80: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('87048', 'Culture, bacterial; stool, aerobic, with isolation and preliminary examination (e.g., KIA, LIA), Salmonella and Shigella species', 'Not applicable for sample collection; laboratory personnel should follow standard precautions', 'Molecular testing for gastrointestinal pathogens (87505, 87506, 87507); Stool culture for other pathogens (87045, 87046); Stool ova and parasite exam (87177)', 'Not applicable - This is a stool culture laboratory test', 'Microbiology Laboratory Test', 'Moderate', 'None for sample collection', 'Not applicable', 'Stool collection container, selective and differential media (e.g., MacConkey, XLD, HE agar), biochemical testing materials', 'Not applicable - This is a laboratory procedure', 'Not applicable', 'Patient must be able to provide stool sample; bedside collection may be necessary for immobile patients', 'Not applicable - This is a laboratory procedure, not a diagnostic imaging code', 'CPT code 87048 is a laboratory microbiology code, not a diagnostic imaging code. This test is typically ordered for patients with suspected bacterial gastroenteritis, particularly when Salmonella or Shigella infection is suspected.', 'Collection of stool sample in appropriate sterile container', 'Standard collection procedures apply; may require caregiver assistance for sample collection', 'Not applicable for patient; proper specimen handling and transport to laboratory required', '48-72 hours for complete culture results', 'Not applicable', 'CLIA-certified laboratory required for processing; follows CAP guidelines for microbiology testing', 'None', 'Not applicable', 'Immunocompromised patients may require additional testing; travelers with diarrhea may benefit from this specific testing', '0 mSv (no ionizing radiation)', 'Presence or absence of Salmonella and Shigella species in stool sample', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
81: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('87086', 'Culture, bacterial; quantitative colony count, urine', 'Not applicable for specimen collection. Allergies to antibiotics may affect treatment options based on culture results.', 'Urinalysis (CPT 81001-81003), Urine dipstick (CPT 81000), Urine microscopy (CPT 81015)', 'Urinary System', 'Microbiology', 'Low', 'No absolute contraindications for specimen collection. Recent antibiotic use may affect results and should be noted.', 'Not applicable', 'Sterile urine collection container, transport media if applicable, laboratory culture media and equipment.', 'Not applicable - this is a laboratory test, not an imaging procedure.', 'Not applicable', 'Assistance may be required for specimen collection in patients with limited mobility.', 'Laboratory Test', 'CPT code 87086 is not an imaging procedure but a laboratory test. It is commonly ordered in conjunction with imaging studies for urinary tract evaluation. Bacterial identification and susceptibility testing (CPT 87088) often follows positive cultures.', 'Clean catch midstream urine collection recommended. First morning void preferred for optimal bacterial detection.', 'Collection methods may differ for pediatric patients (e.g., bag collection, catheterization). Lower colony counts may be significant in pediatric populations.', 'No special care required after specimen collection.', '24-72 hours for complete results (laboratory processing time)', 'Not applicable', 'CLIA-certified laboratory required. Results must be interpreted by qualified healthcare provider.', 'None', 'Not applicable', 'Pregnant women, immunocompromised patients, and elderly may have different thresholds for clinical significance of colony counts.', '0 mSv (no ionizing radiation)', 'Quantitative bacterial count reported as colony-forming units (CFU) per mL. >100,000 CFU/mL typically indicates urinary tract infection in appropriate clinical context.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
82: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('91110', 'Gastrointestinal tract imaging, intraluminal (e.g., capsule endoscopy), esophagus through ileum, with interpretation and report', 'No contrast agents used; rare allergic reactions to capsule components', 'Push enteroscopy (CPT 44360); Double-balloon enteroscopy (CPT 44376-44379); CT enterography (CPT 74177); MR enterography (CPT 74183); Small bowel follow-through (CPT 74250)', 'Gastrointestinal Tract (Esophagus through Ileum)', 'Diagnostic Gastrointestinal Imaging', 'Moderate', 'Absolute: known or suspected GI obstruction, strictures, or fistulas; dysphagia; implanted cardiac devices (relative contraindication - check device compatibility); pregnancy (relative); patients unable to undergo MRI if retention is suspected', 'None', 'Ingestible capsule endoscope; data recorder with sensors/belt; workstation with specialized software for image review and interpretation', 'Patient swallows wireless capsule containing camera(s); capsule transmits images to recording device worn by patient; images captured at 2-6 frames per second as capsule traverses GI tract; data downloaded and processed for physician review', 'Not Applicable', 'Patient must be able to swallow capsule; ambulatory during procedure but should avoid strenuous activity; patients with swallowing disorders may require endoscopic placement', 'Capsule Endoscopy', 'Primary use is evaluation of obscure GI bleeding after negative upper and lower endoscopy; also valuable for assessment of small bowel Crohn''s disease, small bowel tumors, and polyposis syndromes; limited by inability to obtain biopsies or provide therapeutic intervention', 'NPO (nothing by mouth) for 8-12 hours prior to procedure; clear liquid diet the day before; bowel preparation may be required; medications that affect GI motility should be discontinued if possible; removal of metal objects from the body', 'Generally safe for children greater than or equal to2 years old who can swallow the capsule; alternative placement methods (endoscopic placement) may be considered for younger children; dose and protocol adjustments based on weight and age', 'Resume normal diet after capsule ingestion; avoid strenuous physical activity during the procedure; avoid MRI for 2 weeks after procedure unless capsule passage is confirmed; return recording equipment as instructed', '8-12 hours for capsule transit; 20-30 minutes for capsule ingestion and setup', 'None', 'FDA-approved device; requires physician interpretation; not considered a radiological procedure but often interpreted by gastroenterologists or radiologists with specialized training', 'None', 'None required for standard procedure; sedation may be needed if endoscopic placement of the capsule is required', 'Elderly patients may have slower transit times; patients with diabetes may have delayed gastric emptying requiring medication; pregnancy is a relative contraindication due to limited safety data', '0 mSv (no ionizing radiation)', 'Small bowel bleeding sources; Crohn''s disease; small bowel tumors; celiac disease; polyposis syndromes; medication-induced small bowel injury; abnormal mucosa; ulcerations; vascular lesions; polyps', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
83: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('92557', 'Comprehensive audiometry threshold evaluation and speech recognition', 'None for standard testing. Ear insert allergies should be noted if applicable.', 'Otoacoustic emissions testing (CPT 92587, 92588), Auditory brainstem response testing (CPT 92585, 92586), Screening audiometry (CPT 92551, 92552)', 'Ear/Auditory System', 'Diagnostic Audiology', 'Moderate', 'Acute ear infection, recent ear surgery, or presence of cerumen impaction may affect results and should be addressed prior to testing.', 'None', 'Calibrated audiometer, sound-treated booth, headphones and/or insert earphones, bone conduction oscillator, patient response button.', 'Pure-tone air conduction thresholds at 250, 500, 1000, 2000, 3000, 4000, 6000, and 8000 Hz; bone conduction thresholds at 250, 500, 1000, 2000, and 4000 Hz; speech recognition threshold (SRT); word recognition testing.', 'Bilateral', 'Patient must be able to sit upright for duration of test. Accommodations may be needed for patients with mobility limitations.', 'Audiometry', 'This is not a radiological procedure but an audiological test. CPT 92557 includes both pure tone audiometry (92553) and speech audiometry (92556). Results are typically displayed on an audiogram.', 'Patient should avoid exposure to loud noises for at least 14 hours prior to testing. Remove hearing aids before testing.', 'Modified protocols may be used for children based on developmental age. Visual reinforcement audiometry or conditioned play audiometry may be employed for younger children.', 'No specific care required. Results should be reviewed with patient and appropriate referrals made based on findings.', '30-45 minutes', 'None', 'Performed by licensed audiologists or qualified healthcare professionals. Medicare covers when medically necessary for diagnostic purposes.', 'None', 'None required', 'Elderly patients may require additional time. Patients with cognitive impairments may need modified testing procedures. Interpreters should be provided for non-English speaking patients.', '0 mSv (no ionizing radiation)', 'Identifies type and degree of hearing loss (conductive, sensorineural, or mixed), speech recognition abilities, and can assist in diagnosing various auditory disorders.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
84: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('93303', 'Transthoracic echocardiography for congenital cardiac anomalies; complete', 'No contrast agents used; no specific allergy considerations.', '93320/93321/93325 (Doppler echocardiography), 93306 (Complete transthoracic echocardiogram with spectral and color Doppler), 75557/75559 (Cardiac MRI without/with contrast), 75571-75574 (Cardiac CT), 93451-93464 (Cardiac catheterization procedures)', 'Heart', 'Diagnostic Cardiovascular Ultrasound', 'High', 'No absolute contraindications. Relative contraindications include inability to position patient appropriately or severe chest wall deformities that limit acoustic windows.', 'None', 'High-resolution ultrasound machine with cardiac capabilities, including 2D, M-mode, color Doppler, and spectral Doppler functions. Cardiac transducers (2-4 MHz for adults, higher frequencies for pediatric patients).', 'Comprehensive 2D and Doppler evaluation of cardiac chambers, valves, great vessels, and septal structures. Multiple acoustic windows including parasternal long-axis, parasternal short-axis, apical four-chamber, apical five-chamber, apical two-chamber, apical three-chamber, subcostal, and suprasternal notch views. Color Doppler, spectral Doppler, and M-mode imaging as appropriate for complete evaluation of congenital anomalies.', 'Not applicable', 'Patient must be able to lie in supine and left lateral decubitus positions. Limited studies may be performed with patient seated or in other positions if mobility is restricted.', 'Ultrasound', 'This code represents a complete echocardiographic evaluation specifically focused on congenital cardiac anomalies. It requires comprehensive imaging and documentation of all cardiac structures with special attention to developmental abnormalities. The examination is more detailed than a standard transthoracic echocardiogram.', 'No specific preparation required. Patient should wear comfortable clothing that allows access to the chest. Fasting is not typically required.', 'Commonly performed in pediatric populations. May require sedation in very young children or infants who cannot cooperate. Higher frequency transducers (5-12 MHz) are typically used. Specialized pediatric cardiac sonographers are recommended.', 'No specific post-procedure care required. Patient may resume normal activities immediately.', '45-60 minutes', 'None', 'Requires interpretation by a qualified physician. Must be performed by or under the supervision of a qualified sonographer. Documentation must include comprehensive assessment of all cardiac structures and function with attention to congenital anomalies.', 'None', 'Generally not required for adults. May be necessary for young children, infants, or patients with developmental disabilities who cannot remain still during the examination.', 'For pregnant patients with congenital heart disease, this study provides valuable information without radiation risk. In elderly patients with undiagnosed congenital anomalies, acoustic windows may be limited by calcification or emphysematous changes.', '0 mSv (no ionizing radiation)', 'Identification and characterization of congenital cardiac anomalies including but not limited to: atrial septal defects, ventricular septal defects, patent ductus arteriosus, coarctation of aorta, tetralogy of Fallot, transposition of great arteries, anomalous pulmonary venous return, Ebstein''s anomaly, and other structural heart defects.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ... and 59 more matches
- **check-refactored-imports.js** (30 matches)
  - Unique matches: `check`
  - Sample context:
    ```
    1: /**
2:  * Script to check which files are being imported - original or refactored
3:  */
4: console.log('Checking which files are being imported...\n');
    ```
    ```
    4: console.log('Checking which files are being imported...\n');
5: 
6: // Helper function to check imports
7: function checkImport(description, originalPath, refactoredPath) {
8:   console.log(`\n${description}:`);
    ```
    ... and 28 more matches
- **package-lock.json** (19 matches)
  - Unique matches: `check`, `validate`
  - Sample context:
    ```
    270:         "@aws-sdk/middleware-bucket-endpoint": "3.775.0",
271:         "@aws-sdk/middleware-expect-continue": "3.775.0",
272:         "@aws-sdk/middleware-flexible-checksums": "3.787.0",
273:         "@aws-sdk/middleware-host-header": "3.775.0",
274:         "@aws-sdk/middleware-location-constraint": "3.775.0",
    ```
    ```
    616:       }
617:     },
618:     "node_modules/@aws-sdk/middleware-flexible-checksums": {
619:       "version": "3.787.0",
620:       "resolved": "https://registry.npmjs.org/@aws-sdk/middleware-flexible-checksums/-/middleware-flexible-checksums-3.787.0.tgz",
    ```
    ... and 13 more matches
- **Docs\implementation\connection-validation-utils-refactoring.md** (18 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    14: 
15: 1. Two functions:
16:    - `validateRelationshipId`: Validates a relationship ID from request parameters
17:    - `validateTargetOrgId`: Validates target organization ID from request body
18: 
    ```
    ```
    15: 1. Two functions:
16:    - `validateRelationshipId`: Validates a relationship ID from request parameters
17:    - `validateTargetOrgId`: Validates target organization ID from request body
18: 
19: 2. No clear separation of concerns between different validation functionalities
    ```
    ... and 14 more matches
- **Docs\implementation\2025-04-13-implementation-summary.md** (16 matches)
  - Unique matches: `validate`, `verification`, `verify`, `check`
  - Sample context:
    ```
    117: 
118: ### Results
119: - Successfully validated orders with the real Validation Engine
120: - Confirmed LLM responses were processed correctly
121: - Verified validation attempts were logged to the PHI database
    ```
    ```
    164: ### Verification
165: - Confirmed Stripe customer creation during organization registration
166: - Verified webhook signature verification
167: - Tested event handling for payment events
168: - Verified BillingService integration with Stripe
    ```
    ... and 10 more matches
- **Docs\implementation\order-status-manager-refactoring.md** (16 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    15: 1. Three functions:
16:    - `updateOrderStatusToRadiology`: Updates order status to pending_radiology
17:    - `validatePatientData`: Validates patient data for required fields
18:    - `validateInsuranceData`: Validates insurance data for required fields
19: 
    ```
    ```
    16:    - `updateOrderStatusToRadiology`: Updates order status to pending_radiology
17:    - `validatePatientData`: Validates patient data for required fields
18:    - `validateInsuranceData`: Validates insurance data for required fields
19: 
20: 2. No clear separation of concerns between status updates and validation
    ```
    ... and 12 more matches
- **Docs\implementation\response-validator-refactoring.md** (16 matches)
  - Unique matches: `validate`
  - Sample context:
    ```
    14: 
15: 1. Two functions:
16:    - `validateRequiredFields`: Validates that all required fields are present in a response
17:    - `validateValidationStatus`: Validates that the validation status is a valid enum value
18: 
    ```
    ```
    15: 1. Two functions:
16:    - `validateRequiredFields`: Validates that all required fields are present in a response
17:    - `validateValidationStatus`: Validates that the validation status is a valid enum value
18: 
19: 2. No clear separation of concerns between different validation functionalities
    ```
    ... and 12 more matches
- **check-refactored-files.js** (15 matches)
  - Unique matches: `check`
  - Sample context:
    ```
    1: /**
2:  * Script to check if original files or refactored directories exist
3:  */
4: const fs = require('fs');
    ```
    ```
    7: console.log('Checking which files/directories exist...\n');
8: 
9: // Helper function to check if file or directory exists
10: function checkExists(description, originalPath, refactoredPath) {
11:   console.log(`\n${description}:`);
    ```
    ... and 13 more matches
- **radorderpad_schema.sql** (14 matches)
  - Unique matches: `verification`, `check`, `validate`
  - Sample context:
    ```
    152: );
153: 
154: -- Table: email_verification_tokens
155: -- Description: Email Verification
156: CREATE TABLE email_verification_tokens (
    ```
    ```
    154: -- Table: email_verification_tokens
155: -- Description: Email Verification
156: CREATE TABLE email_verification_tokens (
157:     id SERIAL PRIMARY KEY,
158:     user_id INTEGER NOT NULL REFERENCES users(id), -- Associated user
    ```
    ... and 10 more matches
- **tests\stripe-webhooks.test.js** (14 matches)
  - Unique matches: `verification`, `check`, `validate`
  - Sample context:
    ```
    62:  */
63: async function sendWebhookRequest(payload, signature) {
64:   // Convert payload to string - this is crucial for Stripe signature verification
65:   const payloadString = JSON.stringify(payload);
66:   
    ```
    ```
    109: // Mock event payloads
110: const mockCheckoutSessionCompleted = {
111:   id: 'evt_test_checkout_completed',
112:   object: 'event',
113:   api_version: '2025-03-31.basil',
    ```
    ... and 12 more matches

### Database Field Access

- Files affected: 367
- Total matches: 102036

#### Directory Breakdown

- **Data\batches**: 94 files (25.6%)
- **Docs\implementation**: 24 files (6.5%)
- **.**: 22 files (6.0%)
- **old_code**: 15 files (4.1%)
- **Docs**: 9 files (2.5%)
- **src\services\order\radiology\details**: 7 files (1.9%)
- **db-migrations**: 6 files (1.6%)
- **src\controllers\radiology**: 6 files (1.6%)
- **src\services\billing\stripe**: 6 files (1.6%)
- **src\services\location**: 6 files (1.6%)
- **src\services\order\radiology\query\order-builder**: 6 files (1.6%)
- **src\controllers\admin-order**: 5 files (1.4%)
- **src\controllers\uploads**: 4 files (1.1%)
- **src\models\order**: 4 files (1.1%)
- **src\services\connection\queries\request**: 4 files (1.1%)
- **src\utils\database**: 4 files (1.1%)
- **tests\e2e**: 4 files (1.1%)
- **Data\tables**: 3 files (0.8%)
- **old_code\src\services\order\admin**: 3 files (0.8%)
- **src\models**: 3 files (0.8%)
- **src\services\billing\stripe\webhooks**: 3 files (0.8%)
- **src\services\location\queries\user**: 3 files (0.8%)
- **src\services\location\user**: 3 files (0.8%)
- **src\services\notification\email-sender**: 3 files (0.8%)
- **src\services\order\admin\clinical-record-manager**: 3 files (0.8%)
- **src\services\order\admin\types**: 3 files (0.8%)
- **src\services\order\radiology**: 3 files (0.8%)
- **src\services**: 3 files (0.8%)
- **src\services\upload**: 3 files (0.8%)
- **src\services\validation**: 3 files (0.8%)
- **src\utils\response**: 3 files (0.8%)
- **tests\batch**: 3 files (0.8%)
- **src\config**: 2 files (0.5%)
- **src\controllers\billing**: 2 files (0.5%)
- **src\controllers\order-management\handlers**: 2 files (0.5%)
- **src\controllers\order-management\validation**: 2 files (0.5%)
- **src\middleware\auth**: 2 files (0.5%)
- **src\services\auth\organization**: 2 files (0.5%)
- **src\services\auth\user**: 2 files (0.5%)
- **src\services\billing\credit**: 2 files (0.5%)
- **src\services\billing\stripe\webhooks\handle-invoice-payment-failed**: 2 files (0.5%)
- **src\services\connection\queries\approve**: 2 files (0.5%)
- **src\services\connection\queries\list**: 2 files (0.5%)
- **src\services\connection\queries\terminate**: 2 files (0.5%)
- **src\services\connection\services**: 2 files (0.5%)
- **src\services\connection\services\request-connection-helpers**: 2 files (0.5%)
- **src\services\notification**: 2 files (0.5%)
- **src\services\notification\templates**: 2 files (0.5%)
- **src\services\order\admin\insurance**: 2 files (0.5%)
- **src\services\order\admin\utils\query-builder**: 2 files (0.5%)
- **src\services\order\radiology\query\order-builder\metadata-filters**: 2 files (0.5%)
- **src\services\order\validation\attempt-tracking**: 2 files (0.5%)
- **src\services\order\validation**: 2 files (0.5%)
- **src\services\superadmin\organizations**: 2 files (0.5%)
- **src\services\superadmin\users**: 2 files (0.5%)
- **src\utils\text-processing**: 2 files (0.5%)
- **tests**: 2 files (0.5%)
- **Data**: 1 files (0.3%)
- **old_code\src\controllers**: 1 files (0.3%)
- **old_code\src\middleware**: 1 files (0.3%)
- **old_code\src\services\billing\stripe**: 1 files (0.3%)
- **old_code\src\services\connection\services**: 1 files (0.3%)
- **old_code\src\services\notification\email-sender**: 1 files (0.3%)
- **old_code\src\services\order\admin\utils**: 1 files (0.3%)
- **old_code\src\services\order\radiology\export**: 1 files (0.3%)
- **old_code\src\services\order\radiology\query\order-builder**: 1 files (0.3%)
- **old_code\src\services\order\validation**: 1 files (0.3%)
- **old_code\src\services\order**: 1 files (0.3%)
- **old_code\src\services**: 1 files (0.3%)
- **old_code\src\utils\text-processing**: 1 files (0.3%)
- **src\controllers\location**: 1 files (0.3%)
- **src\controllers\order-management**: 1 files (0.3%)
- **src\controllers**: 1 files (0.3%)
- **src\controllers\superadmin\users**: 1 files (0.3%)
- **src\services\auth**: 1 files (0.3%)
- **src\services\billing**: 1 files (0.3%)
- **src\services\billing\stripe\webhooks\handle-subscription-updated**: 1 files (0.3%)
- **src\services\connection\queries**: 1 files (0.3%)
- **src\services\connection\queries\reject**: 1 files (0.3%)
- **src\services\connection**: 1 files (0.3%)
- **src\services\location\queries\create**: 1 files (0.3%)
- **src\services\location\queries\deactivate**: 1 files (0.3%)
- **src\services\location\queries\get**: 1 files (0.3%)
- **src\services\location\queries\list**: 1 files (0.3%)
- **src\services\location\queries\update**: 1 files (0.3%)
- **src\services\notification\email-sender\test-mode**: 1 files (0.3%)
- **src\services\order\admin**: 1 files (0.3%)
- **src\services\order\admin\handlers**: 1 files (0.3%)
- **src\services\order\admin\order-status-manager**: 1 files (0.3%)
- **src\services\order\admin\validation\insurance**: 1 files (0.3%)
- **src\services\order\admin\validation\patient**: 1 files (0.3%)
- **src\services\order\admin\__tests__**: 1 files (0.3%)
- **src\services\order\finalize\authorization**: 1 files (0.3%)
- **src\services\order\finalize\transaction**: 1 files (0.3%)
- **src\services\order\finalize**: 1 files (0.3%)
- **src\services\order\finalize\update**: 1 files (0.3%)
- **src\services\order**: 1 files (0.3%)
- **src\services\order\radiology\export\csv-export**: 1 files (0.3%)
- **src\services\order\radiology\query**: 1 files (0.3%)
- **src\utils\llm**: 1 files (0.3%)
- **src\utils\response\normalizer**: 1 files (0.3%)
- **src\utils\text-processing\code-extractor\common**: 1 files (0.3%)
- **src\utils\text-processing\code-extractor\icd10**: 1 files (0.3%)

#### Top Affected Files

- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (49930 matches)
  - Unique matches: `INSERT INTO`, `$100`, `$700`, `$200`, `$1`, `$600`, `$800`, `$2`, `$500`, `$30`, `$400`, `$50`, `$1000`, `$350`, `$300`, `$40`
  - Sample context:
    ```
    37: );
38: 
39: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('36224', 'Selective catheter placement, internal carotid artery, unilateral, with angiography of the ipsilateral intracranial carotid circulation and all associated radiological supervision and interpretation', 'Pre-medication protocol for patients with history of contrast reactions: typically oral prednisone 50mg at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg 1 hour before procedure; alternative contrast agents for severe iodine allergy', 'CTA of head and neck (70496, 70498), MRA of head and neck (70544, 70545, 70546, 70547, 70548, 70549), Carotid duplex ultrasound (93880, 93882), CT perfusion of brain (0042T)', 'Internal carotid artery and intracranial carotid circulation', 'Diagnostic Angiography', 'High', 'Absolute: Uncontrolled coagulopathy, severe contrast allergy without adequate premedication. Relative: Renal insufficiency (eGFR <30 mL/min), pregnancy, uncontrolled hypertension, recent stroke, severe peripheral vascular disease limiting access', 'Iodinated contrast, typically 50-100 mL of low or iso-osmolar contrast', 'Angiography suite with digital subtraction capabilities, power injector, vascular access supplies, catheters (diagnostic catheters, guidewires), hemostatic devices, monitoring equipment, emergency resuscitation equipment', 'Femoral or radial arterial access; selective catheterization of the common carotid artery followed by selective catheterization of the internal carotid artery; digital subtraction angiography with multiple projections (AP, lateral, oblique) to visualize the entire intracranial carotid circulation; may include 3D rotational angiography', 'Unilateral', 'Patient must remain supine and immobile during procedure; head stabilization may be required; post-procedure immobilization of access site necessary', 'Fluoroscopy/Digital Subtraction Angiography (DSA)', 'Gold standard for detailed evaluation of carotid and intracranial vascular anatomy; provides dynamic information about blood flow; allows for pressure measurements and potential intervention in the same setting; higher spatial and temporal resolution than non-invasive vascular imaging', 'NPO for 4-6 hours prior to procedure; laboratory tests including renal function, coagulation profile, and complete blood count; secure IV access; informed consent; pre-procedure hydration for patients with renal insufficiency', 'Rarely performed in pediatrics; requires pediatric-specific protocols with reduced contrast and radiation dose; sedation or general anesthesia typically required; specialized pediatric angiography team recommended', 'Bed rest for 2-6 hours; monitoring of access site and vital signs; adequate hydration; delayed ambulation with assistance; discharge instructions regarding access site care and delayed contrast reactions', '30-60 minutes', 'None', 'Requires documentation of medical necessity; must be performed by or under supervision of qualified physician with appropriate privileges; requires compliance with radiation safety regulations', 'Medium', 'Typically performed with conscious sedation; general anesthesia may be required for uncooperative patients or complex cases', 'Elderly patients may require reduced contrast dose and careful access site management; pregnant patients should have procedure deferred if possible or performed with abdominal shielding; renal insufficiency patients require pre- and post-procedure hydration and minimized contrast volume', '5-15 mSv depending on complexity and fluoroscopy time', 'Vascular stenosis, occlusion, aneurysms, arteriovenous malformations, arteriovenous fistulas, vasospasm, vascular tumors, atherosclerotic disease, dissection, fibromuscular dysplasia, vasculitis, and other vascular abnormalities of the internal carotid artery and its intracranial branches', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
40: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('37224', 'Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty', 'Pre-medication protocol for patients with contrast allergy: typically prednisone 50mg PO at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg PO/IV 1 hour before procedure; consider CO2 angiography for patients with severe contrast allergy or renal insufficiency', '37225 (Revascularization with atherectomy), 37226 (Revascularization with stent placement), 37227 (Revascularization with stent and atherectomy), 35526 (Bypass graft, femoral-popliteal), 93925 (Duplex ultrasound of lower extremity arteries)', 'Lower extremity - Femoral/Popliteal artery', 'Interventional Vascular Procedure', 'Moderate', 'Absolute: Uncorrected coagulopathy, active infection at access site. Relative: Severe renal insufficiency (eGFR <30 mL/min/1.73m2), pregnancy, contrast allergy, severe peripheral vascular disease limiting access', 'Iodinated contrast, typically 75-125 mL', 'Angiography suite with digital subtraction capabilities; vascular access kits; guidewires; catheters; balloon angioplasty catheters of appropriate sizes; contrast injector; hemodynamic monitoring equipment; emergency resuscitation equipment', 'Initial diagnostic angiography to assess lesion characteristics; road-mapping for intervention planning; fluoroscopic guidance during balloon angioplasty; post-intervention angiography to assess results and complications', 'Unilateral', 'Patient positioned supine on angiography table; limited mobility during procedure; post-procedure immobilization of access site required; patients with severe back pain or inability to lie flat may require accommodations', 'Fluoroscopy', 'Procedure is typically performed for symptomatic peripheral arterial disease (claudication, rest pain, tissue loss) after failed conservative management; technical success rates 80-90%; primary patency at 1 year approximately 50-60%', 'NPO for 6 hours prior to procedure (except medications with small sips of water); laboratory tests including CBC, PT/INR, PTT, BUN, creatinine; discontinuation of anticoagulants per institutional protocol; informed consent; IV access', 'Rarely performed in pediatric population; when necessary, requires pediatric interventional specialist, weight-based contrast dosing, and consideration of radiation reduction techniques', 'Bed rest for 2-6 hours depending on access site and closure method; vital sign monitoring; access site assessment for bleeding or hematoma; hydration; ambulation assessment before discharge; dual antiplatelet therapy typically initiated', '60-120 minutes', 'None', 'Requires documentation of medical necessity; appropriate use criteria must be consulted and documented; physician must have appropriate credentials for endovascular procedures', 'Medium', 'Typically moderate sedation (conscious sedation) with midazolam and fentanyl; general anesthesia rarely required except for uncooperative patients or complex cases', 'Elderly patients may require reduced contrast volume and careful access site selection; diabetic patients have higher risk of peripheral vascular disease and may have calcified vessels requiring specialized techniques; renal insufficiency patients require hydration protocols and minimized contrast volume', '5-15 mSv', 'Stenosis or occlusion of femoral or popliteal artery with restoration of luminal patency following angioplasty; residual stenosis <30% considered technical success; complications may include dissection, perforation, distal embolization, or vessel rupture', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
41: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('43200', 'Esophagoscopy, rigid or flexible; diagnostic, including collection of specimen(s) by brushing or washing when performed (separate procedure)', 'Document allergies to medications used for sedation; lidocaine allergies should be noted for topical anesthesia', 'Barium swallow (74220), CT esophagography (74150), MRI esophagus (74183), Transnasal esophagoscopy (43197)', 'Esophagus', 'Gastrointestinal Endoscopy', 'Moderate', 'Absolute: Unstable cardiopulmonary status, suspected perforation of the esophagus, severe cervical spine instability. Relative: Recent myocardial infarction, unstable angina, severe coagulopathy, large Zenker''s diverticulum', 'None', 'Flexible or rigid esophagoscope, light source, image processor, monitors, specimen collection tools (brushes, washing apparatus), suction equipment, oxygen supply', 'Visual inspection of the esophageal mucosa from the upper esophageal sphincter to the gastroesophageal junction; collection of specimens by brushing or washing when clinically indicated', 'Not applicable', 'Patient positioned in left lateral decubitus position; neck slightly flexed; ability to maintain position for duration of procedure required; limited neck mobility may complicate procedure', 'Endoscopy', 'This procedure is diagnostic only; therapeutic interventions require different CPT codes. Documentation should include extent of examination, findings, specimens collected, and any complications', 'NPO (nothing by mouth) for 6-8 hours prior to procedure; medication adjustments may be required for anticoagulants and antiplatelets; detailed medical history and physical examination', 'Pediatric-sized endoscopes required; higher risk of respiratory complications; may require general anesthesia rather than conscious sedation; special attention to dosing of sedatives and analgesics', 'Monitor vital signs until stable; observe for signs of perforation, bleeding, or respiratory distress; gradual resumption of oral intake; discharge instructions regarding potential delayed complications', '15-30 minutes', 'None', 'Requires documentation of medical necessity; follows CMS guidelines for screening vs. diagnostic procedures; requires appropriate informed consent', 'None', 'Typically performed under moderate (conscious) sedation; may use combinations of benzodiazepines and opioids; topical anesthesia of the oropharynx with lidocaine spray or gel', 'Elderly patients may require reduced sedation; pregnant patients should defer if possible until second trimester; patients with head and neck abnormalities may require modified approach', '0 mSv (no ionizing radiation)', 'Esophagitis, Barrett''s esophagus, esophageal varices, strictures, rings, webs, diverticula, foreign bodies, tumors, and other mucosal abnormalities', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ```
    38: 
39: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('36224', 'Selective catheter placement, internal carotid artery, unilateral, with angiography of the ipsilateral intracranial carotid circulation and all associated radiological supervision and interpretation', 'Pre-medication protocol for patients with history of contrast reactions: typically oral prednisone 50mg at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg 1 hour before procedure; alternative contrast agents for severe iodine allergy', 'CTA of head and neck (70496, 70498), MRA of head and neck (70544, 70545, 70546, 70547, 70548, 70549), Carotid duplex ultrasound (93880, 93882), CT perfusion of brain (0042T)', 'Internal carotid artery and intracranial carotid circulation', 'Diagnostic Angiography', 'High', 'Absolute: Uncontrolled coagulopathy, severe contrast allergy without adequate premedication. Relative: Renal insufficiency (eGFR <30 mL/min), pregnancy, uncontrolled hypertension, recent stroke, severe peripheral vascular disease limiting access', 'Iodinated contrast, typically 50-100 mL of low or iso-osmolar contrast', 'Angiography suite with digital subtraction capabilities, power injector, vascular access supplies, catheters (diagnostic catheters, guidewires), hemostatic devices, monitoring equipment, emergency resuscitation equipment', 'Femoral or radial arterial access; selective catheterization of the common carotid artery followed by selective catheterization of the internal carotid artery; digital subtraction angiography with multiple projections (AP, lateral, oblique) to visualize the entire intracranial carotid circulation; may include 3D rotational angiography', 'Unilateral', 'Patient must remain supine and immobile during procedure; head stabilization may be required; post-procedure immobilization of access site necessary', 'Fluoroscopy/Digital Subtraction Angiography (DSA)', 'Gold standard for detailed evaluation of carotid and intracranial vascular anatomy; provides dynamic information about blood flow; allows for pressure measurements and potential intervention in the same setting; higher spatial and temporal resolution than non-invasive vascular imaging', 'NPO for 4-6 hours prior to procedure; laboratory tests including renal function, coagulation profile, and complete blood count; secure IV access; informed consent; pre-procedure hydration for patients with renal insufficiency', 'Rarely performed in pediatrics; requires pediatric-specific protocols with reduced contrast and radiation dose; sedation or general anesthesia typically required; specialized pediatric angiography team recommended', 'Bed rest for 2-6 hours; monitoring of access site and vital signs; adequate hydration; delayed ambulation with assistance; discharge instructions regarding access site care and delayed contrast reactions', '30-60 minutes', 'None', 'Requires documentation of medical necessity; must be performed by or under supervision of qualified physician with appropriate privileges; requires compliance with radiation safety regulations', 'Medium', 'Typically performed with conscious sedation; general anesthesia may be required for uncooperative patients or complex cases', 'Elderly patients may require reduced contrast dose and careful access site management; pregnant patients should have procedure deferred if possible or performed with abdominal shielding; renal insufficiency patients require pre- and post-procedure hydration and minimized contrast volume', '5-15 mSv depending on complexity and fluoroscopy time', 'Vascular stenosis, occlusion, aneurysms, arteriovenous malformations, arteriovenous fistulas, vasospasm, vascular tumors, atherosclerotic disease, dissection, fibromuscular dysplasia, vasculitis, and other vascular abnormalities of the internal carotid artery and its intracranial branches', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
40: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('37224', 'Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty', 'Pre-medication protocol for patients with contrast allergy: typically prednisone 50mg PO at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg PO/IV 1 hour before procedure; consider CO2 angiography for patients with severe contrast allergy or renal insufficiency', '37225 (Revascularization with atherectomy), 37226 (Revascularization with stent placement), 37227 (Revascularization with stent and atherectomy), 35526 (Bypass graft, femoral-popliteal), 93925 (Duplex ultrasound of lower extremity arteries)', 'Lower extremity - Femoral/Popliteal artery', 'Interventional Vascular Procedure', 'Moderate', 'Absolute: Uncorrected coagulopathy, active infection at access site. Relative: Severe renal insufficiency (eGFR <30 mL/min/1.73m2), pregnancy, contrast allergy, severe peripheral vascular disease limiting access', 'Iodinated contrast, typically 75-125 mL', 'Angiography suite with digital subtraction capabilities; vascular access kits; guidewires; catheters; balloon angioplasty catheters of appropriate sizes; contrast injector; hemodynamic monitoring equipment; emergency resuscitation equipment', 'Initial diagnostic angiography to assess lesion characteristics; road-mapping for intervention planning; fluoroscopic guidance during balloon angioplasty; post-intervention angiography to assess results and complications', 'Unilateral', 'Patient positioned supine on angiography table; limited mobility during procedure; post-procedure immobilization of access site required; patients with severe back pain or inability to lie flat may require accommodations', 'Fluoroscopy', 'Procedure is typically performed for symptomatic peripheral arterial disease (claudication, rest pain, tissue loss) after failed conservative management; technical success rates 80-90%; primary patency at 1 year approximately 50-60%', 'NPO for 6 hours prior to procedure (except medications with small sips of water); laboratory tests including CBC, PT/INR, PTT, BUN, creatinine; discontinuation of anticoagulants per institutional protocol; informed consent; IV access', 'Rarely performed in pediatric population; when necessary, requires pediatric interventional specialist, weight-based contrast dosing, and consideration of radiation reduction techniques', 'Bed rest for 2-6 hours depending on access site and closure method; vital sign monitoring; access site assessment for bleeding or hematoma; hydration; ambulation assessment before discharge; dual antiplatelet therapy typically initiated', '60-120 minutes', 'None', 'Requires documentation of medical necessity; appropriate use criteria must be consulted and documented; physician must have appropriate credentials for endovascular procedures', 'Medium', 'Typically moderate sedation (conscious sedation) with midazolam and fentanyl; general anesthesia rarely required except for uncooperative patients or complex cases', 'Elderly patients may require reduced contrast volume and careful access site selection; diabetic patients have higher risk of peripheral vascular disease and may have calcified vessels requiring specialized techniques; renal insufficiency patients require hydration protocols and minimized contrast volume', '5-15 mSv', 'Stenosis or occlusion of femoral or popliteal artery with restoration of luminal patency following angioplasty; residual stenosis <30% considered technical success; complications may include dissection, perforation, distal embolization, or vessel rupture', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
41: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('43200', 'Esophagoscopy, rigid or flexible; diagnostic, including collection of specimen(s) by brushing or washing when performed (separate procedure)', 'Document allergies to medications used for sedation; lidocaine allergies should be noted for topical anesthesia', 'Barium swallow (74220), CT esophagography (74150), MRI esophagus (74183), Transnasal esophagoscopy (43197)', 'Esophagus', 'Gastrointestinal Endoscopy', 'Moderate', 'Absolute: Unstable cardiopulmonary status, suspected perforation of the esophagus, severe cervical spine instability. Relative: Recent myocardial infarction, unstable angina, severe coagulopathy, large Zenker''s diverticulum', 'None', 'Flexible or rigid esophagoscope, light source, image processor, monitors, specimen collection tools (brushes, washing apparatus), suction equipment, oxygen supply', 'Visual inspection of the esophageal mucosa from the upper esophageal sphincter to the gastroesophageal junction; collection of specimens by brushing or washing when clinically indicated', 'Not applicable', 'Patient positioned in left lateral decubitus position; neck slightly flexed; ability to maintain position for duration of procedure required; limited neck mobility may complicate procedure', 'Endoscopy', 'This procedure is diagnostic only; therapeutic interventions require different CPT codes. Documentation should include extent of examination, findings, specimens collected, and any complications', 'NPO (nothing by mouth) for 6-8 hours prior to procedure; medication adjustments may be required for anticoagulants and antiplatelets; detailed medical history and physical examination', 'Pediatric-sized endoscopes required; higher risk of respiratory complications; may require general anesthesia rather than conscious sedation; special attention to dosing of sedatives and analgesics', 'Monitor vital signs until stable; observe for signs of perforation, bleeding, or respiratory distress; gradual resumption of oral intake; discharge instructions regarding potential delayed complications', '15-30 minutes', 'None', 'Requires documentation of medical necessity; follows CMS guidelines for screening vs. diagnostic procedures; requires appropriate informed consent', 'None', 'Typically performed under moderate (conscious) sedation; may use combinations of benzodiazepines and opioids; topical anesthesia of the oropharynx with lidocaine spray or gel', 'Elderly patients may require reduced sedation; pregnant patients should defer if possible until second trimester; patients with head and neck abnormalities may require modified approach', '0 mSv (no ionizing radiation)', 'Esophagitis, Barrett''s esophagus, esophageal varices, strictures, rings, webs, diverticula, foreign bodies, tumors, and other mucosal abnormalities', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
42: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('55700', 'Biopsy, prostate; needle or punch, single or multiple, any approach', 'Antibiotic allergies should be documented and alternative prophylaxis provided if necessary', 'MRI-guided prostate biopsy (55706), Transperineal prostate biopsy (55700-TC), MRI of prostate without biopsy (72195, 72196, 72197), PSA monitoring without biopsy (84153)', 'Prostate', 'Interventional procedure', 'Moderate', 'Absolute: Acute prostatitis, rectal pathology preventing access. Relative: Severe hemorrhoids, anticoagulation therapy, severe immunosuppression, artificial heart valves (may require additional antibiotic prophylaxis)', 'None', 'Ultrasound machine with transrectal probe, biopsy gun with 18-gauge needles, specimen containers with formalin, sterile drapes and gloves, antibiotic prophylaxis', 'Transrectal ultrasound guidance with systematic sampling of prostate gland. Typically 10-12 core samples obtained from apex, mid-gland, and base of prostate bilaterally', 'Not applicable', 'Patient positioned in left lateral decubitus or lithotomy position. Limited mobility patients may require assistance with positioning', 'Ultrasound-guided procedure', 'Commonly performed for elevated PSA, abnormal digital rectal exam, or active surveillance of known prostate cancer. MRI-ultrasound fusion techniques (reported with different codes) may improve diagnostic yield', 'Antibiotic prophylaxis, bowel preparation (enema), cessation of anticoagulants/antiplatelets per institutional protocol, informed consent, NPO status not typically required', 'Rarely performed in pediatric population; only in cases of suspected malignancy or other specific indications with pediatric urology consultation', 'Monitor for hematuria, urinary retention, infection. Patient education regarding expected blood in urine, stool, and ejaculate. Follow-up for pathology results', '15-30 minutes', 'None', 'Requires proper documentation of medical necessity, typically performed by urologists or interventional radiologists with appropriate credentialing', 'None', 'Usually performed with local anesthesia (lidocaine gel) only. Conscious sedation rarely needed but may be considered for anxious patients or those with anal pain', 'Elderly patients may require dose adjustment for antibiotic prophylaxis. Patients with artificial heart valves may require additional antibiotic prophylaxis per AHA guidelines', '0 mSv (no ionizing radiation)', 'Tissue samples for histopathologic evaluation of prostate cancer, prostatitis, benign prostatic hyperplasia, or other prostatic pathologies', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ... and 49876 more matches
- **Data\tables\cpt_icd10_mappings.sql** (1964 matches)
  - Unique matches: `INSERT INTO`, `$100`, `$700`, `$200`, `$1`, `$600`, `$800`, `$2`, `$500`, `$30`, `$400`, `$50`, `$1000`, `$350`, `$300`, `$40`
  - Sample context:
    ```
    21: 
22: -- Insert data
23: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (93, 'C64.2', '76770', 7, 'High', 'ACR Appropriateness Criteria(R) Renal Cell Carcinoma Staging (2023), p.5-7', 'ACR_2023_Renal_Cell_Carcinoma', 'Renal ultrasound is usually appropriate (7/9) for patients with known left renal malignancy in specific scenarios. Most valuable when: (1) monitoring response during/after treatment with interval measurements of tumor size (plus or minus1-2mm precision); (2) surveillance of small (<4cm) renal masses with growth rate <0.5cm/year; (3) screening high-risk patients with hereditary syndromes (VHL, BHD) every 6-12 months. Ultrasound offers 85-98% sensitivity for masses >3cm but only 67-82% for masses <3cm compared to CT''s 90-95% sensitivity for all sizes. Advantages include zero radiation (vs. CT''s 8-10mSv), accessibility, and cost-effectiveness. Limited for: characterizing complex masses, detecting lesions <1cm, evaluating perinephric invasion, and lymph node assessment. Contrast-enhanced ultrasound improves characterization with 88% sensitivity/80% specificity for malignancy when enhancement pattern shows early wash-in/wash-out. Guidelines: The ACR rates ultrasound as 7/9 for initial evaluation of suspected renal masses and 7/9 for surveillance of known small renal masses. For comprehensive staging, contrast-enhanced CT (9/9) or MRI (8/9) is preferred. The American Urological Association (2021) recommends ultrasound for initial evaluation and surveillance of small renal masses (<4cm) at 6-12 month intervals, particularly in patients with impaired renal function (eGFR <30mL/min) where contrast administration is contraindicated.', 'Renal ultrasound is usually appropriate (7/9) for known left kidney malignancy, particularly for surveillance of small (<4cm) masses, treatment response monitoring, and screening high-risk patients. Key advantages include zero radiation, accessibility, and real-time imaging. Major limitations include reduced sensitivity for masses <3cm and inadequate staging capability compared to cross-sectional imaging.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
24: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (426, 'I70.302', '73725', 7, 'High', 'ACR Appropriateness Criteria(R) Vascular Claudication - Assessment for Revascularization (2023), p.5-7', 'ACR_2023_Peripheral_Arterial_Disease', 'MRA of the lower extremity is usually appropriate (7/9) for evaluating bypass graft atherosclerosis when:
25: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (137, 'E20.0', '75571', 5, 'Moderate', 'Bollerslev J, et al. European Society of Endocrinology Clinical Guideline: Treatment of chronic hypoparathyroidism in adults. Eur J Endocrinol. 2023;188(2):G25-G54, section 5.4.', 'ESE_2023_Chronic_Hypoparathyroidism', 'Cardiac CT calcium scoring (CACS) may be appropriate in idiopathic hypoparathyroidism patients due to their increased cardiovascular risk profile. Most valuable when: (1) patient has had disease >5 years with documented hypocalcemia (Ca <8.5 mg/dL); (2) patient is greater than or equal to40 years with multiple CV risk factors; (3) patient has elevated PTH levels >65 pg/mL despite therapy. Hypoparathyroidism patients have 2-3x higher risk of cardiovascular calcifications compared to age-matched controls. CACS provides quantitative assessment (Agatston score) with excellent reproducibility (variability <4%). Radiation exposure is low (1-2 mSv) compared to coronary CTA (3-15 mSv). Sensitivity for detecting coronary calcification is 96-100%, exceeding stress testing (sensitivity 68-72%) for asymptomatic CAD. Optimal timing: baseline at diagnosis, then every 5 years if Agatston score <100, every 2-3 years if score 100-400. Guidelines: No specific ACR Appropriateness Criteria(R) exists for calcium scoring in hypoparathyroidism. The European Society of Endocrinology (ESE) guidelines suggest cardiovascular risk assessment in chronic hypoparathyroidism but don''t specifically recommend calcium scoring.
    ```
    ```
    22: -- Insert data
23: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (93, 'C64.2', '76770', 7, 'High', 'ACR Appropriateness Criteria(R) Renal Cell Carcinoma Staging (2023), p.5-7', 'ACR_2023_Renal_Cell_Carcinoma', 'Renal ultrasound is usually appropriate (7/9) for patients with known left renal malignancy in specific scenarios. Most valuable when: (1) monitoring response during/after treatment with interval measurements of tumor size (plus or minus1-2mm precision); (2) surveillance of small (<4cm) renal masses with growth rate <0.5cm/year; (3) screening high-risk patients with hereditary syndromes (VHL, BHD) every 6-12 months. Ultrasound offers 85-98% sensitivity for masses >3cm but only 67-82% for masses <3cm compared to CT''s 90-95% sensitivity for all sizes. Advantages include zero radiation (vs. CT''s 8-10mSv), accessibility, and cost-effectiveness. Limited for: characterizing complex masses, detecting lesions <1cm, evaluating perinephric invasion, and lymph node assessment. Contrast-enhanced ultrasound improves characterization with 88% sensitivity/80% specificity for malignancy when enhancement pattern shows early wash-in/wash-out. Guidelines: The ACR rates ultrasound as 7/9 for initial evaluation of suspected renal masses and 7/9 for surveillance of known small renal masses. For comprehensive staging, contrast-enhanced CT (9/9) or MRI (8/9) is preferred. The American Urological Association (2021) recommends ultrasound for initial evaluation and surveillance of small renal masses (<4cm) at 6-12 month intervals, particularly in patients with impaired renal function (eGFR <30mL/min) where contrast administration is contraindicated.', 'Renal ultrasound is usually appropriate (7/9) for known left kidney malignancy, particularly for surveillance of small (<4cm) masses, treatment response monitoring, and screening high-risk patients. Key advantages include zero radiation, accessibility, and real-time imaging. Major limitations include reduced sensitivity for masses <3cm and inadequate staging capability compared to cross-sectional imaging.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
24: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (426, 'I70.302', '73725', 7, 'High', 'ACR Appropriateness Criteria(R) Vascular Claudication - Assessment for Revascularization (2023), p.5-7', 'ACR_2023_Peripheral_Arterial_Disease', 'MRA of the lower extremity is usually appropriate (7/9) for evaluating bypass graft atherosclerosis when:
25: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (137, 'E20.0', '75571', 5, 'Moderate', 'Bollerslev J, et al. European Society of Endocrinology Clinical Guideline: Treatment of chronic hypoparathyroidism in adults. Eur J Endocrinol. 2023;188(2):G25-G54, section 5.4.', 'ESE_2023_Chronic_Hypoparathyroidism', 'Cardiac CT calcium scoring (CACS) may be appropriate in idiopathic hypoparathyroidism patients due to their increased cardiovascular risk profile. Most valuable when: (1) patient has had disease >5 years with documented hypocalcemia (Ca <8.5 mg/dL); (2) patient is greater than or equal to40 years with multiple CV risk factors; (3) patient has elevated PTH levels >65 pg/mL despite therapy. Hypoparathyroidism patients have 2-3x higher risk of cardiovascular calcifications compared to age-matched controls. CACS provides quantitative assessment (Agatston score) with excellent reproducibility (variability <4%). Radiation exposure is low (1-2 mSv) compared to coronary CTA (3-15 mSv). Sensitivity for detecting coronary calcification is 96-100%, exceeding stress testing (sensitivity 68-72%) for asymptomatic CAD. Optimal timing: baseline at diagnosis, then every 5 years if Agatston score <100, every 2-3 years if score 100-400. Guidelines: No specific ACR Appropriateness Criteria(R) exists for calcium scoring in hypoparathyroidism. The European Society of Endocrinology (ESE) guidelines suggest cardiovascular risk assessment in chronic hypoparathyroidism but don''t specifically recommend calcium scoring.
26: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (169, 'E66.9', '76499', 8, 'Moderate', 'Garvey WT, et al. American Association of Clinical Endocrinologists and American College of Endocrinology Comprehensive Clinical Practice Guidelines for Medical Care of Patients with Obesity. Endocr Pract. 2023;29(S1):1-110. Section 4.3.', 'AACE_ACE_2023_Obesity_Management', 'DXA body composition is most appropriate for: 1) Quantifying adiposity distribution with precision (plus or minus1-3% error) in obese patients (BMI >30 kg/m2); 2) Monitoring body composition changes during weight management interventions when weight changes exceed 2-3%; 3) Assessing sarcopenic obesity (appendicular skeletal muscle index <7.26 kg/m2 in men, <5.45 kg/m2 in women). DXA provides superior tissue differentiation compared to bioelectrical impedance (BIA) (error plus or minus3-8%) and anthropometric measurements (error plus or minus5-10%). Radiation exposure is minimal (0.001-0.004 mSv), approximately 1/100th of a chest X-ray. DXA should be performed at baseline and at 3-6 month intervals during active weight management to detect clinically significant changes in fat mass (>1.5-2.0 kg) or lean mass (>1.0-1.5 kg). Guidelines: The American Association of Clinical Endocrinologists/American College of Endocrinology (AACE/ACE) guidelines recommend DXA for body composition assessment in obesity management.
    ```
    ... and 1913 more matches
- **Data\tables\icd10_markdown_docs.sql** (932 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    13: 
14: -- Insert data
15: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (933, 'A04.7', '# Medical Imaging Recommendation for ICD-10 Code A04.7', '..\Output\A04.7.md', '2025-04-08T07:02:53.517Z');
16: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (934, 'A09', '# Medical Imaging Recommendation for ICD-10 Code A09', '..\Output\A09.md', '2025-04-08T07:02:53.517Z');
17: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (935, 'A41.9', '# Medical Imaging Recommendation for ICD-10 Code A41.9', '..\Output\A41.9.md', '2025-04-08T07:02:53.517Z');
    ```
    ```
    14: -- Insert data
15: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (933, 'A04.7', '# Medical Imaging Recommendation for ICD-10 Code A04.7', '..\Output\A04.7.md', '2025-04-08T07:02:53.517Z');
16: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (934, 'A09', '# Medical Imaging Recommendation for ICD-10 Code A09', '..\Output\A09.md', '2025-04-08T07:02:53.517Z');
17: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (935, 'A41.9', '# Medical Imaging Recommendation for ICD-10 Code A41.9', '..\Output\A41.9.md', '2025-04-08T07:02:53.517Z');
18: INSERT INTO medical_icd10_markdown_docs ("id", "icd10_code", "content", "file_path", "import_date") VALUES (936, 'A49.9', '# Medical Imaging Recommendation for ICD-10 Code A49.9', '..\Output\A49.9.md', '2025-04-08T07:02:53.517Z');
    ```
    ... and 930 more matches
- **Data\batches\01_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A71', 'Trachoma', NULL, 'A70-A74', 'Other diseases caused by chlamydiae (A70-A74)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B39', 'Histoplasmosis', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D00.05', 'Carcinoma in situ of hard palate', NULL, 'D00-D09', 'In situ neoplasms (D00-D09)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D00.0', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A71', 'Trachoma', NULL, 'A70-A74', 'Other diseases caused by chlamydiae (A70-A74)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B39', 'Histoplasmosis', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D00.05', 'Carcinoma in situ of hard palate', NULL, 'D00-D09', 'In situ neoplasms (D00-D09)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D00.0', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D00.2', 'Carcinoma in situ of stomach', NULL, 'D00-D09', 'In situ neoplasms (D00-D09)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D00', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\02_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A51.5', 'Early syphilis, latent', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'A51', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A51.9', 'Early syphilis, unspecified', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'A51', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A52', 'Late syphilis', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A51.5', 'Early syphilis, latent', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'A51', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A51.9', 'Early syphilis, unspecified', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'A51', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A52', 'Late syphilis', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('A52.0', 'Cardiovascular and cerebrovascular syphilis', NULL, 'A50-A64', 'Infections with a predominantly sexual mode of transmission (A50-A64)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'A52', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\03_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.5', 'Tinea imbricata', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.6', 'Tinea cruris', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.8', 'Other dermatophytoses', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.5', 'Tinea imbricata', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.6', 'Tinea cruris', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.8', 'Other dermatophytoses', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('B35.9', 'Dermatophytosis, unspecified', NULL, 'B35-B49', 'Mycoses (B35-B49)', NULL, 'Chapter 1: Certain infectious and parasitic diseases (A00-B99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'B35', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\04_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.8', 'Malignant neoplasm of overlapping sites of bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'C34', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.80', 'Malignant neoplasm of overlapping sites of unspecified bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C34.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.81', 'Malignant neoplasm of overlapping sites of right bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C34.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.8', 'Malignant neoplasm of overlapping sites of bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'C34', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.80', 'Malignant neoplasm of overlapping sites of unspecified bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C34.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.81', 'Malignant neoplasm of overlapping sites of right bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C34.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C34.82', 'Malignant neoplasm of overlapping sites of left bronchus and lung', NULL, 'C30-C39', 'Malignant neoplasms of respiratory and intrathoracic organs (C30-C39)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C34.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\05_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.1', 'Malignant neoplasm of dome of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.2', 'Malignant neoplasm of lateral wall of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.3', 'Malignant neoplasm of anterior wall of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.1', 'Malignant neoplasm of dome of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.2', 'Malignant neoplasm of lateral wall of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.3', 'Malignant neoplasm of anterior wall of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C67.4', 'Malignant neoplasm of posterior wall of bladder', NULL, 'C64-C68', 'Malignant neoplasms of urinary tract (C64-C68)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C67', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\06_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C83.90', 'Non-follicular (diffuse) lymphoma, unspecified, unspecified site', NULL, 'C81-C96', 'Malignant neoplasms of lymphoid, hematopoietic and related tissue (C81-C96)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C83.9', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C83.91', 'Non-follicular (diffuse) lymphoma, unspecified, lymph nodes of head, face, and neck', NULL, 'C81-C96', 'Malignant neoplasms of lymphoid, hematopoietic and related tissue (C81-C96)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C83.9', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('X98.3', 'Assault by hot household appliances', NULL, 'X92-Y09', 'Assault (X92-Y09)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'X98', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C83.90', 'Non-follicular (diffuse) lymphoma, unspecified, unspecified site', NULL, 'C81-C96', 'Malignant neoplasms of lymphoid, hematopoietic and related tissue (C81-C96)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C83.9', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C83.91', 'Non-follicular (diffuse) lymphoma, unspecified, lymph nodes of head, face, and neck', NULL, 'C81-C96', 'Malignant neoplasms of lymphoid, hematopoietic and related tissue (C81-C96)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C83.9', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('X98.3', 'Assault by hot household appliances', NULL, 'X92-Y09', 'Assault (X92-Y09)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'X98', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('C83.92', 'Non-follicular (diffuse) lymphoma, unspecified, intrathoracic lymph nodes', NULL, 'C81-C96', 'Malignant neoplasms of lymphoid, hematopoietic and related tissue (C81-C96)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'C83.9', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\07_batch.sql** (500 matches)
  - Unique matches: `INSERT INTO`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.39', 'Benign neoplasm of other parts of mouth', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10.3', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.4', 'Benign neoplasm of tonsil', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.5', 'Benign neoplasm of other parts of oropharynx', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.39', 'Benign neoplasm of other parts of mouth', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10.3', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.4', 'Benign neoplasm of tonsil', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.5', 'Benign neoplasm of other parts of oropharynx', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('D10.6', 'Benign neoplasm of nasopharynx', NULL, 'D10-D36', 'Benign neoplasms, except benign neuroendocrine tumors (D10-D36)', NULL, 'Chapter 2: Neoplasms (C00-D49)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'D10', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches

### Response Processing

- Files affected: 123
- Total matches: 687

#### Directory Breakdown

- **Data\batches**: 28 files (22.8%)
- **.**: 12 files (9.8%)
- **Docs\implementation**: 11 files (8.9%)
- **old_code**: 10 files (8.1%)
- **Docs**: 5 files (4.1%)
- **src\services\location**: 5 files (4.1%)
- **tests\batch**: 5 files (4.1%)
- **tests**: 5 files (4.1%)
- **src\utils\llm\providers**: 3 files (2.4%)
- **src\utils\response**: 3 files (2.4%)
- **Data\tables**: 2 files (1.6%)
- **src\controllers\uploads**: 2 files (1.6%)
- **src\services\location\queries\user**: 2 files (1.6%)
- **src\services\location\user**: 2 files (1.6%)
- **src\services\order\radiology**: 2 files (1.6%)
- **tests\e2e**: 2 files (1.6%)
- **Data**: 1 files (0.8%)
- **old_code\src\controllers**: 1 files (0.8%)
- **old_code\src\services\order\admin**: 1 files (0.8%)
- **old_code\src\services**: 1 files (0.8%)
- **src\config**: 1 files (0.8%)
- **src\controllers\connection**: 1 files (0.8%)
- **src\services\auth\user**: 1 files (0.8%)
- **src\services\billing\credit**: 1 files (0.8%)
- **src\services\connection\services**: 1 files (0.8%)
- **src\services\location\queries\create**: 1 files (0.8%)
- **src\services\location\queries\deactivate**: 1 files (0.8%)
- **src\services\location\queries\get**: 1 files (0.8%)
- **src\services\location\queries\list**: 1 files (0.8%)
- **src\services\location\queries\update**: 1 files (0.8%)
- **src\services\order\admin\patient**: 1 files (0.8%)
- **src\services\order\admin\patient-manager**: 1 files (0.8%)
- **src\services\order\admin\__tests__**: 1 files (0.8%)
- **src\services\order\finalize\signature**: 1 files (0.8%)
- **src\services\order\radiology\query\order-builder**: 1 files (0.8%)
- **src\services\superadmin\organizations**: 1 files (0.8%)
- **src\services\superadmin\users**: 1 files (0.8%)
- **src\services\upload**: 1 files (0.8%)
- **src\services\validation**: 1 files (0.8%)
- **src\utils\database**: 1 files (0.8%)

#### Top Affected Files

- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (138 matches)
  - Unique matches: `response.`
  - Sample context:
    ```
    91: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('93882', 'Duplex scan of extracranial arteries; unilateral or limited study', 'None for standard procedure as no contrast is used', '93880 (Duplex scan of extracranial arteries; complete bilateral study), 70498 (CT angiography, neck), 70547 (MR angiography, neck, without contrast), 70548 (MR angiography, neck, with contrast), 70549 (MR angiography, neck, without and with contrast)', 'Extracranial arteries (carotid and vertebral arteries)', 'Vascular Ultrasound', 'Moderate', 'No absolute contraindications. Relative contraindications include inability to position the neck appropriately or presence of open wounds/recent surgical sites in the examination area.', 'None', 'Ultrasound machine with high-frequency linear transducer (5-12 MHz), color Doppler and spectral Doppler capabilities, and vascular presets.', 'Includes B-mode imaging of the carotid arteries with color and spectral Doppler analysis. Examination includes common carotid artery, carotid bifurcation, internal carotid artery, and external carotid artery on the examined side. May include vertebral artery assessment. Limited study typically focuses on a specific area of concern or follows up on a known abnormality.', 'Unilateral', 'Patient is typically positioned supine with neck slightly extended and head turned away from the side being examined. Pillows or bolsters may be used for patient comfort and optimal positioning.', 'Ultrasound', 'This limited study is appropriate for follow-up of known pathology, assessment of a specific segment, or when complete bilateral examination is not feasible. For comprehensive bilateral assessment, CPT 93880 should be used instead.', 'No special preparation required. Patient should remove jewelry, necklaces, or clothing that might interfere with the examination of the neck.', 'Protocol modifications may be needed for pediatric patients, including use of higher frequency transducers and age-appropriate sedation considerations. Pediatric normal values differ from adult values.', 'No special care required. Patient may resume normal activities immediately.', '30-45 minutes', 'None', 'Requires appropriate documentation of medical necessity. Must be performed by or under supervision of qualified personnel with appropriate training in vascular ultrasound.', 'None', 'Typically not required. For uncooperative patients or those with movement disorders, light sedation may be considered on a case-by-case basis.', 'Elderly patients may require assistance with positioning. Patients with tracheostomy, surgical dressings, or neck trauma may require modified scanning approaches.', '0 mSv (no ionizing radiation)', 'Carotid stenosis, plaque characterization, occlusion, dissection, aneurysm, fibromuscular dysplasia, arteriovenous fistula, or post-interventional assessment.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
92: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('93886', 'Transcranial Doppler study of the intracranial arteries; complete study', 'None for standard procedure as no contrast is used', 'CTA of head (70496), MRA of brain (70544, 70545, 70546), Cerebral angiography (36221-36228), Limited transcranial Doppler study (93888)', 'Intracranial arteries', 'Neurosonology', 'Moderate', 'No absolute contraindications. Relative contraindications include inability to remain still during examination and absence of adequate acoustic windows.', 'None', 'Transcranial Doppler ultrasound system with 2-4 MHz phased array and/or pencil probe transducers, ultrasound gel, and head frame for monitoring studies if applicable.', 'Examination of all major intracranial arteries including bilateral middle cerebral arteries (MCAs), anterior cerebral arteries (ACAs), posterior cerebral arteries (PCAs), vertebral arteries, and basilar artery through available acoustic windows (transtemporal, transorbital, transforaminal). Includes assessment of flow direction, velocity measurements, and waveform analysis.', 'Bilateral', 'Can be performed at bedside for critically ill patients. Patient must be able to maintain head position during examination. Head stabilization devices may be helpful for extended monitoring studies.', 'Ultrasound', 'Particularly useful for monitoring of vasospasm after subarachnoid hemorrhage, detection of right-to-left cardiac shunts, evaluation of intracranial stenosis, and assessment of cerebral hemodynamics. Limited by poor acoustic windows in approximately 10-20% of patients.', 'No special preparation required. Patient should be in a comfortable position, typically supine or seated.', 'Safe for pediatric use with no radiation exposure. Pediatric-specific transducers may be required for optimal imaging in infants and young children. Particularly useful for monitoring in sickle cell disease and assessment of stroke risk.', 'No special care required. Patient may resume normal activities immediately.', '30-45 minutes', 'None', 'Requires appropriate credentialing per ACR guidelines for neurosonology. Technologists should be certified in vascular ultrasound (RVT) or neurovascular ultrasound.', 'None', 'Generally not required. Light sedation may be considered for uncooperative patients or children, though this is rarely necessary.', 'Useful in pregnant patients due to lack of radiation. May have limited utility in elderly patients with calcified temporal windows. Special considerations for patients with sickle cell disease for stroke risk assessment.', '0 mSv (no ionizing radiation)', 'Intracranial stenosis, occlusion, vasospasm, collateral flow patterns, emboli detection, cerebrovascular reactivity, and assessment of cerebral autoregulation. Used in evaluation of stroke, subarachnoid hemorrhage, sickle cell disease, and cerebral circulatory arrest.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
93: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94010', 'Spirometry, including graphic record, total and timed vital capacity, expiratory flow rate measurement(s), with or without maximal voluntary ventilation', 'None for standard spirometry. If bronchodilator challenge is performed, consider medication allergies.', '94060 (Bronchodilator responsiveness testing), 94375 (Respiratory flow volume loop), 94726 (Plethysmography for thoracic gas volume), 94729 (Diffusing capacity)', 'Lungs', 'Diagnostic Pulmonary Function Testing', 'Low', 'Relative contraindications include recent myocardial infarction or stroke (within 1 month), unstable cardiovascular status, thoracic/abdominal/cerebral aneurysms, recent eye surgery, presence of pneumothorax, and hemoptysis of unknown origin.', 'None', 'Spirometer with flow sensor, disposable mouthpieces, nose clips, calibration syringe, computer with spirometry software, printer for reports.', 'Patient performs forced expiratory maneuvers while seated upright with nose clip in place. At least three acceptable maneuvers should be performed with the two largest FVC and FEV1 values within 150 mL of each other. Flow-volume and volume-time curves are recorded.', 'Not Applicable', 'Patient must be able to sit upright and perform forceful exhalation maneuvers. Wheelchair-bound patients can be tested in their wheelchair if they can maintain proper posture.', 'Pulmonary Function Test', 'This is a pulmonary function test, not a radiological procedure. It measures how well the lungs work by measuring how much air is inhaled and exhaled and how quickly. Results are compared to predicted values based on age, height, sex, and ethnicity.', 'Patient should avoid smoking for at least 1 hour before testing, avoid heavy meals, vigorous exercise within 2 hours of testing, and wear loose comfortable clothing. Bronchodilators may need to be withheld per physician instructions.', 'Can be performed in children as young as 5 years with proper coaching. Pediatric reference values should be used. Child-friendly incentive spirometry software may improve performance.', 'Resume normal activities and medications as directed. If bronchodilator was administered, monitor for adverse effects.', '15-30 minutes', 'None', 'Equipment must meet ATS/ERS standards for accuracy and precision. Technologists should be certified in pulmonary function testing. Annual calibration verification required.', 'None', 'None required', 'Elderly patients may require additional rest periods. Pregnant women can safely undergo spirometry. Ethnic-specific reference equations should be used when available.', '0 mSv (no ionizing radiation)', 'Evaluates lung volumes, airflow rates, and flow-volume loop patterns to diagnose obstructive lung diseases (e.g., asthma, COPD), restrictive lung diseases, and to monitor disease progression or treatment response.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
94: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94060', 'Bronchodilation Responsiveness, Spirometry as in 94010, Pre and Post Bronchodilator Administration', 'Assess for allergies to bronchodilator medications (typically albuterol). Alternative agents may be used for patients with known allergies.', '94010 (Spirometry without bronchodilator), 94070 (Bronchoprovocation challenge testing), 94375 (Respiratory flow volume loop), 94726 (Plethysmography for thoracic gas volume), 94728 (Airway resistance by impulse oscillometry)', 'Lungs and Airways', 'Pulmonary Function Test', 'Moderate', 'Relative contraindications include recent myocardial infarction or stroke (within 1 month), unstable cardiovascular status, thoracic/abdominal/cerebral aneurysms, recent eye surgery, presence of pneumothorax, hemoptysis of unknown origin, recent thoracic or abdominal surgery, nausea/vomiting, and severe respiratory distress.', 'None', 'Spirometer meeting ATS/ERS standards, nose clips, disposable mouthpieces, bronchodilator medication (typically albuterol), spacer device or nebulizer, timer.', 'Baseline spirometry performed according to ATS/ERS standards, followed by administration of bronchodilator (typically 4 puffs of albuterol via metered-dose inhaler with spacer or nebulized solution), then repeat spirometry after 10-15 minutes to assess response.', 'Not Applicable', 'Patient must be able to sit upright and perform forced breathing maneuvers. Testing can be performed in wheelchair-bound patients with appropriate positioning.', 'Pulmonary Function Testing', 'Used to assess reversibility of airflow obstruction in patients with suspected asthma or COPD. Helps differentiate between asthma (typically more reversible) and COPD (typically less reversible). Results should be interpreted in clinical context.', 'Patient should avoid bronchodilators for appropriate time period (4-8 hours for short-acting, 12-24 hours for long-acting bronchodilators), avoid smoking for at least 1 hour before testing, avoid heavy meals, vigorous exercise, and tight clothing. Patient should be instructed on proper breathing techniques.', 'Can be performed in children greater than or equal to5 years who can follow instructions. Pediatric reference values should be used. May require more coaching and demonstration. Consider using animated incentive displays for improved compliance.', 'Monitor for adverse reactions to bronchodilator (tachycardia, tremor, headache). Patient may resume normal activities and medications as directed.', '30-45 minutes', 'None', 'Must be performed under supervision of qualified healthcare provider. Equipment must meet ATS/ERS standards for accuracy and calibration.', 'None', 'None required', 'Elderly patients may require more rest between maneuvers. Pregnant patients can safely undergo testing but may have positional limitations. Interpretation should consider normal physiologic changes of pregnancy.', '0 mSv (no ionizing radiation)', 'Changes in FEV1 and FVC pre and post bronchodilator administration. Significant bronchodilator response typically defined as greater than or equal to12% and greater than or equal to200 mL increase in FEV1 and/or FVC from baseline.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
95: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94640', 'Pressurized or nonpressurized inhalation treatment for acute airway obstruction for therapeutic purposes and/or for diagnostic purposes such as sputum induction with aerosol generator, nebulizer, metered dose inhaler or intermittent positive pressure breathing (IPPB) device', 'Assess for allergies to medications being administered via nebulizer. Common medications include albuterol, ipratropium bromide, or budesonide. Document any adverse reactions.', '94664 (Demonstration and/or evaluation of patient utilization of an aerosol generator, nebulizer, metered dose inhaler or IPPB device), 94760 (Noninvasive ear or pulse oximetry for oxygen saturation; single determination), 94761 (Multiple determinations)', 'Respiratory System', 'Therapeutic Respiratory Procedure', 'Low', 'Relative contraindications include untreated pneumothorax, severe bullous emphysema, and recent facial, oral, or skull surgery. Use with caution in patients with cardiovascular instability.', 'None', 'Nebulizer, compressor, appropriate medication solution, mouthpiece or mask, oxygen source if needed, pulse oximeter for monitoring', 'Not applicable - this is not an imaging procedure', 'Not Applicable', 'Patient should be seated upright if possible to optimize medication delivery to lungs. Patients unable to sit may receive treatment while in semi-recumbent position.', 'Respiratory Therapy', 'CPT code 94640 is not a radiological procedure but a respiratory therapy procedure. It is commonly used for bronchodilator administration in patients with asthma, COPD, or other respiratory conditions. This code represents a single treatment session regardless of medication used.', 'Patient should be in a comfortable seated position if possible. No special preparation required. Patients should be instructed on proper breathing techniques for the procedure.', 'Pediatric patients may require age-appropriate masks instead of mouthpieces. Dosing of medications should be adjusted based on weight and age. Parental presence may help reduce anxiety in younger patients.', 'Monitor patient''s respiratory status, oxygen saturation, and heart rate. Observe for adverse reactions to medications. Patient may resume normal activities immediately after treatment.', '10-20 minutes', 'None', 'This is a therapeutic procedure, not a diagnostic imaging procedure. It falls under respiratory therapy services rather than radiology. Documentation should include medication administered, dosage, and patient response.', 'None', 'Sedation is not typically required for this procedure', 'Elderly patients may require assistance with proper technique. Pregnant patients can generally receive treatment safely, but medication selection should consider pregnancy status. Patients with cognitive impairments may need additional assistance and monitoring.', '0 mSv (no ionizing radiation)', 'Not applicable - this is a therapeutic procedure rather than a diagnostic imaging procedure', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ```
    92: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('93886', 'Transcranial Doppler study of the intracranial arteries; complete study', 'None for standard procedure as no contrast is used', 'CTA of head (70496), MRA of brain (70544, 70545, 70546), Cerebral angiography (36221-36228), Limited transcranial Doppler study (93888)', 'Intracranial arteries', 'Neurosonology', 'Moderate', 'No absolute contraindications. Relative contraindications include inability to remain still during examination and absence of adequate acoustic windows.', 'None', 'Transcranial Doppler ultrasound system with 2-4 MHz phased array and/or pencil probe transducers, ultrasound gel, and head frame for monitoring studies if applicable.', 'Examination of all major intracranial arteries including bilateral middle cerebral arteries (MCAs), anterior cerebral arteries (ACAs), posterior cerebral arteries (PCAs), vertebral arteries, and basilar artery through available acoustic windows (transtemporal, transorbital, transforaminal). Includes assessment of flow direction, velocity measurements, and waveform analysis.', 'Bilateral', 'Can be performed at bedside for critically ill patients. Patient must be able to maintain head position during examination. Head stabilization devices may be helpful for extended monitoring studies.', 'Ultrasound', 'Particularly useful for monitoring of vasospasm after subarachnoid hemorrhage, detection of right-to-left cardiac shunts, evaluation of intracranial stenosis, and assessment of cerebral hemodynamics. Limited by poor acoustic windows in approximately 10-20% of patients.', 'No special preparation required. Patient should be in a comfortable position, typically supine or seated.', 'Safe for pediatric use with no radiation exposure. Pediatric-specific transducers may be required for optimal imaging in infants and young children. Particularly useful for monitoring in sickle cell disease and assessment of stroke risk.', 'No special care required. Patient may resume normal activities immediately.', '30-45 minutes', 'None', 'Requires appropriate credentialing per ACR guidelines for neurosonology. Technologists should be certified in vascular ultrasound (RVT) or neurovascular ultrasound.', 'None', 'Generally not required. Light sedation may be considered for uncooperative patients or children, though this is rarely necessary.', 'Useful in pregnant patients due to lack of radiation. May have limited utility in elderly patients with calcified temporal windows. Special considerations for patients with sickle cell disease for stroke risk assessment.', '0 mSv (no ionizing radiation)', 'Intracranial stenosis, occlusion, vasospasm, collateral flow patterns, emboli detection, cerebrovascular reactivity, and assessment of cerebral autoregulation. Used in evaluation of stroke, subarachnoid hemorrhage, sickle cell disease, and cerebral circulatory arrest.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
93: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94010', 'Spirometry, including graphic record, total and timed vital capacity, expiratory flow rate measurement(s), with or without maximal voluntary ventilation', 'None for standard spirometry. If bronchodilator challenge is performed, consider medication allergies.', '94060 (Bronchodilator responsiveness testing), 94375 (Respiratory flow volume loop), 94726 (Plethysmography for thoracic gas volume), 94729 (Diffusing capacity)', 'Lungs', 'Diagnostic Pulmonary Function Testing', 'Low', 'Relative contraindications include recent myocardial infarction or stroke (within 1 month), unstable cardiovascular status, thoracic/abdominal/cerebral aneurysms, recent eye surgery, presence of pneumothorax, and hemoptysis of unknown origin.', 'None', 'Spirometer with flow sensor, disposable mouthpieces, nose clips, calibration syringe, computer with spirometry software, printer for reports.', 'Patient performs forced expiratory maneuvers while seated upright with nose clip in place. At least three acceptable maneuvers should be performed with the two largest FVC and FEV1 values within 150 mL of each other. Flow-volume and volume-time curves are recorded.', 'Not Applicable', 'Patient must be able to sit upright and perform forceful exhalation maneuvers. Wheelchair-bound patients can be tested in their wheelchair if they can maintain proper posture.', 'Pulmonary Function Test', 'This is a pulmonary function test, not a radiological procedure. It measures how well the lungs work by measuring how much air is inhaled and exhaled and how quickly. Results are compared to predicted values based on age, height, sex, and ethnicity.', 'Patient should avoid smoking for at least 1 hour before testing, avoid heavy meals, vigorous exercise within 2 hours of testing, and wear loose comfortable clothing. Bronchodilators may need to be withheld per physician instructions.', 'Can be performed in children as young as 5 years with proper coaching. Pediatric reference values should be used. Child-friendly incentive spirometry software may improve performance.', 'Resume normal activities and medications as directed. If bronchodilator was administered, monitor for adverse effects.', '15-30 minutes', 'None', 'Equipment must meet ATS/ERS standards for accuracy and precision. Technologists should be certified in pulmonary function testing. Annual calibration verification required.', 'None', 'None required', 'Elderly patients may require additional rest periods. Pregnant women can safely undergo spirometry. Ethnic-specific reference equations should be used when available.', '0 mSv (no ionizing radiation)', 'Evaluates lung volumes, airflow rates, and flow-volume loop patterns to diagnose obstructive lung diseases (e.g., asthma, COPD), restrictive lung diseases, and to monitor disease progression or treatment response.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
94: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94060', 'Bronchodilation Responsiveness, Spirometry as in 94010, Pre and Post Bronchodilator Administration', 'Assess for allergies to bronchodilator medications (typically albuterol). Alternative agents may be used for patients with known allergies.', '94010 (Spirometry without bronchodilator), 94070 (Bronchoprovocation challenge testing), 94375 (Respiratory flow volume loop), 94726 (Plethysmography for thoracic gas volume), 94728 (Airway resistance by impulse oscillometry)', 'Lungs and Airways', 'Pulmonary Function Test', 'Moderate', 'Relative contraindications include recent myocardial infarction or stroke (within 1 month), unstable cardiovascular status, thoracic/abdominal/cerebral aneurysms, recent eye surgery, presence of pneumothorax, hemoptysis of unknown origin, recent thoracic or abdominal surgery, nausea/vomiting, and severe respiratory distress.', 'None', 'Spirometer meeting ATS/ERS standards, nose clips, disposable mouthpieces, bronchodilator medication (typically albuterol), spacer device or nebulizer, timer.', 'Baseline spirometry performed according to ATS/ERS standards, followed by administration of bronchodilator (typically 4 puffs of albuterol via metered-dose inhaler with spacer or nebulized solution), then repeat spirometry after 10-15 minutes to assess response.', 'Not Applicable', 'Patient must be able to sit upright and perform forced breathing maneuvers. Testing can be performed in wheelchair-bound patients with appropriate positioning.', 'Pulmonary Function Testing', 'Used to assess reversibility of airflow obstruction in patients with suspected asthma or COPD. Helps differentiate between asthma (typically more reversible) and COPD (typically less reversible). Results should be interpreted in clinical context.', 'Patient should avoid bronchodilators for appropriate time period (4-8 hours for short-acting, 12-24 hours for long-acting bronchodilators), avoid smoking for at least 1 hour before testing, avoid heavy meals, vigorous exercise, and tight clothing. Patient should be instructed on proper breathing techniques.', 'Can be performed in children greater than or equal to5 years who can follow instructions. Pediatric reference values should be used. May require more coaching and demonstration. Consider using animated incentive displays for improved compliance.', 'Monitor for adverse reactions to bronchodilator (tachycardia, tremor, headache). Patient may resume normal activities and medications as directed.', '30-45 minutes', 'None', 'Must be performed under supervision of qualified healthcare provider. Equipment must meet ATS/ERS standards for accuracy and calibration.', 'None', 'None required', 'Elderly patients may require more rest between maneuvers. Pregnant patients can safely undergo testing but may have positional limitations. Interpretation should consider normal physiologic changes of pregnancy.', '0 mSv (no ionizing radiation)', 'Changes in FEV1 and FVC pre and post bronchodilator administration. Significant bronchodilator response typically defined as greater than or equal to12% and greater than or equal to200 mL increase in FEV1 and/or FVC from baseline.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
95: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94640', 'Pressurized or nonpressurized inhalation treatment for acute airway obstruction for therapeutic purposes and/or for diagnostic purposes such as sputum induction with aerosol generator, nebulizer, metered dose inhaler or intermittent positive pressure breathing (IPPB) device', 'Assess for allergies to medications being administered via nebulizer. Common medications include albuterol, ipratropium bromide, or budesonide. Document any adverse reactions.', '94664 (Demonstration and/or evaluation of patient utilization of an aerosol generator, nebulizer, metered dose inhaler or IPPB device), 94760 (Noninvasive ear or pulse oximetry for oxygen saturation; single determination), 94761 (Multiple determinations)', 'Respiratory System', 'Therapeutic Respiratory Procedure', 'Low', 'Relative contraindications include untreated pneumothorax, severe bullous emphysema, and recent facial, oral, or skull surgery. Use with caution in patients with cardiovascular instability.', 'None', 'Nebulizer, compressor, appropriate medication solution, mouthpiece or mask, oxygen source if needed, pulse oximeter for monitoring', 'Not applicable - this is not an imaging procedure', 'Not Applicable', 'Patient should be seated upright if possible to optimize medication delivery to lungs. Patients unable to sit may receive treatment while in semi-recumbent position.', 'Respiratory Therapy', 'CPT code 94640 is not a radiological procedure but a respiratory therapy procedure. It is commonly used for bronchodilator administration in patients with asthma, COPD, or other respiratory conditions. This code represents a single treatment session regardless of medication used.', 'Patient should be in a comfortable seated position if possible. No special preparation required. Patients should be instructed on proper breathing techniques for the procedure.', 'Pediatric patients may require age-appropriate masks instead of mouthpieces. Dosing of medications should be adjusted based on weight and age. Parental presence may help reduce anxiety in younger patients.', 'Monitor patient''s respiratory status, oxygen saturation, and heart rate. Observe for adverse reactions to medications. Patient may resume normal activities immediately after treatment.', '10-20 minutes', 'None', 'This is a therapeutic procedure, not a diagnostic imaging procedure. It falls under respiratory therapy services rather than radiology. Documentation should include medication administered, dosage, and patient response.', 'None', 'Sedation is not typically required for this procedure', 'Elderly patients may require assistance with proper technique. Pregnant patients can generally receive treatment safely, but medication selection should consider pregnancy status. Patients with cognitive impairments may need additional assistance and monitoring.', '0 mSv (no ionizing radiation)', 'Not applicable - this is a therapeutic procedure rather than a diagnostic imaging procedure', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
96: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('94726', 'Pulmonary Function Test (PFT), Plethysmography for determination of lung volumes', 'None specific to the procedure itself', '94727 (Gas dilution technique for determination of lung volumes), 94010 (Spirometry), 94060 (Spirometry with bronchodilator), 94729 (Diffusing capacity test)', 'Lungs', 'Pulmonary Function Testing', 'Moderate', 'Absolute contraindications: recent myocardial infarction (within 1 week), unstable angina, recent stroke, thoracic/abdominal/cerebral aneurysm, recent eye surgery, presence of pneumothorax. Relative contraindications: chest/abdominal pain, oral/facial pain, dementia or confusion, severe claustrophobia.', 'None', 'Body plethysmograph (booth), calibrated pneumotachograph, pressure transducers, computer with specialized software for data collection and analysis', 'Patient sits in an airtight body plethysmograph (booth) and breathes through a mouthpiece while wearing nose clips. Measurements include functional residual capacity (FRC), residual volume (RV), total lung capacity (TLC), and airway resistance.', 'Not applicable', 'Patient must be able to sit upright in the plethysmograph booth and maintain a tight seal around the mouthpiece. Must be able to follow instructions for breathing maneuvers.', 'Pulmonary Function Testing', 'Plethysmography is considered the gold standard for measuring lung volumes, particularly in patients with air trapping or non-uniform ventilation where gas dilution methods may be less accurate. This test provides more comprehensive lung volume measurements than spirometry alone.', 'Patient should avoid smoking for at least 4 hours before testing, avoid heavy meals, alcohol, and vigorous exercise for 2 hours before the test. Bronchodilators should be withheld as clinically appropriate (short-acting for 4-6 hours, long-acting for 12-24 hours).', 'Modified protocols exist for children typically 5 years and older. Pediatric reference values should be used. Child-friendly instruction and coaching is essential. May be difficult to perform in very young children.', 'Patient may resume normal activities and medications immediately after the test', '30-45 minutes', 'None', 'Must be performed under the supervision of a qualified healthcare provider. Equipment must meet ATS/ERS standards for calibration and quality control.', 'None', 'None required', 'Elderly patients may require additional time and assistance. Pregnant women can undergo testing but may have positional limitations in late pregnancy. Wheelchair-bound patients may require specialized equipment or alternative testing methods.', '0 mSv (no ionizing radiation)', 'Lung volumes (TLC, FRC, RV), airway resistance, and thoracic gas volume. Helps diagnose restrictive lung diseases (decreased TLC) versus obstructive lung diseases (increased RV and FRC).', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ... and 131 more matches
- **tests\llm-validation-flow-test.js** (60 matches)
  - Unique matches: `result.`, `response.`
  - Sample context:
    ```
    167: // Helper function to log results
168: function logResult(testCase, result) {
169:   const logFile = path.join(resultsDir, `${testCase.id}-result.json`);
170:   fs.writeFileSync(logFile, JSON.stringify(result, null, 2));
171:   console.log(`Results for test case ${testCase.id} saved to ${logFile}`);
    ```
    ```
    202:     });
203:     
204:     if (response.status !== 200) {
205:       throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
206:     }
    ```
    ... and 48 more matches
- **src\services\order\admin\__tests__\emr-parser.test.ts** (43 matches)
  - Unique matches: `result.`
  - Sample context:
    ```
    11:     const addressMatch = text.match(/(?:Address|Addr):\s*([^,\n]+)(?:,\s*([^,\n]+))?(?:,\s*([A-Z]{2}))?(?:,?\s*(\d{5}(?:-\d{4})?))?/i);
12:     if (addressMatch) {
13:       result.patientInfo.address = addressMatch[1]?.trim();
14:       result.patientInfo.city = addressMatch[2]?.trim();
15:       result.patientInfo.state = addressMatch[3]?.trim();
    ```
    ```
    12:     if (addressMatch) {
13:       result.patientInfo.address = addressMatch[1]?.trim();
14:       result.patientInfo.city = addressMatch[2]?.trim();
15:       result.patientInfo.state = addressMatch[3]?.trim();
16:       result.patientInfo.zipCode = addressMatch[4]?.trim();
    ```
    ... and 41 more matches
- **Data\tables\cpt_icd10_mappings.sql** (31 matches)
  - Unique matches: `response.`
  - Sample context:
    ```
    46: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (604, 'K29.70', '76700', 7, 'High', 'ACR Appropriateness Criteria(R) Right Upper Quadrant Pain, 2023, p.3-5', 'ACR_2023_Right_Upper_Quadrant_Pain', 'Abdominal ultrasound for unspecified gastritis without bleeding is most appropriate when: (1) patients present with persistent epigastric pain (>2 weeks) despite PPI therapy; (2) symptoms include unexplained weight loss (>5% body weight in 6 months); (3) age >50 years with new-onset symptoms; (4) abnormal liver function tests (ALT/AST >2x normal). Ultrasound can detect gastric wall thickening (>5mm indicates pathology), identify alternative diagnoses like gallstones (sensitivity 95% for stones >5mm), pancreatic abnormalities, or hepatic lesions. Compared to CT (sensitivity 86-97%, specificity 85-98%), ultrasound offers no radiation exposure (0 mSv vs. 8-10 mSv for abdominal CT) and higher sensitivity for biliary pathology (95% vs. 85%). Optimal timing is after failed initial therapy (7-14 days of PPIs) when symptoms persist or when red flags (hematemesis, melena, severe pain) are present. Guidelines: The ACR Appropriateness Criteria(R) for Right Upper Quadrant Pain rates abdominal ultrasound as 9/9 for initial evaluation of epigastric/RUQ pain when biliary etiology is suspected, which may mimic gastritis symptoms.
47: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (993, 'M76.32', '76881', 9, 'Moderate', 'AIUM Practice Parameter for the Performance of a Musculoskeletal Ultrasound Examination (2022), Section IV.C.3', 'AIUM_2022_MSK_Ultrasound', 'Ultrasound of the knee is highly appropriate for iliotibial band syndrome (ITBS) of the left leg, with a 9/9 rating. Most valuable when: (1) patients present with lateral knee pain exacerbated by running or cycling; (2) pain with direct palpation over the lateral femoral epicondyle; (3) positive Noble test or Ober test. Ultrasound can detect IT band thickening >5.5mm (vs. normal 4-5mm), fluid collection >2mm in the adjacent bursa, and hyperechoic changes at the distal insertion. Patient selection is optimized when symptoms persist >2 weeks despite rest and NSAIDs. Ultrasound offers superior soft tissue resolution compared to radiographs, with 93% sensitivity and 80% specificity for ITBS versus MRI''s 95% sensitivity but at significantly lower cost. No radiation exposure (0 mSv), making it ideal for initial evaluation or follow-up within 4-6 weeks after treatment initiation. Guidelines: The American Institute of Ultrasound in Medicine (AIUM) Practice Parameter for Musculoskeletal Ultrasound Examinations (2022) specifically includes evaluation of the iliotibial band as an appropriate indication for knee ultrasound.
48: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (619, 'K50.90', '76700', 7, 'Moderate', 'Maaser C, et al. ECCO-ESGAR Guideline for Diagnostic Assessment in IBD Part 1. J Crohns Colitis. 2023;17(1):1-23.', 'ECCO_2023_Crohn''s_Disease_Imaging', 'Abdominal ultrasound is usually appropriate (7/9) for Crohn''s disease evaluation with specific utility rankings: (1) MOST VALUABLE for detecting complications including abscesses >2cm, fistulae, and strictures with prestenotic dilation >3cm; (2) assessing bowel wall thickening >4mm (sensitivity 75-91%); (3) identifying hyperemia via color Doppler (resistive index <0.65 indicates active inflammation); (4) monitoring disease activity when CRP >10mg/L or fecal calprotectin >250microg/g. Ultrasound offers zero radiation exposure versus CT (15-20mSv), making it ideal for patients requiring serial monitoring. Limitations include lower sensitivity for deep pelvic disease (65-75% vs. 85-95% for MRE) and operator dependence. Most appropriate timing: during acute flares (symptoms >3 days with pain >6/10), within 4-6 weeks of treatment initiation, or every 6-12 months for monitoring. Guidelines: The European Crohn''s and Colitis Organisation (ECCO) rates abdominal ultrasound as 7/9 for Crohn''s disease assessment, recommending it as a first-line modality for detecting complications and assessing disease activity. The American College of Radiology (ACR) similarly rates abdominal ultrasound as 7/9 for initial evaluation of suspected inflammatory bowel disease, particularly valuable in pediatric patients and for serial monitoring due to absence of radiation.', 'Abdominal ultrasound is usually appropriate (7/9) for Crohn''s disease, most valuable for detecting complications (abscesses, fistulae), assessing bowel wall thickening >4mm, and monitoring disease activity. Key advantages include zero radiation exposure and real-time assessment; limitations include reduced sensitivity for deep pelvic disease and operator dependence. Most appropriate for acute flares and monitoring treatment response.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
49: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (994, 'M76.32', '73721', 8, 'Moderate', 'ACR Appropriateness Criteria(R), Chronic Knee Pain, 2022, p.8-9', 'ACR_2022_Chronic_Knee_Pain', 'MRI knee without contrast is highly appropriate for iliotibial band syndrome (ITBS) when: 1) Conservative treatment has failed after >4-6 weeks, 2) Symptoms persist despite physical therapy and anti-inflammatory medications, 3) Clinical suspicion of concomitant internal derangement exists. MRI demonstrates IT band thickening (>1.5mm compared to asymptomatic side), peritrochanteric edema extending >2cm, and fluid collection >5mm between IT band and lateral femoral epicondyle. MRI sensitivity for ITBS is 65-85% with specificity of 89-95%, superior to ultrasound (sensitivity 50-70%, specificity 75-85%). No radiation exposure (0 mSv), unlike radiographs (0.005 mSv) which cannot visualize soft tissue inflammation. Most valuable after failed conservative management (NSAIDs, physical therapy >4 weeks) and before considering surgical intervention. Less appropriate for acute presentation (<2 weeks) without red flags. Guidelines: The American College of Radiology Appropriateness Criteria(R) rates MRI without contrast as 7/9 for persistent lateral knee pain with suspected ITBS after failed conservative therapy.
50: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (634, 'K57.0', '74183', 5, 'Moderate', 'ACR Appropriateness Criteria(R), Acute Nonlocalized Abdominal Pain, 2023, p.7-8', 'ACR_2023_Acute_Abdominal_Pain', 'MRI abdomen with and without contrast receives a mid-range appropriateness rating (5/9) for small intestinal diverticulitis with perforation/abscess. Most valuable when: 1) CT is contraindicated due to contrast allergy or renal dysfunction (eGFR <30 mL/min); 2) Patients with inconclusive CT findings but persistent symptoms (fever >38.0 degrees C, WBC >12,000/microL); 3) Evaluation of fistula formation (sensitivity 97% vs 88% for CT). MRI offers superior soft tissue contrast for abscess delineation (>1cm), with sensitivity of 95% for detecting small bowel inflammation (wall thickness >4mm) versus 85% for CT. Limitations include longer acquisition time (20-30 minutes vs 5 minutes for CT), reduced availability in emergency settings, and contraindications in unstable patients. No radiation exposure compared to CT abdomen/pelvis (8-10 mSv). Recommended timing: after initial CT diagnosis or 48-72 hours after failed conservative therapy. Guidelines: The ACR Appropriateness Criteria(R) for Acute Nonlocalized Abdominal Pain rates MRI abdomen with and without contrast as 5/9 for suspected diverticulitis, noting it as an alternative when CT is contraindicated.
    ```
    ```
    115: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (26, 'B19.20', '76700', 9, 'High', 'Ghany MG, et al. Hepatitis C Guidance 2019 Update: AASLD-IDSA Recommendations for Testing, Managing, and Treating Hepatitis C Virus Infection. Hepatology. 2020;71(2):686-721. Section 5.2.', 'AASLD_2023_HCV_Management', 'Abdominal ultrasound is highly appropriate (9/9) for hepatitis C evaluation, with greatest utility in: 1) Initial assessment of liver morphology and fibrosis staging; 2) Surveillance for hepatocellular carcinoma (HCC) in cirrhotic patients every 6 months; 3) Evaluation of portal hypertension. Key findings include liver nodularity, caudate lobe hypertrophy (caudate-right lobe ratio >0.65), splenomegaly (>13cm), and portal vein diameter >13mm indicating portal hypertension. Ultrasound sensitivity for detecting HCC is 84% for lesions >2cm but drops to 27% for lesions <1cm. Ultrasound has no radiation exposure (0 mSv) compared to CT (8-10 mSv). For fibrosis assessment, ultrasound elastography has 87% sensitivity and 91% specificity for detecting F3-F4 fibrosis when liver stiffness exceeds 12.5 kPa. Initial ultrasound should be performed within 6 months of HCV diagnosis. Guidelines: The American Association for the Study of Liver Diseases (AASLD) recommends ultrasound for initial evaluation of all patients with chronic HCV and biannual surveillance in patients with cirrhosis.
116: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (13, 'A69.20', '72156', 8, 'Moderate', 'Lantos PM, et al. Clinical Practice Guidelines by the Infectious Diseases Society of America, American Academy of Neurology, and American College of Rheumatology: 2020 Guidelines for the Prevention, Diagnosis, and Treatment of Lyme Disease. Neurology. 2021;96(6):262-273. Section 4.2.', 'IDSA_AAN_ACR_2020_Lyme_Disease', 'MRI of the spine with and without contrast (72156) for Lyme disease (A69.20) is most appropriate when:
117: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (14, 'A69.20', '76881', 7, 'Moderate', 'Lantos PM, et al. Clinical Practice Guidelines by the Infectious Diseases Society of America (IDSA), American Academy of Neurology (AAN), and American College of Rheumatology (ACR): 2020 Guidelines for the Prevention, Diagnosis and Treatment of Lyme Disease. Clin Infect Dis. 2021;72(1):e1-e48. Section VIII.', 'IDSA_AAFP_ACP_2020_Lyme_Disease', 'Musculoskeletal ultrasound (MSK US) is most appropriate for Lyme disease patients with: 1) Monoarticular or oligoarticular joint swelling, particularly affecting the knee (present in 60-80% of Lyme arthritis cases); 2) Joint effusion >2mm in depth with synovial thickening >2mm; 3) Persistent arthritis despite 2-4 weeks of appropriate antibiotic therapy; 4) ESR >30mm/hr or CRP >1.0mg/dL indicating active inflammation. MSK US offers 88-96% sensitivity and 81-100% specificity for detecting synovitis and effusions compared to MRI, without radiation exposure (0 mSv). It is superior to radiographs (sensitivity 30-60%) for soft tissue evaluation but less sensitive than MRI (95-98%) for cartilage assessment. MSK US should be performed within 1-2 weeks of joint symptoms when Lyme disease is suspected, ideally before antibiotic initiation or 4-6 weeks after treatment to assess response. Guidelines: The ACR Appropriateness Criteria(R) does not specifically rate MSK US for Lyme disease. The Infectious Diseases Society of America (IDSA) guidelines recommend imaging for persistent arthritis but don''t specify modality preference.', 'MSK ultrasound is usually appropriate (7/9) for Lyme disease with joint manifestations, particularly for detecting knee effusions >2mm and synovitis >2mm. It provides real-time, radiation-free assessment of inflammatory changes and treatment response, though less sensitive than MRI for cartilage evaluation. Most valuable when monitoring persistent arthritis despite appropriate antibiotic therapy.', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
118: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (15, 'A69.20', '93306', 7, 'Moderate', 'Lantos PM, et al. Clinical Practice Guidelines by the Infectious Diseases Society of America (IDSA), American Academy of Neurology (AAN), and American College of Rheumatology (ACR): 2020 Guidelines for the Prevention, Diagnosis and Treatment of Lyme Disease. Clin Infect Dis. 2021;72(1):e1-e48. Section VII.', 'IDSA_AAN_ACR_2020_Lyme_Disease', 'Echocardiography is most appropriate for Lyme disease patients with: (1) ECG abnormalities (PR interval >200ms, new AV block), (2) cardiac symptoms (palpitations, syncope, chest pain), or (3) suspected Lyme carditis (occurs in 4-10% of untreated Lyme cases). Complete echocardiography provides superior assessment of cardiac function with sensitivity of 93% for detecting wall motion abnormalities versus 70% for limited echo. Timing is critical: perform within 24-48 hours of ECG abnormalities or cardiac symptoms. Echocardiography should be performed before starting high-degree AV block treatment when Lyme carditis is suspected, especially with troponin elevation >0.1 ng/mL or BNP >100 pg/mL. No radiation exposure (0 mSv) compared to cardiac CT (12-15 mSv) makes it preferable for initial evaluation, particularly in patients <50 years old. Guidelines: The American Heart Association (AHA) and Infectious Diseases Society of America (IDSA) recommend echocardiography for suspected Lyme carditis, particularly with conduction abnormalities.
119: INSERT INTO medical_cpt_icd10_mappings ("id", "icd10_code", "cpt_code", "appropriateness", "evidence_level", "evidence_source", "evidence_id", "enhanced_notes", "refined_justification", "guideline_version", "last_updated", "imported_at", "updated_at") VALUES (873, 'M51.16', '72158', 6, 'High', 'ACR Appropriateness Criteria(R) Low Back Pain, 2022, p.5-7', 'ACR_2022_Low_Back_Pain_with_Radiculopathy', 'MRI lumbar spine without contrast (72148) is the preferred initial study for lumbar radiculopathy, with sensitivity/specificity of 92%/91% for disc herniation. Contrast-enhanced MRI (72158) is most valuable when: 1) Post-surgical evaluation with persistent/recurrent symptoms (>6 weeks after surgery); 2) Suspected infection with fever >38 degrees C, ESR >30mm/hr, or CRP >10mg/L; 3) Suspected neoplasm with unexplained weight loss >10% in 6 months; 4) Failed conservative therapy >6 weeks with progressive neurological deficits. Non-contrast MRI is sufficient for initial evaluation of disc pathology causing radiculopathy. Timing: Non-contrast MRI first, with contrast added only if specific concerning features present. No radiation exposure (0 mSv) for either study, compared to CT (6-10 mSv) with lower soft tissue resolution. Guidelines: The ACR rates MRI lumbar spine without contrast as 8/9 (usually appropriate) for initial evaluation of radiculopathy, while MRI with and without contrast receives a 5/9 rating (may be appropriate) for initial evaluation. The North American Spine Society (2020) recommends MRI without contrast as the preferred initial study for suspected disc herniation with radiculopathy, reserving contrast for suspected infection, malignancy, or post-operative evaluation.', 'The 6/9 rating (', 'ACR 2024 v1.3', '2025-04-01T00:00:00.000Z', '2025-04-08T05:25:59.295Z', '2025-04-08T05:25:59.295Z');
    ```
    ... and 27 more matches
- **tests\file-upload.test.js** (19 matches)
  - Unique matches: `response.`
  - Sample context:
    ```
    26: 
27:   const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
28:   const responseData = await response.json();
29:   
30:   return {
    ```
    ```
    29:   
30:   return {
31:     status: response.status,
32:     data: responseData
33:   };
    ```
    ... and 17 more matches
- **src\services\order\radiology\query\order-builder\filter-orchestrator.ts** (18 matches)
  - Unique matches: `result.`
  - Sample context:
    ```
    23:   
24:   // Apply each filter in sequence
25:   result = applyStatusFilter(result.query, result.params, result.paramIndex, filters.status);
26:   result = applyReferringOrgFilter(result.query, result.params, result.paramIndex, filters.referringOrgId);
27:   result = applyPriorityFilter(result.query, result.params, result.paramIndex, filters.priority);
    ```
    ```
    24:   // Apply each filter in sequence
25:   result = applyStatusFilter(result.query, result.params, result.paramIndex, filters.status);
26:   result = applyReferringOrgFilter(result.query, result.params, result.paramIndex, filters.referringOrgId);
27:   result = applyPriorityFilter(result.query, result.params, result.paramIndex, filters.priority);
28:   result = applyModalityFilter(result.query, result.params, result.paramIndex, filters.modality);
    ```
    ... and 4 more matches
- **test-validation-engine.js** (16 matches)
  - Unique matches: `response.`, `result.`
  - Sample context:
    ```
    48:     });
49:     
50:     if (!response.ok) {
51:       const errorText = await response.text();
52:       throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    ```
    ```
    49:     
50:     if (!response.ok) {
51:       const errorText = await response.text();
52:       throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
53:     }
    ```
    ... and 11 more matches
- **old_code\llm-client.ts** (15 matches)
  - Unique matches: `response.`
  - Sample context:
    ```
    125:     });
126:     
127:     if (!response.ok) {
128:       const errorText = await response.text();
129:       throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`);
    ```
    ```
    126:     
127:     if (!response.ok) {
128:       const errorText = await response.text();
129:       throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`);
130:     }
    ```
    ... and 10 more matches
- **tests\batch\test-order-finalization.js** (13 matches)
  - Unique matches: `response.`, `result.`
  - Sample context:
    ```
    65:     });
66: 
67:     if (!response.ok) {
68:       const errorText = await response.text();
69:       throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
    ```
    ```
    66: 
67:     if (!response.ok) {
68:       const errorText = await response.text();
69:       throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
70:     }
    ```
    ... and 9 more matches
- **Docs\physician_dictation_experience_with_override_schema_update.md** (11 matches)
  - Unique matches: `response.`, `result.`
  - Sample context:
    ```
    1513:       const response = await apiRequest("PUT", `/api/orders/${orderId}`, updatePayload);
1514: 
1515:       const responseData = await response.json();
1516: 
1517:       if (!responseData.success) {
    ```
    ```
    2118:             const response = await apiRequest('GET', `/api/patients/${id}`);
2119:             // apiRequest throws on non-ok, so if we get here, it's ok
2120:             return await response.json();
2121:         } catch (error: any) {
2122:              if (error instanceof Error && error.message.startsWith('404:')) {
    ```
    ... and 8 more matches

### isPrimary Flag Handling

- Files affected: 171
- Total matches: 95721

#### Directory Breakdown

- **Data\batches**: 95 files (55.6%)
- **Docs**: 15 files (8.8%)
- **Docs\implementation**: 11 files (6.4%)
- **db-migrations**: 6 files (3.5%)
- **.**: 6 files (3.5%)
- **test-results**: 5 files (2.9%)
- **old_code**: 4 files (2.3%)
- **src\services\order\admin\validation\insurance**: 3 files (1.8%)
- **src\utils\database**: 3 files (1.8%)
- **Data\tables**: 2 files (1.2%)
- **old_code\src\services\order\admin**: 2 files (1.2%)
- **src\services\order\admin\insurance**: 2 files (1.2%)
- **test-results\llm-validation**: 2 files (1.2%)
- **tests\e2e**: 2 files (1.2%)
- **Data**: 1 files (0.6%)
- **Docs\prompt_examples**: 1 files (0.6%)
- **old_code\src\services\order\radiology\export**: 1 files (0.6%)
- **src\controllers\order-management\validation**: 1 files (0.6%)
- **src\models**: 1 files (0.6%)
- **src\services\billing\stripe\webhooks**: 1 files (0.6%)
- **src\services\order\admin\order-status-manager**: 1 files (0.6%)
- **src\services\order\admin\types**: 1 files (0.6%)
- **src\services\order\radiology\details**: 1 files (0.6%)
- **src\services\order\radiology\export\csv-export**: 1 files (0.6%)
- **src\services\upload**: 1 files (0.6%)
- **src\utils\response\normalizer**: 1 files (0.6%)
- **tests\batch**: 1 files (0.6%)

#### Top Affected Files

- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (47754 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    38: 
39: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('36224', 'Selective catheter placement, internal carotid artery, unilateral, with angiography of the ipsilateral intracranial carotid circulation and all associated radiological supervision and interpretation', 'Pre-medication protocol for patients with history of contrast reactions: typically oral prednisone 50mg at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg 1 hour before procedure; alternative contrast agents for severe iodine allergy', 'CTA of head and neck (70496, 70498), MRA of head and neck (70544, 70545, 70546, 70547, 70548, 70549), Carotid duplex ultrasound (93880, 93882), CT perfusion of brain (0042T)', 'Internal carotid artery and intracranial carotid circulation', 'Diagnostic Angiography', 'High', 'Absolute: Uncontrolled coagulopathy, severe contrast allergy without adequate premedication. Relative: Renal insufficiency (eGFR <30 mL/min), pregnancy, uncontrolled hypertension, recent stroke, severe peripheral vascular disease limiting access', 'Iodinated contrast, typically 50-100 mL of low or iso-osmolar contrast', 'Angiography suite with digital subtraction capabilities, power injector, vascular access supplies, catheters (diagnostic catheters, guidewires), hemostatic devices, monitoring equipment, emergency resuscitation equipment', 'Femoral or radial arterial access; selective catheterization of the common carotid artery followed by selective catheterization of the internal carotid artery; digital subtraction angiography with multiple projections (AP, lateral, oblique) to visualize the entire intracranial carotid circulation; may include 3D rotational angiography', 'Unilateral', 'Patient must remain supine and immobile during procedure; head stabilization may be required; post-procedure immobilization of access site necessary', 'Fluoroscopy/Digital Subtraction Angiography (DSA)', 'Gold standard for detailed evaluation of carotid and intracranial vascular anatomy; provides dynamic information about blood flow; allows for pressure measurements and potential intervention in the same setting; higher spatial and temporal resolution than non-invasive vascular imaging', 'NPO for 4-6 hours prior to procedure; laboratory tests including renal function, coagulation profile, and complete blood count; secure IV access; informed consent; pre-procedure hydration for patients with renal insufficiency', 'Rarely performed in pediatrics; requires pediatric-specific protocols with reduced contrast and radiation dose; sedation or general anesthesia typically required; specialized pediatric angiography team recommended', 'Bed rest for 2-6 hours; monitoring of access site and vital signs; adequate hydration; delayed ambulation with assistance; discharge instructions regarding access site care and delayed contrast reactions', '30-60 minutes', 'None', 'Requires documentation of medical necessity; must be performed by or under supervision of qualified physician with appropriate privileges; requires compliance with radiation safety regulations', 'Medium', 'Typically performed with conscious sedation; general anesthesia may be required for uncooperative patients or complex cases', 'Elderly patients may require reduced contrast dose and careful access site management; pregnant patients should have procedure deferred if possible or performed with abdominal shielding; renal insufficiency patients require pre- and post-procedure hydration and minimized contrast volume', '5-15 mSv depending on complexity and fluoroscopy time', 'Vascular stenosis, occlusion, aneurysms, arteriovenous malformations, arteriovenous fistulas, vasospasm, vascular tumors, atherosclerotic disease, dissection, fibromuscular dysplasia, vasculitis, and other vascular abnormalities of the internal carotid artery and its intracranial branches', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
40: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('37224', 'Revascularization, endovascular, open or percutaneous, femoral, popliteal artery(s), unilateral; with transluminal angioplasty', 'Pre-medication protocol for patients with contrast allergy: typically prednisone 50mg PO at 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg PO/IV 1 hour before procedure; consider CO2 angiography for patients with severe contrast allergy or renal insufficiency', '37225 (Revascularization with atherectomy), 37226 (Revascularization with stent placement), 37227 (Revascularization with stent and atherectomy), 35526 (Bypass graft, femoral-popliteal), 93925 (Duplex ultrasound of lower extremity arteries)', 'Lower extremity - Femoral/Popliteal artery', 'Interventional Vascular Procedure', 'Moderate', 'Absolute: Uncorrected coagulopathy, active infection at access site. Relative: Severe renal insufficiency (eGFR <30 mL/min/1.73m2), pregnancy, contrast allergy, severe peripheral vascular disease limiting access', 'Iodinated contrast, typically 75-125 mL', 'Angiography suite with digital subtraction capabilities; vascular access kits; guidewires; catheters; balloon angioplasty catheters of appropriate sizes; contrast injector; hemodynamic monitoring equipment; emergency resuscitation equipment', 'Initial diagnostic angiography to assess lesion characteristics; road-mapping for intervention planning; fluoroscopic guidance during balloon angioplasty; post-intervention angiography to assess results and complications', 'Unilateral', 'Patient positioned supine on angiography table; limited mobility during procedure; post-procedure immobilization of access site required; patients with severe back pain or inability to lie flat may require accommodations', 'Fluoroscopy', 'Procedure is typically performed for symptomatic peripheral arterial disease (claudication, rest pain, tissue loss) after failed conservative management; technical success rates 80-90%; primary patency at 1 year approximately 50-60%', 'NPO for 6 hours prior to procedure (except medications with small sips of water); laboratory tests including CBC, PT/INR, PTT, BUN, creatinine; discontinuation of anticoagulants per institutional protocol; informed consent; IV access', 'Rarely performed in pediatric population; when necessary, requires pediatric interventional specialist, weight-based contrast dosing, and consideration of radiation reduction techniques', 'Bed rest for 2-6 hours depending on access site and closure method; vital sign monitoring; access site assessment for bleeding or hematoma; hydration; ambulation assessment before discharge; dual antiplatelet therapy typically initiated', '60-120 minutes', 'None', 'Requires documentation of medical necessity; appropriate use criteria must be consulted and documented; physician must have appropriate credentials for endovascular procedures', 'Medium', 'Typically moderate sedation (conscious sedation) with midazolam and fentanyl; general anesthesia rarely required except for uncooperative patients or complex cases', 'Elderly patients may require reduced contrast volume and careful access site selection; diabetic patients have higher risk of peripheral vascular disease and may have calcified vessels requiring specialized techniques; renal insufficiency patients require hydration protocols and minimized contrast volume', '5-15 mSv', 'Stenosis or occlusion of femoral or popliteal artery with restoration of luminal patency following angioplasty; residual stenosis <30% considered technical success; complications may include dissection, perforation, distal embolization, or vessel rupture', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
41: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('43200', 'Esophagoscopy, rigid or flexible; diagnostic, including collection of specimen(s) by brushing or washing when performed (separate procedure)', 'Document allergies to medications used for sedation; lidocaine allergies should be noted for topical anesthesia', 'Barium swallow (74220), CT esophagography (74150), MRI esophagus (74183), Transnasal esophagoscopy (43197)', 'Esophagus', 'Gastrointestinal Endoscopy', 'Moderate', 'Absolute: Unstable cardiopulmonary status, suspected perforation of the esophagus, severe cervical spine instability. Relative: Recent myocardial infarction, unstable angina, severe coagulopathy, large Zenker''s diverticulum', 'None', 'Flexible or rigid esophagoscope, light source, image processor, monitors, specimen collection tools (brushes, washing apparatus), suction equipment, oxygen supply', 'Visual inspection of the esophageal mucosa from the upper esophageal sphincter to the gastroesophageal junction; collection of specimens by brushing or washing when clinically indicated', 'Not applicable', 'Patient positioned in left lateral decubitus position; neck slightly flexed; ability to maintain position for duration of procedure required; limited neck mobility may complicate procedure', 'Endoscopy', 'This procedure is diagnostic only; therapeutic interventions require different CPT codes. Documentation should include extent of examination, findings, specimens collected, and any complications', 'NPO (nothing by mouth) for 6-8 hours prior to procedure; medication adjustments may be required for anticoagulants and antiplatelets; detailed medical history and physical examination', 'Pediatric-sized endoscopes required; higher risk of respiratory complications; may require general anesthesia rather than conscious sedation; special attention to dosing of sedatives and analgesics', 'Monitor vital signs until stable; observe for signs of perforation, bleeding, or respiratory distress; gradual resumption of oral intake; discharge instructions regarding potential delayed complications', '15-30 minutes', 'None', 'Requires documentation of medical necessity; follows CMS guidelines for screening vs. diagnostic procedures; requires appropriate informed consent', 'None', 'Typically performed under moderate (conscious) sedation; may use combinations of benzodiazepines and opioids; topical anesthesia of the oropharynx with lidocaine spray or gel', 'Elderly patients may require reduced sedation; pregnant patients should defer if possible until second trimester; patients with head and neck abnormalities may require modified approach', '0 mSv (no ionizing radiation)', 'Esophagitis, Barrett''s esophagus, esophageal varices, strictures, rings, webs, diverticula, foreign bodies, tumors, and other mucosal abnormalities', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
42: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('55700', 'Biopsy, prostate; needle or punch, single or multiple, any approach', 'Antibiotic allergies should be documented and alternative prophylaxis provided if necessary', 'MRI-guided prostate biopsy (55706), Transperineal prostate biopsy (55700-TC), MRI of prostate without biopsy (72195, 72196, 72197), PSA monitoring without biopsy (84153)', 'Prostate', 'Interventional procedure', 'Moderate', 'Absolute: Acute prostatitis, rectal pathology preventing access. Relative: Severe hemorrhoids, anticoagulation therapy, severe immunosuppression, artificial heart valves (may require additional antibiotic prophylaxis)', 'None', 'Ultrasound machine with transrectal probe, biopsy gun with 18-gauge needles, specimen containers with formalin, sterile drapes and gloves, antibiotic prophylaxis', 'Transrectal ultrasound guidance with systematic sampling of prostate gland. Typically 10-12 core samples obtained from apex, mid-gland, and base of prostate bilaterally', 'Not applicable', 'Patient positioned in left lateral decubitus or lithotomy position. Limited mobility patients may require assistance with positioning', 'Ultrasound-guided procedure', 'Commonly performed for elevated PSA, abnormal digital rectal exam, or active surveillance of known prostate cancer. MRI-ultrasound fusion techniques (reported with different codes) may improve diagnostic yield', 'Antibiotic prophylaxis, bowel preparation (enema), cessation of anticoagulants/antiplatelets per institutional protocol, informed consent, NPO status not typically required', 'Rarely performed in pediatric population; only in cases of suspected malignancy or other specific indications with pediatric urology consultation', 'Monitor for hematuria, urinary retention, infection. Patient education regarding expected blood in urine, stool, and ejaculate. Follow-up for pathology results', '15-30 minutes', 'None', 'Requires proper documentation of medical necessity, typically performed by urologists or interventional radiologists with appropriate credentialing', 'None', 'Usually performed with local anesthesia (lidocaine gel) only. Conscious sedation rarely needed but may be considered for anxious patients or those with anal pain', 'Elderly patients may require dose adjustment for antibiotic prophylaxis. Patients with artificial heart valves may require additional antibiotic prophylaxis per AHA guidelines', '0 mSv (no ionizing radiation)', 'Tissue samples for histopathologic evaluation of prostate cancer, prostatitis, benign prostatic hyperplasia, or other prostatic pathologies', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ```
    55: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('75716', 'Angiography, extremity, bilateral, radiological supervision and interpretation', 'Pre-medication protocol for patients with history of contrast reactions: typically oral prednisone 13, 7, and 1 hour before procedure, plus diphenhydramine 50mg 1 hour before procedure', 'CTA of extremities (73706 for lower extremity, 73206 for upper extremity); MRA of extremities (73725 for lower extremity, 73225 for upper extremity); Duplex ultrasound of extremity arteries (93925 for lower extremity, 93930 for upper extremity)', 'Extremities (upper and/or lower)', 'Vascular Imaging - Diagnostic Angiography', 'High', 'Absolute: severe uncontrolled contrast allergy. Relative: renal insufficiency (eGFR <30 mL/min/1.73m2), pregnancy, uncontrolled hypertension, coagulopathy, congestive heart failure', 'Iodinated contrast, intra-arterial administration', 'Angiography suite with digital subtraction capabilities; C-arm fluoroscopy unit; power injector; vascular access supplies; catheters and guidewires; emergency resuscitation equipment', 'Arterial access (typically common femoral artery); selective catheterization of target vessels; digital subtraction angiography of bilateral extremities with multiple projections; may include time-resolved imaging for dynamic assessment', 'Bilateral', 'Patient must remain supine and immobile during the procedure; post-procedure immobilization of access site required; limited mobility for several hours after procedure', 'Fluoroscopy/Angiography', 'Primarily used for evaluation of peripheral arterial disease, trauma, congenital anomalies, and pre-procedural planning for interventions. Provides detailed anatomic and hemodynamic information. May be performed in conjunction with therapeutic intervention (separate CPT code required for intervention)', 'NPO for 4-6 hours prior to procedure; adequate hydration; recent renal function tests (BUN/creatinine); discontinuation of metformin 48 hours prior to procedure if applicable', 'Rarely performed in pediatric patients; requires pediatric-specific protocols with dose reduction techniques; sedation or general anesthesia often required; consider alternative non-invasive imaging when possible', 'Bed rest for 2-6 hours depending on access site and closure method; monitoring of vital signs and access site; adequate hydration; resumption of metformin 48 hours after procedure if renal function normal', '60-120 minutes', 'None', 'Requires documentation of medical necessity; prior authorization often required by insurance carriers; must be performed under the supervision of a qualified physician', 'Medium', 'Typically performed with moderate sedation (conscious sedation); general anesthesia rarely required except in pediatric patients or adults unable to cooperate', 'For elderly patients, consider risk of contrast-induced nephropathy; for diabetic patients, careful monitoring of glucose levels and renal function; for pregnant patients, consider alternative non-radiation imaging modalities when possible', '5-15 mSv depending on complexity and fluoroscopy time', 'Arterial stenosis, occlusion, aneurysm, pseudoaneurysm, arteriovenous malformation, vasculitis, trauma-related vascular injury, vascular tumors, congenital vascular anomalies, collateral circulation patterns', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
56: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76092', 'Screening mammography, bilateral (two-view film study of each breast)', 'No contrast agents used; rare allergic reactions to compression materials may occur', 'Digital Breast Tomosynthesis (77063 when added to mammography); Screening Breast MRI (77049); Screening Breast Ultrasound (76641); Contrast-Enhanced Mammography (no specific CPT code, typically coded as diagnostic mammography with contrast)', 'Breast', 'Screening', 'Low', 'Pregnancy (relative); acute breast infection or inflammation; recent breast surgery (within 6-8 weeks); breast implant rupture (relative)', 'None', 'Dedicated mammography unit with compression paddle; digital mammography or digital breast tomosynthesis capability; MQSA-certified equipment with annual physics testing', 'Standard two-view examination of each breast (craniocaudal and mediolateral oblique views); additional views may be obtained if needed for complete breast tissue visualization', 'Bilateral', 'Patient must be able to stand or sit upright and hold position for brief periods; accommodations available for patients with limited mobility', 'X-ray', 'CPT code 76092 has been replaced by 77067 for digital mammography; screening mammography is recommended annually for women 40 years and older; may be performed earlier for high-risk patients', 'No deodorant, powder, or lotion on breasts or underarms; wear two-piece clothing for convenience; inform technologist of any breast symptoms, prior surgeries, hormone use, or family history of breast cancer', 'Not routinely performed in pediatric population; only used in specific cases with high clinical suspicion and after consultation with pediatric specialists', 'Resume normal activities immediately; temporary mild discomfort from compression may occur; results typically available within 7-10 days', '15-30 minutes', 'None', 'Annual screening mammography is covered by Medicare for women age 40 and older; Mammography Quality Standards Act (MQSA) requires all facilities to be certified by FDA; must be performed by certified technologists and interpreted by qualified radiologists', 'Low', 'None required', 'Women with breast implants require modified positioning techniques; patients with physical disabilities may require assistance with positioning; high-risk patients may benefit from supplemental screening with ultrasound or MRI', '0.4 mSv', 'Breast masses, calcifications, architectural distortion, asymmetries, and other potential signs of breast cancer', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
57: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76376', '3D rendering with interpretation and reporting of computed tomography, magnetic resonance imaging, ultrasound, or other tomographic modality with image postprocessing under concurrent supervision; not requiring image postprocessing on an independent workstation', 'None specific to the 3D rendering; follows considerations for primary imaging study', '76377 (3D rendering requiring independent workstation), 76380 (CT limited or localized follow-up study)', 'Variable - depends on primary imaging study', 'Advanced Visualization/Post-processing', 'Moderate', 'None specific to the 3D rendering; follows contraindications for primary imaging study', 'Dependent on primary imaging study', 'Computer workstation with 3D rendering software; does not require independent workstation', 'Post-processing of previously acquired imaging data to create 3D renderings; may include multiplanar reformations (MPR), maximum intensity projections (MIP), volume rendering, or surface rendering techniques', 'Not applicable', 'None for the 3D rendering itself as it is performed on previously acquired images', 'Multiple (CT, MRI, Ultrasound, or other tomographic modality)', 'CPT 76376 is used when 3D rendering is performed on the same workstation as the primary interpretation. For 3D rendering requiring an independent workstation, use CPT 76377. This code should not be reported for simple reformatting or 3D reconstructions performed as part of standard image processing', 'None specific to the 3D rendering; follows preparation for primary imaging study', 'No specific pediatric considerations for the 3D rendering itself; follows considerations for primary imaging study', 'None specific to the 3D rendering', '15-30 minutes additional to primary imaging study', 'None for the 3D rendering itself; dependent on primary imaging study', 'Must be performed under concurrent supervision; cannot be billed separately when performed on the same workstation as the primary interpretation; must be medically necessary and documented', 'None', 'None required for the 3D rendering itself; follows requirements for primary imaging study', 'No specific considerations for the 3D rendering itself; follows considerations for primary imaging study', '0 mSv (no additional ionizing radiation beyond primary scan)', 'Enhanced visualization of complex anatomy, spatial relationships, fractures, vascular structures, tumors, or congenital anomalies', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
58: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76377', '3D rendering with postprocessing of volumetric data set(s); requiring image postprocessing on an independent workstation', 'None for the 3D rendering itself; considerations depend on primary imaging study', '76376 (3D rendering not requiring independent workstation), 76380 (CT limited or localized follow-up study), 76497 (Unlisted CT procedure), 76498 (Unlisted MRI procedure)', 'Any (depends on primary imaging study)', 'Advanced Visualization', 'High', 'No specific contraindications for the 3D rendering itself; contraindications depend on primary imaging study', 'Not applicable (depends on primary imaging study)', 'Independent advanced visualization workstation with 3D rendering software, high-resolution display monitors, and appropriate data storage capabilities', 'Acquisition of volumetric dataset from primary imaging study followed by transfer to independent workstation. Postprocessing includes multiplanar reformatting (MPR), maximum intensity projection (MIP), volume rendering technique (VRT), or other advanced visualization techniques as clinically indicated.', 'Not applicable', 'None for the 3D rendering itself; considerations depend on primary imaging study', 'Multiple (CT, MRI, Ultrasound, Nuclear Medicine)', 'CPT 76377 is distinct from 76376, which is for 3D rendering not requiring an independent workstation. This code represents the technical component of the service and requires significant time and expertise beyond standard image interpretation. The primary imaging study is coded separately.', 'No specific preparation for the 3D rendering itself; preparation depends on the primary imaging study', 'No specific pediatric considerations for the 3D rendering itself; considerations depend on primary imaging study', 'None specific to the 3D rendering', '15-45 minutes for postprocessing (in addition to primary imaging acquisition time)', 'Not applicable (depends on primary imaging study)', 'Must be performed on an independent workstation separate from the scanner. Requires documentation of medical necessity. Not separately billable when performed on the same workstation as the primary image acquisition.', 'None', 'Not required for the 3D rendering itself; sedation requirements depend on primary imaging study', 'Particularly valuable for surgical planning in complex cases, congenital anomalies, trauma, and oncologic staging', '0 mSv (no additional ionizing radiation beyond primary study)', 'Enhanced visualization of complex anatomy, pathology, fractures, vascular structures, tumors, or congenital anomalies. Provides spatial relationships not easily appreciated on standard 2D images.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
59: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76380', 'Computed tomography, limited or localized follow-up study', 'If contrast is used, patients with history of allergic reactions to iodinated contrast require premedication protocol or alternative imaging. Contrast reactions should be managed according to ACR Manual on Contrast Media.', 'Depending on clinical indication: MRI (various codes based on body part), Ultrasound (various codes based on body part), or Nuclear Medicine studies (various codes based on radiotracer and body part).', 'Variable - depends on the specific follow-up study being performed', 'Diagnostic Imaging', 'Moderate', 'Relative contraindications include pregnancy (unless benefits outweigh risks), severe renal insufficiency if contrast is used (eGFR <30 mL/min/1.73m2), and history of severe contrast reaction if contrast is needed.', 'Variable - may be performed with or without contrast depending on the clinical indication', 'CT scanner (minimum 16-slice recommended), appropriate patient positioning devices, contrast injector if contrast is used.', 'Targeted acquisition of limited anatomic region with thin-section imaging (typically 1-3mm slice thickness). Protocol parameters are tailored to the specific clinical question and body part being examined.', 'Not applicable', 'Patient must be able to lie still in supine position. Positioning aids may be used for patient comfort and to maintain proper positioning.', 'CT', 'This code is used for limited follow-up CT studies that focus on a specific area of interest rather than a complete examination of an anatomic region. It is commonly used for follow-up of known lesions, post-treatment evaluation, or problem-solving when a full study is not required.', 'Variable based on body part and contrast use. If contrast is used, patients should fast for 4-6 hours prior to examination and be well-hydrated. Renal function tests may be required.', 'Protocols should be adjusted to minimize radiation dose following ALARA principles. Pediatric-specific protocols with reduced kVp and mAs should be employed. Sedation may be required for young children.', 'Standard observation if no contrast is used. If contrast is administered, patients should be monitored for 15-30 minutes post-procedure and encouraged to hydrate.', '10-20 minutes', 'None', 'Subject to ALARA (As Low As Reasonably Achievable) radiation safety principles. Must follow ACR-AAPM Technical Standard for Diagnostic Medical Physics Performance Monitoring of CT Equipment.', 'Medium', 'Generally not required for adults. May be necessary for pediatric patients, patients with claustrophobia, or those unable to remain still during the examination.', 'Pregnant patients should only undergo CT if benefits outweigh risks and alternative non-ionizing imaging is not suitable. Elderly patients may require assistance with positioning and may have reduced tolerance for contrast agents.', '2-10 mSv depending on body part and protocol', 'Follow-up assessment of previously identified abnormalities, evaluation of treatment response, or targeted assessment of specific anatomic regions.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ... and 46950 more matches
- **Data\batches\35_batch.sql** (562 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.64', 'Charcôt''s joint, hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'M14.6', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.641', 'Charcôt''s joint, right hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M14.64', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.642', 'Charcôt''s joint, left hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M14.64', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.64', 'Charcôt''s joint, hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'M14.6', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.641', 'Charcôt''s joint, right hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M14.64', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.642', 'Charcôt''s joint, left hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M14.64', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M14.649', 'Charcôt''s joint, unspecified hand', NULL, 'M05-M14', 'Inflammatory polyarthropathies (M05-M14)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M14.64', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\42_batch.sql** (552 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M75.100', 'Unspecified rotator cuff tear or rupture of unspecified shoulder, not specified as traumatic', 'R29.3 (abnormal posture), R29.6 (repeated falls), R52 (pain, unspecified), R29.898 (other symptoms and signs involving the musculoskeletal system)', 'M70-M79', 'Other soft tissue disorders', 'MUSCULOSKELETAL', 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', 'Adhesive capsulitis is often a clinical diagnosis based on history and physical examination findings of progressive shoulder pain and stiffness with limitation of both active and passive range of motion. Imaging is primarily used to exclude other pathologies rather than to confirm the diagnosis. The condition typically progresses through three phases: freezing (painful), frozen (stiff), and thawing (recovery). Many cases resolve spontaneously over 1-3 years, though physical therapy and other interventions may accelerate recovery.', 'MRI is contraindicated in patients with certain implanted devices, severe claustrophobia, or inability to remain still during the examination. Gadolinium contrast should be avoided in patients with severe renal insufficiency (GFR <30 mL/min) due to risk of nephrogenic systemic fibrosis. Ultrasound has no significant contraindications but may be limited in patients with extreme obesity or inability to position the shoulder appropriately.', 'Follow-up imaging is generally not indicated for uncomplicated adhesive capsulitis unless there is failure to respond to conservative treatment after 3-6 months or sudden change in symptoms suggesting alternative or additional pathology. If symptoms persist despite appropriate conservative management, follow-up MRI may be considered to evaluate for concomitant pathology. According to AAOS guidelines, patients should be reassessed clinically at 6-12 week intervals during treatment to monitor progress.', 'X-RAY, ULTRASOUND, MRI', 2, true, 'adhesive capsulitis, shoulder, frozen shoulder, rotator cuff, unspecified shoulder, shoulder pain, limited range of motion, shoulder stiffness', 'M75.10', 'X-RAY (shoulder): Initial imaging modality for unspecified adhesive capsulitis of shoulder. According to the ACR Appropriateness Criteria (2018) for Shoulder Pain, plain radiographs should be the first imaging study to evaluate for osseous abnormalities, calcific tendinitis, and degenerative changes that may contribute to adhesive capsulitis. Provides baseline assessment and helps rule out other conditions that may mimic adhesive capsulitis.', 'LOW', 'ULTRASOUND: Useful for evaluating soft tissue structures including the rotator cuff, biceps tendon, and subacromial-subdeltoid bursa. Can help identify associated pathologies. MRI: Indicated when X-ray findings are inconclusive or when there is suspicion of concomitant rotator cuff pathology. MRI can demonstrate capsular thickening, rotator interval abnormalities, and coracohumeral ligament thickening characteristic of adhesive capsulitis. According to the AAOS Clinical Practice Guidelines (2019), MRI may be considered when clinical diagnosis is uncertain.', 'M19.019 (primary osteoarthritis, unspecified shoulder - due to similar pain pattern), M25.519 (pain in unspecified shoulder - when specific diagnosis not yet determined), M25.619 (stiffness of unspecified shoulder, not elsewhere classified - when focusing only on mobility limitation), M19.90 (unspecified osteoarthritis, unspecified site - due to nonspecific presentation)', '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M76.899', 'Other specified enthesopathies of unspecified lower limb, excluding foot', NULL, 'M70-M79', 'Other soft tissue disorders (M70-M79)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M76.89', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M76.9', 'Unspecified enthesopathy, lower limb, excluding foot', NULL, 'M70-M79', 'Other soft tissue disorders (M70-M79)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M76', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M75.100', 'Unspecified rotator cuff tear or rupture of unspecified shoulder, not specified as traumatic', 'R29.3 (abnormal posture), R29.6 (repeated falls), R52 (pain, unspecified), R29.898 (other symptoms and signs involving the musculoskeletal system)', 'M70-M79', 'Other soft tissue disorders', 'MUSCULOSKELETAL', 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', 'Adhesive capsulitis is often a clinical diagnosis based on history and physical examination findings of progressive shoulder pain and stiffness with limitation of both active and passive range of motion. Imaging is primarily used to exclude other pathologies rather than to confirm the diagnosis. The condition typically progresses through three phases: freezing (painful), frozen (stiff), and thawing (recovery). Many cases resolve spontaneously over 1-3 years, though physical therapy and other interventions may accelerate recovery.', 'MRI is contraindicated in patients with certain implanted devices, severe claustrophobia, or inability to remain still during the examination. Gadolinium contrast should be avoided in patients with severe renal insufficiency (GFR <30 mL/min) due to risk of nephrogenic systemic fibrosis. Ultrasound has no significant contraindications but may be limited in patients with extreme obesity or inability to position the shoulder appropriately.', 'Follow-up imaging is generally not indicated for uncomplicated adhesive capsulitis unless there is failure to respond to conservative treatment after 3-6 months or sudden change in symptoms suggesting alternative or additional pathology. If symptoms persist despite appropriate conservative management, follow-up MRI may be considered to evaluate for concomitant pathology. According to AAOS guidelines, patients should be reassessed clinically at 6-12 week intervals during treatment to monitor progress.', 'X-RAY, ULTRASOUND, MRI', 2, true, 'adhesive capsulitis, shoulder, frozen shoulder, rotator cuff, unspecified shoulder, shoulder pain, limited range of motion, shoulder stiffness', 'M75.10', 'X-RAY (shoulder): Initial imaging modality for unspecified adhesive capsulitis of shoulder. According to the ACR Appropriateness Criteria (2018) for Shoulder Pain, plain radiographs should be the first imaging study to evaluate for osseous abnormalities, calcific tendinitis, and degenerative changes that may contribute to adhesive capsulitis. Provides baseline assessment and helps rule out other conditions that may mimic adhesive capsulitis.', 'LOW', 'ULTRASOUND: Useful for evaluating soft tissue structures including the rotator cuff, biceps tendon, and subacromial-subdeltoid bursa. Can help identify associated pathologies. MRI: Indicated when X-ray findings are inconclusive or when there is suspicion of concomitant rotator cuff pathology. MRI can demonstrate capsular thickening, rotator interval abnormalities, and coracohumeral ligament thickening characteristic of adhesive capsulitis. According to the AAOS Clinical Practice Guidelines (2019), MRI may be considered when clinical diagnosis is uncertain.', 'M19.019 (primary osteoarthritis, unspecified shoulder - due to similar pain pattern), M25.519 (pain in unspecified shoulder - when specific diagnosis not yet determined), M25.619 (stiffness of unspecified shoulder, not elsewhere classified - when focusing only on mobility limitation), M19.90 (unspecified osteoarthritis, unspecified site - due to nonspecific presentation)', '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M76.899', 'Other specified enthesopathies of unspecified lower limb, excluding foot', NULL, 'M70-M79', 'Other soft tissue disorders (M70-M79)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M76.89', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M76.9', 'Unspecified enthesopathy, lower limb, excluding foot', NULL, 'M70-M79', 'Other soft tissue disorders (M70-M79)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M76', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M75.101', 'Unspecified rotator cuff tear or rupture of right shoulder, not specified as traumatic', 'R29.898 (other symptoms and signs involving the musculoskeletal system), R52 (pain, unspecified), R29.6 (repeated falls), R29.3 (abnormal posture)', 'M70-M79', 'Other soft tissue disorders', 'MUSCULOSKELETAL', 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', 'M75.101 represents unspecified rotator cuff tendinitis of the right shoulder. Many cases can be diagnosed clinically without advanced imaging. Consider initial conservative management with physical therapy and anti-inflammatory medications before pursuing advanced imaging unless there are red flags (history of trauma, weakness, mass, etc.). Imaging should be correlated with clinical findings as incidental rotator cuff abnormalities are common in asymptomatic individuals, particularly with advancing age.', 'MRI is contraindicated in patients with certain implanted devices, severe claustrophobia, or inability to remain still during the examination. Gadolinium contrast should be avoided in patients with severe renal insufficiency (GFR <30 mL/min) due to the risk of nephrogenic systemic fibrosis. Ultrasound has no significant contraindications but is operator-dependent and may have limited utility in obese patients.', 'If initial X-rays are negative but symptoms persist after 4-6 weeks of conservative therapy, consider ultrasound or MRI. For partial tears managed conservatively, follow-up imaging is typically not necessary unless symptoms worsen. For patients undergoing surgical repair, post-operative imaging may be obtained at 3-6 months to assess healing, though clinical improvement is the primary indicator of success. According to AAOS guidelines, routine follow-up imaging for asymptomatic patients after treatment is not recommended.', 'X-RAY, ULTRASOUND, MRI', 2, true, 'rotator cuff tendinitis, shoulder pain, impingement syndrome, unspecified shoulder, shoulder bursitis, subacromial impingement', 'M75.10', 'X-RAY (shoulder, AP and lateral views) is the recommended initial imaging modality for unspecified rotator cuff tendinitis. According to the ACR Appropriateness Criteria (2018) for Shoulder Pain, radiographs should be the first imaging study to evaluate for osseous abnormalities, calcific tendinitis, and to rule out other pathologies that may mimic rotator cuff disease.', 'LOW', 'ULTRASOUND is recommended as a secondary imaging option with high sensitivity (92-95%) for full-thickness rotator cuff tears. MRI without contrast may be considered for cases with normal radiographs but persistent symptoms, offering detailed evaluation of the rotator cuff, labrum, and surrounding soft tissues. The AAOS Clinical Practice Guidelines (2019) support the use of MRI when surgical intervention is being considered.', 'M25.511 (pain in right shoulder), M19.011 (primary osteoarthritis, right shoulder), M54.12 (radiculopathy, cervical region), M53.1 (cervicobrachial syndrome), G56.00 (carpal tunnel syndrome, unspecified upper limb)', '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\56_batch.sql** (541 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.842', 'Visuospatial deficit', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.84', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.843', 'Psychomotor deficit', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.84', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.844', 'Frontal lobe and executive function deficit', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.84', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.842', 'Visuospatial deficit', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.84', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.843', 'Psychomotor deficit', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.84', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.844', 'Frontal lobe and executive function deficit', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.84', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('R41.85', 'Anosognosia', NULL, 'R40-R46', 'Symptoms and signs involving cognition, perception, emotional state and behavior (R40-R46)', NULL, 'Chapter 18: Symptoms, signs and abnormal clinical and laboratory findings, not elsewhere classified (R00-R99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'R41.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\26_batch.sql** (538 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.60', 'Acute embolism and thrombosis of unspecified veins of upper extremity', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'I82.6', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.601', 'Acute embolism and thrombosis of unspecified veins of right upper extremity', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I82.60', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.602', 'Acute embolism and thrombosis of unspecified veins of left upper extremity', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I82.60', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.60', 'Acute embolism and thrombosis of unspecified veins of upper extremity', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'I82.6', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.601', 'Acute embolism and thrombosis of unspecified veins of right upper extremity', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I82.60', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.602', 'Acute embolism and thrombosis of unspecified veins of left upper extremity', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I82.60', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I82.603', 'Acute embolism and thrombosis of unspecified veins of upper extremity, bilateral', NULL, 'I80-I89', 'Diseases of veins, lymphatic vessels and lymph nodes, not elsewhere classified (I80-I89)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I82.60', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\23_batch.sql** (535 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I05.8', 'Other rheumatic mitral valve diseases', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I05', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I05.9', 'Rheumatic mitral valve disease, unspecified', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I05', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I06', 'Rheumatic aortic valve diseases', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I05.8', 'Other rheumatic mitral valve diseases', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I05', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I05.9', 'Rheumatic mitral valve disease, unspecified', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I05', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I06', 'Rheumatic aortic valve diseases', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('I06.0', 'Rheumatic aortic stenosis', NULL, 'I05-I09', 'Chronic rheumatic heart diseases (I05-I09)', NULL, 'Chapter 9: Diseases of the circulatory system (I00-I99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'I06', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\13_batch.sql** (531 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('F98.8', 'Other specified behavioral and emotional disorders with onset usually occurring in childhood and adolescence', NULL, 'F90-F98', 'Behavioral and emotional disorders with onset usually occurring in childhood and adolescence (F90-F98)', NULL, 'Chapter 5: Mental, Behavioral and Neurodevelopmental disorders (F01-F99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'F98', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('F99', 'Mental disorder, not otherwise specified', NULL, 'F99', 'Unspecified mental disorder (F99)', NULL, 'Chapter 5: Mental, Behavioral and Neurodevelopmental disorders (F01-F99)', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G00', 'Bacterial meningitis, not elsewhere classified', NULL, 'G00-G09', 'Inflammatory diseases of the central nervous system (G00-G09)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('F98.8', 'Other specified behavioral and emotional disorders with onset usually occurring in childhood and adolescence', NULL, 'F90-F98', 'Behavioral and emotional disorders with onset usually occurring in childhood and adolescence (F90-F98)', NULL, 'Chapter 5: Mental, Behavioral and Neurodevelopmental disorders (F01-F99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'F98', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('F99', 'Mental disorder, not otherwise specified', NULL, 'F99', 'Unspecified mental disorder (F99)', NULL, 'Chapter 5: Mental, Behavioral and Neurodevelopmental disorders (F01-F99)', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G00', 'Bacterial meningitis, not elsewhere classified', NULL, 'G00-G09', 'Inflammatory diseases of the central nervous system (G00-G09)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G00.0', 'Hemophilus meningitis', NULL, 'G00-G09', 'Inflammatory diseases of the central nervous system (G00-G09)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'G00', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\46_batch.sql** (527 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97', 'Periprosthetic fracture around internal prosthetic joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97.0', 'Periprosthetic fracture around internal prosthetic hip joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'M97', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97.01', 'Periprosthetic fracture around internal prosthetic right hip joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M97.0', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97', 'Periprosthetic fracture around internal prosthetic joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97.0', 'Periprosthetic fracture around internal prosthetic hip joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'M97', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97.01', 'Periprosthetic fracture around internal prosthetic right hip joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M97.0', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M97.02', 'Periprosthetic fracture around internal prosthetic left hip joint', NULL, 'M97', 'Periprosthetic fracture around internal prosthetic joint (M97)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M97.0', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\39_batch.sql** (526 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.823', 'Other cervical disc disorders at C6-C7 level', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M50.82', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.83', 'Other cervical disc disorders, cervicothoracic region', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M50.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.9', 'Cervical disc disorder, unspecified', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'M50', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.823', 'Other cervical disc disorders at C6-C7 level', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M50.82', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.83', 'Other cervical disc disorders, cervicothoracic region', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M50.8', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.9', 'Cervical disc disorder, unspecified', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, false, NULL, 'M50', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('M50.90', 'Cervical disc disorder, unspecified, unspecified cervical region', NULL, 'M50-M54', 'Other dorsopathies (M50-M54)', NULL, 'Chapter 13: Diseases of the musculoskeletal system and connective tissue (M00-M99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'M50.9', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches
- **Data\batches\14_batch.sql** (525 matches)
  - Unique matches: `primary`
  - Sample context:
    ```
    2: BEGIN;
3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G80.0', 'Spastic quadriplegic cerebral palsy', NULL, 'G80-G83', 'Cerebral palsy and other paralytic syndromes (G80-G83)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'G80', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('X99.9', 'Assault by unspecified sharp object', NULL, 'X92-Y09', 'Assault (X92-Y09)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'X99', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G50.0', 'Trigeminal neuralgia', 'R51 (headache), R20.0 (anesthesia of skin), R20.2 (paresthesia of skin), R29.898 (other symptoms and signs involving the nervous system), R52 (pain, unspecified)', 'G50-G59', 'Nerve, nerve root and plexus disorders', 'NEUROLOGICAL', 'Chapter 06: Diseases of the nervous system (G00-G99)', 'Trigeminal neuralgia is often diagnosed clinically based on characteristic symptoms (paroxysmal, unilateral, electric shock-like pain in trigeminal nerve distribution). Imaging is primarily used to rule out secondary causes rather than to confirm the diagnosis. According to the American Headache Society guidelines (2019), approximately 15% of trigeminal neuralgia cases are secondary to identifiable structural abnormalities. Classic trigeminal neuralgia is often associated with neurovascular compression of the trigeminal nerve root, which may be visualized on high-quality MRI sequences.', 'MRI is contraindicated in patients with certain implanted devices (pacemakers, cochlear implants, certain aneurysm clips), severe claustrophobia, or metallic foreign bodies. Gadolinium contrast should be used with caution in patients with renal insufficiency due to the risk of nephrogenic systemic fibrosis. For CT imaging, radiation exposure should be considered, particularly in younger patients or those requiring multiple studies. Iodinated contrast is contraindicated in patients with severe contrast allergies or significant renal dysfunction.', 'Initial imaging is typically performed once to rule out secondary causes. Follow-up imaging is generally not indicated unless there is a change in clinical presentation, failure to respond to appropriate medical therapy, or consideration of surgical intervention such as microvascular decompression. For patients being evaluated for surgical treatment, specialized MRI protocols focusing on the trigeminal nerve and cerebellopontine angle may be recommended. According to the Congress of Neurological Surgeons guidelines (2020), repeat imaging may be considered if symptoms persist despite medical management or if symptoms change in character.', 'MRI, CT', 1, true, 'trigeminal neuralgia, tic douloureux, facial pain, cranial nerve disorder, neuropathic pain, facial nerve, trigeminal nerve', 'G50', 'MRI brain with and without contrast is the primary imaging modality for trigeminal neuralgia (G50.0). According to the American College of Radiology (ACR) Appropriateness Criteria for Cranial Neuropathy (2017), MRI is recommended to evaluate for potential neurovascular compression of the trigeminal nerve or to rule out other structural causes such as tumors, multiple sclerosis plaques, or vascular malformations. High-resolution T2-weighted sequences are particularly useful for visualizing the trigeminal nerve and adjacent vascular structures.', 'MEDIUM', 'CT of the head may be considered as an alternative when MRI is contraindicated. While less sensitive for soft tissue abnormalities, CT can still identify some structural causes of trigeminal neuralgia such as bony abnormalities or large masses. According to the American Academy of Neurology (AAN) practice guidelines, CT may also be useful to evaluate for calcified vascular structures or bony abnormalities of the skull base that might contribute to nerve compression.', 'M26.62 (temporomandibular joint disorder), K08.89 (other specified disorders of teeth and supporting structures), G44.1 (vascular headache), G44.209 (tension-type headache, unspecified), G43.909 (migraine, unspecified)', '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ```
    3: 
4: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G80.0', 'Spastic quadriplegic cerebral palsy', NULL, 'G80-G83', 'Cerebral palsy and other paralytic syndromes (G80-G83)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'G80', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
5: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('X99.9', 'Assault by unspecified sharp object', NULL, 'X92-Y09', 'Assault (X92-Y09)', NULL, 'Chapter 20: External causes of morbidity (V00-Y99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'X99', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
6: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G50.0', 'Trigeminal neuralgia', 'R51 (headache), R20.0 (anesthesia of skin), R20.2 (paresthesia of skin), R29.898 (other symptoms and signs involving the nervous system), R52 (pain, unspecified)', 'G50-G59', 'Nerve, nerve root and plexus disorders', 'NEUROLOGICAL', 'Chapter 06: Diseases of the nervous system (G00-G99)', 'Trigeminal neuralgia is often diagnosed clinically based on characteristic symptoms (paroxysmal, unilateral, electric shock-like pain in trigeminal nerve distribution). Imaging is primarily used to rule out secondary causes rather than to confirm the diagnosis. According to the American Headache Society guidelines (2019), approximately 15% of trigeminal neuralgia cases are secondary to identifiable structural abnormalities. Classic trigeminal neuralgia is often associated with neurovascular compression of the trigeminal nerve root, which may be visualized on high-quality MRI sequences.', 'MRI is contraindicated in patients with certain implanted devices (pacemakers, cochlear implants, certain aneurysm clips), severe claustrophobia, or metallic foreign bodies. Gadolinium contrast should be used with caution in patients with renal insufficiency due to the risk of nephrogenic systemic fibrosis. For CT imaging, radiation exposure should be considered, particularly in younger patients or those requiring multiple studies. Iodinated contrast is contraindicated in patients with severe contrast allergies or significant renal dysfunction.', 'Initial imaging is typically performed once to rule out secondary causes. Follow-up imaging is generally not indicated unless there is a change in clinical presentation, failure to respond to appropriate medical therapy, or consideration of surgical intervention such as microvascular decompression. For patients being evaluated for surgical treatment, specialized MRI protocols focusing on the trigeminal nerve and cerebellopontine angle may be recommended. According to the Congress of Neurological Surgeons guidelines (2020), repeat imaging may be considered if symptoms persist despite medical management or if symptoms change in character.', 'MRI, CT', 1, true, 'trigeminal neuralgia, tic douloureux, facial pain, cranial nerve disorder, neuropathic pain, facial nerve, trigeminal nerve', 'G50', 'MRI brain with and without contrast is the primary imaging modality for trigeminal neuralgia (G50.0). According to the American College of Radiology (ACR) Appropriateness Criteria for Cranial Neuropathy (2017), MRI is recommended to evaluate for potential neurovascular compression of the trigeminal nerve or to rule out other structural causes such as tumors, multiple sclerosis plaques, or vascular malformations. High-resolution T2-weighted sequences are particularly useful for visualizing the trigeminal nerve and adjacent vascular structures.', 'MEDIUM', 'CT of the head may be considered as an alternative when MRI is contraindicated. While less sensitive for soft tissue abnormalities, CT can still identify some structural causes of trigeminal neuralgia such as bony abnormalities or large masses. According to the American Academy of Neurology (AAN) practice guidelines, CT may also be useful to evaluate for calcified vascular structures or bony abnormalities of the skull base that might contribute to nerve compression.', 'M26.62 (temporomandibular joint disorder), K08.89 (other specified disorders of teeth and supporting structures), G44.1 (vascular headache), G44.209 (tension-type headache, unspecified), G43.909 (migraine, unspecified)', '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
7: INSERT INTO medical_icd10_codes ("icd10_code", "description", "associated_symptom_clusters", "block", "block_description", "category", "chapter", "clinical_notes", "contraindications", "follow_up_recommendations", "imaging_modalities", "inappropriate_imaging_risk", "is_billable", "keywords", "parent_code", "primary_imaging", "priority", "secondary_imaging", "typical_misdiagnosis_codes", "imported_at", "updated_at") VALUES ('G50.1', 'Atypical facial pain', NULL, 'G50-G59', 'Nerve, nerve root and plexus disorders (G50-G59)', NULL, 'Chapter 6: Diseases of the nervous system (G00-G99)', NULL, NULL, NULL, NULL, NULL, true, NULL, 'G50', NULL, NULL, NULL, NULL, '2025-04-08T04:08:29.292Z', '2025-04-08T04:08:29.292Z');
    ```
    ... and 498 more matches

### Template Handling

- Files affected: 163
- Total matches: 1552

#### Directory Breakdown

- **Data\batches**: 29 files (17.8%)
- **Docs\implementation**: 24 files (14.7%)
- **Docs**: 19 files (11.7%)
- **test-results\llm-validation**: 18 files (11.0%)
- **.**: 15 files (9.2%)
- **db-migrations**: 6 files (3.7%)
- **src\services\notification\services\connection-notifications**: 5 files (3.1%)
- **src\services\notification\templates\connection**: 5 files (3.1%)
- **src\services\notification\templates**: 5 files (3.1%)
- **old_code\src\services\notification\services\connection**: 4 files (2.5%)
- **src\utils\database**: 4 files (2.5%)
- **src\utils\llm\providers**: 3 files (1.8%)
- **Data\tables**: 2 files (1.2%)
- **old_code**: 2 files (1.2%)
- **src\services\notification\services**: 2 files (1.2%)
- **src\services\notification\services\connection\approval**: 2 files (1.2%)
- **src\services\notification\services\connection\rejection**: 2 files (1.2%)
- **src\services\notification\services\connection\request**: 2 files (1.2%)
- **src\services\notification\services\connection\termination**: 2 files (1.2%)
- **src\services\validation**: 2 files (1.2%)
- **src\utils\llm**: 2 files (1.2%)
- **tests**: 2 files (1.2%)
- **Data**: 1 files (0.6%)
- **Docs\prompt_examples**: 1 files (0.6%)
- **old_code\src\services**: 1 files (0.6%)
- **src\services\billing\stripe\webhooks**: 1 files (0.6%)
- **src\services\notification**: 1 files (0.6%)
- **tests\batch**: 1 files (0.6%)

#### Top Affected Files

- **Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql** (123 matches)
  - Unique matches: `prompt`, `template`
  - Sample context:
    ```
    60: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76390', 'Magnetic resonance spectroscopy (MRS)', 'If performed with contrast, standard MRI contrast (gadolinium) allergy protocols apply. Patients with history of gadolinium reactions should be premedicated or alternative non-contrast protocols should be considered.', '76376/76377 (3D rendering), 70551-70553 (Brain MRI), 72195-72197 (Pelvic MRI), 77046-77049 (Breast MRI), or organ-specific MRI codes depending on the clinical indication', 'Various (brain, prostate, breast, musculoskeletal)', 'Advanced MRI technique', 'High', 'Absolute: Certain implanted devices (pacemakers not MR-conditional, cochlear implants, certain aneurysm clips), ferromagnetic foreign bodies in critical locations. Relative: Claustrophobia, inability to remain still, severe renal impairment if contrast is used (GFR <30 mL/min).', 'Not required, but may be performed with or without contrast', '1.5T or 3T MRI scanner with spectroscopy capability, specialized MRS software and processing capabilities, standard MRI coils appropriate for the body part being imaged', 'Single-voxel or multi-voxel spectroscopy sequences added to conventional MRI protocol. Typically uses PRESS (Point Resolved Spectroscopy) or STEAM (Stimulated Echo Acquisition Mode) sequences. Requires careful voxel placement to avoid susceptibility artifacts.', 'Not applicable', 'Patient must remain completely still during acquisition. Standard MRI positioning applies. May be challenging for patients with pain, movement disorders, or cognitive impairment.', 'MRI', 'MRS provides biochemical information about tissues in addition to anatomical information from conventional MRI. Most commonly used for brain applications but also valuable for prostate, breast, and musculoskeletal applications. Interpretation requires specialized training and experience.', 'Standard MRI preparation: removal of metallic objects, screening for contraindications, possible NPO status depending on body part and clinical indication', 'Safe for pediatric use. May require sedation in young children. Metabolite profiles differ from adults and age-specific normal values should be used for interpretation. Particularly useful for evaluating pediatric brain tumors, metabolic disorders, and developmental abnormalities.', 'Standard post-MRI care. If contrast was administered, ensure adequate hydration.', '45-60 minutes (includes standard MRI sequences plus spectroscopy)', 'None', 'Requires physician supervision. May require prior authorization from insurance carriers. Technical component must be performed on MRI equipment that meets ACR accreditation standards.', 'None', 'Not routinely required for adults. May be necessary for pediatric patients, claustrophobic patients, or those unable to remain still. Conscious sedation or general anesthesia protocols should follow institutional guidelines.', 'Pregnant patients: No known harmful effects, but benefit should outweigh theoretical risks. Elderly patients: May require assistance with positioning and shorter protocols due to comfort issues. Renal impairment: If contrast is used, follow institutional guidelines for gadolinium administration based on GFR.', '0 mSv (no ionizing radiation)', 'Metabolite peaks including N-acetylaspartate (NAA), choline, creatine, lactate, lipids, myoinositol, glutamate/glutamine, and others. Altered metabolite ratios can indicate various pathologies including tumors, metabolic disorders, neurodegenerative diseases, and inflammatory conditions.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
61: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76499', 'Unlisted diagnostic radiographic procedure', 'Variable - Depends on the specific unlisted procedure being performed', 'Consider whether a more specific CPT code exists that accurately describes the procedure performed. Consult current CPT coding manuals and resources to identify the most appropriate code before defaulting to an unlisted procedure code.', 'Various - Depends on the specific unlisted procedure being performed', 'Unlisted Diagnostic Radiographic Procedure', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Various - This is an unlisted code that can apply to any radiologic modality not described by other specific CPT codes', 'This code is used when no other CPT code accurately describes the radiologic procedure performed. When using this code, detailed documentation is essential, including a clear description of what was done, why it was necessary, and how it differs from standard coded procedures. Many payers require prior authorization for unlisted procedure codes. The ACR recommends consulting with coding specialists when using unlisted procedure codes to ensure proper documentation and billing.', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'CPT code 76499 should only be used when a more specific CPT code is unavailable. Documentation must include a detailed description of the procedure performed, including the technique, time, equipment, and interpretation. Many payers require additional documentation and may have specific requirements for unlisted procedure code submission.', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', 'Variable - Depends on the specific unlisted procedure being performed', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
62: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76818', 'Fetal biophysical profile; with non-stress testing', 'No contrast agents used; no specific allergy considerations.', '76819 (Fetal biophysical profile without non-stress testing), 76805 (Obstetrical ultrasound, detailed fetal anatomic examination), 59025 (Non-stress test only)', 'Fetus and Maternal Abdomen', 'Obstetrical Ultrasound', 'Moderate', 'No absolute contraindications. Relative contraindications include severe maternal obesity which may limit image quality.', 'None', 'Real-time ultrasound equipment with color Doppler capabilities, electronic fetal heart rate monitor for non-stress testing component, ultrasound gel, and appropriate transducers (typically curvilinear).', 'Comprehensive evaluation including: 1) Fetal breathing movements, 2) Fetal body movements, 3) Fetal tone, 4) Amniotic fluid volume assessment, and 5) Non-stress test (electronic fetal heart rate monitoring for 20-30 minutes).', 'Not Applicable', 'Patient positioned supine with left lateral tilt to avoid compression of the inferior vena cava. Adjustments may be needed for patient comfort or to optimize fetal visualization.', 'Ultrasound', 'Commonly used in high-risk pregnancies to assess fetal well-being. Typically performed after 28 weeks gestation. May be repeated at regular intervals depending on clinical indications and risk factors.', 'Full bladder may be required for early pregnancy examinations; no specific preparation needed for later gestational ages. Patient should avoid caffeine for 24 hours prior to the examination due to the non-stress test component.', 'This is a prenatal procedure specifically designed for fetal assessment. Not applicable to pediatric patients outside the womb.', 'No specific post-procedure care required. Results should be communicated to the referring provider promptly, especially if abnormalities are detected.', '30-60 minutes', 'None', 'Requires documentation of medical necessity. Must be performed by or under supervision of a qualified healthcare provider with appropriate training in obstetrical ultrasound. Non-stress testing component requires fetal monitoring equipment and interpretation.', 'None', 'No sedation required.', 'Particularly indicated for high-risk pregnancies including those with maternal hypertension, diabetes, decreased fetal movement, intrauterine growth restriction, post-term pregnancy, and history of stillbirth.', '0 mSv (no ionizing radiation)', 'Assessment of fetal well-being through evaluation of fetal breathing movements, body movements, tone, amniotic fluid volume, and fetal heart rate reactivity. Each component is scored 0 or 2 points, with a total possible score of 10 points. Scores of 8-10 are considered normal.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
63: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76881', 'Ultrasound, extremity, nonvascular, real-time with image documentation; complete', 'None for standard procedure. No contrast agents used.', 'MRI of extremity (73221-73223 for upper extremity, 73721-73723 for lower extremity), CT of extremity (73200-73202 for upper extremity, 73700-73702 for lower extremity), Radiography of extremity (various codes based on specific region), or Limited ultrasound examination of extremity (76882)', 'Extremity (arm, elbow, wrist, hand, leg, knee, ankle, foot)', 'Diagnostic Ultrasound', 'Moderate', 'No absolute contraindications. Relative contraindications include open wounds or recent surgical sites that cannot be covered with an appropriate barrier.', 'None', 'High-frequency linear transducer (typically 7-18 MHz), ultrasound machine with color and power Doppler capabilities, ultrasound gel, and image storage system.', 'Complete examination of the specified extremity including all relevant joints, muscles, tendons, ligaments, and other soft tissue structures. Must include static and dynamic assessment with standardized imaging planes. Comparison with contralateral side when clinically indicated. Minimum of two orthogonal planes with documentation of any abnormalities.', 'Unilateral', 'Patient positioning varies based on the extremity being examined. May require specific positioning to optimize visualization of structures of interest. Patients with limited mobility may require assistance with positioning.', 'Ultrasound', 'CPT 76881 represents a complete examination of an extremity, which includes assessment of all relevant structures. For a limited or focused examination of a specific area within an extremity, use CPT 76882 instead. Documentation must support the medical necessity and completeness of the examination.', 'No specific preparation required. Patient should wear loose-fitting clothing or be prepared to change into a gown for access to the extremity being examined.', 'Safe for all pediatric age groups. No ionizing radiation. May require age-appropriate distraction techniques for younger patients. Consider smaller, higher frequency transducers for optimal imaging of smaller anatomic structures.', 'No specific post-procedure care required. Patient may resume normal activities immediately.', '20-30 minutes', 'None', 'Requires physician supervision. Must include real-time imaging with permanent image documentation. Complete examination requires assessment of all relevant anatomic structures within the extremity being examined.', 'None', 'Typically not required. For uncooperative patients or children, minimal sedation may be considered in rare circumstances.', 'Safe during pregnancy. For elderly patients, may require additional positioning support. For patients with implanted hardware, imaging may be limited by acoustic shadowing and reverberation artifacts.', '0 mSv (no ionizing radiation)', 'Tendon/ligament tears or inflammation, joint effusions, synovitis, bursitis, muscle tears or hematomas, foreign bodies, soft tissue masses, ganglion cysts, nerve entrapment, joint instability, cartilage abnormalities, and bone surface irregularities.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
64: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('77021', 'Magnetic resonance guidance for needle placement (e.g., for biopsy, needle aspiration, injection, or placement of localization device)', 'Screen for gadolinium contrast allergies if contrast is used; medication allergies relevant to local anesthetics or sedatives', 'CT-guided needle placement (77012), Ultrasound-guided needle placement (76942), Fluoroscopic-guided needle placement (77002), Stereotactic guidance for breast biopsy (77031, 77032)', 'Various (depends on clinical indication)', 'Interventional Radiology Procedure', 'High', 'Absolute: Non-MRI compatible implanted devices, ferromagnetic foreign bodies in critical locations, first-trimester pregnancy for non-urgent procedures. Relative: Claustrophobia, inability to remain still, severe renal impairment if contrast is used', 'Variable; may use gadolinium-based contrast agents when needed for lesion visualization', 'MRI-compatible interventional equipment including needles, biopsy devices, and guidance systems; MRI scanner (typically 1.5T or 3T); MRI-compatible monitoring equipment', 'Initial diagnostic MRI sequences for planning; intermittent rapid MRI sequences during needle advancement; confirmation sequences after placement; may include T1, T2, STIR, or gradient echo sequences depending on target', 'Not applicable', 'Patient must remain completely still during imaging sequences; positioning depends on target area; may require specialized positioning devices', 'MRI', 'Provides high soft tissue contrast for targeting lesions not visible on other modalities; particularly valuable for prostate, breast, musculoskeletal, and certain neurological applications', 'NPO status varies by target organ; removal of all metallic objects; screening for MRI contraindications; informed consent; possible administration of anxiolytics; IV access establishment', 'May require general anesthesia; dose adjustments for contrast and medications; specialized pediatric MRI-compatible equipment; pediatric radiologist involvement recommended', 'Monitoring for bleeding or other complications; specific care instructions based on target organ; follow-up imaging as clinically indicated', '60-120 minutes', 'None', 'Requires documentation of medical necessity; radiologist must be present during entire procedure; requires specific documentation of needle placement confirmation', 'None', 'Conscious sedation often required; anesthesia support may be necessary for complex cases or pediatric patients', 'Pregnancy: avoid in first trimester unless urgent; Renal impairment: caution with gadolinium contrast; Elderly: may require additional monitoring; Obesity: may have scanner size limitations', '0 mSv (no ionizing radiation)', 'Accurate needle placement into target lesion; tissue sampling for pathologic diagnosis; therapeutic agent delivery; placement of localization devices', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ```
    224: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76098', 'Radiological examination, surgical specimen', 'None, as no contrast is used', '76099 (Unlisted radiographic procedure), 77065-77067 (Screening/diagnostic mammography for intact breast)', 'Surgical specimen', 'Diagnostic radiography', 'Low', 'None, as this is performed on excised tissue', 'None', 'Specimen radiography unit, compression paddle for breast specimens, specimen containers, radiopaque markers', 'Standard two-view radiography of the specimen. For breast specimens, compression views are typically obtained. Images should include specimen identification markers.', 'Not applicable', 'Not applicable as procedure is performed on excised tissue', 'X-ray', 'Commonly used for breast specimens to confirm removal of targeted lesions, particularly microcalcifications. Aids in guiding pathologic examination of the specimen.', 'None required. This is performed on excised tissue specimens.', 'Rarely applicable to pediatric patients except in specific oncologic cases', 'None required. Specimen is returned to pathology for processing after imaging.', '10-15 minutes', 'None', 'Must be performed under physician supervision. Requires documentation of specimen identification and correlation with surgical pathology.', 'Low', 'Not applicable as procedure is performed on excised tissue', 'Most commonly used in breast cancer patients undergoing lumpectomy or excisional biopsy', '0.1-0.3 mSv', 'Calcifications, abnormal densities, clips, wires, or other markers placed during surgery. For breast specimens, confirms presence of suspicious calcifications or masses identified on mammography.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
225: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76391', 'Magnetic resonance (eg, vibration) elastography', 'Standard MRI allergy considerations if contrast is used in conjunction with elastography', 'Liver assessment alternatives: Ultrasound elastography (CPT 91200), Transient elastography (CPT 91200), Acoustic radiation force impulse imaging (ARFI) (CPT 91200), Liver biopsy (CPT 47000)', 'Various (commonly liver, but also applicable to other organs including breast, prostate, kidney, spleen, pancreas, and muscle)', 'Advanced Functional MRI', 'Moderate', 'Standard MRI contraindications: pacemakers/implanted electronic devices, certain metallic implants, severe claustrophobia, inability to remain still. Specific to elastography: ascites may limit liver assessment, iron overload may affect signal quality', 'Not required for elastography sequence, but may be combined with contrast-enhanced MRI in the same session', 'MRI scanner (1.5T or 3T), specialized MR elastography hardware (passive driver and active pneumatic driver system), elastography software package for wave visualization and stiffness map generation', 'Specialized MR sequence using motion-encoding gradients synchronized with mechanical waves (typically 60Hz) delivered via a passive driver placed on the body surface. Acquisition of wave images followed by processing to generate quantitative stiffness maps measured in kilopascals (kPa)', 'Not applicable', 'Patient must remain still during acquisition. Positioning depends on target organ (supine for liver, breast, abdomen; prone may be used for breast in some protocols)', 'MRI', 'Particularly valuable for non-invasive assessment of liver fibrosis as an alternative to biopsy. Growing applications in other organ systems. Provides quantitative measurements that can be used for longitudinal monitoring of disease progression or treatment response', 'Standard MRI preparation: removal of metallic objects, screening for contraindications, fasting for 4-6 hours may be recommended for abdominal studies to reduce bowel peristalsis', 'Safe for pediatric use with appropriate MRI screening. May require sedation in young children. Lower threshold values for liver fibrosis staging may apply compared to adults', 'No special care required beyond standard post-MRI instructions', '10-15 minutes for elastography sequence alone; 30-60 minutes when combined with standard MRI protocols', 'None', 'Requires FDA-cleared MR elastography hardware and software. Reimbursement may require specific documentation of medical necessity, particularly for non-liver applications', 'None', 'Not typically required for adults. May be necessary for pediatric patients or adults with severe claustrophobia or inability to remain still', 'Pregnancy: Generally considered safe after first trimester, but benefit-risk assessment should be performed. Obesity: May have reduced technical success due to wave penetration limitations. Elderly: No specific modifications needed', '0 mSv (no ionizing radiation)', 'Quantitative tissue stiffness measurements useful for assessing fibrosis/cirrhosis in liver disease, characterizing focal lesions, evaluating muscle pathology, and assessing other conditions where tissue mechanical properties are altered', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
226: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76819', 'Fetal biophysical profile with non-stress testing', 'No contrast agents used; no specific allergy considerations.', 'CPT 76818 (Fetal biophysical profile without non-stress testing), CPT 59025 (Non-stress test only), CPT 76816 (Follow-up ultrasound for fetal growth), CPT 76805/76811 (Complete obstetrical ultrasound)', 'Fetus/Uterus', 'Obstetrical Ultrasound', 'Moderate', 'No absolute contraindications. Relative contraindications include severe maternal obesity which may limit image quality.', 'None', 'Real-time ultrasound machine with obstetric capabilities, electronic fetal heart rate monitor, ultrasound gel, examination table with stirrups optional.', 'Combines real-time ultrasound assessment of fetal breathing movements, body movements, fetal tone, and amniotic fluid volume with electronic fetal heart rate monitoring (non-stress test). Each component is scored 0-2 points for a total possible score of 10.', 'Not applicable', 'Patient positioned supine with left lateral tilt to prevent aortocaval compression. Pillows may be used for comfort. Alternative positions may be used if needed for patient comfort or optimal imaging.', 'Ultrasound', 'Commonly used in high-risk pregnancies, post-term pregnancies, decreased fetal movement, intrauterine growth restriction, and other conditions where fetal well-being assessment is indicated. A score of 8-10 is considered normal, 6 is equivocal, and 4 or less is abnormal.', 'Full bladder not required. Patient should be well-hydrated. No fasting required.', 'Not applicable as this is a fetal assessment procedure.', 'No specific post-procedure care required. Results should be communicated to referring provider promptly, especially if abnormalities are detected.', '30-60 minutes', 'None', 'Requires documentation of medical necessity. Must be performed by or under supervision of qualified healthcare provider. Follows ACOG guidelines for high-risk pregnancy monitoring.', 'None', 'No sedation required.', 'Indicated for high-risk pregnancies including maternal conditions (hypertension, diabetes, autoimmune disorders), fetal conditions (IUGR, oligohydramnios), and post-term pregnancies. Modified protocols may be needed for multiple gestations.', '0 mSv (no ionizing radiation)', 'Assesses fetal well-being through evaluation of fetal breathing movements, gross body movements, fetal tone, amniotic fluid volume, and fetal heart rate reactivity. Abnormal findings may indicate fetal compromise or distress.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
227: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76830', 'Ultrasound, transvaginal', 'Latex allergy considerations for probe cover. Ultrasound gel allergies are rare but should be assessed.', '76856 (Ultrasound, pelvic, complete), 72195 (MRI pelvis without contrast), 72197 (MRI pelvis without and with contrast), 74177 (CT abdomen and pelvis with contrast)', 'Female pelvic organs (uterus, ovaries, adnexa)', 'Diagnostic Ultrasound Procedures', 'Moderate', 'Relative contraindications include patient refusal, inability to tolerate transvaginal probe placement, virginal status, severe vaginal stenosis, or active vaginal bleeding/infection.', 'None', 'Ultrasound machine with transvaginal probe (5-9 MHz), probe covers, ultrasound gel, examination table with stirrups or modified lithotomy position capability.', 'Endovaginal probe (5-9 MHz) examination of uterus in sagittal and transverse planes, cervix, endometrium, myometrium, and adnexa. Ovaries evaluated for size, follicles, and abnormalities. Color Doppler may be utilized when indicated.', 'Not applicable', 'Patient positioned in modified lithotomy position. Accommodations may be needed for patients with mobility limitations or joint problems.', 'Ultrasound', 'High clinical utility for evaluation of pelvic pain, abnormal bleeding, infertility workup, and characterization of pelvic masses. Superior to transabdominal ultrasound for detailed evaluation of pelvic organs.', 'Patient should have a full bladder for transabdominal approach if performed in conjunction. Empty bladder preferred for transvaginal portion. Patient should be informed about the procedure and provide consent.', 'Generally not performed in prepubertal patients. Alternative imaging modalities such as transabdominal ultrasound, MRI, or CT may be more appropriate for pediatric patients.', 'No specific aftercare required. Patient may experience mild discomfort after the procedure.', '20-30 minutes', 'None', 'Requires appropriate credentialing per ACR guidelines. Must be performed by or under supervision of a qualified physician.', 'None', 'Not typically required. Anxiolytic medication may be considered for patients with severe anxiety.', 'Modifications may be needed for patients with vaginal stenosis, history of sexual trauma, or cultural/religious concerns. Consider transabdominal approach as an alternative when transvaginal approach is not feasible.', '0 mSv (no ionizing radiation)', 'Uterine abnormalities (fibroids, adenomyosis, endometrial pathology), ovarian cysts or masses, adnexal pathology, free fluid in cul-de-sac, IUD positioning, early pregnancy evaluation, and pelvic inflammatory disease.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
228: INSERT INTO medical_cpt_codes ("cpt_code", "description", "allergy_considerations", "alternatives", "body_part", "category", "complexity", "contraindications", "contrast_use", "equipment_needed", "imaging_protocol", "laterality", "mobility_considerations", "modality", "notes", "patient_preparation", "pediatrics", "post_procedure_care", "procedure_duration", "radiotracer", "regulatory_notes", "relative_radiation_level", "sedation", "special_populations", "typical_dose", "typical_findings", "imported_at", "updated_at") VALUES ('76870', 'Ultrasound, scrotum and contents', 'None for standard examination. No contrast agents used.', 'MRI of scrotum (76498 with appropriate modifier), Testicular scintigraphy for suspected torsion (78761)', 'Scrotum and contents (testes, epididymides, and surrounding structures)', 'Diagnostic Ultrasound', 'Low', 'No absolute contraindications. Relative contraindications include severe pain that prevents adequate examination.', 'None', 'High-frequency linear transducer (7-15 MHz), ultrasound machine with color and spectral Doppler capabilities, ultrasound gel, towels for patient positioning.', 'Complete examination includes grayscale and color Doppler imaging of both testes, epididymides, and scrotal sac. Longitudinal and transverse views of both testes with size measurements. Assessment of testicular parenchyma, epididymides, and scrotal wall. Color Doppler evaluation of testicular and epididymal blood flow.', 'Bilateral', 'Patient typically positioned supine with scrotum supported by towel. May require assistance for patients with mobility issues. Alternative positions may be used for patients unable to lie flat.', 'Ultrasound', 'Highly sensitive for detecting intratesticular and extratesticular pathology. First-line imaging modality for acute scrotal pain. Useful for follow-up of known testicular lesions. Can differentiate between testicular and extratesticular pathology.', 'No special preparation required. Patient should be informed about the procedure. May need to hold penis against lower abdomen with a towel during examination.', 'Preferred imaging modality for pediatric scrotal evaluation due to absence of ionizing radiation. May require age-appropriate explanation and parental presence. Consider shorter examination time for younger patients.', 'No special post-procedure care required. Patient may resume normal activities immediately.', '15-30 minutes', 'None', 'No specific regulatory considerations. Follows standard ACR-AIUM-SPR-SRU Practice Parameter for the Performance of Scrotal Ultrasound Examinations.', 'None', 'Not typically required. For anxious patients or children, verbal reassurance is usually sufficient.', 'For elderly patients, consider limited mobility and positioning needs. For patients with developmental disabilities, clear communication and possibly shortened examination time may be necessary.', '0 mSv (no ionizing radiation)', 'Testicular masses, epididymal abnormalities, hydroceles, varicoceles, testicular torsion, epididymo-orchitis, trauma, undescended testes, and other scrotal pathologies.', '2025-04-08T03:50:55.231Z', '2025-04-08T03:50:55.231Z');
    ```
    ... and 109 more matches
- **Docs\implementation\2025-04-13-implementation-summary.md** (84 matches)
  - Unique matches: `prompt`, `template`, `{{DATABASE_CONTEXT}}`, `{{DICTATION_TEXT}}`, `{{WORD_LIMIT}}`
  - Sample context:
    ```
    51: ### Issues Identified
52: - The `getActivePromptTemplate` function was not filtering for `type = 'default'`
53: - Existing prompt template had incorrect type
54: 
55: ### Solutions Implemented
    ```
    ```
    57:   ```typescript
58:   const result = await queryMainDb(
59:     `SELECT * FROM prompt_templates
60:      WHERE type = 'default' AND active = true
61:      ORDER BY created_at DESC
    ```
    ... and 45 more matches
- **Docs\prompt_management_ui.md** (59 matches)
  - Unique matches: `prompt`, `template`, `{{PATIENT_CASE}}`
  - Sample context:
    ```
    10: ## 1. Purpose
11: 
12: - **Centralized Management:** Provide a unified interface for creating, editing, and managing prompt templates
13: - **Version Control:** Enable tracking of prompt changes over time
14: - **A/B Testing:** Facilitate the setup and analysis of prompt experiments
    ```
    ```
    11: 
12: - **Centralized Management:** Provide a unified interface for creating, editing, and managing prompt templates
13: - **Version Control:** Enable tracking of prompt changes over time
14: - **A/B Testing:** Facilitate the setup and analysis of prompt experiments
15: - **Quality Assurance:** Support testing and validation of prompts before deployment
    ```
    ... and 45 more matches
- **Docs\implementation\validation-engine-implementation-report.md** (50 matches)
  - Unique matches: `prompt`, `template`, `{{DATABASE_CONTEXT}}`, `{{DICTATION_TEXT}}`, `{{WORD_LIMIT}}`
  - Sample context:
    ```
    10: |------|----------|-------------|
11: | April 13, 2025 | Database Connection Fix | Fixed database connection URLs and port configuration |
12: | April 13, 2025 | Prompt Template Update | Updated prompt template query to filter for `type = 'default'` |
13: | April 13, 2025 | Null Value Handling | Enhanced prompt construction to handle null values |
14: | April 13, 2025 | API Key Configuration | Added Anthropic and X.ai API keys to the environment |
    ```
    ```
    11: | April 13, 2025 | Database Connection Fix | Fixed database connection URLs and port configuration |
12: | April 13, 2025 | Prompt Template Update | Updated prompt template query to filter for `type = 'default'` |
13: | April 13, 2025 | Null Value Handling | Enhanced prompt construction to handle null values |
14: | April 13, 2025 | API Key Configuration | Added Anthropic and X.ai API keys to the environment |
15: | April 13, 2025 | LLM Integration Testing | Tested the Validation Engine with real clinical scenarios |
    ```
    ... and 28 more matches
- **tests\batch\test-report-template.md** (48 matches)
  - Unique matches: `{{DATE}}`, `{{TIME}}`, `{{AUTH_STATUS}}`, `{{VALIDATION_STATUS}}`, `{{FINALIZATION_STATUS}}`, `{{RADIOLOGY_STATUS}}`, `{{LOCATION_STATUS}}`, `{{CONNECTION_STATUS}}`, `{{UPLOAD_STATUS}}`, `{{AUTH_DETAILS}}`, `{{VALIDATION_DETAILS}}`, `{{FINALIZATION_DETAILS}}`, `{{RADIOLOGY_DETAILS}}`, `{{LOCATION_DETAILS}}`, `{{CONNECTION_DETAILS}}`, `{{UPLOAD_DETAILS}}`, `{{USER_CREATION}}`, `{{AUTHENTICATION}}`, `{{JWT_GENERATION}}`, `{{RBAC}}`, `{{DRAFT_CREATION}}`, `{{LLM_INTEGRATION}}`, `{{VALIDATION_SCORING}}`, `{{CLARIFICATION}}`, `{{OVERRIDE_VALIDATION}}`, `{{PATIENT_INFO}}`, `{{INSURANCE_INFO}}`, `{{DOCUMENT_UPLOADS}}`, `{{SIGNATURES}}`, `{{STATUS_UPDATES}}`, `{{USER_INVITATION}}`, `{{USER_LISTING}}`, `{{USER_UPDATES}}`, `{{USER_DEACTIVATION}}`, `{{LOCATION_CREATION}}`, `{{LOCATION_UPDATES}}`, `{{LOCATION_DELETION}}`, `{{USER_LOCATION}}`, `{{CONNECTION_REQUESTS}}`, `{{CONNECTION_APPROVAL}}`, `{{CONNECTION_REJECTION}}`, `{{CONNECTION_TERMINATION}}`, `{{CONNECTION_LISTING}}`, `{{PRESIGNED_URL}}`, `{{UPLOAD_CONFIRMATION}}`, `{{FILE_VALIDATION}}`, `{{FILE_ASSOCIATION}}`, `{{ISSUES_RECOMMENDATIONS}}`
  - Sample context:
    ```
    1: # RadOrderPad Backend Test Report
2: 
3: **Date:** {{DATE}}
4: **Time:** {{TIME}}
5: **Environment:** Development
    ```
    ```
    2: 
3: **Date:** {{DATE}}
4: **Time:** {{TIME}}
5: **Environment:** Development
6: 
    ```
    ... and 46 more matches
- **Docs\prompt_registry.md** (46 matches)
  - Unique matches: `prompt`, `template`, `{{DATABASE_CONTEXT}}`, `{{DICTATION_TEXT}}`, `{{WORD_LIMIT}}`, `{{DATABASE_CONTEXT}}`, `{{DICTATION_TEXT}}`, `{{WORD_LIMIT}}`
  - Sample context:
    ```
    4: **Date:** 2025-04-11
5: 
6: This document defines the system for managing, versioning, and assigning LLM prompts used by the Validation Engine, enabling A/B testing and customization.
7: 
8: ---
    ```
    ```
    10: ## 1. Purpose
11: 
12: -   **Modularity:** Separate prompt text from application code for easier updates and maintenance.
13: -   **Versioning:** Track changes to prompts over time.
14: -   **Customization:** Allow different prompts for specific scenarios (e.g., rare diseases, low confidence input).
    ```
    ... and 24 more matches
- **Docs\implementation\troubleshooting-guide.md** (39 matches)
  - Unique matches: `prompt`, `template`, `{{WORD_LIMIT}}`, `{{DATABASE_CONTEXT}}`, `{{DICTATION_TEXT}}`
  - Sample context:
    ```
    58: ## Validation Engine Issues
59: 
60: ### Issue: "No active default prompt template found" error
61: 
62: **Symptoms:**
    ```
    ```
    62: **Symptoms:**
63: ```
64: Error in validation process: Error: No active default prompt template found
65: ```
66: 
    ```
    ... and 19 more matches
- **Docs\prompt_testing.md** (39 matches)
  - Unique matches: `prompt`, `template`
  - Sample context:
    ```
    4: **Date:** 2025-04-15
5: 
6: This document outlines methodologies and best practices for testing prompt templates before deployment to ensure they produce accurate, consistent, and useful results.
7: 
8: ---
    ```
    ```
    10: ## 1. Purpose
11: 
12: - **Quality Assurance:** Ensure prompts produce accurate and consistent results
13: - **Performance Optimization:** Identify and address inefficiencies in prompts
14: - **Regression Prevention:** Verify that changes don't break existing functionality
    ```
    ... and 32 more matches
- **Docs\prompt_template_guide.md** (28 matches)
  - Unique matches: `prompt`, `template`, `{{PATIENT_CASE}}`, `{{DATABASE_CONTEXT}}`, `{{WORD_LIMIT}}`
  - Sample context:
    ```
    4: **Date:** 2025-04-15
5: 
6: This document provides detailed guidance on creating and maintaining effective prompt templates for the RadOrderPad validation engine.
7: 
8: ---
    ```
    ```
    10: ## 1. Purpose
11: 
12: - **Standardization:** Ensure all prompts follow a consistent structure and format
13: - **Quality Assurance:** Provide guidelines for creating effective prompts
14: - **Troubleshooting:** Help identify and fix common issues with prompts
    ```
    ... and 17 more matches
- **test-direct-prompt.js** (28 matches)
  - Unique matches: `prompt`, `template`, `{{PATIENT_CASE}}`
  - Sample context:
    ```
    1: /**
2:  * Test script to directly test the comprehensive prompt with Claude API
3:  * This bypasses the database and application logic to test if the prompt itself works
4:  */
    ```
    ```
    1: /**
2:  * Test script to directly test the comprehensive prompt with Claude API
3:  * This bypasses the database and application logic to test if the prompt itself works
4:  */
5: 
    ```
    ... and 18 more matches

## Impact Assessment

### Critical Components

1. **Response Normalization**
   - Field name mapping in `normalizeResponseFields`
   - Code array normalization in `normalizeCodeArray`
   - isPrimary flag handling

2. **Database Interaction**
   - Field name mismatches between database and application
   - Inconsistent field naming in queries

3. **Template System**
   - Inconsistent field names in templates
   - Validation requirements in templates

## Recommendations

### Short-term Fixes

1. **Fix isPrimary Flag Issue**
   - Update `normalizeCodeArray` to properly preserve the isPrimary flag
   - Change `isPrimary: item.isPrimary === true` to `isPrimary: Boolean(item.isPrimary)`

2. **Update Templates**
   - Ensure all templates use consistent field names
   - Update the lean template to use suggestedICD10Codes instead of diagnosisCodes

### Long-term Strategy

1. **Standardize Field Names**
   - Use the `ValidationResult` interface as the standard
   - Create a style guide for field naming conventions

2. **Gradual Normalization Removal**
   - Start with isolated components
   - Work inward toward core logic
   - Implement changes in small, testable increments

3. **Comprehensive Testing**
   - Create tests that verify field name consistency
   - Ensure tests cover the entire validation pipeline

