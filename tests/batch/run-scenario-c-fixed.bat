@echo off
echo Running RadOrderPad Scenario C with Fixed Helpers
echo ================================================

echo Generating test tokens...
node generate-test-token.js
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

echo Backing up original test-helpers.js...
copy /Y tests\e2e\test-helpers.js tests\e2e\test-helpers.js.bak

echo Applying fixed test helpers...
copy /Y tests\e2e\test-helpers-fixed-c.js tests\e2e\test-helpers.js

echo Starting Scenario C test at %time%

node tests\e2e\scenario-c-admin-finalization.js

set EXIT_CODE=%ERRORLEVEL%

echo Restoring original test-helpers.js...
copy /Y tests\e2e\test-helpers.js.bak tests\e2e\test-helpers.js

if %EXIT_CODE% EQU 0 (
  echo.
  echo Scenario C completed successfully!
) else (
  echo.
  echo Scenario C failed. Check the logs for details.
)

echo Test completed at %time%
echo Results available in test-results\e2e\

exit /b %EXIT_CODE%