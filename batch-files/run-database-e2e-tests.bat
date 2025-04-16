@echo off
echo Running RadOrderPad Database-Driven E2E Tests
echo ================================================

echo Setting up database-driven tests...
call batch-files\setup-database-tests.bat
if %ERRORLEVEL% NEQ 0 (
  echo Setup failed. Exiting.
  exit /b 1
)

echo Generating test tokens...
node generate-test-token.js
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

echo.
echo Running Database Test to verify test data...
call batch-files\run-database-test.bat
if %ERRORLEVEL% NEQ 0 (
  echo Database Test failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario A (Full Physician Order - Successful Validation)...
node -e "require('./tests/e2e/scenario-a-successful-validation').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario A failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario B (Full Physician Order - Override)...
node -e "require('./tests/e2e/scenario-b-validation-override-fixed').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario B failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario C (Admin Finalization)...
node -e "require('./tests/e2e/scenario-c-admin-finalization').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario C failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario D (Radiology View/Update)...
node -e "require('./tests/e2e/scenario-d-radiology-workflow-fixed').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario D failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario E (Connection Request)...
node -e "require('./tests/e2e/scenario-e-connection-request-fixed').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario E failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario F (User Invite)...
node -e "require('./tests/e2e/scenario-f-user-invite-fixed').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario F failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario G (File Upload)...
node -e "require('./tests/e2e/scenario-g-file-upload-fixed').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario G failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo Running Scenario H (Registration and Onboarding)...
node -e "require('./tests/e2e/scenario-h-registration-onboarding').runTest().then(success => process.exit(success ? 0 : 1))"
if %ERRORLEVEL% NEQ 0 (
  echo Scenario H failed. Stopping tests.
  call batch-files\restore-original-tests.bat
  exit /b 1
)

echo.
echo All tests passed successfully!
echo Results available in test-results\e2e\

echo Restoring original tests...
call batch-files\restore-original-tests.bat

exit /b 0