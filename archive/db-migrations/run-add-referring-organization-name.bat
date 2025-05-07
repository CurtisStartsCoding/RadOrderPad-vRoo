@echo off
echo Running migration to add referring_organization_name column to orders table...
echo.

cd ..
call run-sql-script.bat db-migrations/add-referring-organization-name.sql PHI

echo.
echo Migration completed.
pause