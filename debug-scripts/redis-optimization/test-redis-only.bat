@echo off
echo ===== Testing Redis Cache Implementation (Redis-only) =====
echo.
echo Using Redis Cloud configuration from .env.production:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.

node debug-scripts/redis-optimization/test-redis-only.js

echo.
echo ===== Redis-only Test Complete =====