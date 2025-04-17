#!/bin/bash

# Script to import ICD-10 codes in batches
# Usage: ./import_icd10_batched.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad ICD-10 Batched Import Tool ==="
echo "This script will import ICD-10 codes into the radorder_main database in batches."
echo ""

# Get database connection details from environment variables
if [ -n "$MAIN_DATABASE_URL" ]; then
    # Extract connection details from DATABASE_URL
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

echo "Importing ICD-10 codes into radorder_main database in batches..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo "Total batches: 94"
echo ""

# First create the table
echo "Creating table structure..."
export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/batches/00_create_table.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create table structure"
    exit 1
fi

# Import each batch
for i in $(seq 1 94); do
    BATCH_FILE="Data/batches/$(printf "%02d" $i)_batch.sql"
    echo "Importing batch $i of 94..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$BATCH_FILE"
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to import batch $i"
        exit 1
    fi
    echo "Batch $i imported successfully"
done

unset PGPASSWORD

echo ""
echo "ICD-10 code import completed successfully!"
echo "Imported 94 batches"
