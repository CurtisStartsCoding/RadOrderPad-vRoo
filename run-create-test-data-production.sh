#!/bin/bash
echo "===== Creating Test Data in PRODUCTION ====="
node create-test-data-production.js
echo "===== Test Data Creation Complete ====="
read -p "Press any key to continue..."