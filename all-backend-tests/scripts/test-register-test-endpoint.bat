@echo off
echo ===== Testing Registration (Test Endpoint) =====

REM Set environment variables
set NODE_ENV=development
set TEST_MODE=true
set RECAPTCHA_SECRET_KEY=6LcmOSIrAAAAAI-xb8wB5mLBGWTlvweZ48o9jeWtv

echo Environment variables set:
echo RECAPTCHA_SECRET_KEY=%RECAPTCHA_SECRET_KEY%
echo NODE_ENV=%NODE_ENV%
echo TEST_MODE=%TEST_MODE%

REM Change to the script directory
cd /d "%~dp0"

REM Run the test script
node -r dotenv/config test-register-test-endpoint.js dotenv_config_path=.env.test

echo.
echo ===== Test Complete =====
