@echo off
echo ========================================
echo Redis Full Repopulation Script
echo ========================================
echo.
echo This script will:
echo 1. Clear all existing Redis data
echo 2. Repopulate Redis with ALL database records
echo.
echo Press Ctrl+C to cancel or any other key to continue...
pause > nul

cd /d "%~dp0\..\..\"

echo.
echo Running Redis repopulation...
node scripts/redis/repopulate-redis-all.js

echo.
echo Redis repopulation complete!
pause