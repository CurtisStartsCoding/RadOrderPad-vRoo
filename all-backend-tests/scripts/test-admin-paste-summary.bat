@echo off
echo ===== Testing Admin Paste Summary Endpoint =====

rem Get the project root directory
set PROJECT_ROOT=%~dp0..

rem Set environment variables
set API_URL=https://api.radorderpad.com
set TEST_ORDER_ID=603

rem Run the test
node "%PROJECT_ROOT%\scripts\test-admin-paste-summary.js"

echo ===== Test Complete =====
