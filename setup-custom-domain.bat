@echo off
echo ===== Setting Up Custom Domain for Vercel Deployment =====
echo.

REM Check if Vercel CLI is installed
vercel --version > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI is not installed. Please install it using:
    echo npm i -g vercel
    echo.
    pause
    exit /b 1
)

echo Vercel CLI is installed. Proceeding with custom domain setup.
echo.

REM Get project name
set /p PROJECT_NAME=Enter your Vercel project name (default: radorderpad-api): 
if "%PROJECT_NAME%"=="" set PROJECT_NAME=radorderpad-api

REM Set custom domain
set CUSTOM_DOMAIN=api.radorderpad.com

echo.
echo Adding custom domain %CUSTOM_DOMAIN% to project %PROJECT_NAME%...
echo.

REM Add the custom domain to the project
vercel domains add %CUSTOM_DOMAIN% %PROJECT_NAME%

echo.
echo ===== Next Steps =====
echo.
echo 1. Configure Cloudflare DNS records as shown in VERCEL_CUSTOM_DOMAIN_SETUP.md
echo.
echo 2. After adding the DNS records, verify the domain in Vercel:
echo    vercel domains verify %CUSTOM_DOMAIN%
echo.
echo 3. Once verified, update your environment variables to use the new domain:
echo    https://%CUSTOM_DOMAIN%
echo.
echo For detailed instructions, please refer to VERCEL_CUSTOM_DOMAIN_SETUP.md
echo.

pause