@echo off
echo ===== Running Working API Tests (Part 2) =====

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

echo.
echo Running Connection Terminate Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-terminate.bat"

echo.
echo Running Update User Me Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-update-user-me.bat"

echo.
echo Running List Organization Users Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-list-org-users.bat"

echo.
echo Running Update Organization User Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-update-org-user.bat"

echo.
echo Running Deactivate Organization User Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-deactivate-org-user.bat"

echo.
echo Running User Location Assignment Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-user-location-assignment.bat"

echo.
echo Running Connection Reject Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-reject.bat"

echo.
echo Running User Invite Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-user-invite.bat"

echo.
echo Running Update Organization Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-update-org-mine.bat"

echo.
echo Running Search Organizations Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-search-organizations.bat"

echo.
echo Running Health Check Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-health.bat"

echo.
echo Running Login Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-login.bat"

echo.
echo Running Connection List Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-list.bat"

echo.
echo Running Connection Requests List Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-requests-list.bat"

echo.
echo Running Connection Request Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-request.bat"

echo.
echo Running Connection Approve Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-connection-approve.bat"

echo.
echo Running Admin Order Queue Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-admin-order-queue.bat"

echo.
echo Running Admin Paste Summary Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-admin-paste-summary.bat"

echo.
echo Running Location Management Tests...
call "%PROJECT_ROOT%debug-scripts\vercel-tests\test-location-management.bat"

echo.
echo ===== All Working Tests (Part 2) Complete =====