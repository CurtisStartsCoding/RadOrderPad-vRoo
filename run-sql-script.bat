@echo off
echo Running SQL script using Node.js...

REM Check if script path is provided
if "%1"=="" (
  echo Error: No SQL script path provided
  echo Usage: run-sql-script.bat path/to/sql-script.sql
  exit /b 1
)

REM Execute the SQL script using Node.js
node scripts/execute-sql-script.js %1

if %ERRORLEVEL% NEQ 0 (
  echo Failed to execute SQL script
  exit /b %ERRORLEVEL%
)

echo SQL script executed successfully