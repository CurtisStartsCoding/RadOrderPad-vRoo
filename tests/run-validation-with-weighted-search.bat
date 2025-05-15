@echo off
echo Testing Validation with Weighted Search...

set DEV_MAIN_DATABASE_URL=postgresql://postgres:SimplePassword123@radorderpad-main-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=no-verify
set DEV_PHI_DATABASE_URL=postgresql://postgres:SimplePassword123@radorderpad-phi-public.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=no-verify
set NODE_ENV=production
set REDIS_CLOUD_HOST=redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
set REDIS_CLOUD_PORT=11584
set REDIS_CLOUD_PASSWORD=zHUbspGPcewJsoT9G9TSQncuSl0v0MUH

node tests/test-validation-with-weighted-search.js
echo.
echo Test completed.
pause