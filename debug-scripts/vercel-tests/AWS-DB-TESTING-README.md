# Testing with New AWS Database

This guide explains how to test your application with a new AWS database before locking it down.

## Setup

1. Edit the environment file `debug-scripts/vercel-tests/.env.aws-test-new` to include your new AWS database connection strings:

```
# Replace these with your new AWS database connection strings
MAIN_DATABASE_URL=postgresql://postgres:YourPassword@your-new-aws-main-db.region.rds.amazonaws.com:5432/radorder_main?sslmode=no-verify
DEV_MAIN_DATABASE_URL=postgresql://postgres:YourPassword@your-new-aws-main-db.region.rds.amazonaws.com:5432/radorder_main?sslmode=no-verify
PHI_DATABASE_URL=postgresql://postgres:YourPassword@your-new-aws-phi-db.region.rds.amazonaws.com:5432/radorder_phi?sslmode=no-verify
DEV_PHI_DATABASE_URL=postgresql://postgres:YourPassword@your-new-aws-phi-db.region.rds.amazonaws.com:5432/radorder_phi?sslmode=no-verify

# Also update these production URLs
PROD_MAIN_DATABASE_URL=postgresql://postgres:YourPassword@your-new-aws-main-db.region.rds.amazonaws.com:5432/radorder_main?sslmode=no-verify
PROD_PHI_DATABASE_URL=postgresql://postgres:YourPassword@your-new-aws-phi-db.region.rds.amazonaws.com:5432/radorder_phi?sslmode=no-verify
```

2. Also update the host information:

```
PROD_MAIN_DB_HOST=your-new-aws-main-db.region.rds.amazonaws.com
PROD_PHI_DB_HOST=your-new-aws-phi-db.region.rds.amazonaws.com
```

## Testing with sslmode=no-verify

Run the following script to test with SSL certificate validation disabled:

```
.\test-aws-db-no-verify.bat
```

This will run the Super Admin API test using your new AWS database with `sslmode=no-verify`.

## Testing with sslmode=verify

Run the following script to test with SSL certificate validation enabled:

```
.\test-aws-db-verify.bat
```

This will run the Super Admin API test using your new AWS database with `sslmode=verify`.

## What to Expect

1. If the test with `sslmode=no-verify` succeeds but the test with `sslmode=verify` fails, it means your AWS database is working correctly, but the SSL certificate validation is failing. This is expected if you haven't set up proper SSL certificates yet.

2. If both tests succeed, it means your AWS database is working correctly and the SSL certificates are valid.

3. If both tests fail, there might be an issue with the database connection strings or the database itself.

## Next Steps

1. If you need to use `sslmode=no-verify` temporarily, you can update your Vercel environment variables to use this mode.

2. For production, it's recommended to set up proper SSL certificates and use `sslmode=verify` for better security.

3. After testing, you can lock down your AWS database by updating the security groups to only allow connections from your application servers.