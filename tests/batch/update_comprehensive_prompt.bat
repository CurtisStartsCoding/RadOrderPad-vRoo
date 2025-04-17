@echo off
echo Updating prompt template with comprehensive validation framework...

REM Set database connection details from the server output
set DB_HOST=localhost
set DB_PORT=5433
set DB_NAME=radorder_main
set DB_USER=postgres
set PGPASSWORD=postgres123

REM Execute the SQL script
echo Executing SQL script...
echo.
echo Using the following database connection:
echo Host: %DB_HOST%
echo Port: %DB_PORT%
echo Database: %DB_NAME%
echo User: %DB_USER%
echo Password: [Using environment variable]
echo.

REM Execute the SQL script with psql (without password prompt)
REM The -w flag tells psql not to prompt for a password
psql -h %DB_HOST% -p %DB_PORT% -d %DB_NAME% -U %DB_USER% -w -f update_comprehensive_prompt.sql

if %ERRORLEVEL% == 0 (
    echo.
    echo Prompt template updated successfully!
    echo.
    echo To verify the update, check the last few rows of the prompt_templates table.
) else (
    echo.
    echo Failed to update prompt template. Please check the error message above.
)

echo.
pause