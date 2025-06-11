@echo off
echo ===== Running Scheduler (Radiology Organization) Comprehensive Tests =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0"
echo Project root directory: %PROJECT_ROOT%

REM Generate tokens using absolute path
echo.
echo Generating fresh tokens for all roles...
call node "%PROJECT_ROOT%utilities\generate-all-role-tokens.js"

REM Set environment variables for tokens
echo.
echo Setting environment variables for tokens...
if exist "%PROJECT_ROOT%tokens\scheduler-token.txt" (
    set /p SCHEDULER_TOKEN=<"%PROJECT_ROOT%tokens\scheduler-token.txt"
    echo Scheduler Token loaded successfully.
) else (
    echo Error: Scheduler Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\admin_radiology-token.txt" (
    set /p ADMIN_RADIOLOGY_TOKEN=<"%PROJECT_ROOT%tokens\admin_radiology-token.txt"
    echo Admin Radiology Token loaded successfully.
) else (
    echo Error: Admin Radiology Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

echo.
echo Running Scheduler Role Tests...
cd role-tests
call run-scheduler-role-tests.bat
cd ..

echo.
echo Running Radiology Request Info Tests (uses scheduler role)...
cd scripts
call run-radiology-request-info-test.bat
cd ..

echo.
echo ===== Scheduler Comprehensive Tests Complete ====="