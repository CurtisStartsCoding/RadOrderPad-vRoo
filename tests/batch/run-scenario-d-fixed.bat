@echo off
echo Running RadOrderPad Scenario D with Fixed Helpers
echo ================================================

echo Generating test tokens...
node generate-test-token.js
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

echo Backing up original test-helpers.js...
copy /Y tests\e2e\test-helpers.js tests\e2e\test-helpers.js.bak

echo Applying fixed test helpers...
copy /Y tests\e2e\test-helpers-fixed-d.js tests\e2e\test-helpers.js

echo Starting Scenario D test at %time%

node tests\e2e\scenario-d-radiology-workflow.js

set EXIT_CODE=%ERRORLEVEL%

echo Restoring original test-helpers.js...
copy /Y tests\e2e\test-helpers.js.bak tests\e2e\test-helpers.js

if %EXIT_CODE% EQU 0 (
  echo.
  echo Scenario D completed successfully!
) else (
  echo.
  echo Scenario D failed. Check the logs for details.
)

echo Test completed at %time%
echo Results available in test-results\e2e\

exit /b %EXIT_CODE%