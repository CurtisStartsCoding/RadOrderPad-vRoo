@echo off
echo ===== Running Working API Tests (Part 1) =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0"
echo Project root directory: %PROJECT_ROOT%

REM Generate tokens using absolute path
echo Generating fresh tokens for all roles...
call node "%PROJECT_ROOT%utilities\generate-all-role-tokens.js"

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

REM Run individual tests using relative paths
echo.
echo Running Connection Requests Tests...
cd scripts
call test-connection-requests.bat
cd ..

echo.
echo Running Admin Order Queue Tests...
cd scripts
call test-admin-order-queue.bat
cd ..

echo.
echo Running Admin Paste Summary Tests...
cd scripts
call test-admin-paste-summary.bat
cd ..

echo.
echo Running Accept Invitation Tests...
cd scripts
call test-accept-invitation.bat
cd ..

echo.
echo Running User Invite Tests...
cd scripts
call test-user-invite.bat
cd ..

echo.
echo Running Uploads Presigned URL Tests...
cd scripts
call test-uploads-presigned-url.bat
cd ..

echo.
echo Running Uploads Confirm Tests...
cd scripts
call test-uploads-confirm.bat
cd ..

echo.
echo Running Get Download URL Tests...
cd scripts
call test-get-download-url.bat
cd ..

echo.
echo Running Get Credit Balance Tests...
cd scripts
call test-get-credit-balance.bat
cd ..

echo.
echo Running Get Credit Usage Tests...
cd scripts
call test-get-credit-usage.bat
cd ..

echo.
echo Running Register Tests...
cd scripts
call test-register.bat
cd ..

echo.
echo Running Get User Me Tests...
cd scripts
call test-get-user-me.bat
cd ..

echo.
echo ===== All Working Tests (Part 1) Complete =====