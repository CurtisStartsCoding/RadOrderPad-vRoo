@echo off
echo Testing Radiology Group Workflow API Endpoints
echo ==============================================

REM Generate a JWT token for a scheduler user
echo Generating JWT token for scheduler user...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const schedulerUser = { userId: 3, orgId: 2, role: \"scheduler\", email: \"test.scheduler@example.com\" }; const token = helpers.generateToken(schedulerUser); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM Ensure we have a test order with the right status
echo Setting up test order...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', \"UPDATE orders SET status = 'pending_radiology', radiology_organization_id = 2 WHERE id = \" + helpers.config.testData.testOrderId + \" RETURNING id, status, radiology_organization_id;\"));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

REM Test 1: Get Incoming Orders
echo.
echo Test 1: Get Incoming Orders
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"radiology/orders\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"orders"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Get Incoming Orders
) else (
    echo [FAIL] Get Incoming Orders
)

REM Test 2: Get Order Details
echo.
echo Test 2: Get Order Details
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"radiology/orders/\" + helpers.config.testData.testOrderId));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"order"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Get Order Details
) else (
    echo [FAIL] Get Order Details
)

REM Test 3: Export Order as JSON
echo.
echo Test 3: Export Order as JSON
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"radiology/orders/\" + helpers.config.testData.testOrderId + \"/export/json\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"order"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Export Order as JSON
) else (
    echo [FAIL] Export Order as JSON
)

REM Test 4: Export Order as CSV
echo.
echo Test 4: Export Order as CSV
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"radiology/orders/\" + helpers.config.testData.testOrderId + \"/export/csv\"));"') do set API_URL=%%a
curl -s -X GET "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" | findstr /C:"order_id"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Export Order as CSV
) else (
    echo [FAIL] Export Order as CSV
)

REM Test 5: Update Order Status
echo.
echo Test 5: Update Order Status
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"radiology/orders/\" + helpers.config.testData.testOrderId + \"/update-status\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"newStatus\":\"scheduled\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Update Order Status
) else (
    echo [FAIL] Update Order Status
)

REM Verify status update in database
echo.
echo Verifying status update in database...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, status FROM orders WHERE id = ' + helpers.config.testData.testOrderId + ';'));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

REM Test 6: Request Additional Information
echo.
echo Test 6: Request Additional Information
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"radiology/orders/\" + helpers.config.testData.testOrderId + \"/request-info\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"requestedInfoType\":\"labs\",\"requestedInfoDetails\":\"Need recent creatinine levels for contrast administration\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Request Additional Information
) else (
    echo [FAIL] Request Additional Information
)

REM Verify information request in database
echo.
echo Verifying information request in database...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, order_id, requested_info_type, status FROM information_requests WHERE order_id = ' + helpers.config.testData.testOrderId + ';'));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

echo.
echo All tests completed!