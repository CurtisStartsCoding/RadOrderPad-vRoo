#!/bin/bash
echo "=== Testing GET /api/uploads/{documentId}/download-url Endpoint ==="
echo ""

# Change to the vercel-tests directory
cd "$(dirname "$0")"

# Load environment variables
if [ -f .env.test ]; then
  echo "Loading test environment variables..."
  export $(grep -v '^#' .env.test | xargs)
else
  echo "Warning: .env.test file not found"
fi

# Set API URL
API_URL="https://api.radorderpad.com"
if [ -n "$VERCEL_URL" ]; then
  API_URL="https://$VERCEL_URL"
fi

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

# Set test document ID - use a valid document ID from a previous upload
TEST_DOCUMENT_ID=1

echo "Using API URL: $API_URL"
echo "Using Test Document ID: $TEST_DOCUMENT_ID"

# Test 1: Get download URL with admin_referring token
echo ""
echo "Test 1: Get download URL with admin_referring token"
echo "Expected: 200 OK with download URL"
curl -s -X GET \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/uploads/$TEST_DOCUMENT_ID/download-url"

# Test 2: Get download URL with invalid document ID format
echo ""
echo ""
echo "Test 2: Get download URL with invalid document ID format"
echo "Expected: 400 Bad Request"
curl -s -X GET \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/uploads/invalid-id/download-url"

# Test 3: Get download URL with non-existent document ID
echo ""
echo ""
echo "Test 3: Get download URL with non-existent document ID"
echo "Expected: 404 Not Found"
curl -s -X GET \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  "$API_URL/api/uploads/999999/download-url"

# Test 4: Get download URL without token
echo ""
echo ""
echo "Test 4: Get download URL without token"
echo "Expected: 401 Unauthorized"
curl -s -X GET \
  "$API_URL/api/uploads/$TEST_DOCUMENT_ID/download-url"

echo ""
echo ""
echo "=== Tests Completed ==="
read -p "Press Enter to continue..."