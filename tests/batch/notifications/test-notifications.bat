@echo off
echo Testing Notification Service...

REM Compile TypeScript files
echo Compiling TypeScript files...
call npx tsc

REM Run the test
echo Running test...
node tests/test-notifications.js

pause