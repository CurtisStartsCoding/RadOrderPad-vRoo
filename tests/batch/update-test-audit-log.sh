#!/bin/bash
# Update Test Audit Log
# This script updates the Test Audit Log section in the README.md file with the current date and status
# Usage: ./update-test-audit-log.sh "Connection Management Tests" "PASS" "All tests passing after connection service refactoring"

# Check if required parameters are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <TestName> <Status> [Notes]"
    echo "  TestName: The name of the test (e.g., 'Connection Management Tests')"
    echo "  Status: PASS or FAIL"
    echo "  Notes: Optional notes about the test execution"
    exit 1
fi

# Get parameters
TEST_NAME="$1"
STATUS="$2"
NOTES="${3:-}"  # Default to empty string if not provided

# Validate status
if [ "$STATUS" != "PASS" ] && [ "$STATUS" != "FAIL" ]; then
    echo "Error: Status must be either PASS or FAIL"
    exit 1
fi

# Get the current date and time
CURRENT_DATE=$(date "+%B %-d, %Y %-I:%M %p")

# Path to the README.md file
README_PATH="$(dirname "$0")/README.md"

# Create the new table row
NEW_ROW="| **$TEST_NAME** | $CURRENT_DATE | $STATUS | $NOTES |"

# Check if the test already exists in the table and update it
if grep -q "\| \*\*$TEST_NAME\*\* \|" "$README_PATH"; then
    # Use sed to replace the existing row
    # Note: macOS and Linux have different sed syntax
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/| \*\*$TEST_NAME\*\* |.*|.*|.*|/$NEW_ROW/" "$README_PATH"
    else
        # Linux
        sed -i "s/| \*\*$TEST_NAME\*\* |.*|.*|.*|/$NEW_ROW/" "$README_PATH"
    fi
else
    # Find the table header and append the new row after the last row
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "/| Test Name | Last Run Date | Status | Notes |/,/|---/!b;:a;n;/^$/!ba;i\\
$NEW_ROW" "$README_PATH"
    else
        # Linux
        sed -i "/| Test Name | Last Run Date | Status | Notes |/,/|---/!b;:a;n;/^$/!ba;i\\
$NEW_ROW" "$README_PATH"
    fi
fi

echo "Updated test audit log for '$TEST_NAME' with status '$STATUS' and date '$CURRENT_DATE'."