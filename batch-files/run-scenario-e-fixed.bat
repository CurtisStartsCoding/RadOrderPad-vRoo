@echo off
echo Running RadOrderPad Scenario E with Fixed Scenario
echo ================================================

echo Generating test tokens...
node generate-test-token.js
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

echo Backing up original test-helpers.js...
copy /Y tests\e2e\test-helpers.js tests\e2e\test-helpers.js.bak

echo Applying fixed test helpers...
copy /Y tests\e2e\test-helpers-fixed-d.js tests\e2e\test-helpers.js

echo Starting Scenario E test at %time%

node -e "require('./tests/e2e/scenario-e-connection-request-fixed').runTest().then(success => process.exit(success ? 0 : 1))"

set EXIT_CODE=%ERRORLEVEL%

echo Restoring original test-helpers.js...
copy /Y tests\e2e\test-helpers.js.bak tests\e2e\test-helpers.js

if %EXIT_CODE% EQU 0 (
  echo.
  echo Scenario E passed successfully!
) else (
  echo.
  echo Scenario E failed. Check the logs for details.
)

echo Test completed at %time%
echo Results available in test-results\e2e\

exit /b %EXIT_CODE%