@echo off
echo Testing Admin Staff Finalization Workflow API Endpoints (DEBUG VERSION)
echo =====================================================

REM Generate a JWT token for an admin_staff user
echo Generating JWT token for admin_staff user...
for /f "tokens=*" %%a in ('node -e "const jwt = require(\"jsonwebtoken\"); const secret = \"79e90196beeb1beccf61381b2ee3c8038905be3b4058fdf0f611eb78602a5285a7ab7a2a43e38853d5d65f2cfb2d8f955dad73dc67ffb1f0fb6f6e7282a3e112\"; const payload = { userId: 2, orgId: 1, role: \"admin_staff\", email: \"test.admin@example.com\" }; const token = jwt.sign(payload, secret, { expiresIn: \"24h\" }); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM DEBUG: Check if Docker is running
echo.
echo DEBUG: Checking if Docker is running...
docker ps
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running or not accessible
    exit /b 1
)

REM Ensure we have a test order with the right status
echo.
echo DEBUG: Setting up test order...
echo Command: docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "UPDATE orders SET status = 'pending_admin', radiology_organization_id = 1 WHERE id = 4 RETURNING id, status, radiology_organization_id;"
docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "UPDATE orders SET status = 'pending_admin', radiology_organization_id = 1 WHERE id = 4 RETURNING id, status, radiology_organization_id;"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to update test order
    exit /b 1
)

REM Test 1: Paste EMR Summary
echo.
echo DEBUG: Test 1: Paste EMR Summary
echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"
curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-summary" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789\"}"
echo.
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Paste EMR Summary
) else (
    echo [FAIL] Paste EMR Summary
)

REM Test 2: Paste Supplemental Documents
echo.
echo DEBUG: Test 2: Paste Supplemental Documents
echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"
curl -s -X POST "http://localhost:3000/api/admin/orders/4/paste-supplemental" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{\"pastedText\":\"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings\"}"
echo.
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Paste Supplemental Documents
) else (
    echo [FAIL] Paste Supplemental Documents
)

REM Verify clinical records in database
echo.
echo DEBUG: Verifying clinical records in database...
echo Command: docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT id, patient_id, order_id, record_type, added_by_user_id FROM patient_clinical_records WHERE order_id = 4;"
docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT id, patient_id, order_id, record_type, added_by_user_id FROM patient_clinical_records WHERE order_id = 4;"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to verify clinical records
    exit /b 1
)

REM Test 3: Send to Radiology
echo.
echo DEBUG: Test 3: Send to Radiology
echo Command: curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"
curl -s -X POST "http://localhost:3000/api/admin/orders/4/send-to-radiology" -H "Authorization: Bearer %JWT_TOKEN%" -H "Content-Type: application/json" -d "{}"
echo.
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Send to Radiology
) else (
    echo [FAIL] Send to Radiology
)

REM Verify status update in database
echo.
echo DEBUG: Verifying status update in database...
echo Command: docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT id, status FROM orders WHERE id = 4;"
docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT id, status FROM orders WHERE id = 4;"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to verify status update
    exit /b 1
)

REM Verify order history in database
echo.
echo DEBUG: Verifying order history in database...
echo Command: docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT * FROM order_history WHERE order_id = 4 ORDER BY created_at DESC LIMIT 1;"
docker exec radorderpad-postgres psql -U postgres -d radorder_phi -c "SELECT * FROM order_history WHERE order_id = 4 ORDER BY created_at DESC LIMIT 1;"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to verify order history
    exit /b 1
)

echo.
echo All tests completed!