@echo off
echo ===== Running Admin Staff (Referring Organization) Role Tests =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0.."
echo Project root directory: %PROJECT_ROOT%

REM Generate tokens using absolute path
echo.
echo Generating fresh tokens for all roles...
call node "%PROJECT_ROOT%\utilities\generate-all-role-tokens.js"

REM Set environment variables for tokens
echo.
echo Setting environment variables for tokens...
if exist "%PROJECT_ROOT%\tokens\admin_staff-token.txt" (
    set /p ADMIN_STAFF_TOKEN=<"%PROJECT_ROOT%\tokens\admin_staff-token.txt"
    echo Admin Staff Token loaded successfully.
) else (
    echo Error: Admin Staff Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Load AWS credentials from .env.production file
echo.
echo Loading AWS credentials from .env.production file...
for /f "tokens=1,2 delims==" %%a in ('type "%PROJECT_ROOT%\..\\.env.production" ^| findstr /v "^#" ^| findstr /v "^$"') do (
    set "%%a=%%b"
    echo Set %%a environment variable.
)

REM Run the admin staff role tests
echo.
echo Running Admin Staff Role Tests...
node admin-staff-role-tests.js

echo.
echo ===== Admin Staff Role Tests Complete =====