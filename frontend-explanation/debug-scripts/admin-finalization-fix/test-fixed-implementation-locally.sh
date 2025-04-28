#!/bin/bash

echo "===== TESTING FIXED SEND-TO-RADIOLOGY IMPLEMENTATION LOCALLY ====="
echo

# Step 1: Start the server in the background
echo "Step 1: Starting the server..."
npm run dev &
SERVER_PID=$!
echo "Server starting in the background with PID: $SERVER_PID. Waiting 10 seconds for it to initialize..."
sleep 10
echo

# Step 2: Run the test script
echo "Step 2: Running test script..."
echo "Updating API_BASE_URL to use localhost..."
export API_BASE_URL=http://localhost:3000/api
node test-send-to-radiology-fixed.js
echo

# Step 3: Ask if user wants to stop the server
echo "Step 3: Server management"
read -p "Do you want to stop the server? (y/n): " STOP_SERVER

if [[ $STOP_SERVER == "y" || $STOP_SERVER == "Y" ]]; then
    echo "Stopping the server..."
    kill $SERVER_PID
    echo "Server stopped."
else
    echo "Server is still running in the background with PID: $SERVER_PID."
    echo "To stop it manually, use: kill $SERVER_PID"
fi

echo
echo "===== LOCAL TESTING COMPLETE ====="
echo
read -p "Press Enter to continue..."