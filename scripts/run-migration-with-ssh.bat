@echo off
REM Script to run migration with SSH tunnel to AWS RDS (Windows version)
REM Date: 2025-06-11

echo Setting up SSH tunnel for database migration...

REM Configuration
set SSH_KEY_PATH=temp\radorderpad-key-pair.pem
set BASTION_HOST=ec2-3-145-161-19.us-east-2.compute.amazonaws.com
set BASTION_USER=ec2-user
set LOCAL_PORT=5433
set RDS_ENDPOINT=radorderpad-db.crce197.us-east-2.rds.amazonaws.com
set RDS_PORT=5432

REM Check if SSH key exists
if not exist "%SSH_KEY_PATH%" (
    echo ERROR: SSH key not found at %SSH_KEY_PATH%
    echo Please ensure the PEM key is in the temp directory
    exit /b 1
)

echo.
echo Creating SSH tunnel...
echo    Bastion: %BASTION_USER%@%BASTION_HOST%
echo    RDS: %RDS_ENDPOINT%:%RDS_PORT%
echo    Local port: %LOCAL_PORT%
echo.

REM Start SSH tunnel in a new window
start "SSH Tunnel" cmd /c ssh -N -L %LOCAL_PORT%:%RDS_ENDPOINT%:%RDS_PORT% -i "%SSH_KEY_PATH%" %BASTION_USER%@%BASTION_HOST%

REM Wait for tunnel to establish
echo Waiting for tunnel to establish...
timeout /t 5 /nobreak > nul

REM Run the migration
echo.
echo Running migration through tunnel...
set USE_PRIVATE_DB=true
set NODE_ENV=production
node scripts\run-migration-production.js

echo.
echo Migration complete! 
echo Please close the SSH Tunnel window manually.
pause