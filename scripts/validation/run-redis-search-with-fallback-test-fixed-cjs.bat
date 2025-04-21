@echo off
REM Test script for Redis search with PostgreSQL fallback (fixed CommonJS version)

echo Running Redis search with PostgreSQL fallback test (fixed CommonJS version)...
node tests/batch/test-redis-search-with-fallback-fixed-cjs.js

echo Test completed.
pause