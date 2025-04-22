#!/bin/bash

echo "=== Setting Up Billing Tables ==="
echo

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "Building TypeScript files..."
  npm run build
fi

# Run the setup script
node scripts/billing/setup-billing-tables.js

echo
echo "=== Setup Complete ==="