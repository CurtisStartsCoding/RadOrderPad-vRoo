@echo off
echo Checking Redis population status...
echo.

cd /d "%~dp0\.."
node debug-scripts/check-redis-population.js

echo.
echo Press any key to exit...
pause > nul