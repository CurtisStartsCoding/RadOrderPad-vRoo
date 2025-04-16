#!/bin/bash

echo "Testing the comprehensive prompt implementation..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in the PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if test-comprehensive-prompt.js exists
if [ ! -f "test-comprehensive-prompt.js" ]; then
    echo "Error: test-comprehensive-prompt.js not found."
    exit 1
fi

# Set environment variables for testing
export API_BASE_URL="http://localhost:3000"
export API_PATH="/api"
export TEST_AUTH_TOKEN=""

# Prompt for auth token if not set
if [ -z "$TEST_AUTH_TOKEN" ]; then
    echo "Please enter a valid JWT auth token for testing:"
    read -r TEST_AUTH_TOKEN
    export TEST_AUTH_TOKEN
fi

echo "Running test with the following configuration:"
echo "API Base URL: $API_BASE_URL"
echo "API Path: $API_PATH"
echo

# Run the test script
node test-comprehensive-prompt.js

if [ $? -eq 0 ]; then
    echo
    echo "Test completed successfully!"
else
    echo
    echo "Test failed with error code $?"
fi

read -p "Press Enter to continue..."