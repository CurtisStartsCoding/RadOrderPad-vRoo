@echo off
echo Checking Redis keys using SCAN command...
echo.

cd /d "%~dp0\.."
node debug-scripts/check-redis-scan.js

echo.
echo Press any key to exit...
pause > nul