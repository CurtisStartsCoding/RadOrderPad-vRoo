@echo off
echo === Testing Stripe Webhook Handlers ===
echo.

REM Navigate to project root directory
cd %~dp0..\..

REM Run the test script
node scripts/stripe/test-webhook-handlers.js

echo.
echo === Test Complete ===
pause