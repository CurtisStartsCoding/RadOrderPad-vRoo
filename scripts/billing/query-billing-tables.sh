#!/bin/bash

echo "=== Querying Billing Tables ==="
echo

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "Building TypeScript files..."
  npm run build
fi

# Run the query script
node scripts/billing/query-billing-tables.js

echo
echo "=== Query Complete ==="