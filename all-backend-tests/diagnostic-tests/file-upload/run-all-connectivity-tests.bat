@echo off
echo ===== Running All Connectivity Tests for Upload Functionality =====

REM Store the absolute path to the current directory
set "CURRENT_DIR=%~dp0"
echo Current directory: %CURRENT_DIR%

REM Check if node_modules exists, if not, install dependencies
if not exist "%CURRENT_DIR%node_modules" (
    echo Installing dependencies...
    cd "%CURRENT_DIR%"
    call npm install
)

REM Load environment variables from .env.test file
echo.
echo Loading environment variables from .env.test file...
for /f "tokens=1,2 delims==" %%a in ('type "%CURRENT_DIR%..\..\..\\.env.test" ^| findstr /v "^#" ^| findstr /v "^$"') do (
    set "%%a=%%b"
    echo Set %%a environment variable.
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Run the API health check
echo.
echo ===== Running API Health Check =====
node "%CURRENT_DIR%api-health-check.js"

REM Run the S3 connectivity test
echo.
echo ===== Running AWS S3 Connectivity Test =====
node "%CURRENT_DIR%s3-connectivity-test.js"

REM Run the basic connectivity test
echo.
echo ===== Running Basic Connectivity Test =====
node "%CURRENT_DIR%basic-connectivity-test.js"

echo.
echo ===== All Connectivity Tests Complete =====
echo.
echo These tests check the fundamental connections needed for the upload functionality:
echo 1. API connectivity and health
echo 2. AWS S3 connectivity and permissions
echo 3. Presigned URL generation
echo 4. API presigned URL endpoint
echo.
echo If any of these tests fail, check the recommendations provided in each test.
echo.
echo Common issues:
echo - Missing AWS credentials or insufficient permissions
echo - Missing S3 bucket configuration
echo - API server not running or not accessible
echo.
echo Next steps:
echo 1. Fix any issues identified by the tests
echo 2. Run the tests again to verify the fixes
echo 3. Try the full upload test once all connectivity tests pass

pause