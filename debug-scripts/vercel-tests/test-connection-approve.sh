#!/bin/bash
echo "Testing connection approval endpoint..."
cd debug-scripts/vercel-tests
node test-connection-approve.js
exit_code=$?
cd ../..
if [ $exit_code -ne 0 ]; then
  echo "Connection approval test failed with error code $exit_code"
  exit $exit_code
fi
echo "Connection approval test completed successfully"