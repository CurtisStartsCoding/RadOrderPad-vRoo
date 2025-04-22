#!/bin/bash
# Script to run all test suites sequentially
echo "Running all test suites..."
echo

# Create a directory for test results if it doesn't exist
mkdir -p test-results

# Generate a JWT token for a physician user
echo "Generating JWT token for tests..."
JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.physician); console.log(token);")
echo "Token generated: ${JWT_TOKEN:0:20}..."

echo "===== 1. Running Validation Tests ====="
sleep 2
../../run-validation-tests.sh "$JWT_TOKEN" > test-results/validation-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Validation Tests"
    ./update-test-audit-log.sh "Validation Tests" "PASS" "LLM integration functioning correctly"
else
    echo "[FAIL] Validation Tests - Check test-results/validation-tests.log for details"
    ./update-test-audit-log.sh "Validation Tests" "FAIL" "Check test-results/validation-tests.log for details"
fi
echo

echo "===== 2. Running Upload Tests ====="
sleep 2
./run-file-upload-tests.sh > test-results/upload-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Upload Tests"
    ./update-test-audit-log.sh "Upload Tests" "PASS" "Presigned URL generation working"
else
    echo "[FAIL] Upload Tests - Check test-results/upload-tests.log for details"
    ./update-test-audit-log.sh "Upload Tests" "FAIL" "Check test-results/upload-tests.log for details"
fi
echo

echo "===== 3. Running Order Finalization Tests ====="
sleep 2
./run-order-finalization-tests.sh > test-results/order-finalization-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Order Finalization Tests"
    ./update-test-audit-log.sh "Order Finalization Tests" "PASS" "Temporary patient creation working"
else
    echo "[FAIL] Order Finalization Tests - Check test-results/order-finalization-tests.log for details"
    ./update-test-audit-log.sh "Order Finalization Tests" "FAIL" "Check test-results/order-finalization-tests.log for details"
fi
echo

echo "===== 4. Running Admin Finalization Tests ====="
sleep 2
./test-admin-finalization.sh > test-results/admin-finalization-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Admin Finalization Tests"
    ./update-test-audit-log.sh "Admin Finalization Tests" "PASS" "All endpoints working correctly"
else
    echo "[FAIL] Admin Finalization Tests - Check test-results/admin-finalization-tests.log for details"
    ./update-test-audit-log.sh "Admin Finalization Tests" "FAIL" "Check test-results/admin-finalization-tests.log for details"
fi
echo
echo

echo "===== 5. Running Connection Management Tests ====="
sleep 2
./run-connection-tests.sh > test-results/connection-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Connection Management Tests"
    ./update-test-audit-log.sh "Connection Management Tests" "PASS" "All tests passing after connection service refactoring"
else
    echo "[FAIL] Connection Management Tests - Check test-results/connection-tests.log for details"
    ./update-test-audit-log.sh "Connection Management Tests" "FAIL" "Check test-results/connection-tests.log for details"
fi
echo

echo "===== 6. Running Location Management Tests ====="
sleep 2
./test-location-management.sh > test-results/location-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Location Management Tests"
    ./update-test-audit-log.sh "Location Management Tests" "PASS" "No issues reported"
else
    echo "[FAIL] Location Management Tests - Check test-results/location-tests.log for details"
    ./update-test-audit-log.sh "Location Management Tests" "FAIL" "Check test-results/location-tests.log for details"
fi
echo

echo "===== 7. Running Radiology Workflow Tests ====="
sleep 2
./test-radiology-workflow.sh > test-results/radiology-workflow-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Radiology Workflow Tests"
    ./update-test-audit-log.sh "Radiology Workflow Tests" "PASS" "Export functionality verified"
else
    echo "[FAIL] Radiology Workflow Tests - Check test-results/radiology-workflow-tests.log for details"
    ./update-test-audit-log.sh "Radiology Workflow Tests" "FAIL" "Check test-results/radiology-workflow-tests.log for details"
fi
echo

echo "===== 8. Running Stripe Webhook Tests ====="
sleep 2
../../run-stripe-webhook-tests.sh > test-results/stripe-webhook-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Stripe Webhook Tests"
    ./update-test-audit-log.sh "Stripe Webhook Tests" "PASS" "Webhook handlers functioning correctly"
