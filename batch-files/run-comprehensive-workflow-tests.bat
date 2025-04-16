@echo off
echo Running Comprehensive Workflow Tests
echo ===================================

REM Create test-results directory if it doesn't exist
if not exist "test-results" mkdir test-results

REM Check if a specific test number was provided
if "%1"=="" (
  echo Running all tests...
  node tests/e2e/run_comprehensive_tests.js
) else (
  echo Running test %1...
  node tests/e2e/run_comprehensive_tests.js %1
)

echo.
echo Test execution complete.
echo Results are available in the test-results directory.
echo.

pause