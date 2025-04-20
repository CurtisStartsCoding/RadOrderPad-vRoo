#!/bin/bash

echo "Testing Redis Cloud Connection..."

# Compile TypeScript files
echo "Compiling TypeScript files..."
npx tsc

# Run the test script
echo "Running test..."
node scripts/test-redis-connection.js