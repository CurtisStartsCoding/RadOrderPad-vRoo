#!/bin/bash
echo "=== Testing GET /api/billing/credit-balance Endpoint ==="
echo ""

# Set API URL
API_URL="https://api.radorderpad.com"

# Get admin_referring token
TOKEN_FILE="../../tokens/admin_referring-token.txt"
if [ ! -f "$TOKEN_FILE" ]; then
  echo "Error: Token file not found at $TOKEN_FILE"
  exit 1
fi
ADMIN_REFERRING_TOKEN=$(cat "$TOKEN_FILE")

# Get physician token (for testing role restriction)
TOKEN_FILE="../../tokens/physician-token.txt"
if [ ! -f "$TOKEN_FILE" ]; then
  echo "Error: Token file not found at $TOKEN_FILE"
  exit 1
fi
PHYSICIAN_TOKEN=$(cat "$TOKEN_FILE")

echo "Test 1: Get credit balance with admin_referring token"
echo "Expected: 200 OK with credit balance data"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/billing/credit-balance"

echo ""
echo ""

echo "Test 2: Get credit balance with physician token"
echo "Expected: 403 Forbidden (role restriction)"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PHYSICIAN_TOKEN" \
  "$API_URL/api/billing/credit-balance"

echo ""
echo ""

echo "Test 3: Get credit balance without token"
echo "Expected: 401 Unauthorized"
curl -s -X GET \
  -H "Content-Type: application/json" \
  "$API_URL/api/billing/credit-balance"

echo ""
echo ""
echo "=== Test Completed ==="
read -p "Press Enter to continue..."