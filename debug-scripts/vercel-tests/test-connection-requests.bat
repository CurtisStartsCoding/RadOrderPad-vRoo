@echo off
echo Running Connection Requests API Test...

REM Use the PROJECT_ROOT variable passed from the calling script
if "%PROJECT_ROOT%"=="" (
    REM If not called from allfinaltests.bat, set the project root
    set "PROJECT_ROOT=%~dp0..\..\"
)

REM Run the test script
node "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-requests.js"

echo Test completed.