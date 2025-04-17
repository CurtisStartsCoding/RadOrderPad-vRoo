@echo off
:: Script to run validation engine tests

:: Check if JWT_TOKEN is provided as an argument
if "%~1"=="" (
  echo Usage: run-validation-tests.bat ^<JWT_TOKEN^> [API_BASE_URL]
  echo Example: run-validation-tests.bat eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  echo Example with custom API URL: run-validation-tests.bat eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... https://api.example.com
  exit /b 1
)

:: Set environment variables
set JWT_TOKEN=%~1

:: Check if API_BASE_URL is provided as a second argument
if not "%~2"=="" (
  set API_BASE_URL=%~2
) else (
  :: Default to localhost if not provided
  set API_BASE_URL=http://localhost:3000/api
)

:: Check if axios is installed
call npm list axios >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Installing axios...
  call npm install axios
)

:: Run the test script
echo Running validation engine tests...
call node "%~dp0test-validation-engine.js"

:: Check if the test was successful
if %ERRORLEVEL% equ 0 (
  echo Tests completed successfully!
  echo See validation-engine-test-results.md for detailed results.
) else (
  echo Tests failed. Check the error messages above.
  exit /b 1
)