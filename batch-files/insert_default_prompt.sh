#!/bin/bash
# insert_default_prompt.sh
# Script to insert the default validation prompt template into the prompt_templates table
# Date: 2025-04-13

# Set variables
DATABASE="radorder_main"
SQL_FILE="insert_default_prompt.sql"

# Display script information
echo "==================================================="
echo "RadOrderPad Default Prompt Template Insertion"
echo "==================================================="
echo "Database: $DATABASE"
echo "SQL File: $SQL_FILE"
echo "==================================================="

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file not found: $SQL_FILE"
    exit 1
fi

# Execute the SQL statement
echo "Inserting default prompt template into $DATABASE database..."
psql -d "$DATABASE" -f "$SQL_FILE"

# Check if the execution was successful
if [ $? -eq 0 ]; then
    echo "==================================================="
    echo "Default prompt template inserted successfully!"
    echo "==================================================="
    echo "You can verify the insertion with the following SQL command:"
    echo "psql -d $DATABASE -c \"SELECT id, name, type, version, word_limit, active FROM prompt_templates;\""
    echo "==================================================="
else
    echo "==================================================="
    echo "Error: Insertion failed!"
    echo "==================================================="
    exit 1
fi

exit 0