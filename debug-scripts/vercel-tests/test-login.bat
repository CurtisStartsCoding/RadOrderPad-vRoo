@echo off
echo Testing login endpoint...

REM Set API URL
set API_URL=https://api.radorderpad.com

echo API URL: %API_URL%
echo.

echo Test 1: Login with valid credentials
curl -s -X POST "%API_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test.physician@example.com\",\"password\":\"Password123!\"}"
echo.
echo.

echo Test 2: Login with invalid email
curl -s -X POST "%API_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"invalid@example.com\",\"password\":\"Password123!\"}"
echo.
echo.

echo Test 3: Login with invalid password
curl -s -X POST "%API_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test.physician@example.com\",\"password\":\"WrongPassword123!\"}"
echo.
echo.

echo Test 4: Login with missing email
curl -s -X POST "%API_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"password\":\"Password123!\"}"
echo.
echo.

echo Test 5: Login with missing password
curl -s -X POST "%API_URL%/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test.physician@example.com\"}"
echo.
echo.

echo Test completed.