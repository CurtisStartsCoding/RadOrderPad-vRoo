#!/bin/bash
echo "Testing Location Management API Endpoints"
echo "=========================================="

# Generate a JWT token for an admin_referring user
echo "Generating JWT token for admin_referring user..."
JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);")
echo "Token generated: ${JWT_TOKEN:0:20}..."

# Test 1: List Locations
echo
echo "Test 1: List Locations"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('organizations/mine/locations'));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "locations"; then
    echo "[PASS] List Locations"
else
    echo "[FAIL] List Locations"
fi

# Test 2: Create Location
echo
echo "Test 2: Create Location"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('organizations/mine/locations'));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"name":"Test Location","address_line1":"123 Test St","city":"Test City","state":"TS","zip_code":"12345","phone_number":"555-123-4567"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Create Location"
else
    echo "[FAIL] Create Location"
fi

# Get the location ID from the response
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('organizations/mine/locations'));")
LOCATION_RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" | grep "id")
echo "Location response: $LOCATION_RESPONSE"

# Extract the location ID using a simple approach (this is a basic extraction and might need adjustment)
LOCATION_ID=$(echo $LOCATION_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)
echo "Location ID: $LOCATION_ID"

# Test 3: Get Location Details
echo
echo "Test 3: Get Location Details"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('organizations/mine/locations/' + $LOCATION_ID));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "location"; then
    echo "[PASS] Get Location Details"
else
    echo "[FAIL] Get Location Details"
fi

# Test 4: Update Location
echo
echo "Test 4: Update Location"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('organizations/mine/locations/' + $LOCATION_ID));")
RESPONSE=$(curl -s -X PUT "$API_URL" -H "Authorization: Bearer $JWT_TOKEN" -H "Content-Type: application/json" -d '{"name":"Updated Test Location","address_line1":"456 Test Ave","city":"Test City","state":"TS","zip_code":"12345","phone_number":"555-123-4567"}')
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Update Location"
else
    echo "[FAIL] Update Location"
fi

# Test 5: Assign User to Location
echo
echo "Test 5: Assign User to Location"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('users/1/locations/' + $LOCATION_ID));")
RESPONSE=$(curl -s -X POST "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Assign User to Location"
else
    echo "[FAIL] Assign User to Location"
fi

# Test 6: List User Locations
echo
echo "Test 6: List User Locations"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('users/1/locations'));")
RESPONSE=$(curl -s -X GET "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "locations"; then
    echo "[PASS] List User Locations"
else
    echo "[FAIL] List User Locations"
fi

# Test 7: Unassign User from Location
echo
echo "Test 7: Unassign User from Location"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('users/1/locations/' + $LOCATION_ID));")
RESPONSE=$(curl -s -X DELETE "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Unassign User from Location"
else
    echo "[FAIL] Unassign User from Location"
fi

# Test 8: Deactivate Location
echo
echo "Test 8: Deactivate Location"
API_URL=$(node -e "const helpers = require('./test-helpers'); console.log(helpers.getApiUrl('organizations/mine/locations/' + $LOCATION_ID));")
RESPONSE=$(curl -s -X DELETE "$API_URL" -H "Authorization: Bearer $JWT_TOKEN")
echo "$RESPONSE"
if echo "$RESPONSE" | grep -q "success"; then
    echo "[PASS] Deactivate Location"
else
    echo "[FAIL] Deactivate Location"
fi

echo
echo "All tests completed!"