@echo off
echo === Setting Up Test Radiology Organization ===
echo.

REM Check if the dist directory exists
if not exist "dist" (
  echo Building TypeScript files...
  call npm run build
)

REM Run the setup script
node scripts/billing/setup-test-radiology-org.js %*

echo.
echo === Setup Complete ===
pause