#!/bin/bash
echo "Running RadOrderPad Registration and Onboarding Tests"
echo "===================================================="

# Create test results directory if it doesn't exist
mkdir -p test-results/e2e

# Generate test tokens first
echo "Generating test tokens..."
node generate-test-token.js > test-results/e2e/test-tokens.txt
echo "Test tokens generated and saved to test-results/e2e/test-tokens.txt"

# Set the JWT_TOKEN environment variable
JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET || 'your_jwt_secret_key_here');")
export JWT_SECRET

# Run the tests
echo "Starting tests at $(date)"
export NODE_PATH="$PWD/node_modules"
node tests/e2e/run-registration-onboarding-tests.js

# Check the result
if [ $? -eq 0 ]; then
  echo
  echo "All registration and onboarding tests completed successfully!"
else
  echo
  echo "Some tests failed. Check the logs for details."
  exit 1
fi

echo "Tests completed at $(date)"
echo "Results available in test-results/e2e/"