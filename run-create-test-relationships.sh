#!/bin/bash

echo "===== Creating Test Relationships ====="

# Set environment variables
export NODE_ENV=production

# Run the script
node -r dotenv/config create-test-relationships.js

echo ""
echo "===== Test Relationships Created ====="
read -p "Press Enter to continue..."