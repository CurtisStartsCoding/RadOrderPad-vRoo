#!/bin/bash
echo "Directly querying relationships in the production database with hardcoded credentials..."
node scripts/query-relationships-hardcoded.js
read -p "Press enter to continue"