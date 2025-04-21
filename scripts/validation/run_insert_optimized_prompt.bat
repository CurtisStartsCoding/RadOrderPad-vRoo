@echo off
echo Inserting Optimized Prompt with STAT Detection into the database...

REM Set your PostgreSQL connection parameters
set PGHOST=localhost
set PGPORT=5433
set PGDATABASE=radorder_main
set PGUSER=postgres
set PGPASSWORD=postgres123

REM Run the SQL script
psql -h %PGHOST% -p %PGPORT% -d %PGDATABASE% -U %PGUSER% -f insert_optimized_prompt.sql

echo.
echo Insertion completed. Check the output for any errors.
echo.

pause