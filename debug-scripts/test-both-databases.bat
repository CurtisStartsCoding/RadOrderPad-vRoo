@echo off
echo Testing connection to both MAIN and PHI databases...
cd %~dp0
node test-both-databases.js
pause