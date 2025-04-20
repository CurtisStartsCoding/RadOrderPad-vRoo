#!/bin/bash

echo "Testing Notification Service..."

# Compile TypeScript files
echo "Compiling TypeScript files..."
npx tsc

# Run the test
echo "Running test..."
node tests/test-notifications.js