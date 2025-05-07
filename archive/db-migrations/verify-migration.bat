@echo off
echo Verifying migration to add referring_organization_name column...
echo.

cd %~dp0
cd ..
node db-migrations/verify-migration.js

echo.
echo Verification completed.
pause