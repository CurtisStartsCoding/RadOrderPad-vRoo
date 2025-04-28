#!/bin/bash

echo "===== Testing Registration (CAPTCHA Bypass) ====="

# Set environment variables
export NODE_ENV=development
export TEST_MODE=true
export RECAPTCHA_SECRET_KEY=6LcmOSIrAAAAAI-xb8wB5mLBGWTlvweZ48o9jeWtv

echo "Environment variables set:"
echo "RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET_KEY"
echo "NODE_ENV=$NODE_ENV"
echo "TEST_MODE=$TEST_MODE"

# Change to the script directory
cd "$(dirname "$0")"

# Run the test script
node -r dotenv/config test-register-no-captcha.js dotenv_config_path=.env.test

echo ""
echo "===== Test Complete ====="