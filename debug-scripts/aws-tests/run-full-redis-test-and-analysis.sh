#!/bin/bash

echo "Running Full Redis Test Suite and Analysis..."

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

# Run the analysis
echo "Analyzing test results..."
node debug-scripts/aws-tests/analyze-redis-test-results.js

echo "Full test and analysis completed."
echo "Check redis-test-results/detailed_analysis.json for the full report."