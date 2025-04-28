@echo off
echo ===== TESTING AND DEPLOYING FIXED SEND-TO-RADIOLOGY IMPLEMENTATION =====
echo.

REM Step 1: Run the test script
echo Step 1: Running test script...
node test-send-to-radiology-fixed.js
echo.

REM Step 2: Ask for confirmation to deploy
echo Step 2: Confirm deployment
set /p DEPLOY=Do you want to deploy the fixed implementation? (y/n): 

if /i "%DEPLOY%" neq "y" (
    echo Deployment cancelled.
    goto :end
)

REM Step 3: Create deployment package
echo Step 3: Creating deployment package...
call create-deployment-package.bat
echo.

REM Step 4: Deploy to AWS
echo Step 4: Deploying to AWS...
call deploy-to-aws.bat
echo.

echo ===== DEPLOYMENT COMPLETE =====
echo The fixed send-to-radiology implementation has been deployed.
echo You can now use the /api/admin/orders/:orderId/send-to-radiology-fixed endpoint.
echo.

:end
pause