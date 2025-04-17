@echo off
echo Running RadOrderPad Registration and Onboarding Tests
echo ====================================================

REM Create test results directory if it doesn't exist
if not exist test-results\e2e mkdir test-results\e2e

REM Generate test tokens first
echo Generating test tokens...
node generate-test-token.js > test-results\e2e\test-tokens.txt
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

REM Set the JWT_TOKEN environment variable
for /f "tokens=*" %%a in ('node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET || 'your_jwt_secret_key_here');"') do set JWT_SECRET=%%a

REM Run the tests
echo Starting tests at %TIME%
set NODE_PATH=%CD%\node_modules
node tests/e2e/run-registration-onboarding-tests.js

REM Check the result
if %ERRORLEVEL% EQU 0 (
  echo.
  echo All registration and onboarding tests completed successfully!
) else (
  echo.
  echo Some tests failed. Check the logs for details.
  exit /b %ERRORLEVEL%
)

echo Tests completed at %TIME%
echo Results available in test-results\e2e\