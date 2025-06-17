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
# Create a simple 1x1 pixel PNG
echo -n -e '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x77\x53\xde\x00\x00\x00\x0c\x49\x44\x41\x54\x08\xd7\x63\xf8\x0f\x00\x00\x01\x01\x00\x00\x5b\xcd\x38\x29\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > test-upload.png
echo -e "${GREEN}Created test PNG file (1x1 pixel)${NC}"
echo ""

# Step 3: Upload to S3
echo -e "${YELLOW}=== Step 3: Uploading to S3 ===${NC}"
echo "Upload URL: $UPLOAD_URL"
echo ""

# Try upload with curl (simulating browser behavior)
echo "Attempting upload with curl..."
UPLOAD_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$UPLOAD_URL" \
  -H "Content-Type: image/png" \
  --data-binary @test-upload.png)

HTTP_STATUS=$(echo "$UPLOAD_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$UPLOAD_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "HTTP Status: $HTTP_STATUS"
if [ ! -z "$RESPONSE_BODY" ]; then
    echo "Response body:"
    echo "$RESPONSE_BODY"
fi

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}Upload successful!${NC}"
else
    echo -e "${RED}Upload failed with status $HTTP_STATUS${NC}"
    
    # Try to parse error if it's XML
    if echo "$RESPONSE_BODY" | grep -q "<?xml"; then
        echo ""
        echo "Error details:"
        echo "$RESPONSE_BODY" | grep -o '<Code>[^<]*</Code>' | sed 's/<[^>]*>//g' | sed 's/^/  Code: /'
        echo "$RESPONSE_BODY" | grep -o '<Message>[^<]*</Message>' | sed 's/<[^>]*>//g' | sed 's/^/  Message: /'
    fi
fi
echo ""

# Step 4: Confirm upload
echo -e "${YELLOW}=== Step 4: Confirming upload ===${NC}"
CONFIRM_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" https://api.radorderpad.com/api/uploads/confirm \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"fileKey\": \"$FILE_KEY\"}")

CONFIRM_STATUS=$(echo "$CONFIRM_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
CONFIRM_BODY=$(echo "$CONFIRM_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "Response:"
echo "$CONFIRM_BODY" | python3 -m json.tool 2>/dev/null || echo "$CONFIRM_BODY"

if [ "$CONFIRM_STATUS" = "200" ]; then
    echo -e "${GREEN}Upload confirmed successfully!${NC}"
else
    echo -e "${RED}Upload confirmation failed with status $CONFIRM_STATUS${NC}"
fi

# Cleanup
rm -f test-upload.png

echo ""
echo -e "${YELLOW}=== Test Summary ===${NC}"
echo "1. Presigned URL generation: $([ ! -z "$UPLOAD_URL" ] && echo -e "${GREEN}PASS${NC}" || echo -e "${RED}FAIL${NC}")"
echo "2. S3 Upload: $([ "$HTTP_STATUS" = "200" ] && echo -e "${GREEN}PASS${NC}" || echo -e "${RED}FAIL${NC}")"
echo "3. Upload confirmation: $([ "$CONFIRM_STATUS" = "200" ] && echo -e "${GREEN}PASS${NC}" || echo -e "${RED}FAIL${NC}")"