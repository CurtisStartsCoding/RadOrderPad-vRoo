@echo off
echo Testing full workflow from login to order submission...
cd %~dp0
node test-full-workflow.js
pause