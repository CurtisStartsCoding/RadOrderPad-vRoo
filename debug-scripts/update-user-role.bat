@echo off
echo Updating test user's role to 'physician'...
cd %~dp0
node update-user-role.js
pause