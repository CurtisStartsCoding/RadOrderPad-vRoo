#!/bin/bash

# Script to verify medical reference data import
# Usage: ./verify_import.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad Medical Data Import Verification Tool ==="
echo "This script will verify the medical reference data in the radorder_main database."
echo ""

# Get database connection details from environment variables
# If MAIN_DATABASE_URL is set, use it; otherwise use individual PG* variables
if [ -n "$MAIN_DATABASE_URL" ]; then
    # Extract connection details from DATABASE_URL
    # Format: postgres://username:password@hostname:port/database
    DB_USER=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\/\/([^:]+):.+$/\1/')
    DB_PASS=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\/\/[^:]+:([^@]+).+$/\1/')
    DB_HOST=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\/\/[^@]+@([^:]+):.+$/\1/')
    DB_PORT=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:([0-9]+)\/.+$/\1/')
    DB_NAME=$(echo $MAIN_DATABASE_URL | sed -E 's/^postgres:\/\/[^:]+:[^@]+@[^:]+:[0-9]+\/(.+)$/\1/')
else
    # Use individual environment variables
    DB_USER=${PGUSER:-postgres}
    DB_PASS=${PGPASSWORD:-postgres}
    DB_HOST=${PGHOST:-localhost}
    DB_PORT=${PGPORT:-5432}
    DB_NAME=${PGDATABASE:-radorder_main}
fi

# Confirm database name is radorder_main
if [ "$DB_NAME" != "radorder_main" ]; then
    echo "ERROR: This script is intended for the radorder_main database only."
    echo "Current database name: $DB_NAME"
    echo "Please set the correct database name and try again."
    exit 1
fi

# SQL file path
SQL_FILE="verify_import.sql"

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "ERROR: SQL file not found: $SQL_FILE"
    exit 1
fi

echo "Verifying medical reference data in radorder_main database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Execute the SQL file
export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"
RESULT=$?
unset PGPASSWORD

# Check if the verification was successful
if [ $RESULT -eq 0 ]; then
    echo ""
    echo "Verification completed successfully!"
else
    echo ""
    echo "ERROR: Verification failed with exit code $RESULT"
    exit $RESULT
fi

echo ""
echo "Medical reference data verification process completed."