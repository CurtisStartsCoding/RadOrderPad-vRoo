@echo off
echo === Testing Radiology Order Usage Reporting ===
echo.

REM Check if the dist directory exists
if not exist "dist" (
  echo Building TypeScript files...
  call npm run build
)

REM Run the test script
node scripts/billing/test-billing-usage-reporting.js %*

echo.
echo === Test Complete ===
pause