# AWS Deployment Guide

This guide provides instructions for deploying the RadOrderPad API to AWS.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js and npm installed locally

## Deployment Options

### Option 1: Automated Deployment Scripts (Recommended)

We provide automated deployment scripts that handle the entire deployment process to AWS Elastic Beanstalk:

- For Linux/macOS: `deploy-to-aws.sh`
- For Windows: `deploy-to-aws.bat`

These scripts automate building the application, creating deployment packages, and deploying to AWS Elastic Beanstalk.

For detailed instructions on using these scripts, see [AWS Deployment Scripts](./aws-deployment-scripts.md).

### Option 2: AWS Elastic Beanstalk (Manual)

Elastic Beanstalk provides an easy way to deploy Node.js applications to AWS.

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

### Option 3: AWS EC2

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

## HTTPS Configuration with Application Load Balancer

For HIPAA compliance, all API traffic must be encrypted using HTTPS. We use AWS Application Load Balancer (ALB) to handle HTTPS termination and routing.

### Setting Up Application Load Balancer

1. **Create Target Groups**:
   - Go to EC2 → Load Balancing → Target Groups
   - Click "Create target group"
   - Choose target type: "Instances"
   - Name: `api-radorderpad-target`
   - Protocol: HTTP
   - Port: 3000 (the port your Node.js application is listening on)
   - VPC: Select your VPC where the EC2 instance is running
   - Health check settings:
     - Protocol: HTTP
     - Path: `/health`
   - Register your EC2 instance with this target group

2. **Create Application Load Balancer**:
   - Go to EC2 → Load Balancing → Load Balancers
   - Click "Create load balancer"
   - Select "Application Load Balancer"
   - Name: `radorderpad-alb`
   - Scheme: Internet-facing
   - IP address type: IPv4
   - VPC: Same as your EC2 instance
   - Select at least two Availability Zones and their public subnets
   - Security Group: Create a new security group with:
     - Inbound rules for HTTP (80) and HTTPS (443) from anywhere (0.0.0.0/0)
   - Listeners:
     - HTTP:80 - Redirect to HTTPS:443
     - HTTPS:443 - Forward to your target group
   - SSL Certificate: Upload or request a certificate for your domain
   - Security Policy: ELBSecurityPolicy-TLS-1-2-2017-01 (for HIPAA compliance)

3. **Update EC2 Security Group**:
   - Modify your EC2 instance's security group to:
     - Allow traffic on port 3000 only from the load balancer's security group
     - Remove any rules allowing direct public access to port 3000

### DNS Configuration with Cloudflare

We use Cloudflare for DNS management with the following configuration:

1. **DNS Records**:
   - CNAME record for `api.radorderpad.com` pointing to your ALB's DNS name
   - Set to "DNS Only" (gray cloud) to bypass Cloudflare's proxy for the API

2. **SSL/TLS Settings**:
   - SSL/TLS encryption mode: Full
   - Always Use HTTPS: Disabled (handled by AWS ALB)
   - Minimum TLS Version: 1.2

3. **Troubleshooting DNS Issues**:
   - If experiencing redirect loops, ensure "Always Use HTTPS" is disabled in Cloudflare
   - Verify that the load balancer's HTTP listener is configured to redirect to HTTPS
   - Check that security groups allow traffic on ports 80 and 443

### Testing the HTTPS Setup

To verify your HTTPS configuration:

```powershell
# Test direct access to the API
Invoke-WebRequest -Uri "https://api.radorderpad.com/health"

# Expected result: 200 OK with health check response
```

## Redis Cloud Configuration

The application uses Redis Cloud for caching and search functionality. To ensure proper connectivity:

1. **Find Your EC2 Public IP Address**:
   ```bash
   # Run this on your EC2 instance
   curl -s https://api.ipify.org
   ```
   This will return the public IP address that your EC2 instance uses for outbound connections.

2. **Configure Redis Cloud CIDR Allow List**:
   - Go to Redis Cloud Console → Your Database → Configuration
   - Under "CIDR allow list", add the public IP address from the previous step
   - Format: `your-ip-address/32` (e.g., `3.145.57.115/32`)
   - For testing purposes only, you can temporarily use `0.0.0.0/0` (not recommended for production)

3. **Verify Redis Connection**:
   - The application will log Redis connection status on startup
   - If Redis connection fails, the application will fall back to PostgreSQL
   - Check logs for "Redis Cloud connection test failed" messages

4. **Redis Environment Variables**:
   - Ensure these environment variables are correctly set:
     - `REDIS_CLOUD_HOST`
     - `REDIS_CLOUD_PORT`
     - `REDIS_CLOUD_PASSWORD`

5. **Troubleshooting Redis Connection Issues**:
   - If connection fails, verify the IP address hasn't changed (EC2 IPs can change when instances restart)
   - Consider using an Elastic IP for your EC2 instance to maintain a static public IP
   - Check that your security groups allow outbound traffic to Redis Cloud

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

### HTTPS and Load Balancer Issues

If you encounter issues with HTTPS or the load balancer:

