@echo off
echo ===== Running Admin Staff (Referring Organization) Comprehensive Tests =====

REM Store the absolute path to the current directory
set "PROJECT_ROOT=%~dp0"
echo Project root directory: %PROJECT_ROOT%

REM Generate tokens using absolute path
echo.
echo Generating fresh tokens for all roles...
call node "%PROJECT_ROOT%utilities\generate-all-role-tokens.js"

REM Set environment variables for tokens
echo.
echo Setting environment variables for tokens...
if exist "%PROJECT_ROOT%tokens\admin_staff-token.txt" (
    set /p ADMIN_STAFF_TOKEN=<"%PROJECT_ROOT%tokens\admin_staff-token.txt"
    echo Admin Staff Token loaded successfully.
) else (
    echo Error: Admin Staff Token file not found.
    exit /b 1
)

REM Set API URL environment variable
set API_URL=https://api.radorderpad.com
echo API URL set to: %API_URL%

REM Load AWS credentials from .env.production file if it exists
echo.
echo Loading AWS credentials from .env.production file...
if exist "%PROJECT_ROOT%..\.env.production" (
    for /f "tokens=1,2 delims==" %%a in (%PROJECT_ROOT%..\.env.production) do (
        if "%%a"=="AWS_ACCESS_KEY_ID" (
            set AWS_ACCESS_KEY_ID=%%b
            echo Set AWS_ACCESS_KEY_ID environment variable.
        )
        if "%%a"=="AWS_SECRET_ACCESS_KEY" (
            set AWS_SECRET_ACCESS_KEY=%%b
            echo Set AWS_SECRET_ACCESS_KEY environment variable.
        )
        if "%%a"=="AWS_REGION" (
            set AWS_REGION=%%b
            echo Set AWS_REGION environment variable.
        )
        if "%%a"=="S3_BUCKET_NAME" (
            set S3_BUCKET_NAME=%%b
            echo Set S3_BUCKET_NAME environment variable.
        )
        if "%%a"=="S3_BUCKET_ARN" (
            set S3_BUCKET_ARN=%%b
            echo Set S3_BUCKET_ARN environment variable.
        )
        if "%%a"=="NODE_ENV" (
            set NODE_ENV=%%b
            echo Set NODE_ENV environment variable.
        )
        if "%%a"=="JWT_SECRET" (
            set JWT_SECRET=%%b
            echo Set JWT_SECRET environment variable.
        )
    )
)

echo.
echo Running Admin Staff Role Tests...
cd role-tests
call node admin-staff-role-tests.js
cd ..

echo.
echo Running Admin Staff API Upload Test...
cd role-tests
call run-admin-staff-api-upload-test.bat
cd ..

echo.
echo Running Admin Staff S3 Upload Test...
cd role-tests
call run-s3-upload-test.bat
cd ..

echo.
echo ===== Admin Staff Comprehensive Tests Complete =====