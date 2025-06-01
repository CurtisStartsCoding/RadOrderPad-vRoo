@echo off
echo Testing database query limits...
echo.

cd /d "%~dp0\.."
node debug-scripts/test-db-query-limits.js

echo.
echo Press any key to exit...
pause > nul