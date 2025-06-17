#!/bin/bash

# Login to get a valid token
echo "Logging in as admin_staff..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test.admin_staff@example.com", "password": "password123"}')

# Extract token from response
ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo "Failed to login. Response:"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

echo "Generated token: $ADMIN_TOKEN"
echo ""

# Test api.radorderpad.com
echo "=== Testing https://api.radorderpad.com ==="
RESPONSE1=$(curl -s https://api.radorderpad.com/api/uploads/presigned-url \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileType": "image/png", "fileName": "test.png", "contentType": "image/png"}')

echo "Full response:"
echo "$RESPONSE1" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE1"

echo ""
echo "Checking for X-Amz-SignedHeaders:"
echo "$RESPONSE1" | grep -o "X-Amz-SignedHeaders=[^&]*" || echo "No X-Amz-SignedHeaders found"

echo ""
echo ""

# Test localhost:3000
echo "=== Testing http://localhost:3000 ==="
RESPONSE2=$(curl -s http://localhost:3000/api/uploads/presigned-url \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileType": "image/png", "fileName": "test.png", "contentType": "image/png"}')

echo "Full response:"
echo "$RESPONSE2" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE2"

echo ""
echo "Checking for X-Amz-SignedHeaders:"
echo "$RESPONSE2" | grep -o "X-Amz-SignedHeaders=[^&]*" || echo "No X-Amz-SignedHeaders found"

echo ""
echo "=== Summary ==="
echo "api.radorderpad.com has signed headers: $(echo "$RESPONSE1" | grep -q "X-Amz-SignedHeaders=" && echo "YES" || echo "NO")"
echo "localhost:3000 has signed headers: $(echo "$RESPONSE2" | grep -q "X-Amz-SignedHeaders=" && echo "YES" || echo "NO")"