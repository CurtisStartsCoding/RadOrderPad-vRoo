@echo off
echo Testing update user profile endpoint...
cd %~dp0
node test-update-user-me.js
if %ERRORLEVEL% NEQ 0 (
  echo Test failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)
echo Test completed successfully