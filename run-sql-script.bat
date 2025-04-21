@echo off
echo Running SQL script using Node.js...

REM Check if script path is provided
if "%1"=="" (
  echo Error: No SQL script path provided
  echo Usage: run-sql-script.bat path/to/sql-script.sql [PHI|MAIN]
  exit /b 1
)

REM Set database type (default to PHI if not specified)
set DB_TYPE=PHI
if not "%2"=="" (
  set DB_TYPE=%2
)

echo Using %DB_TYPE% database

REM Execute the SQL script using Node.js
node scripts/execute-sql-script.js %1 %DB_TYPE%

if %ERRORLEVEL% NEQ 0 (
  echo Failed to execute SQL script
  exit /b %ERRORLEVEL%
)

echo SQL script executed successfully