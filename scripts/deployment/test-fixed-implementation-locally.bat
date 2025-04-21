@echo off
echo ===== TESTING FIXED SEND-TO-RADIOLOGY IMPLEMENTATION LOCALLY =====
echo.

REM Step 1: Start the server in the background
echo Step 1: Starting the server...
start "RadOrderPad Server" cmd /c "npm run dev"
echo Server starting in the background. Waiting 10 seconds for it to initialize...
timeout /t 10 /nobreak > nul
echo.

REM Step 2: Run the test script
echo Step 2: Running test script...
echo Updating API_BASE_URL to use localhost...
set API_BASE_URL=http://localhost:3000/api
node test-send-to-radiology-fixed.js
echo.

REM Step 3: Ask if user wants to stop the server
echo Step 3: Server management
set /p STOP_SERVER=Do you want to stop the server? (y/n): 

if /i "%STOP_SERVER%" == "y" (
    echo Stopping the server...
    taskkill /FI "WINDOWTITLE eq RadOrderPad Server" /F
    echo Server stopped.
) else (
    echo Server is still running in the background.
    echo To stop it manually, close the server window or use Task Manager.
)

echo.
echo ===== LOCAL TESTING COMPLETE =====
echo.
pause