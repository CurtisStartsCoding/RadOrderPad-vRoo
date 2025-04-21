@echo off
echo Creating deployment package for Vercel (Silent Mode)...

REM Create a clean deployment directory
if exist vercel-deploy rmdir /s /q vercel-deploy
mkdir vercel-deploy

REM Build the TypeScript code
echo Building TypeScript code...
call npm run build >nul 2>nul

REM Copy necessary files to the deployment directory
echo Copying necessary files...
xcopy /s /e /y dist vercel-deploy\dist\ >nul 2>nul
copy package.json vercel-deploy\package.json >nul 2>nul
copy package-lock.json vercel-deploy\package-lock.json >nul 2>nul
copy vercel.json vercel-deploy\vercel.json >nul 2>nul
copy vercel-setup.js vercel-deploy\vercel-setup.js >nul 2>nul

REM Create logs directory and empty log files
echo Creating logs directory and empty log files...
mkdir vercel-deploy\logs
echo. > vercel-deploy\logs\error.log
echo. > vercel-deploy\logs\all.log

REM Install production dependencies
echo Installing production dependencies...
cd vercel-deploy
call npm install --omit=dev >nul 2>nul

REM Create the deployment ZIP file
echo Creating deployment-manual.zip...
cd ..
powershell -Command "Compress-Archive -Path vercel-deploy\* -DestinationPath deployment-manual.zip -Force" >nul 2>nul

echo Deployment package created: deployment-manual.zip

echo.
echo Next steps:
echo 1. Deploy to Vercel using: powershell -File silent-deploy.ps1
echo 2. Or deploy using: .\deploy-to-vercel-silent.bat

pause