#!/bin/bash
echo "Running Trial Feature Tests..."
cd "$(dirname "$0")/../.."
export NODE_ENV=test
npx mocha tests/trial-feature.test.js --timeout 10000