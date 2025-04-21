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

# Run HIPAA Compliance Export test
echo "=== Running HIPAA Compliance Export Test ==="
./test-hipaa-export.sh
echo

# Run Stripe Webhook CLI test
echo "=== Running Stripe Webhook CLI Test ==="
./test-stripe-webhooks-cli.sh
echo

# Run Stripe Webhook Unit Tests
echo "=== Running Stripe Webhook Unit Tests ==="
./test-stripe-webhook-unit.sh
echo

# Run Super Admin API test
echo "=== Running Super Admin API Test ==="
./test-superadmin-api.sh
echo

echo "All tests completed."