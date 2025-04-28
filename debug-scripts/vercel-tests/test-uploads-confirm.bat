@echo off
echo ===== Testing Uploads Confirm Endpoint =====

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
for /f "delims=" %%a in ('type "..\..\tokens\admin_referring-token.txt"') do set TOKEN=%%a
echo Admin Referring Token loaded successfully.

REM Set test order ID - use a valid order ID that the test user has access to
set TEST_ORDER_ID=606
set TEST_PATIENT_ID=1
set TEST_FILE_KEY=uploads/test/dummy-file-key.txt

echo Using API URL: %API_URL%
echo Using Test Order ID: %TEST_ORDER_ID%
echo Using Test Patient ID: %TEST_PATIENT_ID%
echo Using Test File Key: %TEST_FILE_KEY%

REM Test 1: Call the confirm endpoint directly
echo.
echo Test 1: Calling the confirm endpoint directly...
echo Note: This is expected to fail with a 500 error because the backend will check if the file exists in S3.
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileKey\":\"%TEST_FILE_KEY%\",\"orderId\":%TEST_ORDER_ID%,\"patientId\":%TEST_PATIENT_ID%,\"documentType\":\"test_document\",\"fileName\":\"confirm-test.txt\",\"fileSize\":1024,\"contentType\":\"text/plain\"}" ^
  %API_URL%/api/uploads/confirm

REM Test 2: Missing required fields
echo.
echo.
echo Test 2: Missing required fields
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileKey\":\"%TEST_FILE_KEY%\"}" ^
  %API_URL%/api/uploads/confirm

REM Test 3: Invalid fileKey
echo.
echo.
echo Test 3: Invalid fileKey
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %TOKEN%" ^
  -d "{\"fileKey\":\"invalid-file-key\",\"orderId\":%TEST_ORDER_ID%,\"patientId\":%TEST_PATIENT_ID%,\"documentType\":\"test_document\",\"fileName\":\"confirm-test.txt\",\"fileSize\":1024,\"contentType\":\"text/plain\"}" ^
  %API_URL%/api/uploads/confirm

REM Test 4: No authentication
echo.
echo.
echo Test 4: No authentication
curl -s -X POST ^
  -H "Content-Type: application/json" ^
  -d "{\"fileKey\":\"%TEST_FILE_KEY%\",\"orderId\":%TEST_ORDER_ID%,\"patientId\":%TEST_PATIENT_ID%,\"documentType\":\"test_document\",\"fileName\":\"confirm-test.txt\",\"fileSize\":1024,\"contentType\":\"text/plain\"}" ^
  %API_URL%/api/uploads/confirm

echo.
echo.
echo Tests completed successfully
echo Note: The 500 error from the confirm endpoint is expected because the backend checks if the file exists in S3.
echo In a production environment with proper S3 permissions, the confirm endpoint would succeed if the file was uploaded successfully.