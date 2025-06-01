@echo off
echo ===== Running File Upload Diagnostic Tests =====

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

REM Run the diagnostic tests
echo.
echo Running API-based file upload test...
node "%CURRENT_DIR%test-api-upload.js"

echo.
echo Running direct S3 access test...
node "%CURRENT_DIR%test-s3-direct.js"

echo.
echo Running presigned URL test...
node "%CURRENT_DIR%test-presigned-url.js"

echo.
echo ===== File Upload Diagnostic Tests Complete =====
echo.
echo Diagnostic Summary:
echo 1. If the API-based tests succeeded but the direct S3 tests failed, the API is using different AWS credentials than those in .env.test.
echo 2. If all tests failed, there may be an issue with the S3 bucket configuration or permissions.
echo 3. Check the test outputs for specific error messages and recommendations.
echo.
echo Next steps:
echo - Update the AWS credentials in .env.test to match those used by the API
echo - Ensure the AWS user has the necessary S3 permissions (s3:ListBucket, s3:PutObject, s3:GetObject)
echo - Check the S3 bucket name and region configuration

pause