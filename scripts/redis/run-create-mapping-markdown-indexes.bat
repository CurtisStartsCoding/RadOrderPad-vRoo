@echo off
echo Creating RedisSearch Indexes for Mappings and Markdown Documents...
node scripts/redis/create-mapping-markdown-indexes.js
echo.
echo Process completed.
pause