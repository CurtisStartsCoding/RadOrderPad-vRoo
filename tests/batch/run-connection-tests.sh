#!/bin/bash
echo "Setting up test data for connection management tests..."

# Use the same database connection as the running application
echo "Using the same database connection as the running application..."

# Run the setup SQL script using the connection string directly
echo "Running setup-test-data.sql..."
DB_CONN=$(node -e "const helpers = require('./test-helpers'); console.log('postgres://' + helpers.config.database.user + ':' + helpers.config.database.password + '@localhost:' + helpers.config.database.port + '/' + helpers.config.database.mainDb);")
psql "$DB_CONN" -f setup-test-data.sql

# Run the connection management tests
echo ""
echo "Running connection management tests..."
bash test-connection-management.bat
EXIT_CODE=$?

# Update the test audit log
if [ $EXIT_CODE -eq 0 ]; then
    echo "Updating test audit log with PASS status..."
    bash ./update-test-audit-log.sh "Connection Management Tests" "PASS" "All tests passing after connection service refactoring"
else
    echo "Updating test audit log with FAIL status..."
    bash ./update-test-audit-log.sh "Connection Management Tests" "FAIL" "Tests failed - check logs for details"
fi

echo ""
echo "All done!"

# Return the exit code from test-connection-management.bat
exit $EXIT_CODE