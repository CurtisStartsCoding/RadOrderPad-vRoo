@echo off
echo Restoring Original RadOrderPad Tests
echo ================================================

echo Checking for original test-helpers.js backup...
if not exist tests\e2e\test-helpers.js.orig (
  echo No backup found. Nothing to restore.
  exit /b 1
)

echo Restoring original test-helpers.js...
copy /Y tests\e2e\test-helpers.js.orig tests\e2e\test-helpers.js
if %ERRORLEVEL% NEQ 0 (
  echo Failed to restore original test-helpers.js. Please check manually.
  exit /b 1
)

echo Original test setup restored successfully.

exit /b 0