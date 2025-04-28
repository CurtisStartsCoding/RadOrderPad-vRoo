@echo off
echo Creating test users with different roles...
cd %~dp0
node create-test-users.js
pause