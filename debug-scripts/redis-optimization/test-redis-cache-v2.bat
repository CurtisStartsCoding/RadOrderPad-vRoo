@echo off
echo ===== Testing Redis Cache Implementation v2 =====
echo.
echo Using Redis Cloud configuration from .env.production:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.

if "%1"=="" (
  echo Running all tests...
  echo.
  
  echo === Testing CPT code lookup ===
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs cpt 71045
  echo.
  
  echo === Testing ICD-10 code lookup ===
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs icd10 J18.9
  echo.
  
  echo === Testing mapping lookup ===
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs mapping J18.9
  echo.
  
  echo === Testing pattern invalidation ===
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs pattern-invalidate test
  echo.
  
  echo === Testing bulk data retrieval ===
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs bulk-get
  echo.
  
  echo === Showing cache metrics ===
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs metrics
) else (
  echo Running test: %*
  node debug-scripts/redis-optimization/test-redis-cache-v2.cjs %*
)

echo.
echo ===== Redis Cache Tests Complete =====