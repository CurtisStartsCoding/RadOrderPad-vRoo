@echo off
echo Testing Location Management API Endpoints
echo ==========================================

REM Generate a JWT token for an admin_referring user
echo Generating JWT token for admin_referring user...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM Test 1: List Locations
echo.
echo Test 1: List Locations
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"organizations/mine/locations\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"locations"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] List Locations
) else (
    echo [FAIL] List Locations
)

REM Test 2: Create Location
echo.
echo Test 2: Create Location
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"organizations/mine/locations\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Location\",\"address_line1\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Create Location
) else (
    echo [FAIL] Create Location
)

REM Get the location ID from the create response
REM Extract the ID directly from the create response which is in the format:
REM {"message":"Location created successfully","location":{"id":30,...}}
for /f "tokens=*" %%a in ('curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Test Location\",\"address_line1\":\"123 Test St\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" ^| node -e "const data = JSON.parse(require(\"fs\").readFileSync(0, \"utf-8\")); console.log(data.location.id);"') do set LOCATION_ID=%%a
echo Location ID: %LOCATION_ID%

REM Test 3: Get Location Details
echo.
echo Test 3: Get Location Details
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"organizations/mine/locations/\" + %LOCATION_ID%));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"location"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Get Location Details
) else (
    echo [FAIL] Get Location Details
)

REM Test 4: Update Location
echo.
echo Test 4: Update Location
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"organizations/mine/locations/\" + %LOCATION_ID%));"') do set API_URL=%%a
curl -s -X PUT "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"name\":\"Updated Test Location\",\"address_line1\":\"456 Test Ave\",\"city\":\"Test City\",\"state\":\"TS\",\"zip_code\":\"12345\",\"phone_number\":\"555-123-4567\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Update Location
) else (
    echo [FAIL] Update Location
)

REM Test 5: Assign User to Location
echo.
echo Test 5: Assign User to Location
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"users/1/locations/\" + %LOCATION_ID%));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Assign User to Location
) else (
    echo [FAIL] Assign User to Location
)

REM Test 6: List User Locations
echo.
echo Test 6: List User Locations
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"users/1/locations\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"locations"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] List User Locations
) else (
    echo [FAIL] List User Locations
)

REM Test 7: Unassign User from Location
echo.
echo Test 7: Unassign User from Location
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"users/1/locations/\" + %LOCATION_ID%));"') do set API_URL=%%a
curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Unassign User from Location
) else (
    echo [FAIL] Unassign User from Location
)

REM Test 8: Deactivate Location
echo.
echo Test 8: Deactivate Location
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"organizations/mine/locations/\" + %LOCATION_ID%));"') do set API_URL=%%a
curl -s -X DELETE "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Deactivate Location
) else (
    echo [FAIL] Deactivate Location
)

echo.
echo All tests completed!