@echo off
echo Setting CAPTCHA environment variables on the server...

REM Set the reCAPTCHA secret key (Google's test key that always passes verification)
vercel env add RECAPTCHA_SECRET_KEY production
echo Enter this value when prompted: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

REM Set development mode (optional, only if you want to force development mode on production)
REM vercel env add NODE_ENV production
REM echo Enter this value when prompted: development

REM Set test mode flag (optional, only if you want to enable test mode on production)
vercel env add TEST_MODE production
echo Enter this value when prompted: true

echo.
echo After setting these environment variables, you need to redeploy your application:
echo vercel --prod
echo.
echo Note: Setting NODE_ENV=development on production is not recommended.
echo Instead, modify the captcha.ts file to check for TEST_MODE as described in the documentation.