@echo off
echo ===== Running Working API Tests (Part 2) =====

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

echo.
echo Running Connection Terminate Tests...
cd scripts
call test-connection-terminate.bat
cd ..

echo.
echo Running Update User Me Tests...
cd scripts
call test-update-user-me.bat
cd ..

echo.
echo Running List Organization Users Tests...
cd scripts
call test-list-org-users.bat
cd ..

echo.
echo Running Update Organization User Tests...
cd scripts
call test-update-org-user.bat
cd ..

echo.
echo Running Deactivate Organization User Tests...
cd scripts
call test-deactivate-org-user.bat
cd ..

echo.
echo Running User Location Assignment Tests...
cd scripts
call test-user-location-assignment.bat
cd ..

echo.
echo Running Connection Reject Tests...
cd scripts
call test-connection-reject.bat
cd ..

echo.
echo Running User Invite Tests...
cd scripts
call test-user-invite.bat
cd ..

echo.
echo Running Update Organization Tests...
cd scripts
call test-update-org-mine.bat
cd ..

echo.
echo Running Search Organizations Tests...
cd scripts
call test-search-organizations.bat
cd ..

echo.
echo Running Health Check Tests...
cd scripts
call test-health.bat
cd ..

echo.
echo Running Login Tests...
cd scripts
call test-login.bat
cd ..

echo.
echo Running Connection List Tests...
cd scripts
call test-connection-list.bat
cd ..

echo.
echo Running Connection Requests List Tests...
cd scripts
call test-connection-requests-list.bat
cd ..

echo.
echo Running Connection Request Tests...
cd scripts
call test-connection-request.bat
cd ..

echo.
echo Running Connection Approve Tests...
cd scripts
call test-connection-approve.bat
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
echo Running Location Management Tests...
cd scripts
call test-location-management.bat
cd ..

echo.
echo ===== All Working Tests (Part 2) Complete =====