@echo off
echo Running Admin Send-to-Radiology Tests...

REM Generate JWT token for admin user
echo Generating JWT token for admin_referring user...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./test-helpers\"); const token = helpers.generateToken(helpers.config.testData.adminReferring); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated: %JWT_TOKEN:~0,20%...

REM Get API base URL from config
for /f "tokens=*" %%a in ('node -e "const config = require(\"./test-config\"); console.log(config.api.baseUrl);"') do set API_BASE_URL=%%a
echo Using API base URL: %API_BASE_URL%

REM Run the test script
node test-admin-send-to-radiology.js %JWT_TOKEN%

REM Check if the test was successful
if %ERRORLEVEL% equ 0 (
  echo Tests completed successfully.
  exit /b 0
) else (
  echo Tests failed with exit code %ERRORLEVEL%.
  exit /b 1
)