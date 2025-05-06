#!/bin/bash

echo "Analyzing Redis Test Results..."

# Run the analysis script
node debug-scripts/aws-tests/analyze-redis-test-results.js

echo "Analysis complete. Check redis-test-results/detailed_analysis.json for full report."