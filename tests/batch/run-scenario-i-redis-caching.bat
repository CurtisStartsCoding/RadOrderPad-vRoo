@echo off
echo Running Scenario I: Redis Caching Test...
node tests/e2e/scenario-i-redis-caching.js
if %ERRORLEVEL% NEQ 0 (
  echo Scenario I: Redis Caching Test FAILED
  exit /b 1
) else (
  echo Scenario I: Redis Caching Test PASSED
  exit /b 0
)