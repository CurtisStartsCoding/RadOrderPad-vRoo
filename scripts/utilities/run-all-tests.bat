@echo off
REM Master test script to run all tests

echo Running all tests...
echo.

REM Run Redis search with fallback test
echo === Running Redis Search with Fallback Test ===
call run-redis-search-with-fallback-test-fixed-cjs.bat
echo.

REM Run Radiology Export test
echo === Running Radiology Export Test ===
call test-radiology-export.bat
echo.

REM Run HIPAA Compliance Export test
echo === Running HIPAA Compliance Export Test ===
call test-hipaa-export.bat
echo.

REM Run Stripe Webhook CLI test
echo === Running Stripe Webhook CLI Test ===
call test-stripe-webhooks-cli.bat
echo.

REM Run Stripe Webhook Unit Tests
echo === Running Stripe Webhook Unit Tests ===
call test-stripe-webhook-unit.bat
echo.

REM Run Super Admin API test
echo === Running Super Admin API Test ===
call test-superadmin-api.bat
echo.

echo All tests completed.
pause