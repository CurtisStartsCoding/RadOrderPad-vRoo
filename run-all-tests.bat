@echo off
REM Master test script to run all tests

echo Running all tests...
echo.

REM Run Redis search with fallback test
echo === Running Redis Search with Fallback Test ===
call run-redis-search-with-fallback-test-fixed-cjs.bat
echo.

REM Run Radiology Export test
echo === Running Radiology Export Test ===
call test-radiology-export.bat
echo.

echo All tests completed.
pause