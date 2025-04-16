#!/bin/bash

echo "Running Billing Subscriptions API Tests..."
node test-billing-subscriptions.js

if [ $? -ne 0 ]; then
  echo "Tests FAILED with exit code $?"
  exit 1
else
  echo "All tests PASSED"
  exit 0
fi