#!/bin/bash

# Load environment variables from .env.test file
if [ -f .env.test ]; then
  export $(grep -v '^#' .env.test | xargs)
else
  echo "Error: .env.test file not found"
  exit 1
fi

# Get admin_referring token
TOKEN_FILE="../../tokens/admin_referring-token.txt"
if [ ! -f "$TOKEN_FILE" ]; then
  echo "Error: Token file not found: $TOKEN_FILE"
  exit 1
fi

TOKEN=$(cat "$TOKEN_FILE")

echo
echo "=== Testing GET /api/organizations (Search Organizations) ==="
echo

# Test 1: Basic search without filters
echo "Test 1: Basic search without filters"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL/organizations" | jq .

echo
echo

# Test 2: Search by name
echo "Test 2: Search by name (partial match)"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL/organizations?name=Rad" | jq .

echo
echo

# Test 3: Search by type
echo "Test 3: Search by type"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL/organizations?type=radiology_group" | jq .

echo
echo

# Test 4: Search by state
echo "Test 4: Search by state"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL/organizations?state=CA" | jq .

echo
echo

# Test 5: Search with multiple filters
echo "Test 5: Search with multiple filters"
curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL/organizations?type=radiology_group&state=CA" | jq .

echo
echo

# Test 6: Test with non-admin token (should get 403)
echo "Test 6: Test with non-admin token (should get 403)"
PHYSICIAN_TOKEN=$(cat ../../tokens/physician-token.txt)
curl -s -X GET \
  -H "Authorization: Bearer $PHYSICIAN_TOKEN" \
  -H "Content-Type: application/json" \
  "$API_URL/organizations" | jq .

echo
echo "=== Tests completed ==="