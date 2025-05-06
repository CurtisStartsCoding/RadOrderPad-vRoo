@echo off
echo Running Redis-LLM Validation Test...

REM Install required packages if not already installed
echo Checking for required npm packages...
npm list axios || npm install axios
npm list dotenv || npm install dotenv
npm list openai || npm install openai
npm list ioredis || npm install ioredis

REM Run the test script
echo Running Redis-LLM validation test...
node debug-scripts/redis-llm-validation-test.js

echo Test completed.