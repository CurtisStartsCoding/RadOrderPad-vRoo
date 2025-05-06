@echo off
echo Running Validation Approach Comparison...
echo This will test both old and new prompts with multiple LLMs using the actual context generator

REM Create a directory for the results
if not exist "debug-scripts\validation-comparison-results" mkdir "debug-scripts\validation-comparison-results"

REM Install required packages if not already installed
echo Checking for required npm packages...
npm list axios || npm install axios
npm list dotenv || npm install dotenv
npm list openai || npm install openai
npm list ioredis || npm install ioredis

REM Run the test script
echo Running validation approach comparison...
node debug-scripts/compare-validation-approaches.js

echo Test completed. Results saved to validation-comparison-results directory.