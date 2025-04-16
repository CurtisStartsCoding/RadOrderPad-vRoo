@echo off
REM Run the ultra-realistic dictation test with a specified number of tests
REM Usage: run-realistic-dictation-test.bat [number_of_tests]

setlocal

REM Default to 3 tests if no argument is provided
set NUM_TESTS=3
if not "%~1"=="" set NUM_TESTS=%~1

echo Running %NUM_TESTS% ultra-realistic dictation tests...
node debug-scripts/ultra-realistic-dictation-test.js %NUM_TESTS%

endlocal