@echo off
echo Forcing complete Redis population...
echo.
echo WARNING: This will delete all existing Redis keys and repopulate from the database.
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

cd /d "%~dp0\.."
node debug-scripts/force-redis-population.js

echo.
echo Press any key to exit...
pause > nul