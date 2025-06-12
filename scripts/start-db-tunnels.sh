#!/bin/bash

# Start SSH tunnels for RadOrderPad databases
echo "🚇 Starting database SSH tunnels..."

# Kill any existing tunnels
echo "Cleaning up old tunnels..."
pkill -f "ssh.*15432" 2>/dev/null
pkill -f "ssh.*15433" 2>/dev/null

# Start tunnels
echo "Starting Main DB tunnel (port 15432)..."
ssh -f -N -L 15432:radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432 -i ~/radorderpad-key-pair.pem ubuntu@3.129.73.23

echo "Starting PHI DB tunnel (port 15433)..."
ssh -f -N -L 15433:radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432 -i ~/radorderpad-key-pair.pem ubuntu@3.129.73.23

# Verify tunnels are running
sleep 1
if ps aux | grep -q "[s]sh.*15432" && ps aux | grep -q "[s]sh.*15433"; then
    echo "✅ Both tunnels are running!"
    echo ""
    echo "Database connections available at:"
    echo "  Main DB: localhost:15432"
    echo "  PHI DB:  localhost:15433"
else
    echo "❌ Failed to start tunnels"
    exit 1
fi