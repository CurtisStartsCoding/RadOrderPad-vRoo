@echo off
echo Committing RadOrderPad Testing Improvements
echo ==========================================

echo.
echo Step 1: Adding files to Git...
git add .gitignore
git add Docs/database-driven-testing.md
git add Docs/testing-improvements-summary.md
git add tests/e2e/README-database-driven.md
git add tests/e2e/test-helpers-simple.js
git add tests/e2e/test-scenario-a-fix.js
git add tests/e2e/test-scenario-c-fix.js
git add batch-files/run-database-e2e-tests.bat
git add batch-files/setup-database-tests.bat
git add save-environment-details.bat
git add save-environment-details.sh

echo.
echo Step 1.1: Saving environment snapshot...
call save-environment-details.bat
git add environment-snapshot.md

echo.
echo Step 2: Committing changes...
git commit -m "Implement database-driven testing with in-memory state management

- Added in-memory state tracking to fix cross-contamination between test scenarios
- Fixed issues with order status tracking in Scenarios A and C
- Created comprehensive documentation for the database-driven testing approach
- Added test scripts to verify individual scenarios
- Updated .gitignore to exclude test results
- Added environment snapshot tools to preserve project context"

echo.
echo Step 3: Pushing changes to remote repository...
echo If you want to push these changes to a remote repository, run:
echo git push origin your-branch-name

echo.
echo Commit completed successfully!
echo ==========================================