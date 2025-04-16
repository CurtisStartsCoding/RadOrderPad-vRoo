@echo off
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
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\upsert\icd10_codes_upsert.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import ICD-10 codes
    set PGPASSWORD=
    exit /b 1
)
echo ICD-10 codes imported successfully

set PGPASSWORD=

echo.
echo ICD-10 codes import completed successfully!
