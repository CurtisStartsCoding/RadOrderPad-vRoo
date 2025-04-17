@echo off
echo Running All Optimization Tests

REM Check if .env file exists
if not exist .env (
  echo Error: .env file not found.
  echo Please create a .env file with your ANTHROPIC_API_KEY.
  echo Example: ANTHROPIC_API_KEY=sk-ant-api03-...
  exit /b 1
)

REM Check if axios is installed
call npm list axios >nul 2>&1
if %errorlevel% neq 0 (
  echo Installing axios...
  call npm install axios
)

echo.
echo ===================================
echo Running Optimized Prompt Test
echo ===================================
echo.

node test-optimized-prompt.js

echo.
echo ===================================
echo Running Ultra-Optimized Context Test
echo ===================================
echo.

node test-ultra-optimized-context.js

echo.
echo ===================================
echo All tests completed successfully!
echo Results are available in the test-results directory.
echo ===================================
echo.

pause