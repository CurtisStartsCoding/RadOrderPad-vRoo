#!/bin/bash
echo "Running SQL script using Node.js..."

# Check if script path is provided
if [ -z "$1" ]; then
  echo "Error: No SQL script path provided"
  echo "Usage: ./run-sql-script.sh path/to/sql-script.sql"
  exit 1
fi

# Execute the SQL script using Node.js
node scripts/execute-sql-script.js "$1"

if [ $? -ne 0 ]; then
  echo "Failed to execute SQL script"
  exit 1
fi

echo "SQL script executed successfully"

# Make the script executable
chmod +x run-sql-script.sh