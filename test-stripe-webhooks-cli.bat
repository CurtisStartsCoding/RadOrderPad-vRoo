@echo off
echo Running Stripe webhook tests using CLI...

REM Make sure the Stripe CLI is running in listen mode in another terminal
echo Ensure that you have the Stripe CLI running in listen mode:
echo .\stripe.exe listen --forward-to http://localhost:3000/api/webhooks/stripe
echo.

echo --- Testing Stripe Webhook Handlers ---
echo.

echo Triggering customer.subscription.updated event...
.\stripe.exe trigger customer.subscription.updated
echo.

echo Triggering customer.subscription.deleted event...
.\stripe.exe trigger customer.subscription.deleted
echo.

echo Triggering invoice.payment_succeeded event...
.\stripe.exe trigger invoice.payment_succeeded
echo.

echo Triggering invoice.payment_failed event...
.\stripe.exe trigger invoice.payment_failed
echo.

echo All tests completed.
echo Check your server logs to verify that the events were processed correctly.
echo.

pause