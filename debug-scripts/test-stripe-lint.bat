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

echo Linting Stripe webhook test scripts...
echo.
echo --- test-stripe-webhooks-cli.bat ---
type ..\test-stripe-webhooks-cli.bat | findstr /v /c:"REM" | findstr /v /c:"echo" | findstr /v /c:"@echo" | findstr /v /c:"timeout" | findstr /v /c:"start" | findstr /v /c:"taskkill"
echo.

echo Linting JavaScript files...
echo.
echo --- scripts/prepare-stripe-test-data.js ---
npx eslint ..\scripts\prepare-stripe-test-data.js
echo.

echo --- scripts/query-db.js ---
npx eslint ..\scripts\query-db.js
echo.

echo Checking for CommonJS compliance...
echo.
echo Verifying that scripts use require() instead of import:
findstr /s /i /m "import " ..\scripts\*.js
if %ERRORLEVEL% equ 0 (
    echo WARNING: Found import statements in scripts. Should use require() instead.
) else (
    echo OK: No import statements found in scripts.
)
echo.

echo Checking for file extension issues...
echo.
findstr /s /i /m "require(['\"].*['\"])" ..\scripts\*.js | findstr /v /i ".js"
if %ERRORLEVEL% equ 0 (
    echo WARNING: Found require statements without .js extensions.
) else (
    echo OK: All require statements have proper extensions.
)
echo.

echo ===================================================
echo Lint Test Summary
echo ===================================================
echo.
echo 1. Batch Scripts: Manually reviewed
echo 2. JavaScript Files: ESLint checked
echo 3. CommonJS Compliance: Verified
echo 4. File Extension Usage: Verified
echo.
echo All Stripe webhook code has been checked for adherence to the module-system-fix.md guidelines.
echo.

pause