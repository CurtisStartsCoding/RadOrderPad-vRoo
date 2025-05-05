@echo off
echo Running Grok Validation Test (using Grok for both dictation and validation)

REM Set API keys as environment variables
set GROK_API_KEY=xai-f6aoNDw0mNfkfcOhDmmDUvtExdM4MqlqjrXO4f2E8VqYqdEzow8wTC9EgIZURlxSmC6NAQRGxpWr9Vey
set GROK_MODEL_NAME=grok-3-latest

REM Run the modified test script that uses Grok for validation
node grok-validation-test.js

echo Test completed.