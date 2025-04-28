#!/bin/bash
echo "Testing connection rejection endpoint..."
cd debug-scripts/vercel-tests
node test-connection-reject.js
exit_code=$?
cd ../..
if [ $exit_code -ne 0 ]; then
  echo "Connection rejection test failed with error code $exit_code"
  exit $exit_code
fi
echo "Connection rejection test completed successfully"