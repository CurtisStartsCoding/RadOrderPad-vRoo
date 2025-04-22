#!/bin/bash

echo "=== Testing Radiology Order Export ==="
echo

# Check if a token is provided as an argument
if [ -z "$1" ]; then
  echo "No JWT token provided. Using environment variable if available."
  node test-radiology-export.js
else
  echo "Using provided JWT token."
  node test-radiology-export.js --token "$1"
fi

echo
echo "=== Test Complete ==="