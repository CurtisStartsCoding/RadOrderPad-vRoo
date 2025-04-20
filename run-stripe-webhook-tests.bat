@echo off
echo Running Stripe webhook handler tests...
echo.

REM Check if a customer ID was provided
if "%1"=="" (
  echo No customer ID provided, using default test ID
  node tests/stripe-webhook-handlers.test.js
) else (
  echo Using customer ID: %1
  node tests/stripe-webhook-handlers.test.js %1
)

echo.
echo Test run complete.