@echo off
echo ===== Populating Redis with ALL data from PostgreSQL =====
echo.
echo This script will:
echo 1. Connect to PostgreSQL and retrieve all medical codes
echo 2. Store them in Redis with appropriate keys
echo 3. Verify the data was stored correctly
echo.
echo This may take several minutes depending on the size of your database.
echo.

echo Running populate-redis-full.js...
node scripts/redis/populate-redis-full.js

echo.
echo ===== Redis Population Complete =====
echo.
echo Next steps:
echo 1. Run your validation tests with the populated Redis cache
echo 2. Compare the results with previous tests
echo.