@echo off
echo Updating Vercel environment variables to fix SSL certificate issues...
cd %~dp0
node update-vercel-db-ssl.js
pause