1. Check that your EC2 instance is healthy in the target group
2. Verify that the security group allows traffic from the load balancer to the EC2 instance
3. Check that the load balancer listeners are correctly configured
4. If using Cloudflare, ensure there are no conflicting redirect rules

## HIPAA Compliance Considerations

For HIPAA compliance, ensure:

1. **Data Encryption**:
   - All data in transit is encrypted using HTTPS (TLS 1.2+)
   - All data at rest is encrypted (EBS volumes, RDS databases)

2. **Access Controls**:
   - EC2 security groups restrict access to necessary ports only
   - IAM roles follow principle of least privilege
   - Database users have appropriate permissions

3. **Logging and Monitoring**:
   - CloudWatch Logs capture application logs
   - CloudTrail is enabled for API activity logging
   - CloudWatch Alarms are set up for critical metrics

4. **Backup and Recovery**:
   - Regular database backups are configured
   - Disaster recovery plan is documented and tested

5. **Business Associate Agreements**:
   - Ensure AWS BAA is in place
   - Verify BAAs with any other service providers

## Monitoring and Logging

- Set up CloudWatch Logs for monitoring application logs
- Configure CloudWatch Alarms for key metrics
- Use X-Ray for tracing (optional)

## Deployment Scripts and Configuration Files

We have created several scripts and configuration files to simplify the deployment process:

### Configuration Files

1. **`.ebextensions/nodecommand.config`**: Configuration for Elastic Beanstalk Node.js environment
   - Sets Node.js version to 18
   - Configures the proxy server to nginx
   - Sets NODE_ENV to production

2. **`Procfile`**: Specifies the command to start the application
   - Contains `web: node dist/index.js`
   - This is an alternative to using `npm start`

3. **`eb-options.json`**: Sample configuration for AWS CLI deployment
   - Contains environment variables and instance configuration
   - Should be customized for your specific environment

### Deployment Scripts

1. **`create-deployment-package.bat`** (Windows): Creates a deployment package for AWS Elastic Beanstalk
   - Builds the TypeScript code
   - Installs production dependencies
   - Copies necessary files to a deployment directory
   - Creates a ZIP file for deployment

2. **`create-deployment-package.sh`** (Linux/macOS): Unix version of the deployment script
   - Performs the same steps as the Windows version

### Deployment Documentation

1. **`DEPLOYMENT_STEPS.md`**: Detailed instructions for deploying to AWS Elastic Beanstalk
   - Includes prerequisites
   - Step-by-step build and package instructions
   - AWS CLI commands for deployment
   - Environment variable configuration
   - Monitoring and troubleshooting tips
   - Rollback procedure

## Using the Deployment Scripts

To create a deployment package:

1. For Windows:
   ```
   create-deployment-package.bat
   ```

2. For Linux/macOS:
   ```
   chmod +x create-deployment-package.sh
   ./create-deployment-package.sh
   ```

This will create a `deployment.zip` file that can be uploaded to AWS Elastic Beanstalk.

For detailed deployment instructions, refer to the `DEPLOYMENT_STEPS.md` file.

## CORS Configuration for Replit Integration

If you're developing a frontend application on Replit that needs to communicate with your AWS-hosted API, you'll need to configure CORS (Cross-Origin Resource Sharing) to allow requests from Replit domains.

### Current CORS Configuration

The application is configured with the following CORS settings in `src/index.ts`:

```typescript
app.use(cors({
  origin: [
    'https://api.radorderpad.com',
    'https://app.radorderpad.com',
    'https://radorderpad.com',
    // Replit domains
    /\.repl\.co$/,        // Matches all Replit default domains (*.repl.co)
    /\.replit\.dev$/,     // Matches all Replit dev domains (*.replit.dev)
    // For local development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5000',
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,      // Allow cookies to be sent with requests
  maxAge: 86400          // Cache preflight requests for 24 hours
}));
```

### Replit Domain Patterns

Replit applications use the following domain patterns:

1. **Default Replit Domains**: `<app-name>.<username>.repl.co`
2. **Replit Dev Domains**: `<app-name>.<username>.replit.dev`
3. **Wildcard Patterns**:
   - The regex `/\.repl\.co$/` matches all Replit default domains
   - The regex `/\.replit\.dev$/` matches all Replit dev domains

### Customizing CORS for Your Replit App

If you're using a specific Replit app or custom domain, you may need to update the CORS configuration:

1. **For a specific Replit app**:
   - Add the exact domain: `'https://your-app-name.your-username.repl.co'`

2. **For a custom domain linked to your Replit app**:
   - Add the custom domain: `'https://your-custom-domain.com'`

3. **After making changes**:
   - Rebuild and redeploy your application
   - Test the CORS configuration by making requests from your Replit app to your API

### Testing CORS Configuration

To verify your CORS configuration is working correctly:

1. From your Replit app, make a fetch request to your API:
   ```javascript
   fetch('https://api.radorderpad.com/health', {
     method: 'GET',
     credentials: 'include' // If using credentials
   })
   .then(response => response.json())
   .then(data => console.log(data))
   .catch(error => console.error('Error:', error));
   ```

2. Check the browser console for any CORS-related errors
3. If you see errors, verify that your Replit domain is correctly included in the CORS configuration