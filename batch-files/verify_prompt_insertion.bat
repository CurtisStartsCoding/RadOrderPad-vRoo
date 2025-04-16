@echo off
:: verify_prompt_insertion.bat
:: Script to verify the successful insertion of the default prompt template
:: Date: 2025-04-13

:: Set variables
set DATABASE=radorder_main
set VERIFY_SQL=verify_prompt_insertion.sql

:: Display script information
echo ===================================================
echo RadOrderPad Default Prompt Template Verification
echo ===================================================
echo Database: %DATABASE%
echo SQL File: %VERIFY_SQL%
echo ===================================================

:: Check if the SQL file exists
if not exist "%VERIFY_SQL%" (
    echo Error: Verification SQL file not found: %VERIFY_SQL%
    exit /b 1
)

:: Run the verification script
echo Running verification queries...
psql -d "%DATABASE%" -f "%VERIFY_SQL%"

:: Check if the verification was successful
if %ERRORLEVEL% equ 0 (
    echo ===================================================
    echo Verification completed successfully!
    echo ===================================================
) else (
    echo ===================================================
    echo Error: Verification failed!
    echo ===================================================
    exit /b 1
)

exit /b 0