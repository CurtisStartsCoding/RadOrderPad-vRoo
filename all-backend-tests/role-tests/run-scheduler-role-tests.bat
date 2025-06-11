@echo off
echo ===== Running Scheduler (Radiology Organization) Role Tests =====
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Run the scheduler role tests
echo Running scheduler role tests...
node "%SCRIPT_DIR%scheduler-role-tests.js"

echo.
echo ===== Scheduler Role Tests Complete =====
pause