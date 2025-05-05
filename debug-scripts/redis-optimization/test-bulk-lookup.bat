@echo off
echo ===== Testing Redis Bulk Lookup =====
echo.
echo Using Redis Cloud configuration from .env.production:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.

echo Stopping any existing test-bulk-lookup.cjs process...
taskkill /F /FI "WINDOWTITLE eq test-bulk-lookup.cjs" /T >nul 2>&1

echo Running test...
node debug-scripts/redis-optimization/test-bulk-lookup.cjs

echo.
echo ===== Redis Bulk Lookup Test Complete =====