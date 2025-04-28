#!/bin/bash
echo "===== Testing Admin Paste Summary Endpoint ====="

# Set environment variables
export NODE_ENV=production

# Run the test script
node -r dotenv/config test-admin-paste-summary.js dotenv_config_path=.env.test

echo ""
echo "===== Test Complete ====="