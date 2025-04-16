@echo off
echo Testing the comprehensive prompt implementation...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed or not in the PATH.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

REM Check if test-comprehensive-prompt.js exists
if not exist test-comprehensive-prompt.js (
    echo Error: test-comprehensive-prompt.js not found.
    exit /b 1
)

REM Set environment variables for testing
set API_BASE_URL=http://localhost:3000
set API_PATH=/api

REM Use the freshly generated token
set TEST_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsIm9yZ0lkIjoxLCJyb2xlIjoicGh5c2ljaWFuIiwiZW1haWwiOiJ0ZXN0LnBoeXNpY2lhbkBleGFtcGxlLmNvbSIsImlhdCI6MTc0NDY4NTYxOCwiZXhwIjoxNzQ0NzcyMDE4fQ.oK-Um8-Fe9IDVlNd0dYzb9Fy7PD3s0kSMsNwFmVR3bQ

echo Using JWT token: %TEST_AUTH_TOKEN:~0,20%...

echo Running test with the following configuration:
echo API Base URL: %API_BASE_URL%
echo API Path: %API_PATH%
echo.

REM Run the test script
node test-comprehensive-prompt.js

if %ERRORLEVEL% equ 0 (
    echo.
    echo Test completed successfully!
) else (
    echo.
    echo Test failed with error code %ERRORLEVEL%
)

pause