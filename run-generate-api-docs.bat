@echo off
echo Generating api-docs-export.txt file from frontend-explanation\api-docs...
node scripts/utilities/generate-api-docs-code.js
echo Done!
pause