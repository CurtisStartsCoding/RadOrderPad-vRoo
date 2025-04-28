#!/bin/bash
echo "===== Running All API Tests ====="

echo
echo "Generating fresh tokens for all roles..."
cd ../../
node scripts/utilities/generate-all-role-tokens.js
cd debug-scripts/vercel-tests

echo
echo "===== Running Working Tests (Part 1) ====="
bash working-tests.sh

echo
echo "===== Running Working Tests (Part 2) ====="
bash working-tests-2.sh

echo
echo "===== All Tests Complete ====="