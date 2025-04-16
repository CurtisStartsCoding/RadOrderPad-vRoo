@echo off
REM Update Test Audit Log
REM This script is a wrapper for the PowerShell script that updates the Test Audit Log section in the README.md file
REM Usage: update-test-audit-log.bat "Connection Management Tests" "PASS" "All tests passing after refactoring"

if "%~3"=="" (
    powershell -ExecutionPolicy Bypass -File "%~dp0update-test-audit-log.ps1" -TestName "%~1" -Status "%~2" -Notes ""
) else (
    powershell -ExecutionPolicy Bypass -File "%~dp0update-test-audit-log.ps1" -TestName "%~1" -Status "%~2" -Notes "%~3"
)