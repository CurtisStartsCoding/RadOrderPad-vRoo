#!/bin/bash

echo "Running Comprehensive Workflow Tests"
echo "==================================="

# Create test-results directory if it doesn't exist
mkdir -p test-results

# Check if a specific test number was provided
if [ -z "$1" ]; then
  echo "Running all tests..."
  node tests/e2e/run_comprehensive_tests.js
else
  echo "Running test $1..."
  node tests/e2e/run_comprehensive_tests.js $1
fi

echo ""
echo "Test execution complete."
echo "Results are available in the test-results directory."
echo ""

read -p "Press Enter to continue..."