#!/bin/bash
# Script to run validation engine tests

# Check if JWT_TOKEN is provided as an argument
if [ -z "$1" ]; then
  echo "Usage: ./run-validation-tests.sh <JWT_TOKEN> [API_BASE_URL]"
  echo "Example: ./run-validation-tests.sh eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  echo "Example with custom API URL: ./run-validation-tests.sh eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... https://api.example.com"
  exit 1
fi
# Set environment variables
export JWT_TOKEN=$1

# Check if API_BASE_URL is provided as a second argument
if [ -n "$2" ]; then
  export API_BASE_URL=$2
else
  # Default to localhost if not provided
  export API_BASE_URL=http://localhost:3000/api
fi


# Check if axios is installed
if ! npm list axios > /dev/null 2>&1; then
  echo "Installing axios..."
  npm install axios
fi

# Run the test script
echo "Running validation engine tests..."
node "$(dirname "$0")/test-validation-engine.js"

# Check if the test was successful
if [ $? -eq 0 ]; then
  echo "Tests completed successfully!"
  echo "See validation-engine-test-results.md for detailed results."
else
  echo "Tests failed. Check the error messages above."
  exit 1
fi