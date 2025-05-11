@echo off
echo ===== Testing Order Validation Endpoint (Enhanced) =====
echo This test will log detailed information including:
echo - Full API payload including Redis/Postgres details
echo - Dictation text
echo - Full JSON response
echo.
echo Results will be saved to:
echo - Detailed logs: ..\logs\validation-test-[timestamp].log
echo - JSON results: ..\results\validation-results-[timestamp].json
echo.
cd %~dp0
node test-order-validation-enhanced.js
if %ERRORLEVEL% NEQ 0 (
  echo Test failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo Test completed successfully
echo Logs are available in the logs directory
echo JSON results are available in the results directory