#!/bin/bash

echo "Updating prompt template with comprehensive validation framework..."

# Set default database connection details
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="radorderpad"
DB_USER="postgres"

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  echo "Loading database configuration from .env file..."
  
  # Extract database configuration from .env file
  if grep -q "DB_HOST=" .env; then
    DB_HOST=$(grep "DB_HOST=" .env | cut -d '=' -f2)
  fi
  
  if grep -q "DB_PORT=" .env; then
    DB_PORT=$(grep "DB_PORT=" .env | cut -d '=' -f2)
  fi
  
  if grep -q "DB_NAME=" .env; then
    DB_NAME=$(grep "DB_NAME=" .env | cut -d '=' -f2)
  fi
  
  if grep -q "DB_USER=" .env; then
    DB_USER=$(grep "DB_USER=" .env | cut -d '=' -f2)
  fi
  
  if grep -q "DB_PASSWORD=" .env; then
    export PGPASSWORD=$(grep "DB_PASSWORD=" .env | cut -d '=' -f2)
  fi
fi

# Display connection info (without password)
echo "Using database connection:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Execute the SQL script
echo "Executing SQL script..."
psql -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -U "$DB_USER" -f update_comprehensive_prompt.sql

# Check if the command was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "Prompt template updated successfully!"
  echo ""
  echo "To verify the update, check the last few rows of the prompt_templates table."
else
  echo ""
  echo "Failed to update prompt template. Please check the error message above."
fi

echo ""
read -p "Press Enter to continue..."