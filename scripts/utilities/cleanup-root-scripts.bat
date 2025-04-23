@echo off
echo Cleaning up scripts from root directory...

echo Deleting delete-database-schema-fixes.bat from root...
del "delete-database-schema-fixes.bat"

echo Deleting generate-all-role-tokens.js from root...
del "generate-all-role-tokens.js"

echo Done.
echo The script has been moved to scripts\utilities\delete-database-schema-fixes.bat
pause