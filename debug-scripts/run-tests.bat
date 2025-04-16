@echo off
echo Compiling TypeScript files...
call npx tsc
if %ERRORLEVEL% neq 0 (
    echo Error compiling TypeScript files
    exit /b %ERRORLEVEL%
)

echo.
echo Running isPrimary flag handling test...
node debug-scripts/test-isPrimary-handling.js
if %ERRORLEVEL% neq 0 (
    echo Test failed
    exit /b %ERRORLEVEL%
)

echo.
echo Running prompt field name update...
node debug-scripts/update-prompt-field-names.js
if %ERRORLEVEL% neq 0 (
    echo Update failed
    exit /b %ERRORLEVEL%
)

echo.
echo Validating prompt templates...
node debug-scripts/validate-prompt-template.js
if %ERRORLEVEL% neq 0 (
    echo Validation failed
    exit /b %ERRORLEVEL%
)

echo.
echo All tests completed successfully!