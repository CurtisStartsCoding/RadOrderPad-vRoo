#!/bin/bash
echo "===== Testing Redis Population on Server Startup ====="
echo
echo "This script will:"
echo "1. Clear Redis keys related to medical codes"
echo "2. Call the populateRedisFromPostgres function"
echo "3. Verify that Redis was populated correctly"
echo
echo "Running test-redis-population.js..."
node debug-scripts/redis-optimization/test-redis-population.js
echo
echo "Script completed."