@echo off
echo ===== Running Physician Role Tests =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0\.."
echo Project root directory: %PROJECT_ROOT%

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Set the test user credentials
set PHYSICIAN_EMAIL=test.physician@example.com
set PHYSICIAN_PASSWORD=password123
echo Physician email set to: %PHYSICIAN_EMAIL%

REM Run the physician role tests
echo.
echo Running Physician Role Tests...
node "%PROJECT_ROOT%\role-tests\physician-role-tests.js"

echo.
echo ===== Physician Role Tests Complete =====
pause