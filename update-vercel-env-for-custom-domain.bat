@echo off
echo ===== Updating Vercel Environment Variables for Custom Domain =====
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

echo Vercel CLI is installed. Proceeding with environment variable updates.
echo.

REM Get project name
set /p PROJECT_NAME=Enter your Vercel project name (default: radorderpad-api): 
if "%PROJECT_NAME%"=="" set PROJECT_NAME=radorderpad-api

REM Set custom domain
set CUSTOM_DOMAIN=api.radorderpad.com

echo.
echo Fetching current environment variables for project %PROJECT_NAME%...
echo.

REM Pull current environment variables
vercel env pull .env.production --environment=production

echo.
echo Current environment variables have been pulled to .env.production
echo.
echo Now we'll update any URLs in the environment variables to use the custom domain.
echo.

REM Create a temporary file for the updated environment variables
type .env.production > .env.production.new

REM Replace Vercel URLs with the custom domain
powershell -Command "(Get-Content .env.production.new) -replace 'https://radorderpad-[a-z0-9\-]+\.vercel\.app', 'https://%CUSTOM_DOMAIN%' | Set-Content .env.production.new"
powershell -Command "(Get-Content .env.production.new) -replace 'https://radorderpad-api-[a-z0-9\-]+\.vercel\.app', 'https://%CUSTOM_DOMAIN%' | Set-Content .env.production.new"
powershell -Command "(Get-Content .env.production.new) -replace 'https://radorderpad-api\.vercel\.app', 'https://%CUSTOM_DOMAIN%' | Set-Content .env.production.new"

echo Environment variables have been updated in .env.production.new
echo.
echo Please review the changes:
echo.

REM Show the differences
powershell -Command "Compare-Object (Get-Content .env.production) (Get-Content .env.production.new) | Format-Table -Property InputObject, SideIndicator -AutoSize"

echo.
echo SideIndicator legend:
echo => : Lines in the new file (added or modified)
echo ^<= : Lines in the original file (removed or replaced)
echo.

set /p CONFIRM=Do you want to apply these changes to Vercel? (y/n): 
if /i "%CONFIRM%" NEQ "y" (
    echo Changes not applied. Exiting...
    del .env.production.new
    pause
    exit /b 0
)

echo.
echo Applying changes to Vercel environment variables...
echo.

REM Move the new file to replace the old one
move /y .env.production.new .env.production

REM Push the updated environment variables to Vercel
vercel env push .env.production --environment=production

echo.
echo Environment variables have been updated in Vercel.
echo.
echo ===== Next Steps =====
echo.
echo 1. Redeploy your application to apply the new environment variables:
echo    vercel --prod
echo.
echo 2. Test your API endpoints using the new custom domain:
echo    https://%CUSTOM_DOMAIN%/api/...
echo.

pause