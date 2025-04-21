#!/bin/bash

echo "Running RadOrderPad Production End-to-End Tests"
echo "============================================="
echo ""

node tests/e2e/run-production-tests.js

if [ $? -eq 0 ]; then
  echo ""
  echo "Tests completed successfully!"
else
  echo ""
  echo "Tests failed with error code $?"
fi

echo ""
echo "Test logs are available in test-results/e2e-production/"
echo ""

read -p "Press Enter to continue..."