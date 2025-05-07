@echo off
echo Database Connection Test Tool
echo ============================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed or not in PATH
  exit /b 1
)

REM Install required dependencies if not already installed
echo Checking dependencies...
call npm list commander --silent >nul 2>nul || npm install commander --save
call npm list pg --silent >nul 2>nul || npm install pg --save

REM Get connection parameters
set /p DB_URL=Enter database connection URL to test (postgresql://user:password@host:port/dbname): 

echo.
echo Testing connection to database...
echo.

node db-migrations/test-connection.js --db="%DB_URL%"

if %ERRORLEVEL% neq 0 (
  echo.
  echo Connection test failed.
  exit /b 1
) else (
  echo.
  echo Connection test completed.
)

pause