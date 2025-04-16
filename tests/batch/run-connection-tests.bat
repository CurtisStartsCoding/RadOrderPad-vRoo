@echo off
echo Setting up test data for connection management tests...

REM Use the same database connection as the running application
echo Using the same database connection as the running application...

REM Run the setup SQL script using the connection string directly
echo Running setup-test-data.sql...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(\"postgres://\" + helpers.config.database.user + \":\" + helpers.config.database.password + \"@localhost:\" + helpers.config.database.port + \"/\" + helpers.config.database.mainDb);"') do set DB_CONN=%%a
psql "%DB_CONN%" -f setup-test-data.sql

REM Run the connection management tests
echo.
echo Running connection management tests...
call test-connection-management.bat
set EXIT_CODE=%ERRORLEVEL%

REM Update the test audit log
if %EXIT_CODE% EQU 0 (
    echo Updating test audit log with PASS status...
    call update-test-audit-log.bat "Connection Management Tests" "PASS" "All tests passing after connection service refactoring"
) else (
    echo Updating test audit log with FAIL status...
    call update-test-audit-log.bat "Connection Management Tests" "FAIL" "Tests failed - check logs for details"
)

echo.
echo All done!

REM Return the exit code from test-connection-management.bat
exit /b %EXIT_CODE%