#!/bin/bash

echo "Testing get user by ID endpoint..."
echo ""

# Set API URL to production by default
export API_URL="https://api.radorderpad.com"

# Check if .env.test file exists and source it
if [ -f "$(dirname "$0")/.env.test" ]; then
  source "$(dirname "$0")/.env.test"
  echo "Using API URL from .env.test: $API_URL"
fi

# Run the test script
node "$(dirname "$0")/test-get-org-user-by-id.js"

# Check the exit code
if [ $? -eq 0 ]; then
  echo ""
  echo "Test completed successfully"
  exit 0
else
  echo ""
  echo "Test failed with error code $?"
  exit 1
fi