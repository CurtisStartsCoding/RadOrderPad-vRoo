#!/bin/bash

echo "Running Validation Approach Comparison..."
echo "This will test both old and new prompts with multiple LLMs using the actual context generator"

# Create a directory for the results
mkdir -p "debug-scripts/validation-comparison-results"

# Install required packages if not already installed
echo "Checking for required npm packages..."
npm list axios || npm install axios
npm list dotenv || npm install dotenv
npm list openai || npm install openai
npm list ioredis || npm install ioredis

# Run the test script
echo "Running validation approach comparison..."
node debug-scripts/compare-validation-approaches.js

echo "Test completed. Results saved to validation-comparison-results directory."