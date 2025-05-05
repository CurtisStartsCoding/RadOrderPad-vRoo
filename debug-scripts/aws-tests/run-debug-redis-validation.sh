#!/bin/bash
echo "Debugging Redis usage in validation endpoint..."
echo

# Read the physician token from the file
PHYSICIAN_TOKEN=$(cat tokens/physician-token.txt)
export PHYSICIAN_TOKEN

node debug-scripts/aws-tests/debug-redis-validation.js

echo
echo "Done."
read -p "Press Enter to continue..."