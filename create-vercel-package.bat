@echo off
echo Creating deployment package for Vercel...

REM Create a clean deployment directory
if exist vercel-deploy rmdir /s /q vercel-deploy
mkdir vercel-deploy

REM Build the TypeScript code
echo Building TypeScript code...
call npm run build

REM Copy necessary files to the deployment directory
echo Copying necessary files...
xcopy /s /e /y dist vercel-deploy\dist\
copy package.json vercel-deploy\package.json
copy package-lock.json vercel-deploy\package-lock.json
copy vercel.json vercel-deploy\vercel.json
copy vercel-setup.js vercel-deploy\vercel-setup.js

REM Create logs directory and empty log files
echo Creating logs directory and empty log files...
mkdir vercel-deploy\logs
echo. > vercel-deploy\logs\error.log
echo. > vercel-deploy\logs\all.log

REM Install production dependencies
echo Installing production dependencies...
cd vercel-deploy
call npm install --omit=dev

REM Create the deployment ZIP file
echo Creating vercel-deploy.zip...
cd ..
powershell -Command "Compress-Archive -Path vercel-deploy\* -DestinationPath vercel-deploy.zip -Force"

echo Deployment package created: vercel-deploy.zip

echo.
echo Next steps:
echo 1. Deploy to Vercel using: vercel --prod
echo 2. Or upload vercel-deploy.zip to Vercel manually

pause