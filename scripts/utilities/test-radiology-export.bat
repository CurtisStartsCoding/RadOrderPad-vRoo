@echo off
echo === Testing Radiology Order Export ===
echo.

REM Check if a token is provided as an argument
if "%1"=="" (
  echo No JWT token provided. Using environment variable if available.
  node test-radiology-export.js
) else (
  echo Using provided JWT token.
  node test-radiology-export.js --token %1
)

echo.
echo === Test Complete ===
pause