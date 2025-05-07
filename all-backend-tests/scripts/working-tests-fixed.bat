@echo off
echo ===== Running Working API Tests (Part 1) =====

echo.
echo Current directory: %CD%

REM Store the original directory
set ORIGINAL_DIR=%CD%

REM Generate tokens using absolute paths instead of directory navigation
echo Generating fresh tokens for all roles...
call node "%ORIGINAL_DIR%\scripts\utilities\generate-all-role-tokens.js"

REM Run individual tests without changing directories
echo.
echo Running Connection Requests Tests...
call "%ORIGINAL_DIR%\debug-scripts\vercel-tests\run-single-test.bat"

echo.
echo ===== All Working Tests (Part 1) Complete =====
