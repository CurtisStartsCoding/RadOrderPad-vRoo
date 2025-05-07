#!/bin/bash

echo "Database Connection Test Tool"
echo "============================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed or not in PATH"
  exit 1
fi

# Install required dependencies if not already installed
echo "Checking dependencies..."
npm list commander --silent &> /dev/null || npm install commander --save
npm list pg --silent &> /dev/null || npm install pg --save

# Get connection parameters
read -p "Enter database connection URL to test (postgresql://user:password@host:port/dbname): " DB_URL

echo
echo "Testing connection to database..."
echo

node db-migrations/test-connection.js --db="$DB_URL"

if [ $? -ne 0 ]; then
  echo
  echo "Connection test failed."
  exit 1
else
  echo
  echo "Connection test completed."
fi

read -p "Press Enter to continue..."