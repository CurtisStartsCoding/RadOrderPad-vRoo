#!/bin/bash

echo "===== Running Stripe Webhook Tests ====="
echo

# Ensure the dist directory is up to date
npx tsc

# Run the test script
node tests/batch/test-stripe-webhooks.js > test-results/stripe-webhook-tests.log 2>&1

# Check the exit code
if [ $? -eq 0 ]; then
    echo "[PASS] Stripe Webhook Tests"
    echo "Updated test audit log for 'Stripe Webhook Tests' with status 'PASS' and date '$(date)'." >> test-results/test-audit.log
else
    echo "[FAIL] Stripe Webhook Tests - Check test-results/stripe-webhook-tests.log for details"
    echo "Updated test audit log for 'Stripe Webhook Tests' with status 'FAIL' and date '$(date)'." >> test-results/test-audit.log
fi

echo