#!/bin/bash
echo "Setting a relationship to pending status for testing..."
node scripts/set-relationship-pending.js
if [ $? -ne 0 ]; then
  echo "Failed to set relationship to pending status"
  exit 1
fi
echo "Relationship set to pending status successfully"