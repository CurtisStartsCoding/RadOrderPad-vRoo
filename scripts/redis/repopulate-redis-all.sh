#!/bin/bash

echo "========================================"
echo "Redis Full Repopulation Script"
echo "========================================"
echo ""
echo "This script will:"
echo "1. Clear all existing Redis data"
echo "2. Repopulate Redis with ALL database records"
echo ""
echo "Press Ctrl+C to cancel or Enter to continue..."
read -r

# Navigate to project root
cd "$(dirname "$0")/../.." || exit

echo ""
echo "Running Redis repopulation..."
node scripts/redis/repopulate-redis-all.js

echo ""
echo "Redis repopulation complete!"