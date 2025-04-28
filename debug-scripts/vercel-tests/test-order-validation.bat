@echo off
echo ===== Testing Order Validation Endpoint =====
cd %~dp0
node test-order-validation.js
if %ERRORLEVEL% NEQ 0 (
  echo Test failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo Test completed successfully