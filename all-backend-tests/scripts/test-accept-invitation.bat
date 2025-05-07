@echo off
echo ===== Testing Accept Invitation Endpoint =====

REM Simple test for the accept-invitation endpoint
echo Testing accept-invitation endpoint...

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Use a test token for testing
set TEST_TOKEN=test-token-12345

REM Test 1: Invalid token
echo Test 1: Invalid token
curl -s -X POST "%API_URL%/api/user-invites/accept-invitation" ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\", \"password\": \"Password123!\", \"first_name\": \"Test\", \"last_name\": \"User\"}"

echo.
echo.

REM Test 2: Missing required fields
echo Test 2: Missing required fields
curl -s -X POST "%API_URL%/api/user-invites/accept-invitation" ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\"}"

echo.
echo.

REM Test 3: Weak password
echo Test 3: Weak password
curl -s -X POST "%API_URL%/api/user-invites/accept-invitation" ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\", \"password\": \"weak\", \"first_name\": \"Test\", \"last_name\": \"User\"}"

echo.
echo.

echo Test completed successfully
