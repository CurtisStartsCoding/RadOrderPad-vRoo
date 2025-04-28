#!/bin/bash

# Manually set API URL to production server
API_URL=https://api.radorderpad.com

# Set token file paths for different roles
ADMIN_REFERRING_TOKEN_FILE=../../tokens/admin_referring-token.txt
ADMIN_RADIOLOGY_TOKEN_FILE=../../tokens/admin_radiology-token.txt
PHYSICIAN_TOKEN_FILE=../../tokens/physician-token.txt

# Display configuration
echo "API URL: $API_URL"
echo "Admin Referring Token file: $ADMIN_REFERRING_TOKEN_FILE"
echo "Admin Radiology Token file: $ADMIN_RADIOLOGY_TOKEN_FILE"
echo "Physician Token file: $PHYSICIAN_TOKEN_FILE"
echo

# Read tokens from files
if [ -f "$ADMIN_REFERRING_TOKEN_FILE" ]; then
    ADMIN_REFERRING_TOKEN=$(cat "$ADMIN_REFERRING_TOKEN_FILE")
else
    echo "Error: Admin Referring token file not found"
    exit 1
fi

if [ -f "$ADMIN_RADIOLOGY_TOKEN_FILE" ]; then
    ADMIN_RADIOLOGY_TOKEN=$(cat "$ADMIN_RADIOLOGY_TOKEN_FILE")
else
    echo "Error: Admin Radiology token file not found"
    exit 1
fi

if [ -f "$PHYSICIAN_TOKEN_FILE" ]; then
    PHYSICIAN_TOKEN=$(cat "$PHYSICIAN_TOKEN_FILE")
else
    echo "Error: Physician token file not found"
    exit 1
fi

echo
echo "Testing GET /api/users endpoint with admin_referring role..."
echo

# Test with admin_referring token
curl -s -X GET "$API_URL/api/users" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing with pagination and sorting..."
echo

# Test with pagination and sorting
curl -s -X GET "$API_URL/api/users?page=1&limit=2&sortBy=email&sortOrder=asc" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing with role filter..."
echo

# Test with role filter
curl -s -X GET "$API_URL/api/users?role=physician" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing with status filter..."
echo

# Test with status filter
curl -s -X GET "$API_URL/api/users?status=true" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing with name search..."
echo

# Test with name search
curl -s -X GET "$API_URL/api/users?name=Test" \
  -H "Authorization: Bearer $ADMIN_REFERRING_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing GET /api/users endpoint with admin_radiology role..."
echo

# Test with admin_radiology token
curl -s -X GET "$API_URL/api/users" \
  -H "Authorization: Bearer $ADMIN_RADIOLOGY_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing GET /api/users endpoint with physician role (should be forbidden)..."
echo

# Test with physician token (should be forbidden)
curl -s -X GET "$API_URL/api/users" \
  -H "Authorization: Bearer $PHYSICIAN_TOKEN" \
  -H "Content-Type: application/json"
echo
echo

echo "Testing unauthorized access (no token)..."
echo

# Test with no token
curl -s -X GET "$API_URL/api/users"
echo
echo

echo "Test completed."