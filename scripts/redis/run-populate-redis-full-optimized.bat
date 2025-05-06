@echo off
echo ===== Populating Redis with ALL data from PostgreSQL (Optimized) =====
echo.
echo This script will:
echo 1. Connect to PostgreSQL and retrieve all medical codes
echo 2. Store them in Redis with appropriate keys using batch operations
echo 3. Create search indexes for efficient searching
echo.
echo This optimized version uses batch operations for faster loading.
echo.
echo Running populate-redis-full-optimized.js...
node scripts/redis/populate-redis-full-optimized.js
echo.
echo Script completed.
pause