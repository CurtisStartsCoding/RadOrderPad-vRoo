#!/bin/bash

echo "Moving debugging scripts to frontend-explanation/debug-scripts directory..."

# Create the directory if it doesn't exist
mkdir -p "frontend-explanation/debug-scripts"

# Move admin-related test scripts
echo "Moving admin-related test scripts..."
[ -f "test-send-to-radiology-precision.js" ] && cp "test-send-to-radiology-precision.js" "frontend-explanation/debug-scripts/" && echo "Moved test-send-to-radiology-precision.js"
[ -f "test-send-to-radiology.js" ] && cp "test-send-to-radiology.js" "frontend-explanation/debug-scripts/" && echo "Moved test-send-to-radiology.js"
[ -f "test-admin-endpoint.js" ] && cp "test-admin-endpoint.js" "frontend-explanation/debug-scripts/" && echo "Moved test-admin-endpoint.js"
[ -f "query-admin-staff-users.js" ] && cp "query-admin-staff-users.js" "frontend-explanation/debug-scripts/" && echo "Moved query-admin-staff-users.js"

# Move database connection test scripts
echo "Moving database connection test scripts..."
[ -f "test-db-connection.js" ] && cp "test-db-connection.js" "frontend-explanation/debug-scripts/" && echo "Moved test-db-connection.js"
[ -f "test-db-connection-ssl.js" ] && cp "test-db-connection-ssl.js" "frontend-explanation/debug-scripts/" && echo "Moved test-db-connection-ssl.js"
[ -f "test-db-connection-ssl.bat" ] && cp "test-db-connection-ssl.bat" "frontend-explanation/debug-scripts/" && echo "Moved test-db-connection-ssl.bat"
[ -f "test-new-db-connection.js" ] && cp "test-new-db-connection.js" "frontend-explanation/debug-scripts/" && echo "Moved test-new-db-connection.js"
[ -f "test-db-data.js" ] && cp "test-db-data.js" "frontend-explanation/debug-scripts/" && echo "Moved test-db-data.js"

# Move comprehensive API test scripts
echo "Moving comprehensive API test scripts..."
[ -f "comprehensive-api-test.js" ] && cp "comprehensive-api-test.js" "frontend-explanation/debug-scripts/" && echo "Moved comprehensive-api-test.js"
[ -f "test-api.js" ] && cp "test-api.js" "frontend-explanation/debug-scripts/" && echo "Moved test-api.js"
[ -f "test-api-with-auth.js" ] && cp "test-api-with-auth.js" "frontend-explanation/debug-scripts/" && echo "Moved test-api-with-auth.js"

echo "All debugging scripts have been moved to frontend-explanation/debug-scripts directory."
echo "Note: Original files remain in the root directory. Delete them manually if needed."
read -p "Press Enter to continue..."