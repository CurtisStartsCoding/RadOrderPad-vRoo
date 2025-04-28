@echo off
echo Restoring test user's role to 'admin_referring'...
cd %~dp0
node restore-user-role.js
pause