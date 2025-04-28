@echo off
echo ===== Testing Get Organization Mine Endpoint =====

REM Use the PROJECT_ROOT variable passed from the calling script
if "%PROJECT_ROOT%"=="" (
    REM If not called from another script, set the project root
    set "PROJECT_ROOT=%~dp0..\..\"
)

REM Run the test script
node "%PROJECT_ROOT%debug-scripts\vercel-tests\test-get-org-mine.js"

echo.
echo ===== Test Complete =====