#!/bin/bash
echo "===== Testing Redis Bulk Lookup ====="
echo

echo "Using Redis Cloud configuration from .env.production:"
echo "Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com"
echo "Port: 11584"
echo

echo "Running test..."
node debug-scripts/redis-optimization/test-bulk-lookup.cjs

echo
echo "===== Redis Bulk Lookup Test Complete ====="