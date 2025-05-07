@echo off
echo ===== Testing Modified Registration Endpoint =====
echo NOTE: The first two tests will only pass after deploying the CAPTCHA test mode changes to the production server.

REM Store the absolute path to the project root directory
set "PROJECT_ROOT=%~dp0..\..\"
echo Project root directory: %PROJECT_ROOT%

REM Set environment variables
set NODE_ENV=development
set TEST_MODE=true
set RECAPTCHA_SECRET_KEY=6LcmOSIrAAAAAI-xb8wB5mLBGWTlvweZ48o9jeWtv
set API_URL=https://api.radorderpad.com

echo Environment variables set:
echo NODE_ENV=%NODE_ENV%
echo TEST_MODE=%TEST_MODE%
echo RECAPTCHA_SECRET_KEY=%RECAPTCHA_SECRET_KEY%
echo API_URL=%API_URL%

REM Create a temporary .env.test file with the environment variables
echo NODE_ENV=%NODE_ENV% > .env.test
echo TEST_MODE=%TEST_MODE% >> .env.test
echo RECAPTCHA_SECRET_KEY=%RECAPTCHA_SECRET_KEY% >> .env.test
echo API_URL=%API_URL% >> .env.test

REM Run the test script
node "%~dp0test-register.js"

echo.
echo ===== Test Complete =====
