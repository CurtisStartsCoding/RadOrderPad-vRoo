@echo off
echo ===== Running Working API Tests (Part 3) =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0"
echo Project root directory: %PROJECT_ROOT%

REM Generate tokens using absolute path
echo.
echo Generating fresh tokens for all roles...
call node "%PROJECT_ROOT%utilities\generate-all-role-tokens.js"

REM Set environment variables for tokens
echo.
echo Setting environment variables for tokens...
if exist "%PROJECT_ROOT%tokens\admin_referring-token.txt" (
    set /p ADMIN_REFERRING_TOKEN=<"%PROJECT_ROOT%tokens\admin_referring-token.txt"
    set ADMIN_TOKEN=%ADMIN_REFERRING_TOKEN%
    echo Admin Referring Token loaded successfully.
) else (
    echo Error: Admin Referring Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\admin_radiology-token.txt" (
    set /p ADMIN_RADIOLOGY_TOKEN=<"%PROJECT_ROOT%tokens\admin_radiology-token.txt"
    echo Admin Radiology Token loaded successfully.
) else (
    echo Error: Admin Radiology Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\physician-token.txt" (
    set /p PHYSICIAN_TOKEN=<"%PROJECT_ROOT%tokens\physician-token.txt"
    echo Physician Token loaded successfully.
) else (
    echo Error: Physician Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\admin_staff-token.txt" (
    set /p ADMIN_STAFF_TOKEN=<"%PROJECT_ROOT%tokens\admin_staff-token.txt"
    echo Admin Staff Token loaded successfully.
) else (
    echo Error: Admin Staff Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com

echo.
echo Running Get Organization Mine Tests...
cd scripts
call test-get-org-mine.bat
cd ..

echo.
echo Running Order Validation Tests...
cd scripts
call test-order-validation.bat
cd ..

echo.
echo Running Enhanced Order Validation Tests with Detailed Logging...
cd scripts
call test-order-validation-enhanced.bat
cd ..

echo.
echo Running Super Admin API Tests...
cd scripts
call run-superadmin-api-test.bat
cd ..

echo.
echo Running Trial Feature Tests...
cd scripts
call run-trial-feature-test.bat
cd ..

echo.
echo Running Radiology Request Info Tests...
cd scripts
call run-radiology-request-info-test.bat
cd ..

echo.
echo ===== All Working Tests (Part 3) Complete =====