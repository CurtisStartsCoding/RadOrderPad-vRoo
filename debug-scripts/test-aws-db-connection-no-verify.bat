@echo off
echo Testing connection to AWS RDS database with SSL verification disabled...
cd %~dp0
node test-aws-db-connection-no-verify.js
pause