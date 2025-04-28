# Vercel Tests and Database Testing Scripts

This directory contains scripts and configuration files for testing the application with different database configurations, particularly for testing the migration from public to private AWS databases.

## Environment Files

- `.env.aws-test-private`: Configuration for testing with private AWS databases using `sslmode=no-verify`
- `.env.aws-test-new`: Template for testing with custom AWS databases
- `.env.aws-test-verify`: Generated file for testing with SSL verification enabled

## Test Scripts

### Private Database Testing

- `test-private-db-no-verify.bat`: Tests connectivity to private databases with SSL validation disabled
- `test-private-db-verify.bat`: Tests connectivity to private databases with SSL validation enabled

### General Testing

- `run-superadmin-api-test.bat`: Tests the Super Admin API functionality
- `test-superadmin-api.js`: JavaScript implementation of Super Admin API tests
- `test-radiology-request-info.js`: Tests for the radiology request info endpoint

## How to Use

1. **Test Private Databases**:
   ```
   .\test-private-db-no-verify.bat
   ```
   This will run the Super Admin API test using the private databases with `sslmode=no-verify`.

2. **Test with SSL Validation**:
   ```
   .\test-private-db-verify.bat
   ```
   This will run the Super Admin API test using the private databases with `sslmode=verify`.

## Server Configuration

The server has been configured with additional environment variables to support switching between public and private databases:

- `PRIVATE_MAIN_DATABASE_URL`: Connection string for the private main database
- `PRIVATE_PHI_DATABASE_URL`: Connection string for the private PHI database
- `USE_PRIVATE_DB`: Flag to control which database set to use (true/false)

The database configuration in `src/config/db-config.ts` has been updated to use these variables based on the `USE_PRIVATE_DB` flag.

## Security Notes

- The `.env.*` files in this directory are excluded from Git to prevent credentials from being committed
- When testing is complete, you can lock down the security on the private databases
- For production use, proper SSL certificates should be set up to allow `sslmode=verify`