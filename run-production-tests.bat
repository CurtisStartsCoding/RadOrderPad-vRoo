@echo off
echo Running RadOrderPad Production End-to-End Tests
echo =============================================

node tests/e2e/run-production-tests.js

if %ERRORLEVEL% EQU 0 (
  echo.
  echo Tests completed successfully!
) else (
  echo.
  echo Tests failed with error code %ERRORLEVEL%
)

echo.
echo Test logs are available in test-results/e2e-production/
echo.

pause