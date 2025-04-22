@echo off
echo Moving useful scripts to appropriate directories...
echo.

REM Create directories if they don't exist
if not exist "frontend-explanation\admin-scripts" mkdir "frontend-explanation\admin-scripts"

echo Moving admin-related scripts to frontend-explanation/admin-scripts:
echo.

echo Moving test-admin-endpoint.js
if exist "test-admin-endpoint.js" (
    move "test-admin-endpoint.js" "frontend-explanation\admin-scripts\"
