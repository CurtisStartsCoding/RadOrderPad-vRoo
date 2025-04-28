@echo off
echo Testing connection approval endpoint...

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin tokens from files
set ADMIN_REFERRING_TOKEN_FILE=..\..\tokens\admin_referring-token.txt
set /p ADMIN_REFERRING_TOKEN=<"%ADMIN_REFERRING_TOKEN_FILE%"

set ADMIN_RADIOLOGY_TOKEN_FILE=..\..\tokens\admin_radiology-token.txt
set /p ADMIN_RADIOLOGY_TOKEN=<"%ADMIN_RADIOLOGY_TOKEN_FILE%"

REM Get physician token from file
set PHYSICIAN_TOKEN_FILE=..\..\tokens\physician-token.txt
set /p PHYSICIAN_TOKEN=<"%PHYSICIAN_TOKEN_FILE%"

REM Set relationship ID (this should be a pending relationship)
set RELATIONSHIP_ID=1

echo API URL: %API_URL%
echo Relationship ID: %RELATIONSHIP_ID%
echo.

echo Test 1: Approve connection with admin_referring token
curl -s -X POST "%API_URL%/api/connections/%RELATIONSHIP_ID%/approve" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 2: Approve connection with admin_radiology token
curl -s -X POST "%API_URL%/api/connections/%RELATIONSHIP_ID%/approve" -H "Authorization: Bearer %ADMIN_RADIOLOGY_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 3: Approve connection with physician token (should fail)
curl -s -X POST "%API_URL%/api/connections/%RELATIONSHIP_ID%/approve" -H "Authorization: Bearer %PHYSICIAN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 4: Approve connection without token
curl -s -X POST "%API_URL%/api/connections/%RELATIONSHIP_ID%/approve" -H "Content-Type: application/json"
echo.
echo.

echo Test 5: Approve connection with invalid relationship ID
curl -s -X POST "%API_URL%/api/connections/999/approve" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test completed.