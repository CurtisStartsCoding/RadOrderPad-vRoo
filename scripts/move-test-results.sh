#!/bin/bash

echo "Moving test results files to API_IMPLEMENTATION_GUIDE directory..."

# Create the test-results directory if it doesn't exist
if [ ! -d "frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results" ]; then
    mkdir -p "frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results"
    echo "Created directory: frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results"
fi

# Copy the test results files with new names
cp "debug-scripts/vercel-tests/missing-endpoints/TEST_RESULTS.md" "frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results/initial-endpoints-test-results.md"
cp "debug-scripts/vercel-tests/missing-endpoints/ADDITIONAL_TEST_RESULTS.md" "frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results/additional-endpoints-test-results.md"
cp "debug-scripts/vercel-tests/missing-endpoints/ADMIN_ENDPOINTS_TEST_RESULTS.md" "frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results/admin-endpoints-test-results.md"

echo "Files copied successfully."

# Create an index file for the test results
cat > "frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results/README.md" << 'EOF'
# API Endpoint Test Results

This directory contains the detailed test results for the API endpoints that were previously missing or incomplete.

## Test Results Files

1. [Initial Endpoints Test Results](./initial-endpoints-test-results.md) - Results from the first round of testing
2. [Additional Endpoints Test Results](./additional-endpoints-test-results.md) - Results from more comprehensive testing with multiple IDs
3. [Admin Endpoints Test Results](./admin-endpoints-test-results.md) - Detailed results for admin order endpoints

## Summary

For a summary of all test results, see the [Missing Endpoints Status Report](../missing-endpoints-status.md).
EOF

echo "Created index file: frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results/README.md"

echo ""
echo "All files have been moved and organized successfully."
echo "The test results are now available in the frontend-explanation/API_IMPLEMENTATION_GUIDE/test-results directory."