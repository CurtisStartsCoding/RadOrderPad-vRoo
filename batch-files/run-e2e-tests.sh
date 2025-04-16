#!/bin/bash

echo "Running RadOrderPad End-to-End Tests"
echo "===================================="

# Create test results directory if it doesn't exist
mkdir -p test-results/e2e

# Run the tests
echo "Starting tests at $(date)"
export NODE_PATH="$(pwd)/node_modules"
node tests/e2e/run-all-e2e-tests.js

# Check the result
if [ $? -eq 0 ]; then
  echo ""
  echo "All tests completed successfully!"
else
  echo ""
  echo "Some tests failed. Check the logs for details."
  exit 1
fi

echo "Tests completed at $(date)"
echo "Results available in test-results/e2e/"