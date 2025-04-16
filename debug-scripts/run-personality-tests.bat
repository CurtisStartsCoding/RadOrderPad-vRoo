@echo off
REM Run the multi-LLM personality test with a specified number of tests
REM Usage: run-personality-tests.bat [number_of_tests]

setlocal

REM Default to 3 tests if no argument is provided
set NUM_TESTS=3
if not "%~1"=="" set NUM_TESTS=%~1

echo Running %NUM_TESTS% personality tests with realistic sentence limits...
node debug-scripts/fixed-multi-llm-personality-test.js %NUM_TESTS%

endlocal