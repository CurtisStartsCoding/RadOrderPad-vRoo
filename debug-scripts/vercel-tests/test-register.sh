#!/bin/bash

echo "===== Testing Modified Registration Endpoint ====="

# Set environment variables
export NODE_ENV=production

# Run the test script
node -r dotenv/config test-register.js dotenv_config_path=.env.production

echo ""
echo "===== Test Complete ====="