-- Verification script for medical reference data import
-- This script checks if the medical tables have been populated correctly
-- Usage: psql -h hostname -p port -U username -d radorder_main -f verify_import.sql

\echo '=== RadOrderPad Medical Data Import Verification ==='
\echo 'This script verifies that medical reference data has been imported into the radorder_main database.'
\echo ''

-- Check if we're connected to the right database
\echo 'Verifying database connection...'
\c radorder_main
\echo 'Connected to database: radorder_main'
\echo ''

-- Count rows in each table
\echo 'Counting rows in medical tables...'
SELECT 'medical_cpt_codes' as table_name, COUNT(*) as row_count FROM medical_cpt_codes
UNION ALL
SELECT 'medical_icd10_codes', COUNT(*) FROM medical_icd10_codes
UNION ALL
SELECT 'medical_cpt_icd10_mappings', COUNT(*) FROM medical_cpt_icd10_mappings
UNION ALL
SELECT 'medical_icd10_markdown_docs', COUNT(*) FROM medical_icd10_markdown_docs
ORDER BY table_name;
\echo ''

-- Sample data from each table
\echo 'Sampling data from medical_cpt_codes (first 5 rows)...'
SELECT cpt_code, description, modality FROM medical_cpt_codes LIMIT 5;
\echo ''

\echo 'Sampling data from medical_icd10_codes (first 5 rows)...'
SELECT icd10_code, description, is_billable FROM medical_icd10_codes LIMIT 5;
\echo ''

\echo 'Sampling data from medical_cpt_icd10_mappings (first 5 rows)...'
SELECT id, icd10_code, cpt_code, appropriateness FROM medical_cpt_icd10_mappings LIMIT 5;
\echo ''

\echo 'Sampling data from medical_icd10_markdown_docs (first 5 rows)...'
SELECT id, icd10_code, SUBSTRING(content, 1, 50) as content_preview FROM medical_icd10_markdown_docs LIMIT 5;
\echo ''

-- Check for any potential issues
\echo 'Checking for potential issues...'

-- Check for CPT codes without mappings
\echo 'CPT codes without any ICD-10 mappings:'
SELECT c.cpt_code, c.description 
FROM medical_cpt_codes c
LEFT JOIN medical_cpt_icd10_mappings m ON c.cpt_code = m.cpt_code
WHERE m.id IS NULL
LIMIT 10;
\echo ''

-- Check for ICD-10 codes without mappings
\echo 'ICD-10 codes without any CPT mappings:'
SELECT i.icd10_code, i.description 
FROM medical_icd10_codes i
LEFT JOIN medical_cpt_icd10_mappings m ON i.icd10_code = m.icd10_code
WHERE m.id IS NULL
LIMIT 10;
\echo ''

-- Check for ICD-10 codes without markdown docs
\echo 'ICD-10 codes without markdown documentation:'
SELECT i.icd10_code, i.description 
FROM medical_icd10_codes i
LEFT JOIN medical_icd10_markdown_docs d ON i.icd10_code = d.icd10_code
WHERE d.id IS NULL
LIMIT 10;
\echo ''

\echo '=== Verification Complete ==='