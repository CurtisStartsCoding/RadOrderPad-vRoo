/**
 * Script to import CPT codes using PostgreSQL's ON CONFLICT DO UPDATE approach
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
const tablePattern = /^INSERT INTO medical_cpt_codes/;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process the source file and extract CPT code inserts
async function extractCPTCodes() {
  console.log(`Processing source file: ${sourceFile}`);
  
  // Initialize record array
  const cptRecords = [];
  
  // Read the file line by line
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Check for CPT code inserts
    if (tablePattern.test(line)) {
      // Extract the values part of the INSERT statement
      const valuesMatch = line.match(/VALUES \((.*)\);/);
      if (valuesMatch && valuesMatch[1]) {
        cptRecords.push(valuesMatch[1]);
      }
    }
  }
  
  console.log(`Found ${cptRecords.length} CPT code records`);
  
  // Write the upsert SQL file
  if (cptRecords.length > 0) {
    await writeUpsertFile(cptRecords);
  }
  
  // Create the import script
  createImportScript();
}

// Write the upsert SQL file
async function writeUpsertFile(records) {
  const outputFile = path.join(outputDir, 'cpt_codes_upsert.sql');
  
  // Create the SQL content with ON CONFLICT clause
  let content = `-- CPT codes upsert script\n`;
  content += `BEGIN;\n\n`;
  
  // Create table if it doesn't exist
  content += `-- Create table if it doesn't exist\n`;
  content += `CREATE TABLE IF NOT EXISTS medical_cpt_codes (\n`;
  content += `  "cpt_code" text NOT NULL,\n`;
  content += `  "description" text,\n`;
  content += `  "allergy_considerations" text,\n`;
  content += `  "alternatives" text,\n`;
  content += `  "body_part" text,\n`;
  content += `  "category" text,\n`;
  content += `  "complexity" text,\n`;
  content += `  "contraindications" text,\n`;
  content += `  "contrast_use" text,\n`;
  content += `  "equipment_needed" text,\n`;
  content += `  "imaging_protocol" text,\n`;
  content += `  "laterality" text,\n`;
  content += `  "mobility_considerations" text,\n`;
  content += `  "modality" text,\n`;
  content += `  "notes" text,\n`;
  content += `  "patient_preparation" text,\n`;
  content += `  "pediatrics" text,\n`;
  content += `  "post_procedure_care" text,\n`;
  content += `  "procedure_duration" text,\n`;
  content += `  "radiotracer" text,\n`;
  content += `  "regulatory_notes" text,\n`;
  content += `  "relative_radiation_level" text,\n`;
  content += `  "sedation" text,\n`;
  content += `  "special_populations" text,\n`;
  content += `  "typical_dose" text,\n`;
  content += `  "typical_findings" text,\n`;
  content += `  "imported_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,\n`;
  content += `  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,\n`;
  content += `  PRIMARY KEY ("cpt_code")\n`;
  content += `);\n\n`;
  
  // Insert records with ON CONFLICT DO UPDATE
  content += `-- Insert or update CPT codes\n`;
  
  for (const record of records) {
    content += `INSERT INTO medical_cpt_codes VALUES (${record})\n`;
    content += `ON CONFLICT (cpt_code) DO UPDATE SET\n`;
    content += `  description = EXCLUDED.description,\n`;
    content += `  allergy_considerations = EXCLUDED.allergy_considerations,\n`;
    content += `  alternatives = EXCLUDED.alternatives,\n`;
    content += `  body_part = EXCLUDED.body_part,\n`;
    content += `  category = EXCLUDED.category,\n`;
    content += `  complexity = EXCLUDED.complexity,\n`;
    content += `  contraindications = EXCLUDED.contraindications,\n`;
    content += `  contrast_use = EXCLUDED.contrast_use,\n`;
    content += `  equipment_needed = EXCLUDED.equipment_needed,\n`;
    content += `  imaging_protocol = EXCLUDED.imaging_protocol,\n`;
    content += `  laterality = EXCLUDED.laterality,\n`;
    content += `  mobility_considerations = EXCLUDED.mobility_considerations,\n`;
    content += `  modality = EXCLUDED.modality,\n`;
    content += `  notes = EXCLUDED.notes,\n`;
    content += `  patient_preparation = EXCLUDED.patient_preparation,\n`;
    content += `  pediatrics = EXCLUDED.pediatrics,\n`;
    content += `  post_procedure_care = EXCLUDED.post_procedure_care,\n`;
    content += `  procedure_duration = EXCLUDED.procedure_duration,\n`;
    content += `  radiotracer = EXCLUDED.radiotracer,\n`;
    content += `  regulatory_notes = EXCLUDED.regulatory_notes,\n`;
    content += `  relative_radiation_level = EXCLUDED.relative_radiation_level,\n`;
    content += `  sedation = EXCLUDED.sedation,\n`;
    content += `  special_populations = EXCLUDED.special_populations,\n`;
    content += `  typical_dose = EXCLUDED.typical_dose,\n`;
    content += `  typical_findings = EXCLUDED.typical_findings,\n`;
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

echo === RadOrderPad CPT Codes Upsert Tool ===
echo This script will import or update CPT codes in the radorder_main database.
echo.

REM Set database connection details
set DB_HOST=localhost
set DB_PORT=5433
set DB_NAME=radorder_main
set DB_USER=postgres
set DB_PASS=postgres123

echo Importing CPT codes into radorder_main database...
echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Import CPT codes
echo Importing CPT codes...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\upsert\\cpt_codes_upsert.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT codes
    set PGPASSWORD=
    exit /b 1
)
echo CPT codes imported successfully

set PGPASSWORD=

echo.
echo CPT codes import completed successfully!
`;

  // Write the script
  fs.writeFileSync('debug-scripts/run_import_cpt_codes_upsert.bat', batScript);
  console.log('Created batch script: debug-scripts/run_import_cpt_codes_upsert.bat');
}

// Run the extraction
extractCPTCodes().catch(err => {
  console.error('Error during extraction:', err);
  process.exit(1);
});