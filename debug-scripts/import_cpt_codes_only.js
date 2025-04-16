/**
 * Script to import only CPT codes
 * This is a modified version of import_other_tables.js that only handles CPT codes
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Configuration
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const outputDir = 'Data/tables';
const excludePattern = /^INSERT INTO medical_icd10_codes/; // Exclude ICD-10 codes

// Table definition
const cptTable = {
  name: 'medical_cpt_codes',
  pattern: /^INSERT INTO medical_cpt_codes/,
  outputFile: 'cpt_codes.sql',
  createTableStatement: `
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
);`
};

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process the source file and extract CPT codes
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
    // Skip ICD-10 inserts
    if (excludePattern.test(line)) {
      continue;
    }
    
    // Check for CPT code inserts
    if (cptTable.pattern.test(line)) {
      cptRecords.push(line);
    }
  }
  
  // Write the CPT codes to a file
  if (cptRecords.length > 0) {
    await writeTableFile(cptTable, cptRecords);
  }
  
  // Create the import scripts
  createImportScripts();
}

// Write a table's records to a file
async function writeTableFile(table, records) {
  const tableFile = path.join(outputDir, table.outputFile);
  
  // Create the file content
  let content = `-- ${table.name} data\n`;
  content += `BEGIN;\n\n`;
  content += `-- Create table if it doesn't exist\n`;
  content += `${table.createTableStatement}\n\n`;
  content += `-- Insert data\n`;
  content += records.join('\n');
  content += `\n\nCOMMIT;\n`;
  
  // Write the file
  fs.writeFileSync(tableFile, content);
  console.log(`Created table file ${tableFile} with ${records.length} records for ${table.name}`);
}

// Create the import scripts (shell and batch)
function createImportScripts() {
  // Create batch script
  const batScript = `@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad CPT Codes Import Tool ===
echo This script will import ONLY CPT codes into the radorder_main database.
echo.

REM Get database connection details from environment variables
if defined MAIN_DATABASE_URL (
    REM Parse the DATABASE_URL to extract connection details
    for /f "tokens=1,2,3 delims=:/" %%a in ("%MAIN_DATABASE_URL%") do (
        set PROTO=%%a
        set EMPTY=%%b
        set USERPASS_HOST_PORT_DB=%%c
    )
    
    for /f "tokens=1,2 delims=@" %%a in ("!USERPASS_HOST_PORT_DB!") do (
        set USERPASS=%%a
        set HOST_PORT_DB=%%b
    )
    
    for /f "tokens=1,2 delims=:" %%a in ("!USERPASS!") do (
        set DB_USER=%%a
        set DB_PASS=%%b
    )
    
    for /f "tokens=1,2,3 delims=:/" %%a in ("!HOST_PORT_DB!") do (
        set DB_HOST=%%a
        set DB_PORT=%%b
        set DB_NAME=%%c
    )
) else (
    REM Use individual environment variables
    set DB_USER=%PGUSER%
    if "!DB_USER!"=="" set DB_USER=postgres
    
    set DB_PASS=%PGPASSWORD%
    if "!DB_PASS!"=="" set DB_PASS=postgres
    
    set DB_HOST=%PGHOST%
    if "!DB_HOST!"=="" set DB_HOST=localhost
    
    set DB_PORT=%PGPORT%
    if "!DB_PORT!"=="" set DB_PORT=5433
    
    set DB_NAME=%PGDATABASE%
    if "!DB_NAME!"=="" set DB_NAME=radorder_main
)

REM Confirm database name is radorder_main
if not "%DB_NAME%"=="radorder_main" (
    echo ERROR: This script is intended for the radorder_main database only.
    echo Current database name: %DB_NAME%
    echo Please set the correct database name and try again.
    exit /b 1
)

echo Importing CPT codes into radorder_main database...
echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Import CPT codes
echo Importing CPT codes...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\tables\\cpt_codes.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT codes
    exit /b 1
)
echo CPT codes imported successfully

set PGPASSWORD=

echo.
echo CPT codes import completed successfully!
`;

  // Write the script
  fs.writeFileSync('debug-scripts/import_cpt_codes_only.bat', batScript);
  console.log('Created batch script: debug-scripts/import_cpt_codes_only.bat');
}

// Run the extraction
extractCPTCodes().catch(err => {
  console.error('Error during extraction:', err);
  process.exit(1);
});