@echo off
echo ===== Populating Redis with ALL data from PostgreSQL (Fixed Version) =====
echo.
echo This script will:
echo 1. Connect to PostgreSQL and retrieve all medical codes
echo 2. Store them in Redis with the CORRECT key formats that match the service files
echo 3. Create search indexes for efficient searching
echo.
echo This fixed version ensures that the key formats match between storage and retrieval.
echo.
echo Running populate-redis-full-fixed.js...
node scripts/redis/populate-redis-full-fixed.js
echo.
echo Script completed.
pause