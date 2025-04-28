@echo off
echo Testing Location Management Endpoints

REM Change to the vercel-tests directory
cd %~dp0

REM Run the JavaScript test
node test-location-management.js