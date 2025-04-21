@echo off
echo AWS PostgreSQL Database Migration Tool
echo ======================================

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
call npm list winston --silent >nul 2>nul || npm install winston --save
call npm list dotenv --silent >nul 2>nul || npm install dotenv --save

REM Get the password if not already in .env
findstr /C:"PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD" .env >nul
if %ERRORLEVEL% equ 0 (
  set /p DB_PASSWORD=Enter the AWS RDS password: 
  
  REM Update the .env file with the correct password
  echo Updating .env file with the correct password...
  powershell -Command "(Get-Content .env) -replace 'PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD', 'PROD_DB_PASSWORD=%DB_PASSWORD%' | Set-Content .env"
  powershell -Command "(Get-Content .env) -replace 'postgres:YOUR_AWS_RDS_PASSWORD@', ('postgres:' + '%DB_PASSWORD%' + '@') | Set-Content .env"
  echo .env file updated successfully.
)

echo.
echo Select connection method:
echo 1. Enter database connection URLs manually
echo 2. Use connection details from .env file
set /p CONNECTION_METHOD=Enter your choice (1-2): 

if "%CONNECTION_METHOD%"=="2" (
  echo.
  echo Using connection details from .env file...
  
  echo.
  echo Select migration type:
  echo 1. Full migration (schema and data)
  echo 2. Schema only
  echo 3. Data only
  set /p MIGRATION_TYPE=Enter your choice (1-3): 

  set ADDITIONAL_ARGS=--use-env
  if "%MIGRATION_TYPE%"=="2" set ADDITIONAL_ARGS=--use-env --schema-only
  if "%MIGRATION_TYPE%"=="3" set ADDITIONAL_ARGS=--use-env --data-only

  echo.
  echo Starting migration...
  echo A log file will be created at db-migrations/migration.log
  echo.

  node db-migrations/aws-postgres-migration.js %ADDITIONAL_ARGS%
) else (
  REM Get connection parameters
  set /p SOURCE_MAIN=Enter source main database URL (postgresql://user:password@host:port/dbname): 
  set /p SOURCE_PHI=Enter source PHI database URL (postgresql://user:password@host:port/dbname): 
  
  REM Get the password for AWS RDS if not already prompted
  if not defined DB_PASSWORD (
    set /p DB_PASSWORD=Enter the AWS RDS password: 
  )
  
  set TARGET_MAIN=postgresql://postgres:%DB_PASSWORD%@radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main
  set TARGET_PHI=postgresql://postgres:%DB_PASSWORD%@radorder-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi

  echo.
  echo Select migration type:
  echo 1. Full migration (schema and data)
  echo 2. Schema only
  echo 3. Data only
  set /p MIGRATION_TYPE=Enter your choice (1-3): 

  set ADDITIONAL_ARGS=
  if "%MIGRATION_TYPE%"=="2" set ADDITIONAL_ARGS=--schema-only
  if "%MIGRATION_TYPE%"=="3" set ADDITIONAL_ARGS=--data-only

  echo.
  echo Starting migration...
  echo A log file will be created at db-migrations/migration.log
  echo.

  node db-migrations/aws-postgres-migration.js --source-main="%SOURCE_MAIN%" --source-phi="%SOURCE_PHI%" --target-main="%TARGET_MAIN%" --target-phi="%TARGET_PHI%" %ADDITIONAL_ARGS%
)

if %ERRORLEVEL% neq 0 (
  echo.
  echo Migration failed. Check db-migrations/migration.log for details.
  exit /b 1
) else (
  echo.
  echo Migration completed successfully.
)

pause