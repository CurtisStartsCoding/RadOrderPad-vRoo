#!/bin/bash
echo "Running Super Admin API Tests..."
npx mocha tests/superadmin-api.test.js --timeout 10000