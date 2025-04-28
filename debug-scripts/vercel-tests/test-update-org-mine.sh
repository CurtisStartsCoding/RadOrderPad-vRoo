#!/bin/bash
echo "Running test-update-org-mine.js..."
cd "$(dirname "$0")"
node test-update-org-mine.js
echo "Test completed."
read -p "Press Enter to continue..."