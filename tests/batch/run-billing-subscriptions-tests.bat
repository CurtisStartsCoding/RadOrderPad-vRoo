@echo off
echo Running Billing Subscriptions API Tests...
node test-billing-subscriptions.js
if %ERRORLEVEL% NEQ 0 (
  echo Tests FAILED with exit code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
) else (
  echo All tests PASSED
  exit /b 0
)