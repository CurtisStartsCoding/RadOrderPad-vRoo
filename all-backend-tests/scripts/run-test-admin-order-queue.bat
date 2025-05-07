@echo off
echo ===== Running Admin Order Queue Test =====

REM Set environment variables directly
set NODE_ENV=production
set API_URL=https://api.radorderpad.com

REM Get the token from the file using a temporary variable
set "TOKEN_PATH=C:\Users\JB\Dropbox (Personal)\Apps\ROP Roo Backend Finalization\tokens\admin_staff-token.txt"
if exist "%TOKEN_PATH%" (
    set /p ADMIN_STAFF_TOKEN=<"%TOKEN_PATH%"
    echo Admin Staff Token loaded successfully.
) else (
    echo Error: Token file not found: %TOKEN_PATH%
    exit /b 1
)

REM Create a temporary .env.test file with the token
echo API_URL=https://api.radorderpad.com > .env.test
echo ADMIN_STAFF_TOKEN=%ADMIN_STAFF_TOKEN% >> .env.test

REM Run the test script directly
node test-admin-order-queue.js

echo.
echo ===== Test Complete =====
