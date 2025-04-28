@echo off
echo Testing update my organization endpoint...

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
set TOKEN_FILE=..\..\tokens\admin_referring-token.txt
set /p ADMIN_TOKEN=<"%TOKEN_FILE%"

REM Get physician token from file
set PHYSICIAN_TOKEN_FILE=..\..\tokens\physician-token.txt
set /p PHYSICIAN_TOKEN=<"%PHYSICIAN_TOKEN_FILE%"

echo API URL: %API_URL%
echo.

echo Test 1: Update my organization with admin token
curl -s -X PUT "%API_URL%/api/organizations/mine" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Test Organization\",\"type\":\"referring_practice\",\"address\":\"123 Main St\",\"city\":\"Test City\",\"state\":\"TS\",\"zipCode\":\"12345\",\"phone\":\"555-123-4567\"}"
echo.
echo.

echo Test 2: Update my organization with physician token (should fail)
curl -s -X PUT "%API_URL%/api/organizations/mine" ^
  -H "Authorization: Bearer %PHYSICIAN_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Test Organization\",\"type\":\"referring_practice\",\"address\":\"123 Main St\",\"city\":\"Test City\",\"state\":\"TS\",\"zipCode\":\"12345\",\"phone\":\"555-123-4567\"}"
echo.
echo.

echo Test 3: Update my organization with invalid data
curl -s -X PUT "%API_URL%/api/organizations/mine" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"\"}"
echo.
echo.

echo Test 4: Update my organization without token
curl -s -X PUT "%API_URL%/api/organizations/mine" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Updated Test Organization\"}"
echo.
echo.

echo Test completed.