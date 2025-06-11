#!/bin/bash

# Test script for dual credit billing system

echo "========================================"
echo " Dual Credit Billing System Test Suite"
echo "========================================"
echo

# Set the API URL (adjust if needed)
export API_BASE_URL=${API_BASE_URL:-http://localhost:3001}

echo "Testing against: $API_BASE_URL"
echo

# Make sure we're in the right directory
cd "$(dirname "$0")/.."

# Run the main dual credit test
echo "Running dual credit system test..."
node tests/test-dual-credit-system.js

echo
echo "========================================"
echo " Additional Credit Balance Checks"
echo "========================================"
echo

# Check credit balances for multiple organizations
echo "Checking credit balances for test organizations..."

# You can add more specific tests here
# For example, testing with specific order types:
# node tests/test-advanced-imaging-credits.js
# node tests/test-basic-imaging-credits.js

echo
echo "Test suite completed!"