# Debug Scripts

This directory contains various scripts and tools for debugging, testing, and maintaining the application.

## Subdirectories

### vercel-tests

The `vercel-tests` directory contains scripts and configuration files for testing the application deployed on Vercel, particularly for database connectivity testing. See the [vercel-tests README](./vercel-tests/README.md) for more details.

## Purpose

These scripts are included in the repository to facilitate:

1. **Database Testing**: Testing connectivity to different database configurations
2. **API Testing**: Verifying API endpoints are working correctly
3. **Deployment Testing**: Ensuring the application deploys and runs correctly on Vercel
4. **Migration Testing**: Testing database migrations and changes

## Usage Notes

- Most scripts are designed to be run from the project root directory
- Some scripts may require environment variables to be set
- Scripts with sensitive information use `.env` files that are excluded from Git

## Important Files

- `vercel-tests/test-private-db-no-verify.bat`: Test connectivity to private databases
- `vercel-tests/test-private-db-verify.bat`: Test connectivity with SSL verification
- `vercel-tests/test-superadmin-api.js`: Test Super Admin API functionality
- `vercel-tests/test-radiology-request-info.js`: Test radiology request info endpoint

## Security Considerations

- Environment files (`.env.*`) are excluded from Git to prevent credentials from being committed
- When using these scripts in production environments, ensure proper security measures are in place
- For database testing, consider using test databases rather than production databases when possible