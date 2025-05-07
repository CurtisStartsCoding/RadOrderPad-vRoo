@echo off
echo Testing connection rejection endpoint...

REM Use the token from the tokens directory
set TOKEN_FILE=..\tokens\admin_radiology-token.txt
if exist %TOKEN_FILE% (
    set /p ADMIN_TOKEN=<%TOKEN_FILE%
) else (
    echo Error: Token file not found: %TOKEN_FILE%
    exit /b 1
)

REM Set the token as an environment variable
set ADMIN_RADIOLOGY_TOKEN=%ADMIN_TOKEN%

REM Run the test script
node test-connection-reject.js
set exit_code=%ERRORLEVEL%

if %exit_code% NEQ 0 (
  echo Connection rejection test failed with error code %exit_code%
  exit /b %exit_code%
)
echo Connection rejection test completed successfully
