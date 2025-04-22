#!/bin/bash

echo "=== Testing Stripe Webhooks ==="
echo

# Run the test script
node scripts/billing/test-stripe-webhooks.js "$@"

echo
echo "=== Test Complete ==="