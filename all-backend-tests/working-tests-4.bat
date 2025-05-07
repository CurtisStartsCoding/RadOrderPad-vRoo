@echo off
echo ===== Running Working API Tests (Part 4) =====

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
if exist "%PROJECT_ROOT%tokens\admin_staff-token.txt" (
    set /p ADMIN_STAFF_TOKEN=<"%PROJECT_ROOT%tokens\admin_staff-token.txt"
    echo Admin Staff Token loaded successfully.
) else (
    echo Error: Admin Staff Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\admin_referring-token.txt" (
    set /p ADMIN_REFERRING_TOKEN=<"%PROJECT_ROOT%tokens\admin_referring-token.txt"
    echo Admin Referring Token loaded successfully.
) else (
    echo Error: Admin Referring Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\physician-token.txt" (
    set /p PHYSICIAN_TOKEN=<"%PROJECT_ROOT%tokens\physician-token.txt"
    echo Physician Token loaded successfully.
) else (
    echo Error: Physician Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Set the order ID to use for testing
REM Try a different order ID for the insurance-info test
set TEST_ORDER_ID=603
echo Using order ID: %TEST_ORDER_ID% for testing
echo Note: If tests fail, try using one of these order IDs: 600, 601, 603, 604, 609, 612

REM Run individual tests using relative paths
echo.
echo Running Admin Paste Summary Tests...
cd scripts
call test-admin-paste-summary.bat
cd ..

echo.
echo Running Admin Paste Supplemental Tests...
cd scripts
call test-admin-paste-supplemental.bat
cd ..

echo.
echo Running Admin Patient Info Tests...
cd scripts
call test-admin-patient-info.bat
cd ..

echo.
echo Running Admin Insurance Info Tests...
cd scripts
call test-admin-insurance-info.bat
cd ..

echo.
echo ===== All Working Tests (Part 4) Complete =====