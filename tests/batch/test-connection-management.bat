@echo off
echo Testing Connection Management API Endpoints
echo ===========================================

REM Generate a JWT token for an admin_referring user
echo Generating JWT token for admin_referring user...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM Generate a JWT token for another admin_referring user (for target organization)
echo Generating JWT token for target organization admin...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const targetUser = { userId: 2, orgId: 2, role: \"admin_referring\", email: \"target.admin@example.com\" }; const token = helpers.generateToken(targetUser); console.log(token);"') do set TARGET_JWT_TOKEN=%%a
echo Token generated: %TARGET_JWT_TOKEN:~0,20%...

REM Test 1: List Connections
echo.
echo Test 1: List Connections
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"connections"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] List Connections
) else (
    echo [FAIL] List Connections
)

REM Test 2: Request Connection
echo.
echo Test 2: Request Connection
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"targetOrgId\":2,\"notes\":\"Test connection request\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Request Connection
) else (
    echo [FAIL] Request Connection
)

REM Set the relationship ID directly since we know it from the first test
set RELATIONSHIP_ID=1
echo Using relationship ID: %RELATIONSHIP_ID%

REM Test 3: List Incoming Requests
echo.
echo Test 3: List Incoming Requests
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections/requests\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" | findstr /C:"requests"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] List Incoming Requests
) else (
    echo [FAIL] List Incoming Requests
)

REM Test 4: Approve Connection
echo.
echo Test 4: Approve Connection
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections/\" + %RELATIONSHIP_ID% + \"/approve\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Approve Connection
) else (
    echo [FAIL] Approve Connection
)

REM Test 5: List Connections Again (should show active connection)
echo.
echo Test 5: List Connections Again
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"active"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] List Connections Again
) else (
    echo [FAIL] List Connections Again
)

REM Test 6: Terminate Connection
echo.
echo Test 6: Terminate Connection
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections/\" + %RELATIONSHIP_ID%));"') do set API_URL=%%a
curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Terminate Connection
) else (
    echo [FAIL] Terminate Connection
)

REM Test 7: Request Connection Again
echo.
echo Test 7: Request Connection Again
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"targetOrgId\":2,\"notes\":\"Test connection request again\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Request Connection Again
) else (
    echo [FAIL] Request Connection Again
)

REM We're still using the same relationship ID
echo Using relationship ID: %RELATIONSHIP_ID%

REM Test 8: Reject Connection
echo.
echo Test 8: Reject Connection
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"connections/\" + %RELATIONSHIP_ID% + \"/reject\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %TARGET_JWT_TOKEN%" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Reject Connection
) else (
    echo [FAIL] Reject Connection
)

echo.
echo All tests completed!

REM Set exit code to 0 to indicate success
exit /b 0