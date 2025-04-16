@echo off
echo Running Stripe webhook tests...

REM Generate a JWT token for an admin user
echo Generating JWT token for admin user...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM Get API base URL from config
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); console.log(helpers.config.api.baseUrl);"') do set API_BASE_URL=%%a
echo Using API base URL: %API_BASE_URL%

echo.
echo ===== Running Direct Function Tests =====
echo.

REM Run the test script
node ./test-stripe-webhooks.js

REM Check the exit code
if %ERRORLEVEL% EQU 0 (
  echo Tests completed successfully.
) else (
  echo Tests failed with exit code %ERRORLEVEL%.
)

echo.
echo ===== Triggering real Stripe webhook events =====
echo.
echo This will trigger actual Stripe webhook events that will be sent to your server.
echo Check the server logs and Stripe CLI listener output for results.
echo.

REM Navigate to the root directory where stripe.exe is located
cd ..\..

REM Trigger a checkout.session.completed event
echo Triggering checkout.session.completed event...
.\stripe trigger checkout.session.completed

echo.
echo Test execution complete. Check the server logs and Stripe CLI listener output for results.