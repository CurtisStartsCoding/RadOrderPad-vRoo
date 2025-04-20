#!/bin/bash
echo "Running All Tests..."

# Run individual test scripts
./run-redis-basic-test.sh
./run-redis-search-test.sh
./test-superadmin-prompts.sh
./test-superadmin-prompt-assignments.sh
./test-superadmin-logs.sh
./test-notifications.sh
./test-ses-email.sh

echo "All tests completed."