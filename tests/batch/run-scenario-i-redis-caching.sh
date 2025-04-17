#!/bin/bash
echo "Running Scenario I: Redis Caching Test..."
node tests/e2e/scenario-i-redis-caching.js
if [ $? -ne 0 ]; then
  echo "Scenario I: Redis Caching Test FAILED"
  exit 1
else
  echo "Scenario I: Redis Caching Test PASSED"
  exit 0
fi