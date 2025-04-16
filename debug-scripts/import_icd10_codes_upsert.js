/**
 * Script to import ICD-10 codes using PostgreSQL's ON CONFLICT DO UPDATE approach
 * This will insert new records and update existing ones without conflicts
 */
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { Pool } = require('pg');
const path = require('path');

// Database connection
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '5433';
const DB_NAME = process.env.DB_NAME || 'radorder_main';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres123';

// Source file and output directory
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const outputDir = 'Data/upsert';
const tablePattern = /^INSERT INTO medical_icd10_codes/;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process the source file and extract ICD-10 code inserts
async function extractICD10Codes() {
  console.log(`Processing source file: ${sourceFile}`);
  
  // Initialize record array
  const icd10Records = [];
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Check for ICD-10 code inserts
    if (tablePattern.test(line)) {
      // Extract the values part of the INSERT statement
      const valuesMatch = line.match(/VALUES \((.*)\);/);
      if (valuesMatch && valuesMatch[1]) {
        icd10Records.push(valuesMatch[1]);
      }
    }
  }
  
  console.log(`Found ${icd10Records.length} ICD-10 code records`);
  
  // Write the upsert SQL file
  if (icd10Records.length > 0) {
    await writeUpsertFile(icd10Records);
  }
  
  // Create the import script
  createImportScript();
}

// Write the upsert SQL file
async function writeUpsertFile(records) {
  const outputFile = path.join(outputDir, 'icd10_codes_upsert.sql');
  
  // Create the SQL content with ON CONFLICT clause
  let content = `-- ICD-10 codes upsert script\n`;
  content += `BEGIN;\n\n`;
  
  // Create table if it doesn't exist
  content += `-- Create table if it doesn't exist\n`;
  content += `CREATE TABLE IF NOT EXISTS medical_icd10_codes (\n`;
  content += `  "icd10_code" text PRIMARY KEY,\n`;
  content += `  "description" text,\n`;
  content += `  "associated_symptom_clusters" text,\n`;
  content += `  "block" text,\n`;
  content += `  "block_description" text,\n`;
  content += `  "category" text,\n`;
  content += `  "chapter" text,\n`;
  content += `  "clinical_notes" text,\n`;
  content += `  "contraindications" text,\n`;
  content += `  "follow_up_recommendations" text,\n`;
  content += `  "imaging_modalities" text,\n`;
  content += `  "inappropriate_imaging_risk" integer,\n`;
  content += `  "is_billable" boolean,\n`;
  content += `  "keywords" text,\n`;
  content += `  "parent_code" text,\n`;
  content += `  "primary_imaging" text,\n`;
  content += `  "priority" text,\n`;
  content += `  "secondary_imaging" text,\n`;
  content += `  "typical_misdiagnosis_codes" text,\n`;
  content += `  "imported_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,\n`;
  content += `  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP\n`;
  content += `);\n\n`;
  
  // Insert records with ON CONFLICT DO UPDATE
  content += `-- Insert or update ICD-10 codes\n`;
  
  for (const record of records) {
    content += `INSERT INTO medical_icd10_codes VALUES (${record})\n`;
    content += `ON CONFLICT (icd10_code) DO UPDATE SET\n`;
    content += `  description = EXCLUDED.description,\n`;
    content += `  associated_symptom_clusters = EXCLUDED.associated_symptom_clusters,\n`;
    content += `  block = EXCLUDED.block,\n`;
    content += `  block_description = EXCLUDED.block_description,\n`;
    content += `  category = EXCLUDED.category,\n`;
    content += `  chapter = EXCLUDED.chapter,\n`;
    content += `  clinical_notes = EXCLUDED.clinical_notes,\n`;
    content += `  contraindications = EXCLUDED.contraindications,\n`;
    content += `  follow_up_recommendations = EXCLUDED.follow_up_recommendations,\n`;
    content += `  imaging_modalities = EXCLUDED.imaging_modalities,\n`;
    content += `  inappropriate_imaging_risk = EXCLUDED.inappropriate_imaging_risk,\n`;
    content += `  is_billable = EXCLUDED.is_billable,\n`;
    content += `  keywords = EXCLUDED.keywords,\n`;
    content += `  parent_code = EXCLUDED.parent_code,\n`;
    content += `  primary_imaging = EXCLUDED.primary_imaging,\n`;
    content += `  priority = EXCLUDED.priority,\n`;
    content += `  secondary_imaging = EXCLUDED.secondary_imaging,\n`;
    content += `  typical_misdiagnosis_codes = EXCLUDED.typical_misdiagnosis_codes,\n`;
    content += `  updated_at = CURRENT_TIMESTAMP;\n\n`;
  }
  
  content += `COMMIT;\n`;
  
  // Write the file
  fs.writeFileSync(outputFile, content);
  console.log(`Created upsert file: ${outputFile}`);
}

// Create the import script
function createImportScript() {
  const batScript = `@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad ICD-10 Codes Upsert Tool ===
echo This script will import or update ICD-10 codes in the radorder_main database.
echo.

REM Set database connection details
set DB_HOST=localhost
set DB_PORT=5433
set DB_NAME=radorder_main
set DB_USER=postgres
set DB_PASS=postgres123

echo Importing ICD-10 codes into radorder_main database...
echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Import ICD-10 codes
echo Importing ICD-10 codes...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\upsert\\icd10_codes_upsert.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import ICD-10 codes
    set PGPASSWORD=
    exit /b 1
)
echo ICD-10 codes imported successfully

set PGPASSWORD=

echo.
echo ICD-10 codes import completed successfully!
`;

  // Write the script
  fs.writeFileSync('debug-scripts/run_import_icd10_codes_upsert.bat', batScript);
  console.log('Created batch script: debug-scripts/run_import_icd10_codes_upsert.bat');
}

// Run the extraction
extractICD10Codes().catch(err => {
  console.error('Error during extraction:', err);
  process.exit(1);
});