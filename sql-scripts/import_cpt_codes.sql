-- Import script for medical_cpt_codes table
-- This script extracts and executes only the CPT code related statements from the main export

BEGIN;

-- Ensure the table exists
CREATE TABLE IF NOT EXISTS medical_cpt_codes (
  "cpt_code" text NOT NULL,
  "description" text,
  "allergy_considerations" text,
  "alternatives" text,
  "body_part" text,
  "category" text,
  "complexity" text,
  "contraindications" text,
  "contrast_use" text,
  "equipment_needed" text,
  "imaging_protocol" text,
  "laterality" text,
  "mobility_considerations" text,
  "modality" text,
  "notes" text,
  "patient_preparation" text,
  "pediatrics" text,
  "post_procedure_care" text,
  "procedure_duration" text,
  "radiotracer" text,
  "regulatory_notes" text,
  "relative_radiation_level" text,
  "sedation" text,
  "special_populations" text,
  "typical_dose" text,
  "typical_findings" text,
  "imported_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("cpt_code")
);

-- Import data from the main export file
\echo 'Importing CPT codes...'
\i 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql'

-- Only keep the CPT code data, discard other tables' data
DELETE FROM medical_icd10_codes;
DELETE FROM medical_cpt_icd10_mappings;
DELETE FROM medical_icd10_markdown_docs;

COMMIT;

\echo 'CPT codes import completed.'