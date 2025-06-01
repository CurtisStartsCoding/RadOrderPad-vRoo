@echo off
echo === Testing S3 Upload with cURL ===
echo.

REM Load token
set /p TOKEN=<..\tokens\admin_staff-token.txt

REM Get presigned URL from API
echo 1. Getting presigned URL from API...
curl -X POST "https://api.radorderpad.com/api/uploads/presigned-url" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileName\":\"test-curl.txt\",\"contentType\":\"text/plain\",\"fileType\":\"supplemental\",\"orderId\":1}" ^
  -o presigned-response.json

echo.
echo 2. Response from API:
type presigned-response.json
echo.

REM Extract the upload URL using PowerShell
echo 3. Extracting upload URL...
for /f "delims=" %%i in ('powershell -Command "(Get-Content presigned-response.json | ConvertFrom-Json).uploadUrl"') do set UPLOAD_URL=%%i

echo Upload URL: %UPLOAD_URL:~0,100%...
echo.

REM Create test file
echo This is a test file for S3 upload > test-curl.txt

REM Try uploading with cURL
echo 4. Attempting upload with cURL...
curl -X PUT "%UPLOAD_URL%" ^
  -H "Content-Type: text/plain" ^
  --data-binary "@test-curl.txt" ^
  -w "\nHTTP Status: %%{http_code}\n" ^
  -v

echo.
echo === Test Complete ===

REM Cleanup
del test-curl.txt 2>nul
del presigned-response.json 2>nul

pause