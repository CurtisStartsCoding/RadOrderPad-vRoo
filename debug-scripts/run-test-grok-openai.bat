@echo off
echo Testing Grok API Connection using OpenAI client...

REM Install required packages if not already installed
echo Checking for required npm packages...
npm list openai || npm install openai
npm list dotenv || npm install dotenv

REM Run the test script
echo Running Grok API test...
node debug-scripts/test-grok-openai.js

echo Test completed.