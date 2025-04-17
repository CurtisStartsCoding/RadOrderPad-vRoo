@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad Medical Data Import Tool ===
echo This script will import medical reference data into the radorder_main database ONLY.
echo WARNING: This script should NOT be used for the radorder_phi database.
echo.

REM SQL file path
set SQL_FILE=Data\medical_tables_export_2025-04-11T23-40-51-963Z.sql

REM Check if the SQL file exists
if not exist "%SQL_FILE%" (
    echo ERROR: SQL file not found: %SQL_FILE%
    exit /b 1
)

REM Get database connection details from environment variables
if defined MAIN_DATABASE_URL (
    REM Parse the DATABASE_URL to extract connection details
    REM This is a simplified version and may not handle all edge cases
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

echo Importing medical reference data into radorder_main database...
echo Database: %DB_NAME%
echo Host: %DB_HOST%:%DB_PORT%
echo User: %DB_USER%
echo SQL File: %SQL_FILE%
echo.

REM Execute the SQL file
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "%SQL_FILE%"
set RESULT=%ERRORLEVEL%
set PGPASSWORD=

REM Check if the import was successful
if %RESULT% equ 0 (
    echo.
    echo Import completed successfully!
    
    REM Count the number of rows in each table
    echo Verifying imported data...
    echo Counting rows in medical tables...
    
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 'medical_cpt_codes' as table_name, COUNT(*) as row_count FROM medical_cpt_codes UNION ALL SELECT 'medical_icd10_codes', COUNT(*) FROM medical_icd10_codes UNION ALL SELECT 'medical_cpt_icd10_mappings', COUNT(*) FROM medical_cpt_icd10_mappings UNION ALL SELECT 'medical_icd10_markdown_docs', COUNT(*) FROM medical_icd10_markdown_docs ORDER BY table_name;"
    
    echo.
    echo Import verification complete.
) else (
    echo.
    echo ERROR: Import failed with exit code %RESULT%
    exit /b %RESULT%
)

echo.
echo Medical reference data import process completed.