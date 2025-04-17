@echo off
echo Running RadOrderPad Fixed E2E Tests
echo ================================================

echo Generating test tokens...
node generate-test-token.js
echo Test tokens generated and saved to test-results\e2e\test-tokens.txt

echo.
echo Running Scenario A (Full Physician Order - Successful Validation)...
call batch-files\run-scenario-a-fixed.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario A failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario B (Full Physician Order - Override)...
call batch-files\run-scenario-b-fixed-new.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario B failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario C (Admin Finalization)...
call batch-files\run-scenario-c-fixed.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario C failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario D (Radiology View/Update)...
call batch-files\run-scenario-d-fixed-new.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario D failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario E (Connection Request)...
call batch-files\run-scenario-e-fixed.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario E failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario F (User Invite)...
call batch-files\run-scenario-f-fixed.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario F failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario G (File Upload)...
call batch-files\run-scenario-g-fixed.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario G failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario H (Registration and Onboarding)...
call batch-files\run-registration-onboarding-tests.bat
if %ERRORLEVEL% NEQ 0 (
  echo Scenario H failed. Stopping tests.
  exit /b 1
)

echo.
echo Running Scenario I (Redis Caching Test)...
rem This scenario uses the original test-helpers.js, not the fixed version
rem Temporarily restore the original test-helpers.js
if exist tests\e2e\test-helpers.js.orig (
  copy /Y tests\e2e\test-helpers.js tests\e2e\test-helpers.js.temp
  copy /Y tests\e2e\test-helpers.js.orig tests\e2e\test-helpers.js
)

call batch-files\run-scenario-i-redis-caching.bat
set SCENARIO_I_RESULT=%ERRORLEVEL%

rem Restore the fixed test-helpers.js
if exist tests\e2e\test-helpers.js.temp (
  copy /Y tests\e2e\test-helpers.js.temp tests\e2e\test-helpers.js
  del tests\e2e\test-helpers.js.temp
)

if %SCENARIO_I_RESULT% NEQ 0 (
  echo Scenario I failed. Stopping tests.
  exit /b 1
)

echo.
echo All tests passed successfully!
echo Results available in test-results\e2e\

exit /b 0