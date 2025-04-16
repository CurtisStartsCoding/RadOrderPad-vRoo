/**
 * Script to import ICD-10 codes in batches
 * This script processes the large ICD-10 dataset in smaller chunks to avoid memory issues
 */

const fs = require('fs');
const readline = require('readline');
const { exec } = require('child_process');
const path = require('path');

// Configuration
const sourceFile = 'Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql';
const batchSize = 500; // Number of records per batch
const outputDir = 'Data/batches';
const tableName = 'medical_icd10_codes';
const tablePattern = /^INSERT INTO medical_icd10_codes/;

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create table definition SQL
const createTableSQL = `
-- Create the medical_icd10_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS medical_icd10_codes (
  "icd10_code" text PRIMARY KEY,
  "description" text,
  "associated_symptom_clusters" text,
  "block" text,
  "block_description" text,
  "category" text,
  "chapter" text,
  "clinical_notes" text,
  "contraindications" text,
  "follow_up_recommendations" text,
  "imaging_modalities" text,
  "inappropriate_imaging_risk" integer,
  "is_billable" boolean,
  "keywords" text,
  "parent_code" text,
  "primary_imaging" text,
  "priority" text,
  "secondary_imaging" text,
  "typical_misdiagnosis_codes" text,
  "imported_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
`;

// Write the create table SQL file
const createTableFile = path.join(outputDir, '00_create_table.sql');
fs.writeFileSync(createTableFile, createTableSQL);
console.log(`Created table definition file: ${createTableFile}`);

// Process the source file and extract ICD-10 inserts
async function extractBatches() {
  console.log(`Processing source file: ${sourceFile}`);
  console.log(`Extracting ${tableName} records in batches of ${batchSize}`);
  
  const fileStream = fs.createReadStream(sourceFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let batchNumber = 1;
  let recordCount = 0;
  let batchRecords = [];
  let totalRecords = 0;

  for await (const line of rl) {
    // Check if this is an ICD-10 insert
    if (tablePattern.test(line)) {
      batchRecords.push(line);
      recordCount++;
      totalRecords++;
      
      // If we've reached the batch size, write the batch file
      if (recordCount >= batchSize) {
        await writeBatchFile(batchNumber, batchRecords);
        batchRecords = [];
        recordCount = 0;
        batchNumber++;
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc();
          console.log('Garbage collection performed');
        }
      }
    }
  }
  
  // Write any remaining records
  if (batchRecords.length > 0) {
    await writeBatchFile(batchNumber, batchRecords);
  }
  
  console.log(`Extraction complete. Total records: ${totalRecords}, Total batches: ${batchNumber}`);
  
  // Create the import script
  createImportScripts(batchNumber);
}

// Write a batch of records to a file
async function writeBatchFile(batchNumber, records) {
  const batchFile = path.join(outputDir, `${String(batchNumber).padStart(2, '0')}_batch.sql`);
  
  // Create the batch file content
  let content = `-- Batch ${batchNumber} of ${tableName} inserts\n`;
  content += `BEGIN;\n\n`;
  content += records.join('\n');
  content += `\n\nCOMMIT;\n`;
  
  // Write the file
  fs.writeFileSync(batchFile, content);
  console.log(`Created batch file ${batchFile} with ${records.length} records`);
}

// Create the import scripts (shell and batch)
function createImportScripts(totalBatches) {
  // Create shell script
  const shScript = `#!/bin/bash

# Script to import ICD-10 codes in batches
# Usage: ./import_icd10_batched.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad ICD-10 Batched Import Tool ==="
echo "This script will import ICD-10 codes into the radorder_main database in batches."
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

echo "Importing ICD-10 codes into radorder_main database in batches..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo "Total batches: ${totalBatches}"
echo ""

# First create the table
echo "Creating table structure..."
export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/batches/00_create_table.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create table structure"
    exit 1
fi

# Import each batch
for i in $(seq 1 ${totalBatches}); do
    BATCH_FILE="Data/batches/$(printf "%02d" $i)_batch.sql"
    echo "Importing batch $i of ${totalBatches}..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BATCH_FILE"
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to import batch $i"
        exit 1
    fi
    echo "Batch $i imported successfully"
done

unset PGPASSWORD

echo ""
echo "ICD-10 code import completed successfully!"
echo "Imported ${totalBatches} batches"
`;

  // Create batch script
  const batScript = `@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad ICD-10 Batched Import Tool ===
echo This script will import ICD-10 codes into the radorder_main database in batches.
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

echo Importing ICD-10 codes into radorder_main database in batches...
echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo Total batches: ${totalBatches}
echo.

REM First create the table
echo Creating table structure...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\\batches\\00_create_table.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to create table structure
    exit /b 1
)

REM Import each batch
for /L %%i in (1,1,${totalBatches}) do (
    set BATCH_NUM=00%%i
    set BATCH_FILE=Data\\batches\\!BATCH_NUM:~-2!_batch.sql
    echo Importing batch %%i of ${totalBatches}...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "!BATCH_FILE!"
    if %ERRORLEVEL% neq 0 (
        echo ERROR: Failed to import batch %%i
        exit /b 1
    )
    echo Batch %%i imported successfully
)

set PGPASSWORD=

echo.
echo ICD-10 code import completed successfully!
echo Imported ${totalBatches} batches
`;

  // Write the scripts
  fs.writeFileSync('import_icd10_batched.sh', shScript);
  fs.chmodSync('import_icd10_batched.sh', 0o755); // Make executable
  console.log('Created shell script: import_icd10_batched.sh');
  
  fs.writeFileSync('import_icd10_batched.bat', batScript);
  console.log('Created batch script: import_icd10_batched.bat');
}

// Run the extraction
extractBatches().catch(err => {
  console.error('Error during extraction:', err);
  process.exit(1);
});