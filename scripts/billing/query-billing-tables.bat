@echo off
echo === Querying Billing Tables ===
echo.

REM Check if the dist directory exists
if not exist "dist" (
  echo Building TypeScript files...
  call npm run build
)

REM Run the query script
node scripts/billing/query-billing-tables.js

echo.
echo === Query Complete ===
pause