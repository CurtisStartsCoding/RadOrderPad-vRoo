@echo off
echo Redis Configuration Switcher
echo ==========================
echo.
echo 1. Development Mode (localhost through SSM tunnel)
echo 2. Production Mode (direct MemoryDB connection)
echo.

set /p mode="Select mode (1 or 2): "

if "%mode%"=="1" (
    echo Switching to Development Mode (localhost through SSM tunnel)...
    echo.
    echo # AWS MemoryDB Configuration > .env.tmp
    echo # Using localhost:6379 with SSM port forwarding to MemoryDB >> .env.tmp
    echo # Original endpoint: clustercfg.radorderpad-memorydb.i0vhe3.memorydb.us-east-2.amazonaws.com >> .env.tmp
    echo MEMORYDB_HOST=127.0.0.1 >> .env.tmp
    echo MEMORYDB_PORT=6379 >> .env.tmp
    echo # No username/password needed for now based on open-access ACL >> .env.tmp
    echo # MEMORYDB_USER= >> .env.tmp
    echo # MEMORYDB_PASSWORD= >> .env.tmp
    echo # Disable TLS when using localhost through SSM tunnel >> .env.tmp
    echo NODE_ENV=development >> .env.tmp
    echo. >> .env.tmp
    echo # Copy remaining environment variables from original .env file >> .env.tmp
    findstr /v "MEMORYDB_HOST MEMORYDB_PORT NODE_ENV" .env | findstr /v "^#" >> .env.tmp
    move /y .env.tmp .env
    echo Configuration updated to Development Mode.
    echo.
    echo Don't forget to run setup-ssm-port-forwarding.bat to create the tunnel!
) else if "%mode%"=="2" (
    echo Switching to Production Mode (direct MemoryDB connection)...
    echo.
    echo # AWS MemoryDB Configuration > .env.tmp
    echo MEMORYDB_HOST=clustercfg.radorderpad-memorydb.i0vhe3.memorydb.us-east-2.amazonaws.com >> .env.tmp
    echo MEMORYDB_PORT=6379 >> .env.tmp
    echo # No username/password needed for now based on open-access ACL >> .env.tmp
    echo # MEMORYDB_USER= >> .env.tmp
    echo # MEMORYDB_PASSWORD= >> .env.tmp
    echo # Always enable TLS for MemoryDB >> .env.tmp
    echo NODE_ENV=production >> .env.tmp
    echo. >> .env.tmp
    echo # Copy remaining environment variables from original .env file >> .env.tmp
    findstr /v "MEMORYDB_HOST MEMORYDB_PORT NODE_ENV" .env | findstr /v "^#" >> .env.tmp
    move /y .env.tmp .env
    echo Configuration updated to Production Mode.
) else (
    echo Invalid selection. Please run the script again and select 1 or 2.
)

echo.
pause