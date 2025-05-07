@echo off
echo Testing health endpoint...

REM Set API URL
set API_URL=https://api.radorderpad.com

echo API URL: %API_URL%
echo.

echo Test 1: Health check endpoint
curl -s -X GET "%API_URL%/health"
echo.
echo.

echo Test 2: Health check with detailed info
curl -s -X GET "%API_URL%/health?detailed=true"
echo.
echo.

echo Test completed.
