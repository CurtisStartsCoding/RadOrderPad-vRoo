@echo off
echo ===== Checking AWS User Used by API Server =====
echo.

cd /d "%~dp0"
node check-api-aws-user.js

echo.
pause