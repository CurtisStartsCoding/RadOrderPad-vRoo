@echo off
echo ====================================
echo Running Location Filtering Tests
echo ====================================
echo.

REM Navigate to the correct directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "..\..\node_modules" (
    echo Installing dependencies...
    cd ..\..
    npm install
    cd all-backend-tests\role-tests
)

REM Set environment variables if needed
if not defined API_URL (
    set API_URL=https://api.radorderpad.com
)

REM Create test users if they don't exist
echo Note: This test requires the following test users to exist:
echo - physician.location1@example.com (assigned to Location 1)
echo - physician.location2@example.com (assigned to Location 2)
echo - admin.location1@example.com (assigned to Location 1)
echo - admin.location2@example.com (assigned to Location 2)
echo.
echo If these users don't exist, please create them first.
echo.

REM Run the location filtering tests
echo Running location filtering tests...
node location-filtering-tests.js

echo.
echo ====================================
echo Location Filtering Tests Complete
echo ====================================
pause