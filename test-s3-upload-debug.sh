#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Login to get a valid token
echo -e "${YELLOW}Logging in as admin_staff...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST https://api.radorderpad.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test.admin_staff@example.com", "password": "password123"}')

# Extract token from response
ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}Failed to login. Response:${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}Login successful!${NC}"
echo ""

# Step 1: Get presigned URL
echo -e "${YELLOW}=== Step 1: Getting presigned URL ===${NC}"
PRESIGNED_RESPONSE=$(curl -s https://api.radorderpad.com/api/uploads/presigned-url \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileType": "image/png", "fileName": "test-upload.png", "contentType": "image/png"}')

echo "Response:"
echo "$PRESIGNED_RESPONSE" | python3 -m json.tool

# Extract uploadUrl and fileKey
UPLOAD_URL=$(echo "$PRESIGNED_RESPONSE" | grep -o '"uploadUrl":"[^"]*"' | cut -d'"' -f4 | sed 's/\\//g')
FILE_KEY=$(echo "$PRESIGNED_RESPONSE" | grep -o '"fileKey":"[^"]*"' | cut -d'"' -f4)

if [ -z "$UPLOAD_URL" ] || [ -z "$FILE_KEY" ]; then
    echo -e "${RED}Failed to get presigned URL${NC}"
    exit 1
fi

echo -e "${GREEN}Got presigned URL successfully${NC}"
echo "File key: $FILE_KEY"
echo ""

# Step 2: Create a test PNG file
echo -e "${YELLOW}=== Step 2: Creating test PNG file ===${NC}"
echo -n -e '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x77\x53\xde\x00\x00\x00\x0c\x49\x44\x41\x54\x08\xd7\x63\xf8\x0f\x00\x00\x01\x01\x00\x00\x5b\xcd\x38\x29\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > test-upload.png
echo -e "${GREEN}Created test PNG file (1x1 pixel)${NC}"
echo ""

# Step 3: Upload to S3 with different methods
echo -e "${YELLOW}=== Step 3: Testing different upload methods ===${NC}"
echo "Upload URL: $UPLOAD_URL"
echo ""

# Method 1: Minimal headers (only what's signed)
echo -e "${YELLOW}Method 1: Minimal headers (only host)${NC}"
UPLOAD_RESPONSE=$(curl -v -X PUT "$UPLOAD_URL" \
  -H "Host: radorderpad-uploads-prod-us-east-2.s3.us-east-2.amazonaws.com" \
  --data-binary @test-upload.png 2>&1)

echo "$UPLOAD_RESPONSE" | grep -E "(< HTTP|< x-amz-|SignatureDoesNotMatch|<Code>)"
echo ""

# Method 2: With Content-Type
echo -e "${YELLOW}Method 2: With Content-Type header${NC}"
UPLOAD_RESPONSE=$(curl -v -X PUT "$UPLOAD_URL" \
  -H "Host: radorderpad-uploads-prod-us-east-2.s3.us-east-2.amazonaws.com" \
  -H "Content-Type: image/png" \
  --data-binary @test-upload.png 2>&1)

echo "$UPLOAD_RESPONSE" | grep -E "(< HTTP|< x-amz-|SignatureDoesNotMatch|<Code>)"
echo ""

# Method 3: Try with wget instead of curl
echo -e "${YELLOW}Method 3: Using wget${NC}"
wget --method=PUT \
     --body-file=test-upload.png \
     --header="Content-Type: image/png" \
     --output-document=- \
     "$UPLOAD_URL" 2>&1 | grep -E "(HTTP|SignatureDoesNotMatch|<Code>)"
echo ""

# Method 4: Try without any extra headers using curl with minimal options
echo -e "${YELLOW}Method 4: Curl with absolutely minimal options${NC}"
curl -s -T test-upload.png "$UPLOAD_URL" -w "\nHTTP Status: %{http_code}\n" -o response.txt
cat response.txt | grep -E "(SignatureDoesNotMatch|<Code>)" || echo "Success!"
echo ""

# Cleanup
rm -f test-upload.png response.txt