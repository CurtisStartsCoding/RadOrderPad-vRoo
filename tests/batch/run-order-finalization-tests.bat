@echo off
echo Running Order Finalization Tests
echo ===============================

REM Use the token generation from all-backend-tests
echo Using token generation from all-backend-tests...
cd ..\..\all-backend-tests
call node utilities\generate-all-role-tokens.js
cd ..\tests\batch

REM Set environment variables for tokens
echo Setting environment variables for tokens...
if exist "..\..\all-backend-tests\tokens\physician-token.txt" (
    set /p PHYSICIAN_TOKEN=<"..\..\all-backend-tests\tokens\physician-token.txt"
    echo Physician Token loaded successfully.
) else (
    echo Error: Physician Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Create test-results directory if it doesn't exist
if not exist "test-results" mkdir test-results

REM Run the test
echo Running order finalization tests...
node test-order-finalization.js > test-results\order-finalization-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Order Finalization Tests
) else (
    echo [FAIL] Order Finalization Tests - Check test-results\order-finalization-tests.log for details
)

echo.
echo Test completed!