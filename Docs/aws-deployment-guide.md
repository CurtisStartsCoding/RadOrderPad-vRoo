# AWS Deployment Guide

This guide provides instructions for deploying the RadOrderPad API to AWS.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js and npm installed locally

## Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended)

Elastic Beanstalk provides the easiest way to deploy Node.js applications to AWS.

1. **Prepare your application**:
   ```bash
   # Build the application
   npm run build
   
   # Create a deployment package
   zip -r deployment.zip dist/ package.json package-lock.json .ebextensions/ .env.example
   ```

2. **Create an Elastic Beanstalk application**:
   - Go to the AWS Management Console
   - Navigate to Elastic Beanstalk
   - Click "Create Application"
   - Enter application details:
     - Application name: `radorderpad-api`
     - Platform: Node.js
     - Platform branch: Node.js 18
     - Application code: Upload your deployment.zip file

3. **Configure environment variables**:
   - In the Elastic Beanstalk console, go to your environment
   - Navigate to Configuration > Software
   - Add the following environment variables:
     - `NODE_ENV=production`
     - `MAIN_DATABASE_URL=postgresql://username:password@hostname:port/radorder_main`
     - `PHI_DATABASE_URL=postgresql://username:password@hostname:port/radorder_phi`
     - `REDIS_CLOUD_HOST=your-redis-host`
     - `REDIS_CLOUD_PORT=your-redis-port`
     - `REDIS_CLOUD_PASSWORD=your-redis-password`
     - Add other required environment variables from your .env file

4. **Deploy your application**:
   - Elastic Beanstalk will automatically deploy your application
   - Monitor the deployment in the Events tab

### Option 2: AWS EC2

For more control over the deployment environment:

1. **Launch an EC2 instance**:
   - Amazon Linux 2 or Ubuntu Server are recommended
   - t3.small or larger instance type
   - Configure security groups to allow HTTP/HTTPS traffic

2. **Install dependencies**:
   ```bash
   # For Amazon Linux
   sudo yum update -y
   sudo yum install -y nodejs npm git
   
   # For Ubuntu
   sudo apt update
   sudo apt install -y nodejs npm git
   ```

3. **Deploy your application**:
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/RadOrderPad.git
   cd RadOrderPad
   
   # Install dependencies
   npm install --production
   
   # Build the application
   npm run build
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your production settings
   
   # Start the application with PM2
   npm install -g pm2
   pm2 start dist/index.js --name "radorderpad-api"
   pm2 save
   pm2 startup
   ```

## Module System Configuration

The RadOrderPad API uses CommonJS modules for compatibility with Node.js. This configuration is already set up in the repository:

- `package.json` does not include `"type": "module"`
- `tsconfig.json` includes `"module": "CommonJS"`

This ensures that the TypeScript code is compiled to CommonJS format, which is compatible with Node.js without requiring file extensions in import statements.

## Database Configuration

The application requires two PostgreSQL databases:

1. **Main Database**: Stores application data, user information, and configuration
2. **PHI Database**: Stores protected health information (PHI)

Make sure to set up both databases and provide the connection strings as environment variables.

## Redis Configuration

The application uses Redis for caching and search functionality:

1. **Redis Cloud**: The application is configured to use Redis Cloud by default
2. **Environment Variables**: Make sure to set the Redis environment variables:
   - `REDIS_CLOUD_HOST`
   - `REDIS_CLOUD_PORT`
   - `REDIS_CLOUD_PASSWORD`

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution issues:

1. Verify that the `package.json` file does not include `"type": "module"`
2. Verify that the `tsconfig.json` file includes `"module": "CommonJS"`
3. Rebuild the application with `npm run build`

See `Docs/module-system-fix.md` for more details on the module system configuration.

### Database Connection Issues

If you encounter database connection issues:

1. Verify that the database connection strings are correctly set in the environment variables
2. Verify that the security groups allow traffic from the application to the database
3. Verify that the database user has the necessary permissions

## Monitoring and Logging

- Set up CloudWatch Logs for monitoring application logs
- Configure CloudWatch Alarms for key metrics
- Use X-Ray for tracing (optional)