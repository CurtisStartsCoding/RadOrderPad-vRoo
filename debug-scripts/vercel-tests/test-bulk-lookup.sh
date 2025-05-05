#!/bin/bash
echo "===== Testing Bulk Lookup ====="

echo "Loading environment variables from .env.production"
export NODE_ENV=production
node -r dotenv/config debug-scripts/vercel-tests/test-bulk-lookup.js

echo "===== Bulk Lookup Test Complete ====="