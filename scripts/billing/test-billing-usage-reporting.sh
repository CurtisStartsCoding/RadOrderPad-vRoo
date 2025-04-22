#!/bin/bash

echo "=== Testing Radiology Order Usage Reporting ==="
echo

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "Building TypeScript files..."
  npm run build
fi

# Run the test script
node scripts/billing/test-billing-usage-reporting.js "$@"

echo
echo "=== Test Complete ==="