#!/bin/bash

echo "=== Testing Stripe Webhook Handlers ==="
echo ""

# Navigate to project root directory
cd "$(dirname "$0")/../.."

# Run the test script
node scripts/stripe/test-webhook-handlers.js

echo ""
echo "=== Test Complete ==="
read -p "Press Enter to continue..."