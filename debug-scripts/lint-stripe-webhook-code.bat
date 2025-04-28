@echo off
echo ===================================================
echo Stripe Webhook Code Linting
echo ===================================================
echo.

REM Check if ESLint is installed
where npx >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npx not found. Please ensure Node.js and npm are installed.
    exit /b 1
)

REM Change to the root directory to access the correct tsconfig.json
cd ..

echo Linting Stripe webhook controller...
echo.
npx eslint src\controllers\webhook.controller.ts
echo.

echo Linting Stripe service...
echo.
npx eslint src\services\billing\stripe\stripe.service.ts
echo.

echo Linting Stripe webhook handlers...
echo.
npx eslint src\services\billing\stripe\webhooks\*.ts
echo.

echo Linting Stripe webhook subdirectories...
echo.
npx eslint src\services\billing\stripe\webhooks\handle-invoice-payment-failed\*.ts
npx eslint src\services\billing\stripe\webhooks\handle-subscription-updated\*.ts
echo.

echo ===================================================
echo Lint Test Summary
echo ===================================================
echo.
echo Completed linting of Stripe webhook code.
echo.

pause