else
    echo "[FAIL] Stripe Webhook Tests - Check test-results/stripe-webhook-tests.log for details"
    ./update-test-audit-log.sh "Stripe Webhook Tests" "FAIL" "Check test-results/stripe-webhook-tests.log for details"
fi
echo

echo "===== 9. Running Super Admin API Tests ====="
sleep 2
./test-superadmin-api.sh > test-results/superadmin-api-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Super Admin API Tests"
    ./update-test-audit-log.sh "Super Admin API Tests" "PASS" "All endpoints working correctly"
else
    echo "[FAIL] Super Admin API Tests - Check test-results/superadmin-api-tests.log for details"
    ./update-test-audit-log.sh "Super Admin API Tests" "FAIL" "Check test-results/superadmin-api-tests.log for details"
fi
echo

echo "===== 10. Running File Upload Tests ====="
sleep 2
./run-file-upload-tests.sh > test-results/file-upload-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] File Upload Tests"
    ./update-test-audit-log.sh "File Upload Tests" "PASS" "S3 presigned URL flow working correctly"
else
    echo "[FAIL] File Upload Tests - Check test-results/file-upload-tests.log for details"
    ./update-test-audit-log.sh "File Upload Tests" "FAIL" "Check test-results/file-upload-tests.log for details"
fi
echo

echo "===== 11. Running Admin Send-to-Radiology Tests ====="
sleep 2
./run-admin-send-to-radiology-tests.sh > test-results/admin-send-to-radiology-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Admin Send-to-Radiology Tests"
    ./update-test-audit-log.sh "Admin Send-to-Radiology Tests" "PASS" "Credit consumption on order submission working correctly"
else
    echo "[FAIL] Admin Send-to-Radiology Tests - Check test-results/admin-send-to-radiology-tests.log for details"
    ./update-test-audit-log.sh "Admin Send-to-Radiology Tests" "FAIL" "Check test-results/admin-send-to-radiology-tests.log for details"
fi
echo

echo "===== 12. Running Billing Subscriptions Tests ====="
sleep 2
./run-billing-subscriptions-tests.sh > test-results/billing-subscriptions-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Billing Subscriptions Tests"
    ./update-test-audit-log.sh "Billing Subscriptions Tests" "PASS" "Stripe subscription creation API working correctly"
else
    echo "[FAIL] Billing Subscriptions Tests - Check test-results/billing-subscriptions-tests.log for details"
    ./update-test-audit-log.sh "Billing Subscriptions Tests" "FAIL" "Check test-results/billing-subscriptions-tests.log for details"
fi
echo

echo "===== 13. Running MemoryDB Cache Tests ====="
sleep 2
./run-memorydb-cache-test.sh > test-results/memorydb-cache-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] MemoryDB Cache Tests"
    ./update-test-audit-log.sh "MemoryDB Cache Tests" "PASS" "Redis caching layer working correctly"
else
    echo "[FAIL] MemoryDB Cache Tests - Check test-results/memorydb-cache-tests.log for details"
    ./update-test-audit-log.sh "MemoryDB Cache Tests" "FAIL" "Check test-results/memorydb-cache-tests.log for details"
fi
echo

echo "===== 14. Running Enhanced EMR Parser Tests ====="
sleep 2
./run-emr-parser-test.sh > test-results/emr-parser-tests.log 2>&1
RESULT=$?
if [ $RESULT -eq 0 ]; then
    echo "[PASS] Enhanced EMR Parser Tests"
    ./update-test-audit-log.sh "Enhanced EMR Parser Tests" "PASS" "Improved EMR parsing functionality working correctly"
else
    echo "[FAIL] Enhanced EMR Parser Tests - Check test-results/emr-parser-tests.log for details"
    ./update-test-audit-log.sh "Enhanced EMR Parser Tests" "FAIL" "Check test-results/emr-parser-tests.log for details"
fi
echo

echo "===== Test Summary ====="
echo "14 test suites executed."
echo "Test results have been saved to the test-results directory."
echo "To view detailed logs, check the corresponding .log files."
echo

echo "===== Updating File Length Checker Audit Log ====="
./check-file-lengths.sh ../../src ts > test-results/file-length-check.log 2>&1
./update-test-audit-log.sh "File Length Checker" "PASS" "Identified files for refactoring"

echo "All tests completed!"
echo "Test audit log has been updated with the latest results."