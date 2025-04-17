#!/bin/bash

# Master script to import all medical reference data
# Usage: ./import_all_medical_data.sh

# Set error handling
set -e
trap 'echo "Error occurred at line $LINENO. Command: $BASH_COMMAND"' ERR

echo "=== RadOrderPad Medical Data Import Master Script ==="
echo "This script will import all medical reference data into the radorder_main database."
echo "WARNING: This script should ONLY be used for the radorder_main database."
echo ""

# Confirm with the user
read -p "This will import all medical reference data. Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Import cancelled."
    exit 0
fi

# Step 1: Import ICD-10 codes (this is the largest dataset)
echo ""
echo "Step 1: Importing ICD-10 codes (this may take a while)..."
./import_icd10_batched.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import ICD-10 codes"
    exit 1
fi

# Step 2: Import other tables (CPT codes, mappings, markdown docs)
echo ""
echo "Step 2: Importing other tables (CPT codes, mappings, markdown docs)..."
./import_other_tables.sh
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to import other tables"
    exit 1
fi

echo ""
echo "All medical reference data has been successfully imported into the radorder_main database!"
echo "You can verify the import using the verify_import.sh script."
