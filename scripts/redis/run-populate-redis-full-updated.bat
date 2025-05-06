@echo off
echo ===== Populating Redis with ALL data from PostgreSQL =====
echo.
echo This script will:
echo 1. Connect to PostgreSQL and retrieve all medical codes
echo 2. Store them in Redis with appropriate keys
echo 3. Create search indexes for efficient searching
echo.
echo This may take several minutes depending on the size of your database.
echo.
echo Running populate-redis-full-updated.js...
node scripts/redis/populate-redis-full-updated.js
echo.
echo Script completed.
pause