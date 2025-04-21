@echo off
echo Creating deployment package for AWS Elastic Beanstalk...

REM Create a clean deployment directory
if exist deployment rmdir /s /q deployment
mkdir deployment

REM Build the TypeScript code
echo Building TypeScript code...
call npm run build

REM Install production dependencies
echo Installing production dependencies...
cd deployment
call npm init -y
call npm install --omit=dev --prefix ../ --package-lock-only
call npm ci --omit=dev --prefix ../

REM Copy necessary files to the deployment directory
echo Copying necessary files...
xcopy /s /e /y ..\dist dist\
copy ..\package.json package.json
copy ..\package-lock.json package-lock.json
mkdir .ebextensions
copy ..\Procfile Procfile
copy ..\.ebextensions\*.* .ebextensions\

REM Create the deployment ZIP file
echo Creating deployment.zip...
powershell Compress-Archive -Path * -DestinationPath ..\deployment.zip -Force

REM Clean up
cd ..
echo Deployment package created: deployment.zip

echo.
echo Next steps:
echo 1. Upload deployment.zip to AWS Elastic Beanstalk
echo 2. Configure environment variables in the Elastic Beanstalk console
echo 3. Deploy the application

pause