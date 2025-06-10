@echo off
echo =================================
echo Testing Patient Search API
echo =================================

REM Check if physician token is set
if "%PHYSICIAN_TOKEN%"=="" (
    echo ERROR: PHYSICIAN_TOKEN environment variable not set
    echo Please run: set PHYSICIAN_TOKEN=your_physician_token_here
    echo.
    echo You can get a physician token by running:
    echo   node ../utilities/generate-all-role-tokens.js
    echo   Then check ../tokens/physician-token.txt
    exit /b 1
)

REM Set API base URL if not already set
if "%API_BASE_URL%"=="" (
    set API_BASE_URL=https://api.radorderpad.com
)

echo Using API URL: %API_BASE_URL%
echo Using Token: %PHYSICIAN_TOKEN:~0,20%...
echo.

REM Run the test
node test-patient-search.js

echo.
echo Test completed.
pause