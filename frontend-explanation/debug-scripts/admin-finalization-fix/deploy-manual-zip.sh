#!/bin/bash

echo "===== DEPLOYING FIXED IMPLEMENTATION TO AWS ELASTIC BEANSTALK ====="
echo

# Check if deployment-manual.zip exists
if [ ! -f deployment-manual.zip ]; then
    echo "Error: deployment-manual.zip not found."
    echo "Please run create-deployment-zip-manual.sh first."
    exit 1
fi

# Check if eb CLI is installed
if ! command -v eb &> /dev/null; then
    echo "Error: AWS Elastic Beanstalk CLI (eb) not found."
    echo "Please install the EB CLI: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html"
    exit 1
fi

# Deploy to AWS Elastic Beanstalk
echo "Deploying to AWS Elastic Beanstalk..."
echo

# Read environment name from eb-options.json
EB_ENV=$(grep -o '"environment-name": *"[^"]*"' eb-options.json | cut -d'"' -f4)

# Deploy using the EB CLI
echo "Using environment: $EB_ENV"
eb deploy $EB_ENV --staged --label fixed-admin-finalization-$(date +%Y%m%d-%H%M) --timeout 20

echo
echo "===== DEPLOYMENT COMPLETE ====="
echo
echo "The fixed send-to-radiology implementation has been deployed to AWS Elastic Beanstalk."
echo "You can now use the /api/admin/orders/:orderId/send-to-radiology-fixed endpoint."
echo

read -p "Press Enter to continue..."