@echo off
echo === Setting Up Test Referring Organization ===
echo.

REM Check if the dist directory exists
if not exist "dist" (
  echo Building TypeScript files...
  call npm run build
)

REM Run the setup script
node scripts/billing/setup-test-referring-org.js %*

echo.
echo === Setup Complete ===
pause