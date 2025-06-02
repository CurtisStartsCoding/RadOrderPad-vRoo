@echo off
echo Running simple Redis connection test...
echo.

cd /d "%~dp0\..\..\"
node debug-scripts/redis-optimization/test-redis-connection-simple.js

echo.
echo Script execution complete.
echo Press any key to exit...
pause > nul