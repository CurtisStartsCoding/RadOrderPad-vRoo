@echo off
echo Running Redis population test with enhanced debugging...
echo.
echo This script will attempt to connect to Redis and show detailed debug information
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

cd /d "%~dp0\..\..\"
node debug-scripts/redis-optimization/test-redis-population-modified.js

echo.
echo Script execution complete.
echo Press any key to exit...
pause > nul