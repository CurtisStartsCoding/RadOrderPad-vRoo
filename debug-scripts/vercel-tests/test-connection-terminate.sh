#!/bin/bash
echo "Testing connection termination endpoint..."
cd "$(dirname "$0")"
node test-connection-terminate.js
if [ $? -ne 0 ]; then
  echo "Test failed with error code $?"
  exit $?
fi
echo "Test completed successfully"