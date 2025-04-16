@echo off
echo Setting up RadOrderPad Database-Driven Tests
echo ================================================

echo Backing up original test-helpers.js...
if not exist tests\e2e\test-helpers.js.orig (
  copy /Y tests\e2e\test-helpers.js tests\e2e\test-helpers.js.orig
) else (
  echo Original test-helpers.js already backed up.
)

echo Applying database-driven test helpers...
copy /Y tests\e2e\test-helpers-simple.js tests\e2e\test-helpers.js
if %ERRORLEVEL% NEQ 0 (
  echo Failed to apply database-driven test helpers. Exiting.
  exit /b 1
)

echo Database-driven test setup complete.
echo You can now run the tests using run-database-e2e-tests.bat

exit /b 0