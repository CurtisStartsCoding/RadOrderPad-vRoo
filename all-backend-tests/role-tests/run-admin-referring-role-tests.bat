@echo off
echo ===========================================
echo     Admin Referring Role Tests
echo ===========================================
echo.

REM Store the current directory
set "ORIGINAL_DIR=%CD%"

REM Navigate to role-tests directory
cd /d "%~dp0"

REM Generate fresh token
echo Generating fresh admin_referring token...
cd ..
call node utilities\generate-admin-referring-token.js
cd role-tests

REM Check if token was generated
if not exist "..\tokens\admin_referring-token.txt" (
    echo Error: Failed to generate admin_referring token
    exit /b 1
)

REM Run the tests
echo.
echo Running Admin Referring Role Tests...
echo.
node admin-referring-role-tests.js

REM Return to original directory
cd /d "%ORIGINAL_DIR%"

echo.
echo Test execution complete.
pause