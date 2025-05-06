@echo off
echo Counting Redis keys...
echo.
node debug-scripts/redis-optimization/count-redis-keys.js
echo.
echo Script completed.
pause