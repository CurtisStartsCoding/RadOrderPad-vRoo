@echo off
echo Testing Redis Cloud Connection...

REM Compile TypeScript files
echo Compiling TypeScript files...
call npx tsc

REM Run the test script
echo Running test...
node scripts/redis/test-redis-connection.js

pause