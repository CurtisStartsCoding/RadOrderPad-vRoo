@echo off
echo AWS RDS Connection Test
echo ======================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Error: Node.js is not installed or not in PATH
  exit /b 1
)

REM Install required dependencies if not already installed
echo Checking dependencies...
call npm list pg --silent >nul 2>nul || npm install pg --save
call npm list dotenv --silent >nul 2>nul || npm install dotenv --save

REM Get the password
set /p DB_PASSWORD=Enter the AWS RDS password: 

echo.
echo Testing connection to AWS RDS Main Database...
echo.

node db-migrations/test-connection.js --db="postgresql://postgres:%DB_PASSWORD%@radorder-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main"

if %ERRORLEVEL% neq 0 (
  echo.
  echo Connection to Main Database failed.
  echo Please check that you've updated the security group correctly.
  echo See db-migrations/aws-security-group-update.md for instructions.
) else (
  echo.
  echo Connection to Main Database successful!
  echo.
  echo Testing connection to AWS RDS PHI Database...
  echo.
  
  node db-migrations/test-connection.js --db="postgresql://postgres:%DB_PASSWORD%@radorder-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi"
  
  if %ERRORLEVEL% neq 0 (
    echo.
    echo Connection to PHI Database failed.
    echo Please check that you've updated the security group correctly.
    echo See db-migrations/aws-security-group-update.md for instructions.
  ) else (
    echo.
    echo Connection to PHI Database successful!
    echo.
    echo You're ready to run the migration script:
    echo db-migrations\migrate-to-aws.bat
    
    REM Update the .env file with the correct password
    echo.
    echo Updating .env file with the correct password...
    powershell -Command "(Get-Content .env) -replace 'PROD_DB_PASSWORD=YOUR_AWS_RDS_PASSWORD', 'PROD_DB_PASSWORD=%DB_PASSWORD%' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'postgres:YOUR_AWS_RDS_PASSWORD@', ('postgres:' + '%DB_PASSWORD%' + '@') | Set-Content .env"
    echo .env file updated successfully.
  )
)

pause