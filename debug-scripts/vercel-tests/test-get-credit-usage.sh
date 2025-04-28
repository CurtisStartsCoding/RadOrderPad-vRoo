#!/bin/bash
echo "=== Testing GET /api/billing/credit-usage Endpoint ==="
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

# Get physician token
TOKEN_FILE="../../tokens/physician-token.txt"
if [ ! -f "$TOKEN_FILE" ]; then
  echo "Error: Token file not found at $TOKEN_FILE"
  exit 1
fi
PHYSICIAN_TOKEN=$(cat "$TOKEN_FILE")

echo "Test 1: Get credit usage history with admin_referring token"
echo "Expected: 200 OK with credit usage logs and pagination"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/billing/credit-usage"

echo ""
echo ""

echo "Test 2: Get credit usage history with pagination (limit=1)"
echo "Expected: 200 OK with only 1 log entry"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/billing/credit-usage?limit=1"

echo ""
echo ""

echo "Test 3: Get credit usage history with filtering (actionType=order_submitted)"
echo "Expected: 200 OK with filtered logs"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/billing/credit-usage?actionType=order_submitted"

echo ""
echo ""

echo "Test 4: Get credit usage history with sorting (sortBy=created_at&sortOrder=asc)"
echo "Expected: 200 OK with sorted logs"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/billing/credit-usage?sortBy=created_at&sortOrder=asc"

echo ""
echo ""

echo "Test 5: Get credit usage history with physician token"
echo "Expected: 403 Forbidden (role restriction)"
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PHYSICIAN_TOKEN" \
  "$API_URL/api/billing/credit-usage"

echo ""
echo ""

echo "Test 6: Get credit usage history without token"
echo "Expected: 401 Unauthorized"
curl -s -X GET \
  -H "Content-Type: application/json" \
  "$API_URL/api/billing/credit-usage"

echo ""
echo ""
echo "=== Test Completed ==="
read -p "Press Enter to continue..."