# AWS Deployment Scripts

This document provides instructions for using the automated deployment scripts to deploy the RadOrderPad API to AWS Elastic Beanstalk.

## Prerequisites

- AWS CLI installed and configured with appropriate permissions
- Node.js and npm installed locally
- For Windows: PowerShell or 7-Zip for creating zip archives

## Available Scripts

Two deployment scripts are provided:

1. `deploy-to-aws.sh` - For Linux/macOS users
2. `deploy-to-aws.bat` - For Windows users

## Configuration

Before running the scripts, you need to update the configuration variables in the script:

### Environment Configuration

- `APP_NAME`: The name of your Elastic Beanstalk application
- `ENV_NAME`: The name of your Elastic Beanstalk environment
- `REGION`: The AWS region to deploy to (e.g., us-east-1)
- `PLATFORM`: The platform version to use (e.g., Node.js 18)

### Application Environment Variables

Update these with your actual values:

- `NODE_ENV`: Set to "production" for production deployments
- `MAIN_DATABASE_URL`: PostgreSQL connection string for the main database
- `PHI_DATABASE_URL`: PostgreSQL connection string for the PHI database
- `REDIS_CLOUD_HOST`: Redis Cloud host
- `REDIS_CLOUD_PORT`: Redis Cloud port
- `REDIS_CLOUD_PASSWORD`: Redis Cloud password
- `JWT_SECRET`: Secret key for JWT token generation
- `ANTHROPIC_API_KEY`: API key for Anthropic Claude

## Usage

### Linux/macOS

1. Make the script executable:
   ```bash
   chmod +x deploy-to-aws.sh
   ```

2. Run the script:
   ```bash
   ./deploy-to-aws.sh
   ```

### Windows

1. Open Command Prompt or PowerShell

2. Run the script:
   ```
   deploy-to-aws.bat
   ```

## What the Scripts Do

The deployment scripts automate the following steps:

1. Build the application using `npm run build`
2. Create a deployment package (zip file)
3. Create an Elastic Beanstalk application (if it doesn't exist)
4. Create an Elastic Beanstalk environment (if it doesn't exist)
5. Configure environment variables
6. Create a new application version
7. Upload the deployment package to S3
8. Update the environment with the new version
9. Wait for the deployment to complete
10. Display the URL of the deployed application

## Troubleshooting

### AWS CLI Authentication Issues

If you encounter authentication issues with the AWS CLI, make sure you have configured your AWS credentials correctly:

```bash
aws configure
```

### Deployment Package Issues

If the deployment package creation fails:

- For Linux/macOS: Make sure the `zip` command is installed
- For Windows: Make sure PowerShell or 7-Zip is installed

### Environment Variable Escaping

If you have special characters in your environment variables (like in passwords), you may need to properly escape them in the scripts.

## Customization

You can customize the scripts to add additional environment variables or configuration options as needed. The scripts are designed to be a starting point that you can adapt to your specific requirements.

## Continuous Integration

These scripts can be integrated into a CI/CD pipeline (like GitHub Actions, Jenkins, or GitLab CI) to automate deployments when changes are pushed to your repository.