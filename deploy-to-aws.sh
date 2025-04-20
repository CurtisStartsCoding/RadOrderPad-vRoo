#!/bin/bash
# AWS Elastic Beanstalk Deployment Script
# This script automates the deployment of the RadOrderPad API to AWS Elastic Beanstalk

# Exit on error
set -e

# Configuration
APP_NAME="radorderpad-api"
ENV_NAME="radorderpad-api-prod"
REGION="us-east-1"  # Change to your preferred region
PLATFORM="Node.js 18"
PLATFORM_ARN="arn:aws:elasticbeanstalk:${REGION}::platform/Node.js 18 running on 64bit Amazon Linux 2/5.8.0"

# Environment variables (replace with your actual values)
NODE_ENV="production"
MAIN_DATABASE_URL="postgresql://username:password@hostname:port/radorder_main"
PHI_DATABASE_URL="postgresql://username:password@hostname:port/radorder_phi"
REDIS_CLOUD_HOST="your-redis-host"
REDIS_CLOUD_PORT="your-redis-port"
REDIS_CLOUD_PASSWORD="your-redis-password"
JWT_SECRET="your-jwt-secret"
ANTHROPIC_API_KEY="your-anthropic-api-key"

echo "Starting deployment process..."

# Step 1: Build the application
echo "Building application..."
npm run build

# Step 2: Create deployment package
echo "Creating deployment package..."
if [ ! -d ".ebextensions" ]; then
  mkdir .ebextensions
  cat > .ebextensions/nodecommand.config << EOL
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "node dist/index.js"
EOL
fi

zip -r deployment.zip dist/ package.json package-lock.json .ebextensions/ .env.example

# Step 3: Check if application exists
echo "Checking if application exists..."
if ! aws elasticbeanstalk describe-applications --application-names $APP_NAME > /dev/null 2>&1; then
  echo "Creating application $APP_NAME..."
  aws elasticbeanstalk create-application --application-name $APP_NAME --description "RadOrderPad API"
else
  echo "Application $APP_NAME already exists."
fi

# Step 4: Check if environment exists
echo "Checking if environment exists..."
if ! aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --application-name $APP_NAME | grep -q $ENV_NAME; then
  echo "Creating environment $ENV_NAME..."
  aws elasticbeanstalk create-environment \
    --application-name $APP_NAME \
    --environment-name $ENV_NAME \
    --solution-stack-name "$PLATFORM" \
    --option-settings \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=NODE_ENV,Value=$NODE_ENV \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=MAIN_DATABASE_URL,Value=$MAIN_DATABASE_URL \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=PHI_DATABASE_URL,Value=$PHI_DATABASE_URL \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_HOST,Value=$REDIS_CLOUD_HOST \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PORT,Value=$REDIS_CLOUD_PORT \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=REDIS_CLOUD_PASSWORD,Value=$REDIS_CLOUD_PASSWORD \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=JWT_SECRET,Value=$JWT_SECRET \
      Namespace=aws:elasticbeanstalk:application:environment,OptionName=ANTHROPIC_API_KEY,Value=$ANTHROPIC_API_KEY
  
  echo "Waiting for environment to be created..."
  aws elasticbeanstalk wait environment-exists --environment-names $ENV_NAME --application-name $APP_NAME
else
  echo "Environment $ENV_NAME already exists."
fi

# Step 5: Create new application version
echo "Creating new application version..."
VERSION_LABEL="v$(date +%Y%m%d%H%M%S)"
aws elasticbeanstalk create-application-version \
  --application-name $APP_NAME \
  --version-label $VERSION_LABEL \
  --source-bundle S3Bucket="elasticbeanstalk-$REGION-$(aws sts get-caller-identity --query 'Account' --output text)",S3Key="$APP_NAME/deployment.zip" \
  --auto-create-application

# Step 6: Upload deployment package to S3
echo "Uploading deployment package to S3..."
aws s3 cp deployment.zip "s3://elasticbeanstalk-$REGION-$(aws sts get-caller-identity --query 'Account' --output text)/$APP_NAME/deployment.zip"

# Step 7: Update environment with new version
echo "Updating environment with new version..."
aws elasticbeanstalk update-environment \
  --application-name $APP_NAME \
  --environment-name $ENV_NAME \
  --version-label $VERSION_LABEL

echo "Deployment initiated. Checking status..."

# Step 8: Wait for deployment to complete
echo "Waiting for deployment to complete..."
aws elasticbeanstalk wait environment-updated --environment-names $ENV_NAME --application-name $APP_NAME

# Step 9: Get environment URL
ENV_URL=$(aws elasticbeanstalk describe-environments --environment-names $ENV_NAME --application-name $APP_NAME --query 'Environments[0].CNAME' --output text)

echo "Deployment completed successfully!"
echo "Your application is available at: http://$ENV_URL"