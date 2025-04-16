#!/bin/bash

# Script to import medical reference data into the radorder_main database
# Usage: ./import_medical_data.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad Medical Data Import Tool ==="
echo "This script will import medical reference data into the radorder_main database ONLY."
echo "WARNING: This script should NOT be used for the radorder_phi database."
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
SQL_FILE="Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql"

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "ERROR: SQL file not found: $SQL_FILE"
    exit 1
fi

echo "Importing medical reference data into radorder_main database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo "SQL File: $SQL_FILE"
echo ""

# Execute the SQL file
export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"
RESULT=$?
unset PGPASSWORD

# Check if the import was successful
if [ $RESULT -eq 0 ]; then
    echo ""
    echo "Import completed successfully!"
    
    # Count the number of rows in each table
    echo "Verifying imported data..."
    echo "Counting rows in medical tables..."
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
    SELECT 'medical_cpt_codes' as table_name, COUNT(*) as row_count FROM medical_cpt_codes
    UNION ALL
    SELECT 'medical_icd10_codes', COUNT(*) FROM medical_icd10_codes
    UNION ALL
    SELECT 'medical_cpt_icd10_mappings', COUNT(*) FROM medical_cpt_icd10_mappings
    UNION ALL
    SELECT 'medical_icd10_markdown_docs', COUNT(*) FROM medical_icd10_markdown_docs
    ORDER BY table_name;
    "
    
    echo ""
    echo "Import verification complete."
else
    echo ""
    echo "ERROR: Import failed with exit code $RESULT"
    exit $RESULT
fi

echo ""
echo "Medical reference data import process completed."