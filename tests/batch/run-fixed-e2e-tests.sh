#!/bin/bash
echo "Running RadOrderPad End-to-End Tests with Fixed Helpers"
echo "===================================================="

# Create test results directory if it doesn't exist
mkdir -p test-results/e2e

# Generate test tokens first
echo "Generating test tokens..."
node generate-test-token.js > test-results/e2e/test-tokens.txt
echo "Test tokens generated and saved to test-results/e2e/test-tokens.txt"

# Set the JWT_SECRET environment variable
JWT_SECRET=$(node -e "require('dotenv').config(); console.log(process.env.JWT_SECRET || 'your_jwt_secret_key_here');")
export JWT_SECRET

# Temporarily rename the original test-helpers.js file
echo "Backing up original test-helpers.js..."
if [ -f tests/e2e/test-helpers.js.bak ]; then
  rm tests/e2e/test-helpers.js.bak
fi
mv tests/e2e/test-helpers.js tests/e2e/test-helpers.js.bak

# Copy the fixed version to test-helpers.js
echo "Applying fixed test helpers..."
cp tests/e2e/test-helpers-fixed.js tests/e2e/test-helpers.js

# Run the tests
echo "Starting tests at $(date)"
export NODE_PATH="$PWD/node_modules"

# Run all tests except Scenario I
echo "Running tests A-H..."
node tests/e2e/run-all-e2e-tests.js

# Save the exit code
EXIT_CODE=$?

# If tests A-H passed, run Scenario I separately
if [ $EXIT_CODE -eq 0 ]; then
  echo "Running Scenario I (Redis Caching Test)..."
  # This scenario uses the original test-helpers.js, not the fixed version
  # Temporarily restore the original test-helpers.js
  if [ -f tests/e2e/test-helpers.js.bak ]; then
    cp tests/e2e/test-helpers.js tests/e2e/test-helpers.js.temp
    cp tests/e2e/test-helpers.js.bak tests/e2e/test-helpers.js
  fi

  # Run Scenario I
  bash batch-files/run-scenario-i-redis-caching.sh
  SCENARIO_I_RESULT=$?

  # Restore the fixed test-helpers.js
  if [ -f tests/e2e/test-helpers.js.temp ]; then
    cp tests/e2e/test-helpers.js.temp tests/e2e/test-helpers.js
    rm tests/e2e/test-helpers.js.temp
  fi

  # Update exit code if Scenario I failed
  if [ $SCENARIO_I_RESULT -ne 0 ]; then
    EXIT_CODE=1
  fi
fi

# Save the exit code
EXIT_CODE=$?

# Restore the original test-helpers.js file
echo "Restoring original test-helpers.js..."
rm tests/e2e/test-helpers.js
mv tests/e2e/test-helpers.js.bak tests/e2e/test-helpers.js

# Check the result
if [ $EXIT_CODE -eq 0 ]; then
  echo
  echo "All tests completed successfully!"
else
  echo
  echo "Some tests failed. Check the logs for details."
fi

echo "Tests completed at $(date)"
echo "Results available in test-results/e2e/"

exit $EXIT_CODE