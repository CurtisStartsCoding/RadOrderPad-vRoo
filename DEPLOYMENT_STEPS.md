# RadOrderPad API Deployment Steps

This document outlines the steps required to build and deploy the RadOrderPad API to AWS Elastic Beanstalk.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js and npm installed locally

## Build and Package Steps

### 1. Install Production Dependencies

```bash
# Clean install of production dependencies only
npm ci --omit=dev
```

This command installs only the dependencies listed in the `dependencies` section of package.json, omitting the `devDependencies`. It uses the exact versions specified in package-lock.json for consistent installations.

### 2. Build the TypeScript Code

```bash
# Build the TypeScript code
npm run build
```

This command compiles the TypeScript code to JavaScript in the `dist` directory according to the configuration in tsconfig.json.

### 3. Create the Deployment Package

```bash
# Create a deployment directory
mkdir -p deployment

# Copy necessary files to the deployment directory
cp -r dist package.json package-lock.json .ebextensions Procfile .env.example deployment/

# Create the deployment ZIP file
cd deployment
zip -r ../deployment.zip .
cd ..
```

This creates a ZIP file containing only the necessary files for deployment:
- `dist/`: The compiled JavaScript code
- `package.json` and `package-lock.json`: For dependency installation
- `.ebextensions/`: Configuration files for Elastic Beanstalk
- `Procfile`: (Optional) Specifies the command to start the application
- `.env.example`: Example environment variables (for reference)

## Deployment Steps

### 1. Create a New Elastic Beanstalk Application (First Time Only)

```bash
# Create a new Elastic Beanstalk application
aws elasticbeanstalk create-application --application-name radorderpad-api --description "RadOrderPad Backend API"
```

### 2. Create a New Environment or Update an Existing One

#### Create a New Environment

```bash
# Create a new environment
aws elasticbeanstalk create-environment \
  --application-name radorderpad-api \
  --environment-name radorderpad-api-prod \
  --solution-stack-name "64bit Amazon Linux 2 v5.8.0 running Node.js 18" \
  --option-settings file://eb-options.json
```

The `eb-options.json` file should contain environment-specific configuration, including environment variables.

#### Update an Existing Environment

```bash
# Update an existing environment
aws elasticbeanstalk update-environment \
  --environment-name radorderpad-api-prod \
  --option-settings file://eb-options.json
```

### 3. Deploy the Application

```bash
# Deploy the application
aws elasticbeanstalk create-application-version \
  --application-name radorderpad-api \
  --version-label v1.0.0-$(date +%Y%m%d%H%M%S) \
  --source-bundle S3Bucket="your-deployment-bucket",S3Key="deployment.zip"

# Update the environment to use the new version
aws elasticbeanstalk update-environment \
  --environment-name radorderpad-api-prod \
  --version-label v1.0.0-$(date +%Y%m%d%H%M%S)
```

## Pre-Deployment Audit

Before deploying the application, it's recommended to run the deployment configuration audit script to identify potential issues:

```bash
# For Windows
debug-scripts\run-deployment-audit.bat

# For Linux/macOS
chmod +x debug-scripts/run-deployment-audit.sh
./debug-scripts/run-deployment-audit.sh
```

This script will scan the codebase for:
- Hardcoded URLs, hostnames, and ports
- Environment variable usage
- Configuration patterns that might cause issues in production

The script generates a detailed report (`debug-scripts/deployment-audit-report.md`) with findings and recommendations. Review this report and address any issues before proceeding with deployment.

Common issues to address:
- Replace hardcoded localhost references with environment variables
- Ensure all environment variables are properly set in the Elastic Beanstalk environment
- Use HTTPS instead of HTTP for production environments
- Replace hardcoded port references with environment variables

## Environment Variables

The following environment variables should be set in the Elastic Beanstalk environment:

- `NODE_ENV`: Set to `production`
- `MAIN_DATABASE_URL`: PostgreSQL connection string for the main database
- `PHI_DATABASE_URL`: PostgreSQL connection string for the PHI database
- `REDIS_CLOUD_HOST`: Redis host
- `REDIS_CLOUD_PORT`: Redis port
- `REDIS_CLOUD_PASSWORD`: Redis password
- `JWT_SECRET`: Secret for JWT token generation and validation
- Other application-specific environment variables

## Monitoring and Troubleshooting

- Monitor the application logs in CloudWatch Logs
- Set up CloudWatch Alarms for key metrics
- Use the Elastic Beanstalk console to view events and logs

## Rollback Procedure

If issues are encountered after deployment:

```bash
# List available versions
aws elasticbeanstalk describe-application-versions --application-name radorderpad-api

# Roll back to a previous version
aws elasticbeanstalk update-environment \
  --environment-name radorderpad-api-prod \
  --version-label <previous-version-label>