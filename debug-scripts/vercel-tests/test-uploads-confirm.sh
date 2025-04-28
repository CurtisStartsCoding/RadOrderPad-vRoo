#!/bin/bash
echo "Testing POST /api/uploads/confirm endpoint"

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
API_URL="https://api.radorderpad.com"
if [ -n "$VERCEL_URL" ]; then
  API_URL="https://$VERCEL_URL"
fi

# Set test order ID - use a valid order ID that the test user has access to
TEST_ORDER_ID=606
TEST_PATIENT_ID=1

echo "Using API URL: $API_URL"
echo "Using Test Order ID: $TEST_ORDER_ID"
echo "Using Test Patient ID: $TEST_PATIENT_ID"

# Step 1: Get a presigned URL to get a valid fileKey
echo
echo "Step 1: Getting a presigned URL..."
PRESIGNED_URL_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"fileName\":\"confirm-test.txt\",\"fileType\":\"text/plain\",\"contentType\":\"text/plain\",\"fileSize\":1024,\"documentType\":\"test_document\",\"orderId\":$TEST_ORDER_ID,\"patientId\":$TEST_PATIENT_ID}" \
  "$API_URL/api/uploads/presigned-url")

echo "Presigned URL Response: $PRESIGNED_URL_RESPONSE"

# Use node to extract the fileKey from the JSON response
echo "var response = $PRESIGNED_URL_RESPONSE; console.log(response.fileKey);" > extract.js
FILE_KEY=$(node extract.js)
rm extract.js

echo "Extracted File Key: $FILE_KEY"

# Step 2: Skip the actual S3 upload
echo
echo "Step 2: Skipping actual S3 upload (no permissions in test environment)"
echo "In a production environment, the file would be uploaded to S3 at this point."

# Step 3: Call the confirm endpoint directly
echo
echo "Step 3: Calling the confirm endpoint directly..."
echo "Note: This is expected to fail with a 500 error because the backend will check if the file exists in S3."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"fileKey\":\"$FILE_KEY\",\"orderId\":$TEST_ORDER_ID,\"patientId\":$TEST_PATIENT_ID,\"documentType\":\"test_document\",\"fileName\":\"confirm-test.txt\",\"fileSize\":1024,\"contentType\":\"text/plain\"}" \
  "$API_URL/api/uploads/confirm"

# Test 4: Missing required fields
echo
echo
echo "Test 4: Missing required fields"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"fileKey\":\"$FILE_KEY\"}" \
  "$API_URL/api/uploads/confirm"

# Test 5: Invalid fileKey
echo
echo
echo "Test 5: Invalid fileKey"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"fileKey\":\"invalid-file-key\",\"orderId\":$TEST_ORDER_ID,\"patientId\":$TEST_PATIENT_ID,\"documentType\":\"test_document\",\"fileName\":\"confirm-test.txt\",\"fileSize\":1024,\"contentType\":\"text/plain\"}" \
  "$API_URL/api/uploads/confirm"

# Test 6: No authentication
echo
echo
echo "Test 6: No authentication"
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"fileKey\":\"$FILE_KEY\",\"orderId\":$TEST_ORDER_ID,\"patientId\":$TEST_PATIENT_ID,\"documentType\":\"test_document\",\"fileName\":\"confirm-test.txt\",\"fileSize\":1024,\"contentType\":\"text/plain\"}" \
  "$API_URL/api/uploads/confirm"

echo
echo
echo "Tests completed"
echo "Note: The 500 error from the confirm endpoint is expected because the backend checks if the file exists in S3."
echo "In a production environment with proper S3 permissions, the confirm endpoint would succeed if the file was uploaded successfully."
read -p "Press Enter to continue..."