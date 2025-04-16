@echo off
:: import_medical_tables.bat
:: Script to import medical reference data into the radorder_main database
:: Date: 2025-04-13

:: Set variables
set SQL_EXPORT_FILE=Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql
set DATABASE=radorder_main

:: Display script information
echo ===================================================
echo RadOrderPad Medical Tables Import Script
echo ===================================================
echo Database: %DATABASE%
echo SQL File: %SQL_EXPORT_FILE%
echo ===================================================

:: Check if the SQL file exists
if not exist "%SQL_EXPORT_FILE%" (
    echo Error: SQL export file not found: %SQL_EXPORT_FILE%
    exit /b 1
)

:: Import the medical tables data
echo Importing medical tables data into %DATABASE% database...
psql -d "%DATABASE%" -f "%SQL_EXPORT_FILE%"

:: Check if the import was successful
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo Import completed successfully!
    echo ===================================================
    echo You can verify the import using the verify_import.sql script:
    echo psql -d %DATABASE% -f verify_import.sql
    echo ===================================================
) else (
    echo ===================================================
    echo Error: Import failed!
    echo ===================================================
    exit /b 1
)

exit /b 0