@echo off
echo ===========================================
echo     Admin Radiology Role Tests
echo ===========================================
echo.

REM Store the current directory
set "ORIGINAL_DIR=%CD%"

REM Navigate to role-tests directory
cd /d "%~dp0"

REM Generate fresh token
echo Generating fresh admin_radiology token...
cd ..
call node utilities\generate-admin-radiology-token.js
cd role-tests

REM Check if token was generated
if not exist "..\tokens\admin_radiology-token.txt" (
    echo Error: Failed to generate admin_radiology token
    exit /b 1
)

REM Run the tests
echo.
echo Running Admin Radiology Role Tests...
echo.
node admin-radiology-role-tests.js

REM Return to original directory
cd /d "%ORIGINAL_DIR%"

echo.
echo Test execution complete.
pause