@echo off
echo Environment variable # Test environment variables for API testing not defined
echo Environment variable # Admin tokens for testing admin-only endpoints not defined
echo Environment variable # Test IDs for various endpoints not defined
echo Environment variable # Set this to a valid order ID in pending_admin status for testing the paste-summary endpoint not defined
echo Environment variable # Set this to a valid pending relationship ID for testing the connection approval endpoint not defined
echo Environment variable # Token for physician role (used in test-update-org-user.bat/sh) not defined

echo.
echo === Testing GET /api/organizations (Search Organizations) ===
echo.

REM Set API URL
set API_URL=https://api.radorderpad.com

REM Get admin token from file
set TOKEN_FILE=..\..\tokens\admin_referring-token.txt
set /p ADMIN_TOKEN=<"%TOKEN_FILE%"

REM Get physician token from file
set PHYSICIAN_TOKEN_FILE=..\..\tokens\physician-token.txt
set /p PHYSICIAN_TOKEN=<"%PHYSICIAN_TOKEN_FILE%"

echo Test 1: Basic search without filters
curl -s -X GET "%API_URL%/api/organizations" -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 2: Search by name
curl -s -X GET "%API_URL%/api/organizations?name=Radiology" -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 3: Search by type
curl -s -X GET "%API_URL%/api/organizations?type=radiology" -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 4: Search by state
curl -s -X GET "%API_URL%/api/organizations?state=CA" -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 5: Search with multiple filters
curl -s -X GET "%API_URL%/api/organizations?name=Radiology&type=radiology&state=CA" -H "Authorization: Bearer %ADMIN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 6: Search with physician token (should fail)
curl -s -X GET "%API_URL%/api/organizations" -H "Authorization: Bearer %PHYSICIAN_TOKEN%" -H "Content-Type: application/json"
echo.
echo.

echo Test 7: Search without token
curl -s -X GET "%API_URL%/api/organizations" -H "Content-Type: application/json"
echo.
echo.

echo Test completed.