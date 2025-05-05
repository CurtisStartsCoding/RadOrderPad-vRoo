#!/bin/bash
echo "Generating test token for validation endpoint..."
echo

node debug-scripts/aws-tests/generate-test-token.js

echo
echo "Token generation completed."
read -p "Press Enter to continue..."