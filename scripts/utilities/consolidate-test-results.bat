@echo off
echo Consolidating Test Results

REM Run the consolidation script
node consolidate-test-results.js

echo.
echo Consolidation completed. Results are available in consolidated-test-results.json.
echo.

pause