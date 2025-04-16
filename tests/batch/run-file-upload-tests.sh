#!/bin/bash
echo "Running File Upload Tests..."

# Generate JWT token using test-helpers
JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")
echo "Using JWT token: ${JWT_TOKEN:0:20}..."
export JWT_TOKEN

# Run the tests
node test-file-upload.js

# Check for errors
if [ $? -ne 0 ]; then
    echo "File Upload Tests failed with error code $?"
    exit 1
fi

echo "File Upload Tests completed successfully."
exit 0