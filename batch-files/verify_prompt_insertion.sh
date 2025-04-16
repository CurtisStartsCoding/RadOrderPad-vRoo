#!/bin/bash
# verify_prompt_insertion.sh
# Script to verify the successful insertion of the default prompt template
# Date: 2025-04-13

# Set variables
DATABASE="radorder_main"
VERIFY_SQL="verify_prompt_insertion.sql"

# Display script information
echo "==================================================="
echo "RadOrderPad Default Prompt Template Verification"
echo "==================================================="
echo "Database: $DATABASE"
echo "SQL File: $VERIFY_SQL"
echo "==================================================="

# Check if the SQL file exists
if [ ! -f "$VERIFY_SQL" ]; then
    echo "Error: Verification SQL file not found: $VERIFY_SQL"
    exit 1
fi

# Run the verification script
echo "Running verification queries..."
psql -d "$DATABASE" -f "$VERIFY_SQL"

# Check if the verification was successful
if [ $? -eq 0 ]; then
    echo "==================================================="
    echo "Verification completed successfully!"
    echo "==================================================="
else
    echo "==================================================="
    echo "Error: Verification failed!"
    echo "==================================================="
    exit 1
fi

exit 0