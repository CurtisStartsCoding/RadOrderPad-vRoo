#!/bin/bash
echo "Running Super Admin Logs API Tests..."

# Set environment variables for testing
API_URL="http://localhost:3000"
TEST_TOKEN="test-token"

# Compile TypeScript files
echo "Compiling TypeScript files..."
npx tsc

# Run the tests
echo "Running tests..."

# Test listing LLM validation logs
echo "Testing GET /api/superadmin/logs/validation"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  $API_URL/api/superadmin/logs/validation

echo -e "\n"

# Test listing LLM validation logs with filters
echo "Testing GET /api/superadmin/logs/validation with filters"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  "$API_URL/api/superadmin/logs/validation?organization_id=1&status=success&limit=10&offset=0"

echo -e "\n"

# Test listing credit usage logs
echo "Testing GET /api/superadmin/logs/credits"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  $API_URL/api/superadmin/logs/credits

echo -e "\n"

# Test listing credit usage logs with filters
echo "Testing GET /api/superadmin/logs/credits with filters"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  "$API_URL/api/superadmin/logs/credits?organization_id=1&action_type=validate&limit=10&offset=0"

echo -e "\n"

# Test listing purgatory events
echo "Testing GET /api/superadmin/logs/purgatory"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  $API_URL/api/superadmin/logs/purgatory

echo -e "\n"

# Test listing purgatory events with filters
echo "Testing GET /api/superadmin/logs/purgatory with filters"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  "$API_URL/api/superadmin/logs/purgatory?organization_id=1&status=active&limit=10&offset=0"

echo -e "\n"

echo "Super Admin Logs API Tests completed."