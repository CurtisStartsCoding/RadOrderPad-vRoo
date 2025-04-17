@echo off
echo Running File Upload Tests...

REM Generate a JWT token for an admin_referring user
echo Generating JWT token...
for /f "tokens=*" %%a in ('node -e "const helpers = require(\"./tests/batch/test-helpers\"); const adminUser = { userId: 1, orgId: 1, role: \"admin_referring\", email: \"test.admin@example.com\" }; const token = helpers.generateToken(adminUser); console.log(token);"') do set JWT_TOKEN=%%a
echo Token generated (first 20 chars): %JWT_TOKEN:~0,20%...

REM Run the test script with the token set as an environment variable
echo Running test script...
node tests/batch/test-file-upload.js

echo Tests finished.
pause