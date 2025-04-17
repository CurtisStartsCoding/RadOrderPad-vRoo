@echo off
echo Updating Optimized Prompt with Correct Field Names...
echo.

REM Set database connection parameters
set PGHOST=localhost
set PGPORT=5433
set PGDATABASE=radorder_main
set PGUSER=postgres
set PGPASSWORD=postgres123

REM Run the SQL script
psql -f update_optimized_prompt_with_field_names.sql

echo.
echo Update completed. Check the output for results.
echo.

pause