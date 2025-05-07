@echo off
echo Testing User Invitation Endpoint (Production)

REM Generate tokens for all roles
echo Generating fresh tokens for all roles...
cd ..\..\
call node generate-all-role-tokens.js
cd debug-scripts\vercel-tests

REM Get admin token from tokens directory
set /p ADMIN_TOKEN=<..\tokens\admin_referring-token.txt

REM Set production API URL
set API_URL=https://api.radorderpad.com/api

echo.
echo Testing with valid data (admin_referring token)
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -H "Authorization: Bearer %ADMIN_TOKEN%" -d "{\"email\":\"test.user@example.com\",\"role\":\"physician\"}"

echo.
echo.
echo Testing with invalid email format
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -H "Authorization: Bearer %ADMIN_TOKEN%" -d "{\"email\":\"invalid-email\",\"role\":\"physician\"}"

echo.
echo.
echo Testing with invalid role
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -H "Authorization: Bearer %ADMIN_TOKEN%" -d "{\"email\":\"test.user@example.com\",\"role\":\"invalid_role\"}"

echo.
echo.
echo Testing with missing email
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -H "Authorization: Bearer %ADMIN_TOKEN%" -d "{\"role\":\"physician\"}"

echo.
echo.
echo Testing with missing role
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -H "Authorization: Bearer %ADMIN_TOKEN%" -d "{\"email\":\"test.user@example.com\"}"

REM Get non-admin token from tokens directory
set /p NON_ADMIN_TOKEN=<..\tokens\physician-token.txt

echo.
echo.
echo Testing with non-admin token (should fail with 403)
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -H "Authorization: Bearer %NON_ADMIN_TOKEN%" -d "{\"email\":\"test.user@example.com\",\"role\":\"physician\"}"

echo.
echo.
echo Testing without token (should fail with 401)
curl -X POST "%API_URL%/user-invites/invite" -H "Content-Type: application/json" -d "{\"email\":\"test.user@example.com\",\"role\":\"physician\"}"

echo.
echo.
echo Test completed
