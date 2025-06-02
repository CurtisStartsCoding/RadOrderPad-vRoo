@echo off
echo ===== Redis CLI Operations =====
echo.
echo This script will use Redis CLI via Docker to:
echo 1. Count keys by pattern
echo 2. Delete keys by pattern
echo.
echo Redis connection details:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

REM Set Redis connection details
set REDIS_HOST=redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
set REDIS_PORT=11584
set REDIS_PASSWORD=zHUbspGPcewJsoT9G9TSQncuSl0v0MUH

REM Pull Redis Docker image if not already available
echo.
echo Pulling Redis Docker image...
docker pull redis:latest

REM Function to run Redis CLI command and display output
echo.
echo ===== Redis Key Statistics =====

REM Count total keys
echo.
echo Counting total Redis keys...
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning DBSIZE

REM Count keys by pattern
echo.
echo Counting keys by pattern...

echo.
echo Old CPT keys (cpt:code:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "cpt:code:*" | find /c /v ""

echo.
echo Old ICD-10 keys (icd10:code:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "icd10:code:*" | find /c /v ""

echo.
echo Old mapping keys (mapping:icd10-to-cpt:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "mapping:icd10-to-cpt:*" | find /c /v ""

echo.
echo New CPT keys (cpt:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "cpt:*" | find /c /v ""

echo.
echo New ICD-10 keys (icd10:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "icd10:*" | find /c /v ""

echo.
echo New mapping keys (mapping:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "mapping:*" | find /c /v ""

echo.
echo Markdown keys (markdown:*):
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "markdown:*" | find /c /v ""

REM Ask for confirmation before deleting keys
echo.
echo ===== Delete Redis Keys =====
echo.
echo Do you want to delete Redis keys? (Y/N)
set /p DELETE_CONFIRM=

if /i "%DELETE_CONFIRM%" neq "Y" (
    echo.
    echo Key deletion cancelled.
    goto END
)

echo.
echo Which key pattern do you want to delete?
echo 1. All keys (*)
echo 2. Old CPT keys (cpt:code:*)
echo 3. Old ICD-10 keys (icd10:code:*)
echo 4. Old mapping keys (mapping:icd10-to-cpt:*)
echo 5. New CPT keys (cpt:*)
echo 6. New ICD-10 keys (icd10:*)
echo 7. New mapping keys (mapping:*)
echo 8. Markdown keys (markdown:*)
echo.
set /p PATTERN_CHOICE=

set KEY_PATTERN=
if "%PATTERN_CHOICE%"=="1" set KEY_PATTERN=*
if "%PATTERN_CHOICE%"=="2" set KEY_PATTERN=cpt:code:*
if "%PATTERN_CHOICE%"=="3" set KEY_PATTERN=icd10:code:*
if "%PATTERN_CHOICE%"=="4" set KEY_PATTERN=mapping:icd10-to-cpt:*
if "%PATTERN_CHOICE%"=="5" set KEY_PATTERN=cpt:*
if "%PATTERN_CHOICE%"=="6" set KEY_PATTERN=icd10:*
if "%PATTERN_CHOICE%"=="7" set KEY_PATTERN=mapping:*
if "%PATTERN_CHOICE%"=="8" set KEY_PATTERN=markdown:*

if "%KEY_PATTERN%"=="" (
    echo.
    echo Invalid choice. Exiting.
    goto END
)

echo.
echo You are about to delete keys matching pattern: %KEY_PATTERN%
echo Are you sure? (Y/N)
set /p FINAL_CONFIRM=

if /i "%FINAL_CONFIRM%" neq "Y" (
    echo.
    echo Key deletion cancelled.
    goto END
)

echo.
echo Deleting keys matching pattern: %KEY_PATTERN%
echo This may take some time for large key sets...

REM Use Lua script to delete keys by pattern
echo.
echo Running Lua script to delete keys by pattern...
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --eval "local keys = redis.call('keys', ARGV[1]); local count = 0; for i=1,#keys,1000 do local subset = {}; for j=i,math.min(i+999,#keys) do table.insert(subset, keys[j]); end; count = count + redis.call('del', unpack(subset)); end; return count;" 0 "%KEY_PATTERN%"

echo.
echo Key deletion complete.

REM Verify deletion
echo.
echo Verifying deletion...
echo Counting remaining keys matching pattern: %KEY_PATTERN%
docker run --rm redis:latest redis-cli -h %REDIS_HOST% -p %REDIS_PORT% -a %REDIS_PASSWORD% --tls --no-auth-warning --raw KEYS "%KEY_PATTERN%" | find /c /v ""

:END
echo.
echo Script execution complete.
echo Press any key to exit...
pause > nul