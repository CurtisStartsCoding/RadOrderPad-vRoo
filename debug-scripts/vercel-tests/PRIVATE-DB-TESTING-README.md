# Testing with Private AWS Databases

This guide explains how to test your application with your private AWS databases before locking down security.

## What We've Set Up

1. **Environment File with Private Database Connections**:
   - `debug-scripts/vercel-tests/.env.aws-test-private`
   - Contains connection strings for your private databases with the correct passwords

2. **Test Scripts**:
   - `test-private-db-no-verify.bat`: Tests with SSL certificate validation disabled
   - `test-private-db-verify.bat`: Tests with SSL certificate validation enabled

## How to Run the Tests

1. **Test with SSL Validation Disabled**:
   ```
   .\test-private-db-no-verify.bat
   ```
   This will run the Super Admin API test using your private databases with `sslmode=no-verify`.

2. **Test with SSL Validation Enabled**:
   ```
   .\test-private-db-verify.bat
   ```
   This will run the Super Admin API test using your private databases with `sslmode=verify`.

## What to Expect

1. If the test with `sslmode=no-verify` succeeds but the test with `sslmode=verify` fails, it means your private databases are working correctly, but the SSL certificate validation is failing. This is expected if you haven't set up proper SSL certificates yet.

2. If both tests succeed, it means your private databases are working correctly and the SSL certificates are valid.

3. If both tests fail, there might be an issue with the database connection strings or the databases themselves.

## Next Steps

1. If the tests with the private databases are successful, you can update your Vercel environment variables to point to the private databases:

   ```
   MAIN_DATABASE_URL=postgresql://postgres:password@radorderpad-main-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_main?sslmode=no-verify
   PHI_DATABASE_URL=postgresql://postgres:password2@radorderpad-phi-db.czi6ewycqxzy.us-east-2.rds.amazonaws.com:5432/radorder_phi?sslmode=no-verify
   ```

2. After updating the environment variables, redeploy your application:
   ```
   vercel --prod
   ```

3. Once you've confirmed that your application is working with the private databases, you can start locking down security by updating the security groups to only allow connections from your application servers.