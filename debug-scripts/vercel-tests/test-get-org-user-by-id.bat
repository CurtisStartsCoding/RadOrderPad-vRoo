@echo off
echo Testing get user by ID endpoint...
echo.

REM Set API URL to production by default
set API_URL=https://api.radorderpad.com

REM Check if .env.test file exists and source it
if exist "%~dp0\.env.test" (
  for /F "tokens=*" %%A in (%~dp0\.env.test) do set %%A
  echo Using API URL from .env.test: %API_URL%
)

REM Run the test script
node "%~dp0\test-get-org-user-by-id.js"

REM Check the exit code
if %ERRORLEVEL% EQU 0 (
  echo.
  echo Test completed successfully
  exit /b 0
) else (
  echo.
  echo Test failed with error code %ERRORLEVEL%
  exit /b 1
)