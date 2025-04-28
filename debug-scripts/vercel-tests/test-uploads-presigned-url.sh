#!/bin/bash
echo "Testing POST /api/uploads/presigned-url endpoint"

# Change to the vercel-tests directory
cd "$(dirname "$0")"

# Load environment variables
if [ -f .env.test ]; then
  echo "Loading test environment variables..."
  export $(grep -v '^#' .env.test | xargs)
else
  echo "Warning: .env.test file not found"
fi

# Get admin_referring token
if [ -f ../../tokens/admin_referring-token.txt ]; then
  TOKEN=$(cat ../../tokens/admin_referring-token.txt)
else
  echo "Error: admin_referring token file not found"
  exit 1
fi

# Set API URL
API_URL="http://localhost:3000"
if [ -n "$VERCEL_URL" ]; then
  API_URL="https://$VERCEL_URL"
fi

echo "Using API URL: $API_URL"

# Test 1: Valid request with all required fields
echo
echo "Test 1: Valid request with all required fields"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fileName":"test-document.pdf","fileType":"application/pdf","contentType":"application/pdf","fileSize":1048576,"documentType":"test"}' \
  "$API_URL/api/uploads/presigned-url"

# Test 2: Missing required fields
echo
echo
echo "Test 2: Missing required fields"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fileName":"test-document.pdf"}' \
  "$API_URL/api/uploads/presigned-url"

# Test 3: Invalid file type
echo
echo
echo "Test 3: Invalid file type"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fileName":"test-document.exe","fileType":"application/octet-stream","contentType":"application/octet-stream","fileSize":1048576}' \
  "$API_URL/api/uploads/presigned-url"

# Test 4: File size too large
echo
echo
echo "Test 4: File size too large"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"fileName":"large-image.jpg","fileType":"image/jpeg","contentType":"image/jpeg","fileSize":10485760}' \
  "$API_URL/api/uploads/presigned-url"

# Test 5: No authentication
echo
echo
echo "Test 5: No authentication"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test-document.pdf","fileType":"application/pdf","contentType":"application/pdf","fileSize":1048576}' \
  "$API_URL/api/uploads/presigned-url"

echo
echo
echo "Tests completed"