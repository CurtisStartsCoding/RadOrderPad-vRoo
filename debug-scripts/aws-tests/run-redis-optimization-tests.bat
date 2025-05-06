@echo off
echo Running Redis Optimization Test Suite...
echo This will test Redis implementation with multiple LLMs and test cases

REM Set environment variables from .env.production
for /f "tokens=*" %%a in (.env.production) do (
    set %%a
)

REM Create a timestamp for the results
set timestamp=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set timestamp=%timestamp: =0%

REM Create a directory for the results
if not exist "redis-test-results" mkdir "redis-test-results"
if not exist "redis-test-results\%timestamp%" mkdir "redis-test-results\%timestamp%"

REM Run the test suite
echo Running tests with Node.js...
node debug-scripts/aws-tests/redis-optimization-test-suite.js

echo Test suite completed. Results saved to redis-test-results directory.
echo Check summary_report.json for analysis.