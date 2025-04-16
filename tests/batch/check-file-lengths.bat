@echo off
REM Script to check file lengths and identify files that need refactoring
REM Usage: check-file-lengths.bat [path] [extension]
REM Example: check-file-lengths.bat ..\..\src ts

echo Running file length check...
powershell -ExecutionPolicy Bypass -File "%~dp0check-file-lengths.ps1" %1 %2

echo.
echo Done!