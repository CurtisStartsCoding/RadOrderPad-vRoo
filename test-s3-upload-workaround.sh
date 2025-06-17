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
echo ""

# Check if URL has X-Amz-SignedHeaders
if echo "$UPLOAD_URL" | grep -q "X-Amz-SignedHeaders="; then
    echo -e "${YELLOW}WARNING: URL contains X-Amz-SignedHeaders parameter${NC}"
    echo "This will cause signature mismatch errors with curl/wget"
    echo ""
    
    # Try removing the X-Amz-SignedHeaders parameter
    echo -e "${YELLOW}Attempting workaround: Removing X-Amz-SignedHeaders from URL${NC}"
    MODIFIED_URL=$(echo "$UPLOAD_URL" | sed 's/&X-Amz-SignedHeaders=[^&]*//')
    echo "Modified URL (removed X-Amz-SignedHeaders)"
else
    MODIFIED_URL="$UPLOAD_URL"
fi

# Step 2: Create a test PNG file
echo -e "${YELLOW}=== Step 2: Creating test PNG file ===${NC}"
echo -n -e '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90\x77\x53\xde\x00\x00\x00\x0c\x49\x44\x41\x54\x08\xd7\x63\xf8\x0f\x00\x00\x01\x01\x00\x00\x5b\xcd\x38\x29\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > test-upload.png
echo -e "${GREEN}Created test PNG file${NC}"
echo ""

# Step 3: Test with modified URL
echo -e "${YELLOW}=== Step 3: Testing upload with modified URL ===${NC}"
UPLOAD_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$MODIFIED_URL" \
  -H "Content-Type: image/png" \
  --data-binary @test-upload.png)

HTTP_STATUS=$(echo "$UPLOAD_RESPONSE" | grep "HTTP_STATUS:" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$UPLOAD_RESPONSE" | sed '/HTTP_STATUS:/d')

echo "HTTP Status: $HTTP_STATUS"
if [ ! -z "$RESPONSE_BODY" ]; then
    echo "Response:"
    echo "$RESPONSE_BODY"
fi

if [ "$HTTP_STATUS" != "200" ]; then
    echo -e "${RED}Modified URL upload failed${NC}"
    echo ""
    
    # Try another approach - reconstruct the URL without signed headers
    echo -e "${YELLOW}=== Alternative: Reconstructing presigned URL ===${NC}"
    
    # Parse the URL components
    BASE_URL=$(echo "$UPLOAD_URL" | cut -d'?' -f1)
    QUERY_STRING=$(echo "$UPLOAD_URL" | cut -d'?' -f2)
    
    # Build new query string without X-Amz-SignedHeaders
    NEW_QUERY=""
    IFS='&' read -ra PARAMS <<< "$QUERY_STRING"
    for param in "${PARAMS[@]}"; do
        if [[ ! "$param" =~ ^X-Amz-SignedHeaders= ]]; then
            if [ -z "$NEW_QUERY" ]; then
                NEW_QUERY="$param"
            else
                NEW_QUERY="$NEW_QUERY&$param"
            fi
        fi
    done
    
    RECONSTRUCTED_URL="$BASE_URL?$NEW_QUERY"
    
    echo "Testing with reconstructed URL..."
    UPLOAD_RESPONSE2=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT "$RECONSTRUCTED_URL" \
      -H "Content-Type: image/png" \
      --data-binary @test-upload.png)
    
    HTTP_STATUS2=$(echo "$UPLOAD_RESPONSE2" | grep "HTTP_STATUS:" | cut -d':' -f2)
    RESPONSE_BODY2=$(echo "$UPLOAD_RESPONSE2" | sed '/HTTP_STATUS:/d')
    
    echo "HTTP Status: $HTTP_STATUS2"
    if [ ! -z "$RESPONSE_BODY2" ]; then
        echo "Response:"
        echo "$RESPONSE_BODY2"
    fi
    
    if [ "$HTTP_STATUS2" = "200" ]; then
        echo -e "${GREEN}Reconstructed URL upload successful!${NC}"
        HTTP_STATUS="200"
    fi
fi

# Step 4: Confirm upload if successful
if [ "$HTTP_STATUS" = "200" ]; then
    echo ""
    echo -e "${YELLOW}=== Step 4: Confirming upload ===${NC}"
    CONFIRM_RESPONSE=$(curl -s https://api.radorderpad.com/api/uploads/confirm \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"fileKey\": \"$FILE_KEY\"}")
    
    echo "Response:"
    echo "$CONFIRM_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CONFIRM_RESPONSE"
fi

# Cleanup
rm -f test-upload.png

echo ""
echo -e "${YELLOW}=== Summary ===${NC}"
echo "The issue is that the presigned URL contains X-Amz-SignedHeaders=host"
echo "This causes curl/wget to fail with SignatureDoesNotMatch"
echo ""
echo "Solution: Deploy the latest code that sets signableHeaders to empty Set"
echo "Location: src/services/upload/presigned-url.service.ts line 128"