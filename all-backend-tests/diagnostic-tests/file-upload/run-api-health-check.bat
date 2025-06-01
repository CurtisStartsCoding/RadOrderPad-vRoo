@echo off
echo ===== Running API Health Check for Upload Functionality =====

REM Store the absolute path to the current directory
set "CURRENT_DIR=%~dp0"
echo Current directory: %CURRENT_DIR%

REM Check if node_modules exists, if not, install dependencies
if not exist "%CURRENT_DIR%node_modules" (
    echo Installing dependencies...
    cd "%CURRENT_DIR%"
    call npm install
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Run the API health check
echo.
echo Running API Health Check...
node "%CURRENT_DIR%api-health-check.js"

echo.
echo ===== API Health Check Complete =====
echo.
echo This test checks the API endpoints related to the upload functionality:
echo 1. API health endpoint
echo 2. Uploads API endpoint
echo.
echo If any of these tests fail, check the recommendations provided.

pause