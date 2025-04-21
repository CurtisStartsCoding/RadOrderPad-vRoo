@echo off
echo Organizing test scripts into appropriate directories...

REM Create necessary subdirectories if they don't exist
mkdir tests\batch\redis 2>nul
mkdir tests\batch\stripe 2>nul
mkdir tests\batch\notifications 2>nul
mkdir tests\batch\superadmin 2>nul
mkdir tests\batch\ses 2>nul
mkdir tests\batch\general 2>nul

REM Move Redis-related test scripts
echo Moving Redis test scripts...
move run-redis-basic-test.bat tests\batch\redis\ 2>nul
move run-redis-basic-test.sh tests\batch\redis\ 2>nul
move run-redis-search-test.bat tests\batch\redis\ 2>nul
move test-redis-connection.bat tests\batch\redis\ 2>nul
move test-redis-connection.sh tests\batch\redis\ 2>nul

REM Move Stripe-related test scripts
echo Moving Stripe test scripts...
move test-stripe-webhooks.bat tests\batch\stripe\ 2>nul
move test-stripe-webhooks.sh tests\batch\stripe\ 2>nul
move run-stripe-webhook-tests.bat tests\batch\stripe\ 2>nul

REM Move Notification-related test scripts
echo Moving Notification test scripts...
move test-notifications.bat tests\batch\notifications\ 2>nul
move test-notifications.sh tests\batch\notifications\ 2>nul

REM Move SuperAdmin-related test scripts
echo Moving SuperAdmin test scripts...
move test-superadmin-logs.bat tests\batch\superadmin\ 2>nul
move test-superadmin-logs.sh tests\batch\superadmin\ 2>nul
move test-superadmin-prompt-assignments.bat tests\batch\superadmin\ 2>nul
move test-superadmin-prompt-assignments.sh tests\batch\superadmin\ 2>nul
move test-superadmin-prompts.bat tests\batch\superadmin\ 2>nul

REM Move SES-related test scripts
echo Moving SES test scripts...
move test-ses-email.bat tests\batch\ses\ 2>nul
move test-ses-email.sh tests\batch\ses\ 2>nul

REM Move general test scripts
echo Moving general test scripts...
move run-all-tests.bat tests\batch\general\ 2>nul
move run-all-tests.sh tests\batch\general\ 2>nul
move run-all-optimization-tests.bat tests\batch\general\ 2>nul

REM Move other test-related scripts that might be in the root directory
echo Moving other test-related scripts...
move test-*.bat tests\batch\ 2>nul
move test-*.sh tests\batch\ 2>nul
move run-*-test*.bat tests\batch\ 2>nul
move run-*-test*.sh tests\batch\ 2>nul

echo Script organization complete!
echo.
echo Note: Some files may not have been moved if they were already in their target directories.