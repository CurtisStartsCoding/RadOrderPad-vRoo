@echo off
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
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\tables\cpt_codes.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT codes
    exit /b 1
)
echo CPT codes imported successfully

REM Import markdown docs (depends on ICD-10 codes being already imported)
echo Importing ICD-10 markdown docs...
echo NOTE: This will only work if ICD-10 codes have already been imported
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\tables\icd10_markdown_docs.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import ICD-10 markdown docs
    echo Make sure ICD-10 codes have been imported first using import_icd10_batched.bat
    exit /b 1
)
echo ICD-10 markdown docs imported successfully

REM Import mappings (depends on both CPT and ICD-10 codes)
echo Importing CPT-ICD10 mappings...
echo NOTE: This will only work if both CPT and ICD-10 codes have already been imported
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\tables\cpt_icd10_mappings.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to import CPT-ICD10 mappings
    echo Make sure both CPT and ICD-10 codes have been imported first
    exit /b 1
)
echo CPT-ICD10 mappings imported successfully

set PGPASSWORD=

echo.
echo All medical tables (except ICD-10 codes) imported successfully!
