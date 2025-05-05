#!/bin/bash
echo "===== Testing Rate Limiting ====="

echo "Loading environment variables from .env.production"
export NODE_ENV=production
node -r dotenv/config debug-scripts/vercel-tests/test-rate-limit.js

echo "===== Rate Limit Test Complete ====="