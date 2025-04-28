@echo off
echo ===== RUNNING ALL ADMIN FINALIZATION DEBUG TESTS =====
echo.

REM Create test results directory if it doesn't exist
if not exist "..\test-results" mkdir "..\test-results"

echo Step 1: Testing Database Connections...
call run-db-test.bat > ..\test-results\db-connection-test.log
echo Database connection test completed. Results saved to test-results\db-connection-test.log
echo.

echo Step 2: Testing Patient Information Update...
node test-update-patient-info.js > ..\test-results\update-patient-info-test.log
echo Patient information update test completed. Results saved to test-results\update-patient-info-test.log
echo.

echo Step 3: Testing Organization Relationships...
node test-organization-relationships.js > ..\test-results\organization-relationships-test.log
echo Organization relationships test completed. Results saved to test-results\organization-relationships-test.log
echo.

echo Step 4: Updating Order Organizations...
node update-order-organizations.js > ..\test-results\update-order-organizations.log
echo Order organizations update completed. Results saved to test-results\update-order-organizations.log
echo.

echo Step 5: Testing Update and Send Workflow...
node test-update-and-send.js > ..\test-results\update-and-send-test.log
echo Update and send workflow test completed. Results saved to test-results\update-and-send-test.log
echo.

echo ===== ALL TESTS COMPLETED =====
echo.
echo Test results have been saved to the test-results directory.
echo Please review the admin-finalization-debug-guide.md file for a comprehensive analysis.
echo.
pause