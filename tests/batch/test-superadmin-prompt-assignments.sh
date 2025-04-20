#!/bin/bash
echo "Running Super Admin Prompt Assignments API Tests (Batch)..."

# Set environment variables for testing
API_URL="http://localhost:3000"
TEST_TOKEN="test-token"

# Compile TypeScript files
echo "Compiling TypeScript files..."
npx tsc

# Run the tests
echo "Running tests..."

# Test creating a prompt assignment
echo "Testing POST /api/superadmin/prompts/assignments"
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{"physician_id":1,"prompt_id":1,"ab_group":"A","is_active":true}' \
  $API_URL/api/superadmin/prompts/assignments

echo -e "\n"

# Test listing prompt assignments
echo "Testing GET /api/superadmin/prompts/assignments"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  $API_URL/api/superadmin/prompts/assignments

echo -e "\n"

# Test listing prompt assignments with filters
echo "Testing GET /api/superadmin/prompts/assignments with filters"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  "$API_URL/api/superadmin/prompts/assignments?physician_id=1&is_active=true"

echo -e "\n"

# Test getting a specific prompt assignment (replace 1 with an actual ID)
echo "Testing GET /api/superadmin/prompts/assignments/1"
curl -X GET \
  -H "Authorization: Bearer $TEST_TOKEN" \
  $API_URL/api/superadmin/prompts/assignments/1

echo -e "\n"

# Test updating a prompt assignment (replace 1 with an actual ID)
echo "Testing PUT /api/superadmin/prompts/assignments/1"
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -d '{"ab_group":"B","is_active":true}' \
  $API_URL/api/superadmin/prompts/assignments/1

echo -e "\n"

# Test deleting a prompt assignment (replace 1 with an actual ID)
echo "Testing DELETE /api/superadmin/prompts/assignments/1"
curl -X DELETE \
  -H "Authorization: Bearer $TEST_TOKEN" \
  $API_URL/api/superadmin/prompts/assignments/1

echo -e "\n"

echo "Super Admin Prompt Assignments API Tests (Batch) completed."