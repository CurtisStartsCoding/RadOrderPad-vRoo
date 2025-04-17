@echo off
echo Running RadOrderPad End-to-End Tests
echo ====================================

REM Create test results directory if it doesn't exist
if not exist test-results\e2e mkdir test-results\e2e

REM Run the tests
echo Starting tests at %TIME%
set NODE_PATH=%CD%\node_modules
node tests/e2e/run-all-e2e-tests.js

REM Check the result
if %ERRORLEVEL% EQU 0 (
  echo.
  echo All tests completed successfully!
) else (
  echo.
  echo Some tests failed. Check the logs for details.
  exit /b %ERRORLEVEL%
)

echo Tests completed at %TIME%
echo Results available in test-results\e2e\