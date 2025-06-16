@echo off
echo ========================================
echo   LOCATION PERMISSIONS TEST SUITE
echo ========================================
echo.

echo Step 1: Creating test organizations and users...
echo ------------------------------------------------
node create-test-users-for-permissions.js
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to create test environment
    pause
    exit /b 1
)

echo.
echo Step 2: Approving connections between organizations...
echo -----------------------------------------------------
timeout /t 3 /nobreak > nul
node approve-test-connections.js
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to approve connections
    pause
    exit /b 1
)

echo.
echo Step 3: Running location permissions tests...
echo --------------------------------------------
timeout /t 3 /nobreak > nul
node test-location-permissions.js

echo.
echo ========================================
echo   TEST SUITE COMPLETE
echo ========================================
echo.
echo Check the following files for details:
echo - test-environment-summary.json
echo - location-permissions-test-results.json
echo.
pause