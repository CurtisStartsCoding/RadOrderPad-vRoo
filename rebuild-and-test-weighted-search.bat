@echo off
echo Rebuilding project and testing weighted search...

echo.
echo Step 1: Building TypeScript files...
npm run build

echo.
echo Step 2: Running validation test with weighted search...
node tests/test-validation-with-weighted-search.js

echo.
echo Process completed.
pause