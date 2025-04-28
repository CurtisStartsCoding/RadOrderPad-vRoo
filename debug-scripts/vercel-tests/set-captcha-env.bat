@echo off
echo Setting environment variables for CAPTCHA testing...

REM Set the reCAPTCHA secret key (Google's test key that always passes verification)
set RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

REM Set development mode
set NODE_ENV=development

REM Set test mode flag
set TEST_MODE=true

echo Environment variables set:
echo RECAPTCHA_SECRET_KEY=%RECAPTCHA_SECRET_KEY%
echo NODE_ENV=%NODE_ENV%
echo TEST_MODE=%TEST_MODE%

echo.
echo You can now run the registration test with:
echo .\test-register-captcha.bat
echo.
echo Note: These variables are only set for the current terminal session.
echo To make them permanent, set them in your system environment variables.