@echo off
echo ===== Testing Bulk Lookup =====

echo Loading environment variables from .env.production
set NODE_ENV=production

echo Stopping any existing test-bulk-lookup.js process...
taskkill /F /FI "WINDOWTITLE eq test-bulk-lookup.js" /T >nul 2>&1

echo Running test...
node debug-scripts/vercel-tests/test-bulk-lookup.js

echo ===== Bulk Lookup Test Complete =====
