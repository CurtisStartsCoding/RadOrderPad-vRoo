@echo off
echo Running TypeScript and linting checks on Redis weighted search implementation...
echo.

echo Step 1: TypeScript type checking...
call npx tsc --noEmit src/utils/redis/search/weighted-search.ts src/utils/redis/search/mapping-search-weighted.ts src/utils/redis/search/markdown-search-weighted.ts src/utils/database/redis-context-generator-weighted.ts
if %errorlevel% neq 0 (
  echo TypeScript check failed!
  exit /b %errorlevel%
)
echo TypeScript check passed!
echo.

echo Step 2: ESLint checking...
call npx eslint src/utils/redis/search/weighted-search.ts src/utils/redis/search/mapping-search-weighted.ts src/utils/redis/search/markdown-search-weighted.ts src/utils/database/redis-context-generator-weighted.ts
if %errorlevel% neq 0 (
  echo ESLint check failed!
  exit /b %errorlevel%
)
echo ESLint check passed!
echo.

echo Step 3: Building the project...
call npm run build
if %errorlevel% neq 0 (
  echo Build failed!
  exit /b %errorlevel%
)
echo Build successful!
echo.

echo Step 4: Running validation test with weighted search...
call node tests/test-validation-with-weighted-search.js
if %errorlevel% neq 0 (
  echo Test failed!
  exit /b %errorlevel%
)
echo Test completed successfully!
echo.

echo All checks passed!
echo The Redis weighted search implementation is working correctly.
pause