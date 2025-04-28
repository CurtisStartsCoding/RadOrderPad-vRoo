@echo off
REM Test script for Super Admin log viewing endpoints
REM Usage: test-superadmin-logs.bat [endpoint]
REM Where [endpoint] is one of: validation, validation-enhanced, credits, purgatory, all

echo Testing Super Admin log viewing endpoints...

cd %~dp0
node test-superadmin-logs.js %1

if %ERRORLEVEL% NEQ 0 (
  echo Test failed with error code %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

echo Test completed successfully!