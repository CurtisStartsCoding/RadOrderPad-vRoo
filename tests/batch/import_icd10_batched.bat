@echo off
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
echo Total batches: 94
echo.

REM First create the table
echo Creating table structure...
set PGPASSWORD=%DB_PASS%
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "Data\batches\00_create_table.sql"
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to create table structure
    exit /b 1
)

REM Import each batch
for /L %%i in (1,1,94) do (
    set BATCH_NUM=00%%i
    set BATCH_FILE=Data\batches\!BATCH_NUM:~-2!_batch.sql
    echo Importing batch %%i of 94...
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
echo Imported 94 batches
