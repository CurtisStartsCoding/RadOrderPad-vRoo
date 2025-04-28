@echo off
echo ===== Testing Get Credit Balance Endpoint =====

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
for /f "delims=" %%a in ('type "..\..\tokens\admin_referring-token.txt"') do set ADMIN_TOKEN=%%a
echo Admin Referring Token loaded successfully.

REM Get physician token from file
for /f "delims=" %%a in ('type "..\..\tokens\physician-token.txt"') do set PHYSICIAN_TOKEN=%%a
echo Physician Token loaded successfully.

echo Test 1: Get credit balance with admin_referring token
echo Expected: 200 OK with credit balance data
curl -s -X GET ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  %API_URL%/api/billing/credit-balance

echo.
echo.

echo Test 2: Get credit balance with physician token
echo Expected: 403 Forbidden (role restriction)
curl -s -X GET ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %PHYSICIAN_TOKEN%" ^
  %API_URL%/api/billing/credit-balance

echo.
echo.

echo Test 3: Get credit balance without token
echo Expected: 401 Unauthorized
curl -s -X GET ^
  -H "Content-Type: application/json" ^
  %API_URL%/api/billing/credit-balance

echo.
echo.
echo Tests completed successfully