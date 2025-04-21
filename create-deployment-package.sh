#!/bin/bash
echo "Creating deployment package for AWS Elastic Beanstalk..."

# Create a clean deployment directory
rm -rf deployment
mkdir -p deployment

# Build the TypeScript code
echo "Building TypeScript code..."
npm run build

# Install production dependencies
echo "Installing production dependencies..."
cd deployment
npm init -y
npm install --omit=dev --prefix ../ --package-lock-only
npm ci --omit=dev --prefix ../

# Copy necessary files to the deployment directory
echo "Copying necessary files..."
cp -r ../dist ./
cp ../package.json ./
cp ../package-lock.json ./
mkdir -p .ebextensions
cp ../Procfile ./
cp ../.ebextensions/* ./.ebextensions/

# Create the deployment ZIP file
echo "Creating deployment.zip..."
zip -r ../deployment.zip ./*

# Clean up
cd ..
echo "Deployment package created: deployment.zip"

echo ""
echo "Next steps:"
echo "1. Upload deployment.zip to AWS Elastic Beanstalk"
echo "2. Configure environment variables in the Elastic Beanstalk console"
echo "3. Deploy the application"