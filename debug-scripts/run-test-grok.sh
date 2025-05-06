#!/bin/bash

echo "Testing Grok API Connection..."

# Install required packages if not already installed
echo "Checking for required npm packages..."
npm list axios || npm install axios
npm list dotenv || npm install dotenv

# Run the test script
echo "Running Grok API test..."
node debug-scripts/test-grok.js

echo "Test completed."