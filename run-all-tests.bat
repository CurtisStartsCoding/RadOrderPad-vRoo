@echo off
echo Running All Tests...

REM Run individual test scripts
call run-redis-basic-test.bat
call run-redis-search-test.bat
call test-superadmin-prompts.bat
call test-superadmin-prompt-assignments.bat
call test-superadmin-logs.bat

echo All tests completed.
pause