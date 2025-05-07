@echo off
setlocal enabledelayedexpansion

REM Manually set API URL to production server
set API_URL=https://api.radorderpad.com

REM Set token file paths for different roles
set ADMIN_REFERRING_TOKEN_FILE=..\tokens\admin_referring-token.txt
set ADMIN_RADIOLOGY_TOKEN_FILE=..\tokens\admin_radiology-token.txt
set PHYSICIAN_TOKEN_FILE=..\tokens\physician-token.txt

REM Display configuration
echo API URL: %API_URL%
echo Admin Referring Token file: %ADMIN_REFERRING_TOKEN_FILE%
echo Admin Radiology Token file: %ADMIN_RADIOLOGY_TOKEN_FILE%
echo Physician Token file: %PHYSICIAN_TOKEN_FILE%
echo.

REM Read tokens from files
if exist %ADMIN_REFERRING_TOKEN_FILE% (
    set /p ADMIN_REFERRING_TOKEN=<%ADMIN_REFERRING_TOKEN_FILE%
) else (
    echo Error: Admin Referring token file not found
    exit /b 1
)

if exist %ADMIN_RADIOLOGY_TOKEN_FILE% (
    set /p ADMIN_RADIOLOGY_TOKEN=<%ADMIN_RADIOLOGY_TOKEN_FILE%
) else (
    echo Error: Admin Radiology token file not found
    exit /b 1
)

if exist %PHYSICIAN_TOKEN_FILE% (
    set /p PHYSICIAN_TOKEN=<%PHYSICIAN_TOKEN_FILE%
) else (
    echo Error: Physician token file not found
    exit /b 1
)

echo.
echo Testing GET /api/users endpoint with admin_referring role...
echo.

REM Test with admin_referring token
curl -s -X GET "%API_URL%/api/users" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing with pagination and sorting...
echo.

REM Test with pagination and sorting
curl -s -X GET "%API_URL%/api/users?page=1&limit=2&sortBy=email&sortOrder=asc" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing with role filter...
echo.

REM Test with role filter
curl -s -X GET "%API_URL%/api/users?role=physician" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing with status filter...
echo.

REM Test with status filter
curl -s -X GET "%API_URL%/api/users?status=true" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing with name search...
echo.

REM Test with name search
curl -s -X GET "%API_URL%/api/users?name=Test" -H "Authorization: Bearer %ADMIN_REFERRING_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing GET /api/users endpoint with admin_radiology role...
echo.

REM Test with admin_radiology token
curl -s -X GET "%API_URL%/api/users" -H "Authorization: Bearer %ADMIN_RADIOLOGY_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing GET /api/users endpoint with physician role (should be forbidden)...
echo.

REM Test with physician token (should be forbidden)
curl -s -X GET "%API_URL%/api/users" -H "Authorization: Bearer %PHYSICIAN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Testing unauthorized access (no token)...
echo.

REM Test with no token
curl -s -X GET "%API_URL%/api/users"
echo.
echo.

echo Test completed.
