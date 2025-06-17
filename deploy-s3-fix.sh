#!/bin/bash

# This script should be run on the server (ubuntu@ip-10-0-101-169)

echo "Deploying S3 upload fix..."

# Build the TypeScript code
echo "Building TypeScript..."
npm run build

# Restart the PM2 process
echo "Restarting RadOrderPad..."
pm2 restart RadOrderPad

# Wait for it to start
echo "Waiting for server to start..."
sleep 5

# Check PM2 status
pm2 status

echo ""
echo "Deployment complete!"
echo "Now run: ./test-s3-upload-complete.sh to test the fix"