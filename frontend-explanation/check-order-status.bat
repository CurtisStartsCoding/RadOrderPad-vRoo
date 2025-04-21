@echo off
echo Checking Order Status
echo ====================

cd %~dp0
cd ..

echo Installing required dependencies...
call npm install node-fetch@2 --no-save

echo.
echo Executing order status check...
node frontend-explanation/check-order-status.js

echo.
echo Check completed.
pause