@echo off
echo === Testing Stripe Webhooks ===
echo.

REM Run the test script
node scripts/billing/test-stripe-webhooks.js %*

echo.
echo === Test Complete ===
pause