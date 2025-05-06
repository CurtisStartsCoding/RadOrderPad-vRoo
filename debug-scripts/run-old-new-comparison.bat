@echo off
echo Running Old vs New Validation Comparison...
echo This will test both old and new validation approaches with the same dictation text

REM Create a directory for the results
if not exist "debug-scripts\validation-comparison-results" mkdir "debug-scripts\validation-comparison-results"

REM Install required packages if not already installed
echo Checking for required npm packages...
npm list axios || npm install axios
npm list dotenv || npm install dotenv
npm list jsonwebtoken || npm install jsonwebtoken

REM Run the test script
echo Running validation approach comparison...
node debug-scripts/compare-old-new-validation.js

echo Test completed. Results saved to validation-comparison-results directory.