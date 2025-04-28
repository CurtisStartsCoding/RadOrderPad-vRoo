#!/bin/bash
echo "===== Testing Admin Orders Queue Endpoint ====="

# Set environment variables
export NODE_ENV=production

# Change to the script directory
cd "$(dirname "$0")"

# Run the test script
node -r dotenv/config test-admin-order-queue.js dotenv_config_path=.env.production

echo ""
echo "===== Test Complete ====="