@echo off
echo ===== Testing Redis Fuzzy Search =====
echo.
echo Using Redis Cloud configuration from .env.production:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.

echo Stopping any existing test-redis-fuzzy-search.js process...
taskkill /F /FI "WINDOWTITLE eq test-redis-fuzzy-search.js" /T >nul 2>&1

echo Running test...
node debug-scripts/redis-optimization/test-redis-fuzzy-search.js

echo.
echo ===== Redis Fuzzy Search Test Complete =====