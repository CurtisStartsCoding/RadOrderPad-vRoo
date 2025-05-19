@echo off
echo ===== Running Trial Role Tests =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0\.."
echo Project root directory: %PROJECT_ROOT%

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Set the test user credentials
set TRIAL_USER_EMAIL=trial-test@example.com
set TRIAL_USER_PASSWORD=updatedPassword789
echo Trial user email set to: %TRIAL_USER_EMAIL%

REM Run the trial role tests
echo.
echo Running Trial Role Tests...
node "%PROJECT_ROOT%\role-tests\trial-role-tests.js"

echo.
echo ===== Trial Role Tests Complete =====
pause