@echo off
echo ===== Running Additional API Tests =====

echo.
echo Generating fresh tokens for all roles...
call node scripts/utilities/generate-all-role-tokens.js

echo.
echo Running Credit Balance Tests...
cd debug-scripts\vercel-tests
call test-get-credit-balance.bat

echo.
echo Running Credit Usage Tests...
call test-get-credit-usage.bat

echo.
echo Running Uploads Presigned URL Tests...
call test-uploads-presigned-url.bat

echo.
echo Running Uploads Confirm Tests...
call test-uploads-confirm.bat

echo.
echo Running Download URL Tests...
call test-get-download-url.bat

echo.
echo Running Search Organizations Tests...
call test-search-organizations.bat

echo.
echo Running Update Organization Tests...
call test-update-org-mine.bat

echo.
echo Running List Organization Users Tests...
call test-list-org-users.bat

echo.
echo Running Get Organization User Tests...
call test-get-org-user-by-id.bat

echo.
echo Running Update Organization User Tests...
call test-update-org-user.bat

echo.
echo Running Deactivate Organization User Tests...
call test-deactivate-org-user.bat

echo.
cd ..\..\
echo ===== All Additional Tests Complete =====