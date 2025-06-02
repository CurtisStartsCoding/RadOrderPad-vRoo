@echo off
echo Running simple Redis connection test with logging...
echo.

cd /d "%~dp0\..\..\"
echo Redirecting output to redis-connection-test.log
node debug-scripts/redis-optimization/test-redis-connection-simple.js > redis-connection-test.log 2>&1
echo Test completed. Check redis-connection-test.log for details.

echo.
echo Script execution complete.
echo Press any key to exit...
pause > nul