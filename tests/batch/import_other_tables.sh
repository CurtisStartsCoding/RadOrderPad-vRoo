#!/bin/bash

# Script to import medical tables (except ICD-10 codes)
# Usage: ./import_other_tables.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad Medical Tables Import Tool ==="
echo "This script will import CPT codes, mappings, and markdown docs into the radorder_main database."
echo "NOTE: This script does NOT import ICD-10 codes. Use import_icd10_batched.sh for that."
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

echo "Importing medical tables into radorder_main database..."
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "User: $DB_USER"
echo ""

# Import CPT codes first
echo "Importing CPT codes..."
export PGPASSWORD="$DB_PASS"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/tables/cpt_codes.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import CPT codes"
    exit 1
fi
echo "CPT codes imported successfully"

# Import markdown docs (depends on ICD-10 codes being already imported)
echo "Importing ICD-10 markdown docs..."
echo "NOTE: This will only work if ICD-10 codes have already been imported"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/tables/icd10_markdown_docs.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import ICD-10 markdown docs"
    echo "Make sure ICD-10 codes have been imported first using import_icd10_batched.sh"
    exit 1
fi
echo "ICD-10 markdown docs imported successfully"

# Import mappings (depends on both CPT and ICD-10 codes)
echo "Importing CPT-ICD10 mappings..."
echo "NOTE: This will only work if both CPT and ICD-10 codes have already been imported"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "Data/tables/cpt_icd10_mappings.sql"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import CPT-ICD10 mappings"
    echo "Make sure both CPT and ICD-10 codes have been imported first"
    exit 1
fi
echo "CPT-ICD10 mappings imported successfully"

unset PGPASSWORD

echo ""
echo "All medical tables (except ICD-10 codes) imported successfully!"
