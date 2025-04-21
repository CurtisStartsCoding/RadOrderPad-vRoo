@echo on
echo Adding testing documentation and implementation files to Git...

REM Add .gitignore with SQL and test result exclusions
echo Adding .gitignore...
git add .gitignore

REM Add documentation files
echo Adding documentation files...
echo - Docs\database-driven-testing.md
git add Docs\database-driven-testing.md
echo - Docs\testing-improvements-summary.md
git add Docs\testing-improvements-summary.md
echo - Docs\quick-guide-database-testing.md
git add Docs\quick-guide-database-testing.md
echo - Docs\test-documentation.md
git add Docs\test-documentation.md

REM Add test implementation files
echo Adding test implementation files...
echo - tests\e2e\README-database-driven.md
git add tests\e2e\README-database-driven.md
echo - tests\e2e\test-helpers-simple.js
git add tests\e2e\test-helpers-simple.js
echo - tests\e2e\test-scenario-a-fix.js
git add tests\e2e\test-scenario-a-fix.js
echo - tests\e2e\test-scenario-c-fix.js
git add tests\e2e\test-scenario-c-fix.js

REM Add batch files for running tests
echo Adding batch files for running tests...
echo - batch-files\run-database-e2e-tests.bat
git add batch-files\run-database-e2e-tests.bat
echo - batch-files\setup-database-tests.bat
git add batch-files\setup-database-tests.bat

REM Add environment snapshot tools
echo Adding environment snapshot tools...
echo - save-environment-details.bat
git add save-environment-details.bat
echo - save-environment-details.sh
git add save-environment-details.sh

REM Add commit scripts
echo Adding commit scripts...
echo - commit-testing-improvements.bat
git add commit-testing-improvements.bat
echo - commit-testing-improvements.sh
git add commit-testing-improvements.sh

REM Add this batch file
echo Adding this batch file...
git add add-testing-docs.bat

echo.
echo Files staged for commit. Check status with 'git status'