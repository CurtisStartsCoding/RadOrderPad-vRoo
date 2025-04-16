/**
 * Script to import all medical tables except ICD-10 codes
 * This handles the smaller tables: CPT codes, mappings, and markdown docs
 */

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Configuration
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const outputDir = 'Data/tables';
const excludePattern = /^INSERT INTO medical_icd10_codes/; // Exclude ICD-10 codes

// Table definitions
const tables = [
  {
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
  },
  {
    name: 'medical_cpt_icd10_mappings',
    pattern: /^INSERT INTO medical_cpt_icd10_mappings/,
    outputFile: 'cpt_icd10_mappings.sql',
    createTableStatement: `
CREATE TABLE IF NOT EXISTS medical_cpt_icd10_mappings (
  "id" serial PRIMARY KEY,
  "icd10_code" text REFERENCES medical_icd10_codes(icd10_code),
  "cpt_code" text REFERENCES medical_cpt_codes(cpt_code),
  "appropriateness" integer,
  "evidence_level" text,
  "evidence_source" text,
  "evidence_id" text,
  "enhanced_notes" text,
  "refined_justification" text,
  "guideline_version" text,
  "last_updated" date,
  "imported_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    name: 'medical_icd10_markdown_docs',
    pattern: /^INSERT INTO medical_icd10_markdown_docs/,
    outputFile: 'icd10_markdown_docs.sql',
    createTableStatement: `
CREATE TABLE IF NOT EXISTS medical_icd10_markdown_docs (
  "id" serial PRIMARY KEY,
  "icd10_code" text NOT NULL UNIQUE REFERENCES medical_icd10_codes(icd10_code),
  "content" text,
  "file_path" text,
  "import_date" timestamp without time zone
);`
  }
];

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process the source file and extract table data
async function extractTables() {
  console.log(`Processing source file: ${sourceFile}`);
  
  // Initialize record counters and arrays
  const tableRecords = {};
  tables.forEach(table => {
    tableRecords[table.name] = [];
  });
  
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
    
    // Check each table pattern
    for (const table of tables) {
      if (table.pattern.test(line)) {
        tableRecords[table.name].push(line);
        break;
      }
    }
  }
  
  // Write each table's SQL file
  for (const table of tables) {
    const records = tableRecords[table.name];
    if (records.length > 0) {
      await writeTableFile(table, records);
    }
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
  // Create shell script
  const shScript = `#!/bin/bash

# Script to import medical tables (except ICD-10 codes)
# Usage: ./import_other_tables.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad Medical Tables Import Tool ==="
echo "This script will import CPT codes, mappings, and markdown docs into the radorder_main database."
echo "NOTE: This script does NOT import ICD-10 codes. Use import_icd10_batched.sh for that."
echo ""

# Get database connection details from environment variables
if [ -n "$MAIN_DATABASE_URL" ]; then
    # Extract connection details from DATABASE_URL
    DB_USER=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\\/\\/([^:]+):.+$/\\1/')
    DB_PASS=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\\/\\/[^:]+:([^@]+).+$/\\1/')
    DB_HOST=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\\/\\/[^@]+@([^:]+):.+$/\\1/')
    DB_PORT=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:([0-9]+)\\/.+$/\\1/')
    DB_NAME=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\\/\\/[^:]+:[^@]+@[^:]+:[0-9]+\\/(.+)$/\\1/')
else
    # Use individual environment variables
    DB_USER=\${PGUSER:-postgres}
    DB_PASS=\${PGPASSWORD:-postgres}
    DB_HOST=\${PGHOST:-localhost}
    DB_PORT=\${PGPORT:-5432}
    DB_NAME=\${PGDATABASE:-radorder_main}
fi

# Confirm database name is radorder_main
if [ "$DB_NAME" != "radorder_main" ]; then
    echo "ERROR: This script is intended for the radorder_main database only."
    echo "Current database name: $DB_NAME"
    echo "Please set the correct database name and try again."
    exit 1
fi

echo "Importing medical tables into radorder_main database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Import CPT codes first
echo "Importing CPT codes..."
export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/tables/cpt_codes.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import CPT codes"
    exit 1
fi
echo "CPT codes imported successfully"

# Import markdown docs (depends on ICD-10 codes being already imported)
echo "Importing ICD-10 markdown docs..."
echo "NOTE: This will only work if ICD-10 codes have already been imported"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/tables/icd10_markdown_docs.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import ICD-10 markdown docs"
    echo "Make sure ICD-10 codes have been imported first using import_icd10_batched.sh"
    exit 1
fi
echo "ICD-10 markdown docs imported successfully"

# Import mappings (depends on both CPT and ICD-10 codes)
echo "Importing CPT-ICD10 mappings..."
echo "NOTE: This will only work if both CPT and ICD-10 codes have already been imported"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/tables/cpt_icd10_mappings.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import CPT-ICD10 mappings"
    echo "Make sure both CPT and ICD-10 codes have been imported first"
    exit 1
fi
echo "CPT-ICD10 mappings imported successfully"

unset PGPASSWORD

echo ""
echo "All medical tables (except ICD-10 codes) imported successfully!"
`;

  // Create batch script
  const batScript = `@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad Medical Tables Import Tool ===
echo This script will import CPT codes, mappings, and markdown docs into the radorder_main database.
echo NOTE: This script does NOT import ICD-10 codes. Use import_icd10_batched.bat for that.
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
    if "!DB_PORT!"=="" set DB_PORT=5432
    
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

echo Importing medical tables into radorder_main database...
echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo.

REM Import CPT codes first
echo Importing CPT codes...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\tables\\cpt_codes.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT codes
    exit /b 1
)
echo CPT codes imported successfully

REM Import markdown docs (depends on ICD-10 codes being already imported)
echo Importing ICD-10 markdown docs...
echo NOTE: This will only work if ICD-10 codes have already been imported
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\tables\\icd10_markdown_docs.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import ICD-10 markdown docs
    echo Make sure ICD-10 codes have been imported first using import_icd10_batched.bat
    exit /b 1
)
echo ICD-10 markdown docs imported successfully

REM Import mappings (depends on both CPT and ICD-10 codes)
echo Importing CPT-ICD10 mappings...
echo NOTE: This will only work if both CPT and ICD-10 codes have already been imported
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\tables\\cpt_icd10_mappings.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT-ICD10 mappings
    echo Make sure both CPT and ICD-10 codes have been imported first
    exit /b 1
)
echo CPT-ICD10 mappings imported successfully

set PGPASSWORD=

echo.
echo All medical tables (except ICD-10 codes) imported successfully!
`;

  // Write the scripts
  fs.writeFileSync('import_other_tables.sh', shScript);
  fs.chmodSync('import_other_tables.sh', 0o755); // Make executable
  console.log('Created shell script: import_other_tables.sh');
  
  fs.writeFileSync('import_other_tables.bat', batScript);
  console.log('Created batch script: import_other_tables.bat');
}

// Run the extraction
extractTables().catch(err => {
  console.error('Error during extraction:', err);
  process.exit(1);
});