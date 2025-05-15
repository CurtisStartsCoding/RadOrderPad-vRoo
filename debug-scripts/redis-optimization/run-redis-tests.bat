@echo off
echo Testing Redis JSON Search Query Syntax...
echo.
echo === CHECKING INDEX SCHEMA ===
node debug-scripts/redis-optimization/check-index-schema.js
echo.
echo === TESTING QUERY SYNTAX ===
node debug-scripts/redis-optimization/test-query-syntax.js
echo.
echo Testing completed.
pause