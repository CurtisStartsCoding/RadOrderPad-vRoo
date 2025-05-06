@echo off
echo ===== Redis Fuzzy Search + Prompt Comparison Test with Cache Warmup =====
echo.
echo This test will:
echo 1. Populate Redis with ALL data from PostgreSQL (cache warmup)
echo 2. Use Redis fuzzy search to get medical codes for the test case
echo 3. Test both old and new prompts with the same context
echo 4. Compare results across multiple LLMs (Claude, GPT, Grok)
echo 5. Focus on detecting rare diseases like hemochromatosis
echo.

echo Using Redis Cloud configuration from .env.production:
echo Host: redis-11584.crce197.us-east-2-1.ec2.redns.redis-cloud.com
echo Port: 11584
echo.

REM Install required packages if not already installed
echo Checking for required npm packages...
npm list axios || npm install axios
npm list dotenv || npm install dotenv
npm list openai || npm install openai
npm list ioredis || npm install ioredis

echo.
echo ===== Step 1: Warming up Redis Cache =====
echo.
echo Running populate-redis-full.js to load ALL data from PostgreSQL into Redis...
node scripts/redis/populate-redis-full.js

echo.
echo ===== Step 2: Running Prompt Comparison Test =====
echo.
echo Stopping any existing redis-prompt-comparison-test.js process...
taskkill /F /FI "WINDOWTITLE eq redis-prompt-comparison-test.js" /T >nul 2>&1

echo Running test with warmed-up Redis cache...
node debug-scripts/redis-optimization/redis-prompt-comparison-test.js

echo.
echo ===== Redis Prompt Comparison Test Complete =====
echo Results saved to debug-scripts/redis-optimization/redis-prompt-results/