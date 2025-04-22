@echo off
echo Running Redis Test Scripts...

echo.
echo === 1. Checking Redis Data ===
node scripts/redis/check-redis-data.js
echo.
echo Press any key to continue to the next test...
pause > nul

echo.
echo === 2. Testing RedisSearch Directly ===
node scripts/redis/test-redis-search-direct.js
echo.
echo Press any key to continue to the next test...
pause > nul

echo.
echo === 3. Checking Index Schema ===
node scripts/redis/check-index-schema.js
echo.
echo Press any key to continue to the next test...
pause > nul

echo.
echo === 4. Testing Different Query Formats ===
node scripts/redis/fix-redis-search-queries.js
echo.
echo Press any key to continue to the next test...
pause > nul

echo.
echo === 5. Implementing Redis Search Fix ===
node scripts/redis/implement-redis-search-fix.js
echo.

echo All Redis tests completed.
pause