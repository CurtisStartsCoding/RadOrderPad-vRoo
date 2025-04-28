#!/bin/bash

echo "===== TESTING AND DEPLOYING FIXED SEND-TO-RADIOLOGY IMPLEMENTATION ====="
echo

# Step 1: Run the test script
echo "Step 1: Running test script..."
node test-send-to-radiology-fixed.js
echo

# Step 2: Ask for confirmation to deploy
echo "Step 2: Confirm deployment"
read -p "Do you want to deploy the fixed implementation? (y/n): " DEPLOY

if [[ $DEPLOY != "y" && $DEPLOY != "Y" ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Step 3: Create deployment package
echo "Step 3: Creating deployment package..."
chmod +x create-deployment-package.sh
./create-deployment-package.sh
echo

# Step 4: Deploy to AWS
echo "Step 4: Deploying to AWS..."
chmod +x deploy-to-aws.sh
./deploy-to-aws.sh
echo

echo "===== DEPLOYMENT COMPLETE ====="
echo "The fixed send-to-radiology implementation has been deployed."
echo "You can now use the /api/admin/orders/:orderId/send-to-radiology-fixed endpoint."
echo

read -p "Press Enter to continue..."