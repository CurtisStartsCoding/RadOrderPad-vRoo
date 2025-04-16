#!/bin/bash
# import_medical_tables.sh
# Script to import medical reference data into the radorder_main database
# Date: 2025-04-13

# Set variables
SQL_EXPORT_FILE="Data/medical_tables_export_2025-04-11T23-40-51-963Z.sql"
DATABASE="radorder_main"

# Display script information
echo "==================================================="
echo "RadOrderPad Medical Tables Import Script"
echo "==================================================="
echo "Database: $DATABASE"
echo "SQL File: $SQL_EXPORT_FILE"
echo "==================================================="

# Check if the SQL file exists
if [ ! -f "$SQL_EXPORT_FILE" ]; then
    echo "Error: SQL export file not found: $SQL_EXPORT_FILE"
    exit 1
fi

# Import the medical tables data
echo "Importing medical tables data into $DATABASE database..."
psql -d "$DATABASE" -f "$SQL_EXPORT_FILE"

# Check if the import was successful
if [ $? -eq 0 ]; then
    echo "==================================================="
    echo "Import completed successfully!"
    echo "==================================================="
    echo "You can verify the import using the verify_import.sql script:"
    echo "psql -d $DATABASE -f verify_import.sql"
    echo "==================================================="
else
    echo "==================================================="
    echo "Error: Import failed!"
    echo "==================================================="
    exit 1
fi

exit 0