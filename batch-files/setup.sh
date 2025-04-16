#!/bin/bash
# setup.sh
# Script to set up and run the RadOrderPad backend API
# Date: 2025-04-13

echo "==================================================="
echo "RadOrderPad Backend API Setup"
echo "==================================================="

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Start the server
echo "Starting the server..."
npm start

echo "==================================================="
echo "Setup complete!"
echo "==================================================="