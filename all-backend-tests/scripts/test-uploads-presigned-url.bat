@echo off
echo ===== Testing Uploads Presigned URL Endpoint =====

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
for /f "delims=" %%a in ('type "..\tokens\admin_referring-token.txt"') do set TOKEN=%%a
echo Admin Referring Token loaded successfully.

echo Using API URL: %API_URL%

REM Test 1: Valid request with all required fields
echo.
echo Test 1: Valid request with all required fields
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileName\":\"test-document.pdf\",\"fileType\":\"application/pdf\",\"contentType\":\"application/pdf\",\"fileSize\":1048576,\"documentType\":\"test\"}" ^
  %API_URL%/api/uploads/presigned-url

REM Test 2: Missing required fields
echo.
echo.
echo Test 2: Missing required fields
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileName\":\"test-document.pdf\"}" ^
  %API_URL%/api/uploads/presigned-url

REM Test 3: Invalid file type
echo.
echo.
echo Test 3: Invalid file type
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileName\":\"test-document.exe\",\"fileType\":\"application/octet-stream\",\"contentType\":\"application/octet-stream\",\"fileSize\":1048576}" ^
  %API_URL%/api/uploads/presigned-url

REM Test 4: File size too large
echo.
echo.
echo Test 4: File size too large
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileName\":\"large-image.jpg\",\"fileType\":\"image/jpeg\",\"contentType\":\"image/jpeg\",\"fileSize\":10485760}" ^
  %API_URL%/api/uploads/presigned-url

REM Test 5: No authentication
echo.
echo.
echo Test 5: No authentication
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -d "{\"fileName\":\"test-document.pdf\",\"fileType\":\"application/pdf\",\"contentType\":\"application/pdf\",\"fileSize\":1048576}" ^
  %API_URL%/api/uploads/presigned-url

echo.
echo.
echo Tests completed successfully
