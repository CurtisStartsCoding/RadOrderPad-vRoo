@echo off
echo Organizing Redis-related scripts...
echo.

echo Creating directories if they don't exist...
if not exist debug-scripts mkdir debug-scripts
if not exist tests\batch mkdir tests\batch

echo Moving Redis-related batch files to appropriate folders...
if exist setup-ssm-port-forwarding.bat move setup-ssm-port-forwarding.bat debug-scripts\
if exist switch-redis-config.bat move switch-redis-config.bat debug-scripts\
if exist configure-aws-for-memorydb.bat move configure-aws-for-memorydb.bat debug-scripts\
if exist setup-memorydb-access.bat move setup-memorydb-access.bat debug-scripts\

echo Moving Redis-related JavaScript files to appropriate folders...
if exist scripts\configure-aws-for-memorydb.js move scripts\configure-aws-for-memorydb.js debug-scripts\
if exist scripts\setup-memorydb-access.js move scripts\setup-memorydb-access.js debug-scripts\

echo Cleaning up unnecessary files...
if exist memorydb-policy.json del memorydb-policy.json
if exist scripts\create-memorydb-iam-policy.json del scripts\create-memorydb-iam-policy.json
if exist scripts\switch-aws-user.js del scripts\switch-aws-user.js
if exist switch-aws-user.bat del switch-aws-user.bat

echo Done!
echo.
pause