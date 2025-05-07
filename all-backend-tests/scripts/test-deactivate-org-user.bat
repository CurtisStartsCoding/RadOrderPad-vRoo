@echo off
setlocal enabledelayedexpansion

echo Testing deactivate user endpoint...

REM Run the JavaScript test file
node test-deactivate-org-user.js
