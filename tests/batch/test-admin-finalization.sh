#!/bin/bash
echo "Testing Admin Staff Finalization Workflow API Endpoints"
echo "====================================================="

# Generate a JWT token for an admin_staff user
echo "Generating JWT token for admin_staff user..."
JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")
echo "Token generated: ${JWT_TOKEN:0:20}..."

# Ensure we have a test order with the right status
echo "Setting up test order..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'UPDATE orders SET status = \'pending_admin\', radiology_organization_id = 1 WHERE id = ' + helpers.config.testData.testOrderId + ' RETURNING id, status, radiology_organization_id;'));")
eval $DB_CMD

# Test 1: Paste EMR Summary
echo
echo "Test 1: Paste EMR Summary"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('admin/orders/' + helpers.config.testData.testOrderId + '/paste-summary'));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"pastedText":"Patient Address: 123 Main St, Springfield, IL 12345\nPhone: (555) 123-4567\nEmail: patient@example.com\nInsurance Provider: Blue Cross Blue Shield\nPolicy Number: ABC123456\nGroup Number: GRP789"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Paste EMR Summary"
else
    echo "[FAIL] Paste EMR Summary"
fi

# Test 2: Paste Supplemental Documents
echo
echo "Test 2: Paste Supplemental Documents"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('admin/orders/' + helpers.config.testData.testOrderId + '/paste-supplemental'));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"pastedText":"Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Paste Supplemental Documents"
else
    echo "[FAIL] Paste Supplemental Documents"
fi

# Verify clinical records in database
echo
echo "Verifying clinical records in database..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, patient_id, order_id, record_type, added_by_user_id FROM patient_clinical_records WHERE order_id = ' + helpers.config.testData.testOrderId + ';'));")
eval $DB_CMD

# Test 3: Send to Radiology
echo
echo "Test 3: Send to Radiology"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('admin/orders/' + helpers.config.testData.testOrderId + '/send-to-radiology'));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Send to Radiology"
else
    echo "[FAIL] Send to Radiology"
fi

# Verify status update in database
echo
echo "Verifying status update in database..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, status FROM orders WHERE id = ' + helpers.config.testData.testOrderId + ';'));")
eval $DB_CMD

# Verify order history in database
echo
echo "Verifying order history in database..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT * FROM order_history WHERE order_id = ' + helpers.config.testData.testOrderId + ' ORDER BY created_at DESC LIMIT 1;'));")
eval $DB_CMD

echo
echo "All tests completed!"