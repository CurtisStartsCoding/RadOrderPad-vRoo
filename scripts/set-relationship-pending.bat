@echo off
echo Setting a relationship to pending status for testing...
node scripts/set-relationship-pending.js
if %ERRORLEVEL% NEQ 0 (
  echo Failed to set relationship to pending status
  exit /b %ERRORLEVEL%
)
echo Relationship set to pending status successfully