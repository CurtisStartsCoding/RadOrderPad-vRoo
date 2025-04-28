@echo off
echo ===== Testing Admin Paste Summary Endpoint =====

REM Use the PROJECT_ROOT variable passed from the calling script
if "%PROJECT_ROOT%"=="" (
    REM If not called from another script, set the project root
    set "PROJECT_ROOT=%~dp0..\..\"
)
echo Project root directory: %PROJECT_ROOT%

REM Run the test script
node "%PROJECT_ROOT%debug-scripts\vercel-tests\test-admin-paste-summary.js"

echo.
echo ===== Test Complete =====