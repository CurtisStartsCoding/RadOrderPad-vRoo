@echo off
echo Creating ZIP file using 7-Zip...

REM Check if 7-Zip is installed
where 7z >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 7-Zip is not installed or not in PATH. Trying alternative method...
    goto :TryPowerShell
)

REM Use 7-Zip to create the ZIP file
echo Using 7-Zip to create vercel-deploy.zip...
7z a -tzip vercel-deploy.zip .\vercel-deploy\*
if %ERRORLEVEL% EQU 0 (
    echo Successfully created vercel-deploy.zip using 7-Zip.
    goto :End
)

:TryPowerShell
echo Using PowerShell to create vercel-deploy.zip...
powershell -Command "Add-Type -Assembly 'System.IO.Compression.FileSystem'; [System.IO.Compression.ZipFile]::CreateFromDirectory('vercel-deploy', 'vercel-deploy.zip')"
if %ERRORLEVEL% EQU 0 (
    echo Successfully created vercel-deploy.zip using PowerShell.
    goto :End
)

echo Failed to create ZIP file. Trying direct deployment...

:End
echo.
echo If ZIP file creation was successful, you can deploy to Vercel by:
echo 1. Going to the Vercel dashboard
echo 2. Creating a new project
echo 3. Uploading the vercel-deploy.zip file
echo.
echo Alternatively, you can deploy directly using the Vercel CLI:
echo vercel --prod
echo.
pause