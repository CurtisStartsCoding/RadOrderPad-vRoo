@echo off
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
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\upsert\cpt_codes_upsert.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT codes
    set PGPASSWORD=
    exit /b 1
)
echo CPT codes imported successfully

set PGPASSWORD=

echo.
echo CPT codes import completed successfully!
