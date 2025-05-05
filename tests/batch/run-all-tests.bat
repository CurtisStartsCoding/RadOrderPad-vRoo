@echo off
REM Script to run all test suites sequentially
echo Running all test suites...
echo.

REM Create a directory for test results if it doesn't exist
if not exist "test-results" mkdir test-results

REM Generate a JWT token for a physician user
echo Generating JWT token for tests...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.physician); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

echo ===== 1. Running Validation Tests =====
timeout /t 2 /nobreak > nul
call ..\..\run-validation-tests.bat %JWT_TOKEN% > test-results\validation-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Validation Tests
    call update-test-audit-log.bat "Validation Tests" "PASS" "LLM integration functioning correctly"
) else (
    echo [FAIL] Validation Tests - Check test-results\validation-tests.log for details
    call update-test-audit-log.bat "Validation Tests" "FAIL" "Check test-results\validation-tests.log for details"
)
echo.

echo ===== 2. Running Upload Tests =====
timeout /t 2 /nobreak > nul
call run-file-upload-tests.bat > test-results\upload-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Upload Tests
    call update-test-audit-log.bat "Upload Tests" "PASS" "Presigned URL generation working"
) else (
    echo [FAIL] Upload Tests - Check test-results\upload-tests.log for details
    call update-test-audit-log.bat "Upload Tests" "FAIL" "Check test-results\upload-tests.log for details"
)
echo.

echo ===== 3. Running Order Finalization Tests =====
timeout /t 2 /nobreak > nul
call run-order-finalization-tests.bat > test-results\order-finalization-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Order Finalization Tests
    call update-test-audit-log.bat "Order Finalization Tests" "PASS" "Temporary patient creation working"
) else (
    echo [FAIL] Order Finalization Tests - Check test-results\order-finalization-tests.log for details
    call update-test-audit-log.bat "Order Finalization Tests" "FAIL" "Check test-results\order-finalization-tests.log for details"
)
echo.

echo ===== 4. Running Admin Finalization Tests =====
timeout /t 2 /nobreak > nul
call test-admin-finalization.bat > test-results\admin-finalization-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Admin Finalization Tests
    call update-test-audit-log.bat "Admin Finalization Tests" "PASS" "All endpoints working correctly"
) else (
    echo [FAIL] Admin Finalization Tests - Check test-results\admin-finalization-tests.log for details
    call update-test-audit-log.bat "Admin Finalization Tests" "FAIL" "Check test-results\admin-finalization-tests.log for details"
)
echo.
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Admin Finalization Tests
    call update-test-audit-log.bat "Admin Finalization Tests" "PASS" "All endpoints working correctly"
) else (
    echo [FAIL] Admin Finalization Tests - Check test-results\admin-finalization-tests.log for details
    call update-test-audit-log.bat "Admin Finalization Tests" "FAIL" "Check test-results\admin-finalization-tests.log for details"
)
echo.

echo ===== 5. Running Connection Management Tests =====
timeout /t 2 /nobreak > nul
call run-connection-tests.bat > test-results\connection-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Connection Management Tests
    call update-test-audit-log.bat "Connection Management Tests" "PASS" "All tests passing after connection service refactoring"
) else (
    echo [FAIL] Connection Management Tests - Check test-results\connection-tests.log for details
    call update-test-audit-log.bat "Connection Management Tests" "FAIL" "Check test-results\connection-tests.log for details"
)
echo.

echo ===== 6. Running Location Management Tests =====
timeout /t 2 /nobreak > nul
call test-location-management.bat > test-results\location-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Location Management Tests
    call update-test-audit-log.bat "Location Management Tests" "PASS" "No issues reported"
) else (
    echo [FAIL] Location Management Tests - Check test-results\location-tests.log for details
    call update-test-audit-log.bat "Location Management Tests" "FAIL" "Check test-results\location-tests.log for details"
)
echo.

echo ===== 7. Running Radiology Workflow Tests =====
timeout /t 2 /nobreak > nul
call test-radiology-workflow.bat > test-results\radiology-workflow-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Radiology Workflow Tests
    call update-test-audit-log.bat "Radiology Workflow Tests" "PASS" "Export functionality verified"
) else (
    echo [FAIL] Radiology Workflow Tests - Check test-results\radiology-workflow-tests.log for details
    call update-test-audit-log.bat "Radiology Workflow Tests" "FAIL" "Check test-results\radiology-workflow-tests.log for details"
)
echo.

echo ===== 8. Running Stripe Webhook Tests =====
timeout /t 2 /nobreak > nul
call ..\..\run-stripe-webhook-tests.bat > test-results\stripe-webhook-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Stripe Webhook Tests
    call update-test-audit-log.bat "Stripe Webhook Tests" "PASS" "Webhook handlers functioning correctly"
) else (
    echo [FAIL] Stripe Webhook Tests - Check test-results\stripe-webhook-tests.log for details
    call update-test-audit-log.bat "Stripe Webhook Tests" "FAIL" "Check test-results\stripe-webhook-tests.log for details"
)
echo.

echo ===== 9. Running Super Admin API Tests =====
timeout /t 2 /nobreak > nul
call test-superadmin-api.bat > test-results\superadmin-api-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Super Admin API Tests
    call update-test-audit-log.bat "Super Admin API Tests" "PASS" "All endpoints working correctly"
) else (
    echo [FAIL] Super Admin API Tests - Check test-results\superadmin-api-tests.log for details
    call update-test-audit-log.bat "Super Admin API Tests" "FAIL" "Check test-results\superadmin-api-tests.log for details"
)
echo.

