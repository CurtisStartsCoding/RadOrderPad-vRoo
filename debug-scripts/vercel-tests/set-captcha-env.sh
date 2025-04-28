#!/bin/bash

echo "Setting environment variables for CAPTCHA testing..."

# Set the reCAPTCHA secret key (Google's test key that always passes verification)
export RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# Set development mode
export NODE_ENV=development

# Set test mode flag
export TEST_MODE=true

echo "Environment variables set:"
echo "RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET_KEY"
echo "NODE_ENV=$NODE_ENV"
echo "TEST_MODE=$TEST_MODE"

echo ""
echo "You can now run the registration test with:"
echo "./test-register-captcha.sh"
echo ""
echo "Note: These variables are only set for the current terminal session."
echo "To make them permanent, add them to your .bashrc or .profile file."