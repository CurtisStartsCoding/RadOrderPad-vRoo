@echo off
echo === Setting Up Billing Tables ===
echo.

REM Check if the dist directory exists
if not exist "dist" (
  echo Building TypeScript files...
  call npm run build
)

REM Run the setup script
node scripts/billing/setup-billing-tables.js

echo.
echo === Setup Complete ===
pause