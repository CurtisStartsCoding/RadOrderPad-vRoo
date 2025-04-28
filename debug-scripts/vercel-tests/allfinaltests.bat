@echo off
echo ===== Running All Final API Tests =====

REM Store the absolute path to the project root directory
set "PROJECT_ROOT=%~dp0..\..\\"
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

REM Create a temporary .env.test file with the tokens and API URL
echo API_URL=https://api.radorderpad.com > "%~dp0.env.test"
echo ADMIN_REFERRING_TOKEN=%ADMIN_REFERRING_TOKEN% >> "%~dp0.env.test"
echo ADMIN_RADIOLOGY_TOKEN=%ADMIN_RADIOLOGY_TOKEN% >> "%~dp0.env.test"
echo ADMIN_STAFF_TOKEN=%ADMIN_STAFF_TOKEN% >> "%~dp0.env.test"
echo PHYSICIAN_TOKEN=%PHYSICIAN_TOKEN% >> "%~dp0.env.test"

echo.
echo ===== Running Connection Requests Tests =====
call "%~dp0test-connection-requests.bat"

echo.
echo ===== Running Admin Order Queue Tests =====
call "%~dp0test-admin-order-queue.bat"

echo.
echo ===== Running Admin Paste Summary Tests =====
call "%~dp0test-admin-paste-summary.bat"

echo.
echo ===== Running Accept Invitation Tests =====
call "%~dp0test-accept-invitation.bat"

echo.
echo ===== Running User Invite Tests =====
call "%~dp0test-user-invite.bat"

echo.
echo ===== Running Uploads Presigned URL Tests =====
call "%~dp0test-uploads-presigned-url.bat"

echo.
echo ===== Running Uploads Confirm Tests =====
call "%~dp0test-uploads-confirm.bat"

echo.
echo ===== Running Get Download URL Tests =====
call "%~dp0test-get-download-url.bat"

echo.
echo ===== Running Get Credit Balance Tests =====
call "%~dp0test-get-credit-balance.bat"

echo.
echo ===== Running Get Credit Usage Tests =====
call "%~dp0test-get-credit-usage.bat"

echo.
echo ===== Running Get User Me Tests =====
call "%~dp0test-get-user-me.bat"

echo.
echo ===== Running Connection Terminate Tests =====
call "%~dp0test-connection-terminate.bat"

echo.
echo ===== Running Update User Me Tests =====
call "%~dp0test-update-user-me.bat"

echo.
echo ===== Running List Organization Users Tests =====
call "%~dp0test-list-org-users.bat"

echo.
echo ===== Running Update Organization User Tests =====
call "%~dp0test-update-org-user.bat"

echo.
echo ===== Running Deactivate Organization User Tests =====
call "%~dp0test-deactivate-org-user.bat"

echo.
echo ===== Running User Location Assignment Tests =====
call "%~dp0test-user-location-assignment.bat"

echo.
echo ===== Running Connection Reject Tests =====
call "%~dp0test-connection-reject.bat"

echo.
echo ===== Running Connection List Tests =====
call "%~dp0test-connection-list.bat"

echo.
echo ===== Running Connection Requests List Tests =====
call "%~dp0test-connection-requests-list.bat"

echo.
echo ===== Running Connection Request Tests =====
call "%~dp0test-connection-request.bat"

echo.
echo ===== Running Connection Approve Tests =====
call "%~dp0test-connection-approve.bat"

echo.
echo ===== Running Update Organization Tests =====
call "%~dp0test-update-org-mine.bat"

echo.
echo ===== Running Search Organizations Tests =====
call "%~dp0test-search-organizations.bat"

echo.
echo ===== Running Health Check Tests =====
call "%~dp0test-health.bat"

echo.
echo ===== Running Login Tests =====
call "%~dp0test-login.bat"

echo.
echo ===== Running Location Management Tests =====
call "%~dp0test-location-management.bat"

echo.
echo ===== Running Get Organization Mine Tests =====
call "%~dp0test-get-org-mine.bat"

echo.
echo ===== Running Order Validation Tests =====
call "%~dp0test-order-validation.bat"

echo.
echo ===== All Tests Completed Successfully =====