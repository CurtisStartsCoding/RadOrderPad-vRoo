@echo off
echo ===== Updating Template Field Names in Database =====
node debug-scripts/update-template-field-names-in-db.js
if %ERRORLEVEL% neq 0 (
    echo Error updating template field names in database
    exit /b %ERRORLEVEL%
)

echo.
echo ===== Setting Template as Active =====
node debug-scripts/update-active-template.js
if %ERRORLEVEL% neq 0 (
    echo Error setting template as active
    exit /b %ERRORLEVEL%
)

echo.
echo ===== Running Comprehensive Workflow Tests =====
call run-comprehensive-workflow-tests.bat
if %ERRORLEVEL% neq 0 (
    echo Comprehensive workflow tests failed
    exit /b %ERRORLEVEL%
)

echo.
echo All steps completed successfully!