#!/bin/bash
echo "Testing update user profile endpoint..."
cd "$(dirname "$0")"
node test-update-user-me.js
if [ $? -ne 0 ]; then
  echo "Test failed with error code $?"
  exit $?
fi
echo "Test completed successfully"