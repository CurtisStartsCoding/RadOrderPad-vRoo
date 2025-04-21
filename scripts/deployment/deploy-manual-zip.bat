@echo off
echo ===== DEPLOYING FIXED IMPLEMENTATION TO AWS ELASTIC BEANSTALK =====
echo.

REM Check if deployment-manual.zip exists
if not exist deployment-manual.zip (
    echo Error: deployment-manual.zip not found.
    echo Please run create-deployment-zip-manual.bat first.
    goto :end
)

REM Check if eb CLI is installed
where eb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: AWS Elastic Beanstalk CLI (eb) not found.
    echo Please install the EB CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html
    goto :end
)

REM Deploy to AWS Elastic Beanstalk
echo Deploying to AWS Elastic Beanstalk...
echo.

REM Read environment name from eb-options.json
for /f "tokens=2 delims=:, " %%a in ('type eb-options.json ^| findstr "environment-name"') do (
    set EB_ENV=%%a
    set EB_ENV=!EB_ENV:"=!
)

REM Deploy using the EB CLI
echo Using environment: %EB_ENV%
eb deploy %EB_ENV% --staged --label fixed-admin-finalization-%date:~10,4%%date:~4,2%%date:~7,2%-%time:~0,2%%time:~3,2% --timeout 20

echo.
echo ===== DEPLOYMENT COMPLETE =====
echo.
echo The fixed send-to-radiology implementation has been deployed to AWS Elastic Beanstalk.
echo You can now use the /api/admin/orders/:orderId/send-to-radiology-fixed endpoint.
echo.

:end
pause