@echo off
echo Diagnosing 500 record limit issue...
echo.

cd /d "%~dp0\.."
node debug-scripts/diagnose-500-limit.js

echo.
echo Press any key to exit...
pause > nul