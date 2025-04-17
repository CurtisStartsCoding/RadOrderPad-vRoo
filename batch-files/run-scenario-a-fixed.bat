@echo off
echo Running RadOrderPad Scenario A with Fixed Helpers
echo ================================================

REM Create test results directory if it doesn't exist
if not exist test-results\e2e mkdir test-results\e2e

REM Generate test tokens first
echo Generating test tokens...
node generate-test-token.js > test-results\e2e\test-tokens.txt
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

REM Set the JWT_SECRET environment variable
for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET || 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a

REM Temporarily rename the original test-helpers.js file
echo Backing up original test-helpers.js...
if exist tests\e2e\test-helpers.js.bak del tests\e2e\test-helpers.js.bak
ren tests\e2e\test-helpers.js test-helpers.js.bak

REM Copy the fixed version to test-helpers.js
echo Applying fixed test helpers...
copy tests\e2e\test-helpers-fixed-a.js tests\e2e\test-helpers.js

REM Run Scenario A
echo Starting Scenario A test at %time%
set NODE_PATH=%CD%\node_modules
node tests\e2e\scenario-a-successful-validation.js

REM Save the exit code
set EXIT_CODE=%ERRORLEVEL%

REM Restore the original test-helpers.js file
echo Restoring original test-helpers.js...
del tests\e2e\test-helpers.js
ren tests\e2e\test-helpers.js.bak test-helpers.js

REM Check the result
if %EXIT_CODE% EQU 0 (
  echo.
  echo Scenario A completed successfully!
) else (
  echo.
  echo Scenario A failed. Check the logs for details.
)

echo Test completed at %time%
echo Results available in test-results\e2e\

exit /b %EXIT_CODE%