@echo off
echo Debugging Redis usage in validation endpoint...
echo.

set PHYSICIAN_TOKEN=
for /f "delims=" %%a in (tokens\physician-token.txt) do set PHYSICIAN_TOKEN=%%a

node debug-scripts/aws-tests/debug-redis-validation.js

echo.
echo Done.
pause