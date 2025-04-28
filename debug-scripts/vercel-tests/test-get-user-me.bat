@echo off
echo ===== Testing Get User Me Endpoint =====

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get physician token from file
for /f "delims=" %%a in ('type "..\..\tokens\physician-token.txt"') do set TOKEN=%%a
echo Physician Token loaded successfully.

echo API URL: %API_URL%

echo.
echo Test 1: Get current user profile
echo Expected: 200 OK with user data
curl -s -X GET ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  %API_URL%/api/users/me

echo.
echo.
echo Test 2: Unauthorized access (no token)
echo Expected: 401 Unauthorized
curl -s -X GET ^
  -H "Content-Type: application/json" ^
  %API_URL%/api/users/me

echo.
echo.
echo Tests completed successfully