@echo off
echo Testing connection termination endpoint...
cd %~dp0
node test-connection-terminate.js
if %ERRORLEVEL% NEQ 0 (
  echo Test failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo Test completed successfully
