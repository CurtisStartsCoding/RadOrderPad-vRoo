#!/bin/bash

echo "Running Redis Optimization Test Suite..."
echo "This will test Redis implementation with multiple LLMs and test cases"

# Set environment variables from .env.production
if [ -f .env.production ]; then
  export $(grep -v '^#' .env.production | xargs)
fi

# Create a timestamp for the results
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")

# Create a directory for the results
mkdir -p "redis-test-results/$timestamp"

# Run the test suite
echo "Running tests with Node.js..."
node debug-scripts/aws-tests/redis-optimization-test-suite.js

echo "Test suite completed. Results saved to redis-test-results directory."
echo "Check summary_report.json for analysis."