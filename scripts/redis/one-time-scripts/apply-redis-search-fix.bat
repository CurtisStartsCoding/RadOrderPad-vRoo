@echo off
echo Applying Redis Search Fix...

REM Check if the search.js file exists
if not exist "src\utils\redis\search.js" (
    echo Error: src\utils\redis\search.js does not exist.
    echo Please check the path and try again.
    goto :end
)

REM Check if the search-fixed.js file exists
if not exist "src\utils\redis\search-fixed.js" (
    echo Error: src\utils\redis\search-fixed.js does not exist.
    echo Please run implement-redis-search-fix.js first.
    goto :end
)

REM Backup the original file
echo Backing up original search.js to search.js.bak...
copy "src\utils\redis\search.js" "src\utils\redis\search.js.bak"
if errorlevel 1 (
    echo Error: Failed to backup search.js.
    goto :end
)

REM Replace the original file with the fixed version
echo Replacing search.js with the fixed version...
copy "src\utils\redis\search-fixed.js" "src\utils\redis\search.js"
if errorlevel 1 (
    echo Error: Failed to replace search.js.
    goto :end
)

echo Redis Search Fix applied successfully!
echo Original file backed up to src\utils\redis\search.js.bak

:end
pause