#!/bin/bash
echo "Running Admin Send-to-Radiology Tests..."

# Generate JWT token for admin user
echo "Generating JWT token for admin user..."
JWT_TOKEN=$(node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);")
echo "Token generated: ${JWT_TOKEN:0:20}..."

# Get API base URL from config
API_BASE_URL=$(node -e "const config = require('./test-config'); console.log(config.api.baseUrl);")
echo "Using API base URL: $API_BASE_URL"

# Run the test script
node test-admin-send-to-radiology.js "$JWT_TOKEN"

# Check if the test was successful
if [ $? -eq 0 ]; then
  echo "Tests completed successfully."
  exit 0
else
  echo "Tests failed with exit code $?."
  exit 1
fi