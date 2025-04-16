@echo off
setlocal enabledelayedexpansion

echo === RadOrderPad CPT Codes Import Tool ===
echo This script will import ONLY CPT codes into the radorder_main database.
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

REM Test the database connection first
echo Testing database connection...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 'Connection successful';"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to connect to the database
    echo Please check your connection details and try again
    set PGPASSWORD=
    exit /b 1
)
echo Database connection successful!
echo.

REM Import CPT codes
echo Importing CPT codes...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\tables\cpt_codes.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT codes
    set PGPASSWORD=
    exit /b 1
)
echo CPT codes imported successfully

set PGPASSWORD=

echo.
echo CPT codes import completed successfully!