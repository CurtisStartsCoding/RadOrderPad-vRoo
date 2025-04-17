@echo off
echo ===== Running Stripe Webhook Tests =====
echo.

REM Ensure the dist directory is up to date
call npx tsc

REM Run the test script
node tests/batch/test-stripe-webhooks.js > test-results\stripe-webhook-tests.log 2>&1

REM Check the exit code
if %errorlevel% equ 0 (
    echo [PASS] Stripe Webhook Tests
    echo Updated test audit log for 'Stripe Webhook Tests' with status 'PASS' and date '%date% %time%'. >> test-results\test-audit.log
) else (
    echo [FAIL] Stripe Webhook Tests - Check test-results\stripe-webhook-tests.log for details
    echo Updated test audit log for 'Stripe Webhook Tests' with status 'FAIL' and date '%date% %time%'. >> test-results\test-audit.log
)

echo.