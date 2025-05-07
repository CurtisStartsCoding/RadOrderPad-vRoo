@echo off
echo ===== Testing User Invitation Endpoint =====

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
for /f "delims=" %%a in ('type "..\tokens\admin_referring-token.txt"') do set ADMIN_TOKEN=%%a
echo Admin Referring Token loaded successfully.

REM Get non-admin token from file
for /f "delims=" %%a in ('type "..\tokens\physician-token.txt"') do set NON_ADMIN_TOKEN=%%a
echo Physician Token loaded successfully.

echo.
echo Test 1: Valid data (admin_referring token)
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"email\":\"test.user@example.com\",\"role\":\"physician\"}"

echo.
echo.
echo Test 2: Invalid email format
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"email\":\"invalid-email\",\"role\":\"physician\"}"

echo.
echo.
echo Test 3: Invalid role
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"email\":\"test.user@example.com\",\"role\":\"invalid_role\"}"

echo.
echo.
echo Test 4: Missing email
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"role\":\"physician\"}"

echo.
echo.
echo Test 5: Missing role
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %ADMIN_TOKEN%" ^
  -d "{\"email\":\"test.user@example.com\"}"

echo.
echo.
echo Test 6: Non-admin token (should fail with 403)
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer %NON_ADMIN_TOKEN%" ^
  -d "{\"email\":\"test.user@example.com\",\"role\":\"physician\"}"

echo.
echo.
echo Test 7: Without token (should fail with 401)
curl -s -X POST "%API_URL%/api/user-invites/invite" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test.user@example.com\",\"role\":\"physician\"}"

echo.
echo.
echo Test completed successfully
