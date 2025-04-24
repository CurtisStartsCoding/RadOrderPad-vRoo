@echo off
echo Moving test results files to API_IMPLEMENTATION_GUIDE directory...

REM Create the test-results directory if it doesn't exist
if not exist "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results" (
    mkdir "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results"
    echo Created directory: frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results
)

REM Copy the test results files with new names
copy "debug-scripts\vercel-tests\missing-endpoints\TEST_RESULTS.md" "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\initial-endpoints-test-results.md"
copy "debug-scripts\vercel-tests\missing-endpoints\ADDITIONAL_TEST_RESULTS.md" "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\additional-endpoints-test-results.md"
copy "debug-scripts\vercel-tests\missing-endpoints\ADMIN_ENDPOINTS_TEST_RESULTS.md" "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\admin-endpoints-test-results.md"

echo Files copied successfully.

REM Create an index file for the test results
echo # API Endpoint Test Results > "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo. >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo This directory contains the detailed test results for the API endpoints that were previously missing or incomplete. >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo. >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo ## Test Results Files >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo. >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo 1. [Initial Endpoints Test Results](./initial-endpoints-test-results.md) - Results from the first round of testing >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo 2. [Additional Endpoints Test Results](./additional-endpoints-test-results.md) - Results from more comprehensive testing with multiple IDs >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo 3. [Admin Endpoints Test Results](./admin-endpoints-test-results.md) - Detailed results for admin order endpoints >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo. >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo ## Summary >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo. >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"
echo For a summary of all test results, see the [Missing Endpoints Status Report](../missing-endpoints-status.md). >> "frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md"

echo Created index file: frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results\README.md

echo.
echo All files have been moved and organized successfully.
echo The test results are now available in the frontend-explanation\API_IMPLEMENTATION_GUIDE\test-results directory.