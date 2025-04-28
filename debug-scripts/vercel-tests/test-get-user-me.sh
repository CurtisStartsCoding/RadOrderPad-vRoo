#!/bin/bash

# Manually set API URL to production server
API_URL=https://api.radorderpad.com

# Get a token for testing (using physician role)
TOKEN_FILE=../../tokens/physician-token.txt
if [ ! -f "$TOKEN_FILE" ]; then
  echo "Token file not found: $TOKEN_FILE"
  echo "Please run generate-all-role-tokens.js first"
  exit 1
fi

TOKEN=$(cat $TOKEN_FILE)

echo
echo "Testing GET /api/users/me endpoint..."
echo

# Make the request to get current user profile
curl -s -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  $API_URL/api/users/me

echo
echo
echo "Testing unauthorized access (no token)..."
echo

# Test without a token (should get 401)
curl -s -X GET \
  -H "Content-Type: application/json" \
  $API_URL/api/users/me

echo
echo
echo "Test completed."