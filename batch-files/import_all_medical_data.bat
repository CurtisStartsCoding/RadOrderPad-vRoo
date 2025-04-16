@echo off
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
