@echo off
echo Creating deployment ZIP file manually...

REM Check if 7-Zip is installed
where 7z >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 7-Zip not found. Using PowerShell instead.
    
    REM Create the deployment ZIP file using PowerShell
    echo Creating deployment.zip using PowerShell...
    cd deployment
    powershell -Command "Get-ChildItem -Path . -Recurse | Where-Object { !$_.PSIsContainer } | Compress-Archive -DestinationPath ..\deployment-manual.zip -Force"
    cd ..
) else (
    REM Create the deployment ZIP file using 7-Zip
    echo Creating deployment.zip using 7-Zip...
    7z a -tzip deployment-manual.zip .\deployment\* -r
)

if exist deployment-manual.zip (
    echo Deployment package created: deployment-manual.zip
) else (
    echo Failed to create deployment package.
)

echo.
echo Next steps:
echo 1. Upload deployment-manual.zip to AWS Elastic Beanstalk
echo 2. Configure environment variables in the Elastic Beanstalk console
echo 3. Deploy the application

pause