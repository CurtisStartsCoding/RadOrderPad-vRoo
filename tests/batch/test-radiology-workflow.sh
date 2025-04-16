#!/bin/bash
echo "Testing Radiology Group Workflow API Endpoints"
echo "=============================================="

# Generate a JWT token for a scheduler user
echo "Generating JWT token for scheduler user..."
JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const schedulerUser = { userId: 3, orgId: 2, role: \"scheduler\", email: \"test.scheduler@example.com\" }; const token = helpers.generateToken(schedulerUser); console.log(token);")
echo "Token generated: ${JWT_TOKEN:0:20}..."

# Ensure we have a test order with the right status
echo "Setting up test order..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', \"UPDATE orders SET status = 'pending_radiology', radiology_organization_id = 2 WHERE id = \" + helpers.config.testData.testOrderId + \" RETURNING id, status, radiology_organization_id;\"));")
eval $DB_CMD

# Test 1: Get Incoming Orders
echo
echo "Test 1: Get Incoming Orders"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('radiology/orders'));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "orders"; then
    echo "[PASS] Get Incoming Orders"
else
    echo "[FAIL] Get Incoming Orders"
fi

# Test 2: Get Order Details
echo
echo "Test 2: Get Order Details"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('radiology/orders/' + helpers.config.testData.testOrderId));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "order"; then
    echo "[PASS] Get Order Details"
else
    echo "[FAIL] Get Order Details"
fi

# Test 3: Export Order as JSON
echo
echo "Test 3: Export Order as JSON"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('radiology/orders/' + helpers.config.testData.testOrderId + '/export/json'));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "order"; then
    echo "[PASS] Export Order as JSON"
else
    echo "[FAIL] Export Order as JSON"
fi

# Test 4: Export Order as CSV
echo
echo "Test 4: Export Order as CSV"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('radiology/orders/' + helpers.config.testData.testOrderId + '/export/csv'));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "order_id"; then
    echo "[PASS] Export Order as CSV"
else
    echo "[FAIL] Export Order as CSV"
fi

# Test 5: Update Order Status
echo
echo "Test 5: Update Order Status"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('radiology/orders/' + helpers.config.testData.testOrderId + '/update-status'));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"newStatus":"scheduled"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Update Order Status"
else
    echo "[FAIL] Update Order Status"
fi

# Verify status update in database
echo
echo "Verifying status update in database..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, status FROM orders WHERE id = ' + helpers.config.testData.testOrderId + ';'));")
eval $DB_CMD

# Test 6: Request Additional Information
echo
echo "Test 6: Request Additional Information"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('radiology/orders/' + helpers.config.testData.testOrderId + '/request-info'));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"requestedInfoType":"labs","requestedInfoDetails":"Need recent creatinine levels for contrast administration"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Request Additional Information"
else
    echo "[FAIL] Request Additional Information"
fi

# Verify information request in database
echo
echo "Verifying information request in database..."
DB_CMD=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getDockerDbCommand('phi', 'SELECT id, order_id, requested_info_type, status FROM information_requests WHERE order_id = ' + helpers.config.testData.testOrderId + ';'));")
eval $DB_CMD

echo
echo "All tests completed!"