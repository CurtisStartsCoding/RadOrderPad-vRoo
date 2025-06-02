@echo off
echo Running modified Redis population test...
echo.
echo This script will clear all Redis keys and repopulate them
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

cd /d "%~dp0\..\..\"
node debug-scripts/redis-optimization/test-redis-population-modified.js

echo.
echo Script execution complete.
echo Press any key to exit...
pause > nul