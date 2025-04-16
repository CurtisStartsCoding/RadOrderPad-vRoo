@echo off
echo Testing Admin Staff Finalization Workflow API Endpoints
echo =====================================================

REM Generate a JWT token for an admin_staff user
echo Generating JWT token for admin_staff user...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM Ensure we have a test order with the right status
echo Setting up test order...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'UPDATE orders SET status = \'pending_admin\', radiology_organization_id = 1 WHERE id = ' + helpers.config.testData.testOrderId + ' RETURNING id, status, radiology_organization_id;'));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

REM Test 1: Paste EMR Summary
echo.
echo Test 1: Paste EMR Summary
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"admin/orders/\" + helpers.config.testData.testOrderId + \"/paste-summary\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Paste EMR Summary
) else (
    echo [FAIL] Paste EMR Summary
)

REM Test 2: Paste Supplemental Documents
echo.
echo Test 2: Paste Supplemental Documents
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"admin/orders/\" + helpers.config.testData.testOrderId + \"/paste-supplemental\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Paste Supplemental Documents
) else (
    echo [FAIL] Paste Supplemental Documents
)

REM Verify clinical records in database
echo.
echo Verifying clinical records in database...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, patient_id, order_id, record_type, added_by_user_id FROM patient_clinical_records WHERE order_id = ' + helpers.config.testData.testOrderId + ';'));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

REM Test 3: Send to Radiology
echo.
echo Test 3: Send to Radiology
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.getApiUrl(\"admin/orders/\" + helpers.config.testData.testOrderId + \"/send-to-radiology\"));"') do set API_URL=%%a
curl -s -X POST "%API_URL%" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}" | findstr /C:"success"
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Send to Radiology
) else (
    echo [FAIL] Send to Radiology
)

REM Verify status update in database
echo.
echo Verifying status update in database...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, status FROM orders WHERE id = ' + helpers.config.testData.testOrderId + ';'));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

REM Verify order history in database
echo.
echo Verifying order history in database...
node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT * FROM order_history WHERE order_id = ' + helpers.config.testData.testOrderId + ' ORDER BY created_at DESC LIMIT 1;'));" > temp_cmd.txt
for /f "tokens=*" %%a in (temp_cmd.txt) do %%a
del temp_cmd.txt

echo.
echo All tests completed!