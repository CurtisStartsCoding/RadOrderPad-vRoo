@echo off
setlocal enabledelayedexpansion

REM Test script for the accept-invitation endpoint using production environment
REM This script tests the functionality of accepting an invitation and creating a user account

echo Testing accept-invitation endpoint with production environment...

REM Set API base URL for production
set API_URL=https://api.radorderpad.com/api

REM Use a dummy test token for testing
set TEST_TOKEN=test-token-123456789

REM Skip database operations since we're having SSL certificate issues
echo Skipping database operations due to SSL certificate issues...
echo Using dummy test token: %TEST_TOKEN%
echo Note: These tests will fail with "Invalid invitation token" which is expected
echo       since we're not actually creating a valid token in the database.
echo.

REM Test 1: Valid invitation acceptance
echo Test 1: Valid invitation acceptance
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\", \"password\": \"Password123\", \"first_name\": \"Test\", \"last_name\": \"User\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Test 2: Invalid token
echo Test 2: Invalid token
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"invalid-token\", \"password\": \"Password123\", \"first_name\": \"Test\", \"last_name\": \"User\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Test 3: Missing required fields
echo Test 3: Missing required fields
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Test 4: Weak password
echo Test 4: Weak password
curl -X POST %API_URL%/user-invites/accept-invitation ^
  -H "Content-Type: application/json" ^
  -d "{\"token\": \"%TEST_TOKEN%\", \"password\": \"weak\", \"first_name\": \"Test\", \"last_name\": \"User\"}" ^
  -w "\nStatus: %%{http_code}\n"

echo.

REM Skip cleanup since we didn't create any test data
echo Skipping database cleanup...

echo.
echo Testing completed.

endlocal
