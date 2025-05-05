#!/bin/bash
echo "Getting full API payload..."
echo

node debug-scripts/aws-tests/get-full-payload.js

echo
echo "Done."
read -p "Press Enter to continue..."