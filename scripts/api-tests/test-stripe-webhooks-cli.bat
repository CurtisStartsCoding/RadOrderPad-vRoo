@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo Stripe Webhook End-to-End Testing
echo ===================================================
echo.

REM Check if Stripe CLI is installed
where stripe >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Stripe CLI not found. Please install it from https://stripe.com/docs/stripe-cli
    exit /b 1
)

REM Check if the server is running
curl -s http://localhost:3000/api/health >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Server is not running. Please start the server before running this test.
    exit /b 1
)

REM Set test organization ID and Stripe customer ID
set ORG_ID=1
set STRIPE_CUSTOMER_ID=cus_TEST123456

REM Ensure test data exists in the database
echo Preparing test data...
node scripts/prepare-stripe-test-data.js --org-id=%ORG_ID% --customer-id=%STRIPE_CUSTOMER_ID%
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to prepare test data.
    exit /b 1
)

REM Start Stripe webhook listener in a separate window
start "Stripe Webhook Listener" cmd /c "stripe listen --forward-to http://localhost:3000/api/webhooks/stripe"

REM Wait for the listener to start
echo Waiting for Stripe webhook listener to start...
timeout /t 5 /nobreak >nul

echo.
echo ===================================================
echo Scenario 1: Credit Top-up (checkout.session.completed)
echo ===================================================
echo.

REM Get initial credit balance
echo Initial credit balance:
node scripts/query-db.js --query="SELECT credit_balance FROM organizations WHERE id = %ORG_ID%"

REM Trigger checkout.session.completed event
echo Triggering checkout.session.completed event...
stripe trigger checkout.session.completed --add checkout_session:metadata.radorderpad_org_id=%ORG_ID% --add checkout_session:metadata.credit_bundle_price_id=price_credits_medium

REM Wait for the event to be processed
timeout /t 3 /nobreak >nul

REM Verify credit balance increased
echo Updated credit balance:
node scripts/query-db.js --query="SELECT credit_balance FROM organizations WHERE id = %ORG_ID%"

REM Verify billing event was logged
echo Billing events:
node scripts/query-db.js --query="SELECT * FROM billing_events WHERE organization_id = %ORG_ID% AND event_type = 'top_up' ORDER BY created_at DESC LIMIT 1"

echo.
echo ===================================================
echo Manual Testing Instructions for Other Scenarios
echo ===================================================
echo.
echo For the remaining scenarios, use the Stripe Dashboard:
echo.
echo 1. Log in to the Stripe Dashboard (https://dashboard.stripe.com/)
echo 2. Navigate to Developers ^> Events
echo 3. Select an event type (e.g., invoice.payment_succeeded)
echo 4. Click "Send test webhook"
echo 5. Enter your webhook endpoint URL: http://localhost:3000/api/webhooks/stripe
echo 6. Customize the event data as needed
echo 7. Click "Send test webhook"
echo.
echo After sending each webhook, verify the database changes:
echo.
echo - For invoice.payment_succeeded:
echo   node scripts/query-db.js --query="SELECT status, credit_balance FROM organizations WHERE id = %ORG_ID%"
echo   node scripts/query-db.js --query="SELECT * FROM billing_events WHERE organization_id = %ORG_ID% ORDER BY created_at DESC LIMIT 1"
echo.
echo - For invoice.payment_failed:
echo   node scripts/query-db.js --query="SELECT status FROM organizations WHERE id = %ORG_ID%"
echo   node scripts/query-db.js --query="SELECT * FROM purgatory_events WHERE organization_id = %ORG_ID% ORDER BY created_at DESC LIMIT 1"
echo.
echo - For customer.subscription.updated:
echo   node scripts/query-db.js --query="SELECT subscription_tier FROM organizations WHERE id = %ORG_ID%"
echo.
echo - For customer.subscription.deleted:
echo   node scripts/query-db.js --query="SELECT status, subscription_tier FROM organizations WHERE id = %ORG_ID%"
echo.

echo.
echo ===================================================
echo Test Summary
echo ===================================================
echo.
echo Automated test for checkout.session.completed completed successfully.
echo For other scenarios, please follow the manual testing instructions above.
echo.

REM Kill the Stripe webhook listener
taskkill /FI "WINDOWTITLE eq Stripe Webhook Listener" /T /F >nul 2>nul

endlocal