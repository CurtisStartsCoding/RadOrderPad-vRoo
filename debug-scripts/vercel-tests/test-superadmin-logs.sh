#!/bin/bash
# Test script for Super Admin log viewing endpoints
# Usage: ./test-superadmin-logs.sh [endpoint]
# Where [endpoint] is one of: validation, validation-enhanced, credits, purgatory, all

echo "Testing Super Admin log viewing endpoints..."

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Run the test script
node test-superadmin-logs.js $1

if [ $? -ne 0 ]; then
  echo "Test failed with error code $?"
  exit 1
fi

echo "Test completed successfully!"