@echo off
echo Running Full Validation and Finalization Test
echo ============================================

cd %~dp0
cd ..\..

node tests/e2e/scenario-a-full-validation-finalization.js

echo.
echo Test completed.
pause