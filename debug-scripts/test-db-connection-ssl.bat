@echo off
echo Testing database connection with different SSL configurations...
cd %~dp0
node test-db-connection-ssl.js
pause