@echo off
echo Running File Upload Tests...

rem Generate JWT token using test-helpers
for /f "tokens=*" %%a in ('node -e "const helpers = require('./test-helpers'); const token = helpers.generateToken(helpers.config.testData.adminStaff); console.log(token);"') do set JWT_TOKEN=%%a
echo Using JWT token: %JWT_TOKEN:~0,20%...

rem Run the tests
node test-file-upload.js

rem Check for errors
if %ERRORLEVEL% NEQ 0 (
    echo File Upload Tests failed with error code %ERRORLEVEL%
    exit /b %ERRORLEVEL%
)

echo File Upload Tests completed successfully.
exit /b 0