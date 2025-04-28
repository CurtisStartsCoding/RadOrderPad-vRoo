#!/bin/bash

echo "===== TESTING FIXED SEND-TO-RADIOLOGY IMPLEMENTATION IN PRODUCTION ====="
echo

node test-fixed-implementation-production.js

echo
echo "===== TEST COMPLETE ====="
read -p "Press Enter to continue..."