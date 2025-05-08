@echo off
echo Moving authentication files to archive...

REM Create necessary directories if they don't exist
if not exist "docs-consolidated\archive\authentication\frontend-explanation\API_IMPLEMENTATION_GUIDE" mkdir "docs-consolidated\archive\authentication\frontend-explanation\API_IMPLEMENTATION_GUIDE"
if not exist "docs-consolidated\archive\authentication\frontend-explanation\api-docs\tutorials\authentication" mkdir "docs-consolidated\archive\authentication\frontend-explanation\api-docs\tutorials\authentication"

REM Move API_IMPLEMENTATION_GUIDE files
echo Moving frontend-explanation\API_IMPLEMENTATION_GUIDE\authentication.md...
move /Y "frontend-explanation\API_IMPLEMENTATION_GUIDE\authentication.md" "docs-consolidated\archive\authentication\frontend-explanation\API_IMPLEMENTATION_GUIDE\"

REM Move tutorial files
echo Moving frontend-explanation\api-docs\tutorials\authentication\regular-auth.md...
move /Y "frontend-explanation\api-docs\tutorials\authentication\regular-auth.md" "docs-consolidated\archive\authentication\frontend-explanation\api-docs\tutorials\authentication\"

echo Moving frontend-explanation\api-docs\tutorials\authentication\trial-auth.md...
move /Y "frontend-explanation\api-docs\tutorials\authentication\trial-auth.md" "docs-consolidated\archive\authentication\frontend-explanation\api-docs\tutorials\authentication\"

echo Authentication files have been moved to the archive.
echo Please refer to the consolidated documentation in docs-consolidated\authentication\ for the most up-to-date information.