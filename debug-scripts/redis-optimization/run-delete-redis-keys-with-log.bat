@echo off
echo Running Redis key deletion script with logging...
echo.
echo This script will delete all Redis keys and log the process
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

cd /d "%~dp0\..\..\"
node debug-scripts/redis-optimization/delete-redis-keys-with-log.js

echo.
echo Script execution complete.
echo Check redis-delete-keys.log for detailed output.
echo Press any key to exit...
pause > nul