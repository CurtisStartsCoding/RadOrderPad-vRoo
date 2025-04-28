@echo off
echo Testing connection to AWS RDS database...
cd %~dp0
node test-aws-db-connection.js
pause