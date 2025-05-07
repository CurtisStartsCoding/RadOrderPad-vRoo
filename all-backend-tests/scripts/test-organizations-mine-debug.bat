@echo off
echo Running organizations/mine/debug endpoint test...
node "%~dp0test-organizations-mine-debug-endpoint.js"
if %ERRORLEVEL% neq 0 (
  echo Test failed
  exit /b 1
) else (
  echo Test passed
  exit /b 0
)
