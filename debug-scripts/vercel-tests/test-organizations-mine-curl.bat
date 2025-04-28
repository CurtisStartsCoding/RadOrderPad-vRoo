@echo off
echo Testing organizations/mine endpoint using curl...

echo Step 1: Getting clean token...
node "%~dp0get-clean-token.js"
if %ERRORLEVEL% neq 0 (
  echo Failed to get clean token
  exit /b 1
)

echo Step 2: Reading token from file...
set /p AUTH_TOKEN=<"%~dp0clean-token.txt"
if not defined AUTH_TOKEN (
  echo Failed to read token from file
  exit /b 1
)

echo Step 3: Testing endpoint with curl...
echo Token (first 10 chars): %AUTH_TOKEN:~0,10%...

echo.
echo Making request to https://api.radorderpad.com/api/organizations/mine
echo.

curl -v -X GET "https://api.radorderpad.com/api/organizations/mine" ^
  -H "Authorization: Bearer %AUTH_TOKEN%" ^
  -H "Content-Type: application/json"

if %ERRORLEVEL% neq 0 (
  echo.
  echo Curl request failed with error code %ERRORLEVEL%
  exit /b 1
)

echo.
echo Test completed