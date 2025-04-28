#!/bin/bash
echo "Running Connection Requests API Test..."
cd "$(dirname "$0")"
node test-connection-requests.js
echo "Test completed."
read -p "Press Enter to continue..."