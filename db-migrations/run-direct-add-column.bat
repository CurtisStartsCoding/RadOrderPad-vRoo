@echo off
echo Running direct script to add referring_organization_name column to orders table...
echo.

cd %~dp0
cd ..
node db-migrations/direct-add-column.js

echo.
echo Script completed.
pause