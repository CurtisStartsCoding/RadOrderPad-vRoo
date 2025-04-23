@echo off
echo ===== Creating Test Relationships =====

REM Set environment variables
set NODE_ENV=production

REM Run the script
node -r dotenv/config create-test-relationships.js

echo.
echo ===== Test Relationships Created =====
pause