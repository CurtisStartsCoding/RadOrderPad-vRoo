@echo off
echo Running RadOrderPad Scenario B with Fixed Helpers and Fixed Scenario
echo ================================================

echo Generating test tokens...
node generate-test-token.js
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

echo Backing up original test-helpers.js...
copy /Y tests\e2e\test-helpers.js tests\e2e\test-helpers.js.bak

echo Applying fixed test helpers...
copy /Y tests\e2e\test-helpers-fixed-b.js tests\e2e\test-helpers.js

echo Starting Scenario B test at %time%

node -e "require('./tests/e2e/scenario-b-validation-override-fixed').runTest().then(success => process.exit(success ? 0 : 1))"

set EXIT_CODE=%ERRORLEVEL%

echo Restoring original test-helpers.js...
copy /Y tests\e2e\test-helpers.js.bak tests\e2e\test-helpers.js

if %EXIT_CODE% EQU 0 (
  echo.
  echo Scenario B passed successfully!
) else (
  echo.
  echo Scenario B failed. Check the logs for details.
)

echo Test completed at %time%
echo Results available in test-results\e2e\

exit /b %EXIT_CODE%