echo ===== 10. Running File Upload Tests =====
timeout /t 2 /nobreak > nul
call run-file-upload-tests.bat > test-results\file-upload-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] File Upload Tests
    call update-test-audit-log.bat "File Upload Tests" "PASS" "S3 presigned URL flow working correctly"
) else (
    echo [FAIL] File Upload Tests - Check test-results\file-upload-tests.log for details
    call update-test-audit-log.bat "File Upload Tests" "FAIL" "Check test-results\file-upload-tests.log for details"
)
echo.

echo ===== 11. Running Admin Send-to-Radiology Tests =====
timeout /t 2 /nobreak > nul
call run-admin-send-to-radiology-tests.bat > test-results\admin-send-to-radiology-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Admin Send-to-Radiology Tests
    call update-test-audit-log.bat "Admin Send-to-Radiology Tests" "PASS" "Credit consumption on order submission working correctly"
) else (
    echo [FAIL] Admin Send-to-Radiology Tests - Check test-results\admin-send-to-radiology-tests.log for details
    call update-test-audit-log.bat "Admin Send-to-Radiology Tests" "FAIL" "Check test-results\admin-send-to-radiology-tests.log for details"
)
echo.

echo ===== 12. Running Billing Subscriptions Tests =====
timeout /t 2 /nobreak > nul
call run-billing-subscriptions-tests.bat > test-results\billing-subscriptions-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Billing Subscriptions Tests
    call update-test-audit-log.bat "Billing Subscriptions Tests" "PASS" "Stripe subscription creation API working correctly"
) else (
    echo [FAIL] Billing Subscriptions Tests - Check test-results\billing-subscriptions-tests.log for details
    call update-test-audit-log.bat "Billing Subscriptions Tests" "FAIL" "Check test-results\billing-subscriptions-tests.log for details"
)
echo.

echo ===== 13. Running MemoryDB Cache Tests =====
timeout /t 2 /nobreak > nul
call run-memorydb-cache-test.bat > test-results\memorydb-cache-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] MemoryDB Cache Tests
    call update-test-audit-log.bat "MemoryDB Cache Tests" "PASS" "Redis caching layer working correctly"
) else (
    echo [FAIL] MemoryDB Cache Tests - Check test-results\memorydb-cache-tests.log for details
    call update-test-audit-log.bat "MemoryDB Cache Tests" "FAIL" "Check test-results\memorydb-cache-tests.log for details"
)
echo.

echo ===== 14. Running Enhanced EMR Parser Tests =====
timeout /t 2 /nobreak > nul
call run-emr-parser-test.bat > test-results\emr-parser-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Enhanced EMR Parser Tests
    call update-test-audit-log.bat "Enhanced EMR Parser Tests" "PASS" "Improved EMR parsing functionality working correctly"
) else (
    echo [FAIL] Enhanced EMR Parser Tests - Check test-results\emr-parser-tests.log for details
    call update-test-audit-log.bat "Enhanced EMR Parser Tests" "FAIL" "Check test-results\emr-parser-tests.log for details"
)
echo.

echo ===== 15. Running Redis Rate Limiting Tests =====
timeout /t 2 /nobreak > nul
call ..\..\debug-scripts\vercel-tests\test-rate-limit.bat > test-results\rate-limit-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Redis Rate Limiting Tests
    call update-test-audit-log.bat "Redis Rate Limiting Tests" "PASS" "Rate limiting middleware functioning correctly"
) else (
    echo [FAIL] Redis Rate Limiting Tests - Check test-results\rate-limit-tests.log for details
    call update-test-audit-log.bat "Redis Rate Limiting Tests" "FAIL" "Check test-results\rate-limit-tests.log for details"
)
echo.

echo ===== 16. Running Redis Bulk Lookup Tests =====
timeout /t 2 /nobreak > nul
call ..\..\debug-scripts\redis-optimization\test-bulk-lookup.bat > test-results\bulk-lookup-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Redis Bulk Lookup Tests
    call update-test-audit-log.bat "Redis Bulk Lookup Tests" "PASS" "Lua-based bulk lookup functioning correctly"
) else (
    echo [FAIL] Redis Bulk Lookup Tests - Check test-results\bulk-lookup-tests.log for details
    call update-test-audit-log.bat "Redis Bulk Lookup Tests" "FAIL" "Check test-results\bulk-lookup-tests.log for details"
)
echo.

echo ===== 17. Running Redis Fuzzy Search Tests =====
timeout /t 2 /nobreak > nul
call ..\..\debug-scripts\redis-optimization\test-redis-fuzzy-search.bat > test-results\fuzzy-search-tests.log 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Redis Fuzzy Search Tests
    call update-test-audit-log.bat "Redis Fuzzy Search Tests" "PASS" "Fuzzy search for medical codes functioning correctly"
) else (
    echo [FAIL] Redis Fuzzy Search Tests - Check test-results\fuzzy-search-tests.log for details
    call update-test-audit-log.bat "Redis Fuzzy Search Tests" "FAIL" "Check test-results\fuzzy-search-tests.log for details"
)
echo.

echo ===== Test Summary =====
echo 17 test suites executed.
echo Test results have been saved to the test-results directory.
echo To view detailed logs, check the corresponding .log files.
echo.

echo ===== Updating File Length Checker Audit Log =====
call check-file-lengths.bat ..\..\src ts > test-results\file-length-check.log 2>&1
call update-test-audit-log.bat "File Length Checker" "PASS" "Identified files for refactoring"

echo All tests completed!
echo Test audit log has been updated with the latest results.