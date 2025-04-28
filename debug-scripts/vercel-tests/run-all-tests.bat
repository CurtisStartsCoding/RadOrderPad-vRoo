@echo off
echo ===== Running All API Tests =====

REM Store the absolute path to the project root directory
set "PROJECT_ROOT=%~dp0..\..\"
echo Project root directory: %PROJECT_ROOT%

REM Generate tokens using absolute path
echo.
echo Generating fresh tokens for all roles...
call node "%PROJECT_ROOT%scripts\utilities\generate-all-role-tokens.js"

REM Set environment variables for tokens
echo.
echo Setting environment variables for tokens...
if exist "%PROJECT_ROOT%tokens\admin_referring-token.txt" (
    set /p ADMIN_REFERRING_TOKEN=<"%PROJECT_ROOT%tokens\admin_referring-token.txt"
    set ADMIN_TOKEN=%ADMIN_REFERRING_TOKEN%
    echo Admin Referring Token loaded successfully.
) else (
    echo Error: Admin Referring Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\admin_radiology-token.txt" (
    set /p ADMIN_RADIOLOGY_TOKEN=<"%PROJECT_ROOT%tokens\admin_radiology-token.txt"
    echo Admin Radiology Token loaded successfully.
) else (
    echo Error: Admin Radiology Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\admin_staff-token.txt" (
    set /p ADMIN_STAFF_TOKEN=<"%PROJECT_ROOT%tokens\admin_staff-token.txt"
    echo Admin Staff Token loaded successfully.
) else (
    echo Error: Admin Staff Token file not found.
    exit /b 1
)

if exist "%PROJECT_ROOT%tokens\physician-token.txt" (
    set /p PHYSICIAN_TOKEN=<"%PROJECT_ROOT%tokens\physician-token.txt"
    echo Physician Token loaded successfully.
) else (
    echo Error: Physician Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

echo.
echo ===== Running Working Tests (Part 1) =====
call "%PROJECT_ROOT%debug-scripts\vercel-tests\working-tests.bat"

echo.
echo ===== Running Working Tests (Part 2) =====
call "%PROJECT_ROOT%debug-scripts\vercel-tests\working-tests-2.bat"

echo.
echo ===== Running Working Tests (Part 3) =====
call "%PROJECT_ROOT%debug-scripts\vercel-tests\working-tests-3.bat"

echo.
echo ===== All Tests Complete =====