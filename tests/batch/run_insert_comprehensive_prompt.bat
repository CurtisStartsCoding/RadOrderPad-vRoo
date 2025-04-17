@echo off
echo Inserting comprehensive validation prompt template...
echo.

set DB_HOST=localhost
set DB_PORT=5433
set DB_NAME=radorder_main
set DB_USER=postgres

echo Using the following database connection:
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo Database: %DB_NAME%
echo User: %DB_USER%
echo Password: [Using environment variable]
echo.

echo Executing SQL script...
echo.

psql -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -U %DB_USER% -f insert_comprehensive_prompt.sql

if %ERRORLEVEL% == 0 (
    echo.
    echo Comprehensive prompt template inserted successfully!
    echo.
    echo To verify the update, check the last few rows of the prompt_templates table.
) else (
    echo.
    echo Failed to insert comprehensive prompt template. Please check the error message above.
)

echo.
pause