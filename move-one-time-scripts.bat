@echo off
echo Moving one-time scripts to scripts\redis\one-time-scripts directory...

move scripts\redis\apply-redis-search-fix.bat scripts\redis\one-time-scripts\
move scripts\redis\run-test-fixed-implementation.bat scripts\redis\one-time-scripts\
move scripts\redis\run-weighted-search.bat scripts\redis\one-time-scripts\
move scripts\redis\implement-weighted-search.js scripts\redis\one-time-scripts\

echo Done.
pause