@echo off
echo ===== Testing Connection Endpoints =====

REM Set environment variables
set NODE_ENV=production

REM Run the script
node -r dotenv/config test-connection-endpoints.js

echo.
echo ===== Connection Endpoint Testing Complete =====
pause