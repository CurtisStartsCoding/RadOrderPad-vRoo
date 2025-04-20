@echo off
echo Testing AWS SES Email Sending...

REM Run the test
echo Running test...
node tests/test-ses-email.js

pause