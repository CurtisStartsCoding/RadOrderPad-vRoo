#!/bin/bash

echo "AWS PostgreSQL Database Migration Tool"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is not installed or not in PATH"
  exit 1
fi

# Install required dependencies if not already installed
echo "Checking dependencies..."
npm list commander --silent &> /dev/null || npm install commander --save
npm list pg --silent &> /dev/null || npm install pg --save
npm list winston --silent &> /dev/null || npm install winston --save
npm list dotenv --silent &> /dev/null || npm install dotenv --save

echo
echo "Select connection method:"
echo "1. Enter database connection URLs manually"
echo "2. Use connection details from .env file"
read -p "Enter your choice (1-2): " CONNECTION_METHOD

if [ "$CONNECTION_METHOD" = "2" ]; then
  echo
  echo "Using connection details from .env file..."
  
  echo
  echo "Select migration type:"
  echo "1. Full migration (schema and data)"
  echo "2. Schema only"
  echo "3. Data only"
  read -p "Enter your choice (1-3): " MIGRATION_TYPE

  ADDITIONAL_ARGS="--use-env"
  if [ "$MIGRATION_TYPE" = "2" ]; then
    ADDITIONAL_ARGS="--use-env --schema-only"
  elif [ "$MIGRATION_TYPE" = "3" ]; then
    ADDITIONAL_ARGS="--use-env --data-only"
  fi

  echo
  echo "Starting migration..."
  echo "A log file will be created at db-migrations/migration.log"
  echo

  node db-migrations/aws-postgres-migration.js $ADDITIONAL_ARGS
else
  # Get connection parameters
  read -p "Enter source main database URL (postgresql://user:password@host:port/dbname): " SOURCE_MAIN
  read -p "Enter source PHI database URL (postgresql://user:password@host:port/dbname): " SOURCE_PHI
  read -p "Enter AWS main database URL (postgresql://user:password@host:port/dbname): " TARGET_MAIN
  read -p "Enter AWS PHI database URL (postgresql://user:password@host:port/dbname): " TARGET_PHI

  echo
  echo "Select migration type:"
  echo "1. Full migration (schema and data)"
  echo "2. Schema only"
  echo "3. Data only"
  read -p "Enter your choice (1-3): " MIGRATION_TYPE

  ADDITIONAL_ARGS=""
  if [ "$MIGRATION_TYPE" = "2" ]; then
    ADDITIONAL_ARGS="--schema-only"
  elif [ "$MIGRATION_TYPE" = "3" ]; then
    ADDITIONAL_ARGS="--data-only"
  fi

  echo
  echo "Starting migration..."
  echo "A log file will be created at db-migrations/migration.log"
  echo

  node db-migrations/aws-postgres-migration.js --source-main="$SOURCE_MAIN" --source-phi="$SOURCE_PHI" --target-main="$TARGET_MAIN" --target-phi="$TARGET_PHI" $ADDITIONAL_ARGS
fi

if [ $? -ne 0 ]; then
  echo
  echo "Migration failed. Check db-migrations/migration.log for details."
  exit 1
else
  echo
  echo "Migration completed successfully."
fi

read -p "Press Enter to continue..."