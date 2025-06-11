#!/bin/bash

# Script to run migration with SSH tunnel to AWS RDS
# Date: 2025-06-11

echo "🔐 Setting up SSH tunnel for database migration..."

# Configuration
SSH_KEY_PATH="./temp/radorderpad-key-pair.pem"
BASTION_HOST="ec2-3-145-161-19.us-east-2.compute.amazonaws.com"
BASTION_USER="ec2-user"
LOCAL_PORT=5433
RDS_ENDPOINT="radorderpad-db.crce197.us-east-2.rds.amazonaws.com"
RDS_PORT=5432

# Check if SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ SSH key not found at $SSH_KEY_PATH"
    echo "Please ensure the PEM key is in the project root"
    exit 1
fi

# Set proper permissions on SSH key
chmod 400 "$SSH_KEY_PATH"

# Kill any existing tunnel on the local port
echo "🧹 Cleaning up any existing tunnels..."
lsof -ti:$LOCAL_PORT | xargs kill -9 2>/dev/null

# Create SSH tunnel
echo "🚇 Creating SSH tunnel..."
echo "   Bastion: $BASTION_USER@$BASTION_HOST"
echo "   RDS: $RDS_ENDPOINT:$RDS_PORT"
echo "   Local port: $LOCAL_PORT"

ssh -f -N -L $LOCAL_PORT:$RDS_ENDPOINT:$RDS_PORT -i "$SSH_KEY_PATH" $BASTION_USER@$BASTION_HOST

# Wait a moment for tunnel to establish
sleep 2

# Check if tunnel is established
if lsof -Pi :$LOCAL_PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ SSH tunnel established successfully!"
    
    # Run the migration
    echo ""
    echo "🚀 Running migration through tunnel..."
    USE_PRIVATE_DB=true NODE_ENV=production node scripts/run-migration-production.js
    
    # Kill the tunnel after migration
    echo ""
    echo "🧹 Cleaning up SSH tunnel..."
    lsof -ti:$LOCAL_PORT | xargs kill -9 2>/dev/null
    echo "✅ Tunnel closed"
else
    echo "❌ Failed to establish SSH tunnel"
    exit 1
fi