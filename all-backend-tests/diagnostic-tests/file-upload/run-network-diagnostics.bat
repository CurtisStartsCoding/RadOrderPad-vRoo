@echo off
echo ===== Running S3 Upload Network Diagnostics =====
echo Current directory: %CD%

REM Load environment variables from .env.test file
echo.
echo Loading environment variables from .env.test file...
for /f "tokens=1,2 delims==" %%a in ('type "..\..\..\.env.test" ^| findstr /v "^#" ^| findstr /v "^$"') do (
    set "%%a=%%b"
    echo Set %%a environment variable.
)

REM Install required packages
echo.
echo Installing required packages...
call npm install @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/s3-request-presigner axios --no-save

REM Run the network diagnostics script
echo.
echo Running S3 Upload Network Diagnostics...
node network-diagnostics.js

echo.
echo ===== S3 Upload Network Diagnostics Complete =====
echo.
echo This test performs comprehensive diagnostics on S3 uploads:
echo 1. DNS resolution and HTTPS connectivity
echo 2. Network latency to S3
echo 3. Direct uploads with different file sizes
echo 4. Presigned URL uploads
echo 5. CORS configuration
echo.
echo If any of these tests fail, check the recommendations provided.

pause