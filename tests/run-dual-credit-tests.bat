@echo off
REM Test script for dual credit billing system

echo ========================================
echo  Dual Credit Billing System Test Suite
echo ========================================
echo.

REM Set the API URL (adjust if needed)
set API_BASE_URL=http://localhost:3001

echo Testing against: %API_BASE_URL%
echo.

REM Run the main dual credit test
echo Running dual credit system test...
node tests\test-dual-credit-system.js

echo.
echo ========================================
echo  Additional Credit Balance Checks
echo ========================================
echo.

REM Check credit balances for multiple organizations
echo Checking credit balances for test organizations...

REM You can add more specific tests here
REM For example, testing with specific order types:
REM node tests\test-advanced-imaging-credits.js
REM node tests\test-basic-imaging-credits.js

echo.
echo Test suite completed!
pause