@echo off
echo ===== Testing Get Download URL Endpoint =====

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
for /f "delims=" %%a in ('type "..\tokens\admin_referring-token.txt"') do set ADMIN_TOKEN=%%a
echo Admin Referring Token loaded successfully.

REM Get physician token from file
for /f "delims=" %%a in ('type "..\tokens\physician-token.txt"') do set PHYSICIAN_TOKEN=%%a
echo Physician Token loaded successfully.

REM Set test document ID - use a valid document ID from a previous upload
set TEST_DOCUMENT_ID=1

echo Using API URL: %API_URL%
echo Using Test Document ID: %TEST_DOCUMENT_ID%

REM Test 1: Get download URL with admin_referring token
echo.
echo Test 1: Get download URL with admin_referring token
echo Expected: 200 OK with download URL
curl -s -X GET ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  %API_URL%/api/uploads/%TEST_DOCUMENT_ID%/download-url

REM Test 2: Get download URL with invalid document ID format
echo.
echo.
echo Test 2: Get download URL with invalid document ID format
echo Expected: 400 Bad Request
curl -s -X GET ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  %API_URL%/api/uploads/invalid-id/download-url

REM Test 3: Get download URL with non-existent document ID
echo.
echo.
echo Test 3: Get download URL with non-existent document ID
echo Expected: 404 Not Found
curl -s -X GET ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  %API_URL%/api/uploads/999999/download-url

REM Test 4: Get download URL without token
echo.
echo.
echo Test 4: Get download URL without token
echo Expected: 401 Unauthorized
curl -s -X GET ^
  %API_URL%/api/uploads/%TEST_DOCUMENT_ID%/download-url

echo.
echo.
echo Tests completed successfully
