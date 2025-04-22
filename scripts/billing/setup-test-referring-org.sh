#!/bin/bash

echo "=== Setting Up Test Referring Organization ==="
echo

# Check if the dist directory exists
if [ ! -d "dist" ]; then
  echo "Building TypeScript files..."
  npm run build
fi

# Run the setup script
node scripts/billing/setup-test-referring-org.js "$@"

echo
echo "=== Setup Complete ==="