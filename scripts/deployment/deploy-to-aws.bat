@echo off
REM AWS Elastic Beanstalk Deployment Script for Windows
REM This script automates the deployment of the RadOrderPad API to AWS Elastic Beanstalk

echo Starting deployment process...

REM Configuration
set APP_NAME=radorderpad-api
set ENV_NAME=radorderpad-api-prod
set REGION=us-east-1
set PLATFORM=Node.js 18
set PLATFORM_ARN=arn:aws:elasticbeanstalk:%REGION%::platform/Node.js 18 running on 64bit Amazon Linux 2/5.8.0

REM Environment variables (replace with your actual values)
set NODE_ENV=production
set MAIN_DATABASE_URL=postgresql://username:password@hostname:port/radorder_main
set PHI_DATABASE_URL=postgresql://username:password@hostname:port/radorder_phi
set REDIS_CLOUD_HOST=your-redis-host
set REDIS_CLOUD_PORT=your-redis-port
set REDIS_CLOUD_PASSWORD=your-redis-password
set JWT_SECRET=your-jwt-secret
set ANTHROPIC_API_KEY=your-anthropic-api-key

REM Step 1: Build the application
echo Building application...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Error building application
    exit /b %ERRORLEVEL%
)

REM Step 2: Create deployment package
echo Creating deployment package...
if not exist .ebextensions (
    mkdir .ebextensions
    echo option_settings: > .ebextensions\nodecommand.config
    echo   aws:elasticbeanstalk:container:nodejs: >> .ebextensions\nodecommand.config
    echo     NodeCommand: "node dist/index.js" >> .ebextensions\nodecommand.config
)

REM Check if 7-Zip is installed, otherwise use PowerShell for zipping
where 7z >nul 2>&1
if %ERRORLEVEL% equ 0 (
    7z a -tzip deployment.zip dist package.json package-lock.json .ebextensions .env.example
) else (
    powershell -Command "Compress-Archive -Path dist, package.json, package-lock.json, .ebextensions, .env.example -DestinationPath deployment.zip -Force"
)

REM Step 3: Check if application exists
echo Checking if application exists...
aws elasticbeanstalk describe-applications --application-names %APP_NAME% >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Creating application %APP_NAME%...
    aws elasticbeanstalk create-application --application-name %APP_NAME% --description "RadOrderPad API"
) else (
    echo Application %APP_NAME% already exists.
)

REM Step 4: Check if environment exists
echo Checking if environment exists...
aws elasticbeanstalk describe-environments --environment-names %ENV_NAME% --application-name %APP_NAME% | findstr %ENV_NAME% >nul
if %ERRORLEVEL% neq 0 (
    echo Creating environment %ENV_NAME%...
    aws elasticbeanstalk create-environment ^
        --application-name %APP_NAME% ^
        --environment-name %ENV_NAME% ^
        --solution-stack-name "%PLATFORM%" ^
        --option-settings ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=%NODE_ENV% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=MAIN_DATABASE_URL,Value=%MAIN_DATABASE_URL% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=PHI_DATABASE_URL,Value=%PHI_DATABASE_URL% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_HOST,Value=%REDIS_CLOUD_HOST% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PORT,Value=%REDIS_CLOUD_PORT% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PASSWORD,Value=%REDIS_CLOUD_PASSWORD% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=%JWT_SECRET% ^
        Namespace=aws:elasticbeanstalk:application:environment,OptionName=ANTHROPIC_API_KEY,Value=%ANTHROPIC_API_KEY%
    
    echo Waiting for environment to be created...
    aws elasticbeanstalk wait environment-exists --environment-names %ENV_NAME% --application-name %APP_NAME%
) else (
    echo Environment %ENV_NAME% already exists.
)

REM Step 5: Get AWS account ID
for /f "tokens=*" %%a in ('aws sts get-caller-identity --query "Account" --output text') do set AWS_ACCOUNT=%%a

REM Step 6: Create new application version
echo Creating new application version...
for /f "tokens=*" %%d in ('powershell -Command "Get-Date -Format 'yyyyMMddHHmmss'"') do set VERSION_LABEL=v%%d
aws elasticbeanstalk create-application-version ^
    --application-name %APP_NAME% ^
    --version-label %VERSION_LABEL% ^
    --source-bundle S3Bucket="elasticbeanstalk-%REGION%-%AWS_ACCOUNT%",S3Key="%APP_NAME%/deployment.zip" ^
    --auto-create-application

REM Step 7: Upload deployment package to S3
echo Uploading deployment package to S3...
aws s3 cp deployment.zip "s3://elasticbeanstalk-%REGION%-%AWS_ACCOUNT%/%APP_NAME%/deployment.zip"

REM Step 8: Update environment with new version
echo Updating environment with new version...
aws elasticbeanstalk update-environment ^
    --application-name %APP_NAME% ^
    --environment-name %ENV_NAME% ^
    --version-label %VERSION_LABEL%

echo Deployment initiated. Checking status...

REM Step 9: Wait for deployment to complete
echo Waiting for deployment to complete...
aws elasticbeanstalk wait environment-updated --environment-names %ENV_NAME% --application-name %APP_NAME%

REM Step 10: Get environment URL
for /f "tokens=*" %%u in ('aws elasticbeanstalk describe-environments --environment-names %ENV_NAME% --application-name %APP_NAME% --query "Environments[0].CNAME" --output text') do set ENV_URL=%%u

echo Deployment completed successfully!
echo Your application is available at: http://%ENV_URL%