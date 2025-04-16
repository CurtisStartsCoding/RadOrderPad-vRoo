/**
 * Master script to import all medical reference data
 * This script runs both the ICD-10 batched import and the other tables import
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== RadOrderPad Medical Data Import Master Script ===');
console.log('This script will prepare and import all medical reference data into the radorder_main database.');
console.log('');

// Step 1: Create necessary directories
console.log('Creating output directories...');
const dirs = ['Data/batches', 'Data/tables'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Step 2: Run the extraction scripts
console.log('\nStep 1: Extracting ICD-10 codes in batches...');
runScript('import_icd10_batched.js')
  .then(() => {
    console.log('\nStep 2: Extracting other tables (CPT, mappings, markdown docs)...');
    return runScript('import_other_tables.js');
  })
  .then(() => {
    console.log('\nAll extraction scripts completed successfully!');
    console.log('\nImport Instructions:');
    console.log('1. First import the ICD-10 codes:');
    console.log('   - On Unix/Linux/macOS: ./import_icd10_batched.sh');
    console.log('   - On Windows: import_icd10_batched.bat');
    console.log('');
    console.log('2. Then import the other tables:');
    console.log('   - On Unix/Linux/macOS: ./import_other_tables.sh');
    console.log('   - On Windows: import_other_tables.bat');
    console.log('');
    console.log('NOTE: The ICD-10 import must be completed before importing the other tables,');
    console.log('      as the mappings and markdown docs depend on the ICD-10 codes.');
    
    // Create the master import scripts
    createMasterImportScripts();
  })
  .catch(err => {
    console.error('Error during extraction:', err);
    process.exit(1);
  });

// Function to run a Node.js script
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const process = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${scriptPath}:`);
        console.error(stderr);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
}

// Create master import scripts for shell and batch
function createMasterImportScripts() {
  // Create shell script
  const shScript = `#!/bin/bash

# Master script to import all medical reference data
# Usage: ./import_all_medical_data.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad Medical Data Import Master Script ==="
echo "This script will import all medical reference data into the radorder_main database."
echo "WARNING: This script should ONLY be used for the radorder_main database."
echo ""

# Confirm with the user
read -p "This will import all medical reference data. Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Import cancelled."
    exit 0
fi

# Step 1: Import ICD-10 codes (this is the largest dataset)
echo ""
echo "Step 1: Importing ICD-10 codes (this may take a while)..."
./import_icd10_batched.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import ICD-10 codes"
    exit 1
fi

# Step 2: Import other tables (CPT codes, mappings, markdown docs)
echo ""
echo "Step 2: Importing other tables (CPT codes, mappings, markdown docs)..."
./import_other_tables.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import other tables"
    exit 1
fi

echo ""
echo "All medical reference data has been successfully imported into the radorder_main database!"
echo "You can verify the import using the verify_import.sh script."
`;

  // Create batch script
  const batScript = `@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad Medical Data Import Master Script ===
echo This script will import all medical reference data into the radorder_main database.
echo WARNING: This script should ONLY be used for the radorder_main database.
echo.

REM Confirm with the user
set /p CONFIRM=This will import all medical reference data. Continue? (y/n) 
if /i "%CONFIRM%" neq "y" (
    echo Import cancelled.
    exit /b 0
)

REM Step 1: Import ICD-10 codes (this is the largest dataset)
echo.
echo Step 1: Importing ICD-10 codes (this may take a while)...
call import_icd10_batched.bat
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import ICD-10 codes
    exit /b 1
)

REM Step 2: Import other tables (CPT codes, mappings, markdown docs)
echo.
echo Step 2: Importing other tables (CPT codes, mappings, markdown docs)...
call import_other_tables.bat
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import other tables
    exit /b 1
)

echo.
echo All medical reference data has been successfully imported into the radorder_main database!
echo You can verify the import using the verify_import.bat script.
`;

  // Write the scripts
  fs.writeFileSync('import_all_medical_data.sh', shScript);
  fs.chmodSync('import_all_medical_data.sh', 0o755); // Make executable
  console.log('Created master shell script: import_all_medical_data.sh');
  
  fs.writeFileSync('import_all_medical_data.bat', batScript);
  console.log('Created master batch script: import_all_medical_data.bat');
  
  console.log('\nAll scripts have been created successfully!');
}