#!/bin/bash
# Master test script to run all tests

echo "Running all tests..."
echo

# Run Redis search with fallback test
echo "=== Running Redis Search with Fallback Test ==="
./run-redis-search-with-fallback-test-fixed-cjs.sh
echo

# Run Radiology Export test
echo "=== Running Radiology Export Test ==="
./test-radiology-export.sh
echo

echo "All tests completed."