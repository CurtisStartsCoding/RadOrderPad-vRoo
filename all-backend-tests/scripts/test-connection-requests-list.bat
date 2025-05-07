@echo off
echo Testing connection requests list endpoint...

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin tokens from files
set ADMIN_REFERRING_TOKEN_FILE=..\tokens\admin_referring-token.txt
set /p ADMIN_REFERRING_TOKEN=<"%ADMIN_REFERRING_TOKEN_FILE%"

set ADMIN_RADIOLOGY_TOKEN_FILE=..\tokens\admin_radiology-token.txt
set /p ADMIN_RADIOLOGY_TOKEN=<"%ADMIN_RADIOLOGY_TOKEN_FILE%"

REM Get physician token from file
set PHYSICIAN_TOKEN_FILE=..\tokens\physician-token.txt
set /p PHYSICIAN_TOKEN=<"%PHYSICIAN_TOKEN_FILE%"

echo API URL: %API_URL%
echo.

echo Test 1: List connection requests with admin_referring token
curl -s -X GET "%API_URL%/api/connections/requests" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 2: List connection requests with admin_radiology token
curl -s -X GET "%API_URL%/api/connections/requests" -H "Authorization: Bearer %ADMIN_RADIOLOGY_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 3: List connection requests with physician token (should fail)
curl -s -X GET "%API_URL%/api/connections/requests" -H "Authorization: Bearer %PHYSICIAN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 4: List connection requests without token
curl -s -X GET "%API_URL%/api/connections/requests" -H "Content-Type: application/json"
echo.
echo.

echo Test completed.
