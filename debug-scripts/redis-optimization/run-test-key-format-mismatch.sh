#!/bin/bash
echo "===== Testing Redis Key Format Mismatch ====="
echo
echo "This script will:"
echo "1. Connect to Redis"
echo "2. Store test data with different key formats"
echo "3. Attempt to retrieve the data using different key formats"
echo "4. Test the behavior of service-like functions"
echo "5. Clean up the test data"
echo
echo "This test will verify if the key format mismatch is causing cache misses."
echo
echo "Running test-key-format-mismatch.js..."
node debug-scripts/redis-optimization/test-key-format-mismatch.js
echo
echo "Script completed."