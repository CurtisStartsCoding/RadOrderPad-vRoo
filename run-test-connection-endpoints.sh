#!/bin/bash

echo "===== Testing Connection Endpoints ====="

# Set environment variables
export NODE_ENV=production

# Run the script
node -r dotenv/config test-connection-endpoints.js

echo ""
echo "===== Connection Endpoint Testing Complete ====="
read -p "Press Enter to continue..."