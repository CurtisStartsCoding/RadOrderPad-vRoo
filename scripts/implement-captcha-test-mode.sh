#!/bin/bash

echo "===== Implementing CAPTCHA Test Mode ====="

# Change to the script directory
cd "$(dirname "$0")"

# Run the implementation script
node implement-captcha-test-mode.js

echo ""
echo "===== Implementation Complete ====="
echo "Don't forget to rebuild and redeploy the application for the changes to take effect."
echo "You can use the following commands:"
echo "npm run build"
echo "./push-vercel.sh"