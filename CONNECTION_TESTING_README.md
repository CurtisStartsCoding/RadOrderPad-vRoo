# Connection Management Testing

This directory contains scripts for testing the connection management functionality of the RadOrderPad API. These scripts allow you to create test relationships between organizations and test all connection-related endpoints.

## Overview

The connection management functionality allows organizations to establish relationships with each other. The following endpoints are available:

- `GET /api/connections`: List connections for the admin's organization
- `GET /api/connections/requests`: List pending incoming connection requests
- `POST /api/connections/{relationshipId}/approve`: Approve a pending incoming request
- `POST /api/connections/{relationshipId}/reject`: Reject a pending incoming request
- `DELETE /api/connections/{relationshipId}`: Terminate an active connection

## Scripts

### 1. Token Generation

Before running the tests, you need to generate authentication tokens for the admin roles:

```bash
# Windows
node generate-all-role-tokens.js

# Unix/Linux/macOS
node generate-all-role-tokens.js
```

This script will:
- Log in with test credentials for each role
- Save the tokens to separate files in the `tokens` directory
- Create convenience scripts for setting environment variables

### 2. Create Test Relationships

To test the connection endpoints, you need to create test relationships between organizations:

```bash
# Windows
run-create-test-relationships.bat

# Unix/Linux/macOS
./run-create-test-relationships.sh
```

This script will:
- Insert test relationships with different statuses into the organization_relationships table
- Create relationships between existing organizations with different statuses
- Check if organizations and users exist before creating relationships
- Update existing relationships if they already exist

The script creates the following test relationships:
1. A pending relationship between organizations 1 and 2
2. An active relationship between organizations 3 and 4
3. A rejected relationship between organizations 5 and 6
4. A terminated relationship between organizations 7 and 8

### 3. Test Connection Endpoints

After generating tokens and creating test relationships, you can test all connection endpoints:

```bash
# Windows
run-test-connection-endpoints.bat

# Unix/Linux/macOS
./run-test-connection-endpoints.sh
```

This script will:
- Load authentication tokens for admin_referring and admin_radiology roles
- Test the GET /api/connections endpoint
- Test the GET /api/connections/requests endpoint
- Find a pending relationship and test the POST /api/connections/{relationshipId}/approve endpoint
- Find another pending relationship and test the POST /api/connections/{relationshipId}/reject endpoint
- Find an active relationship and test the DELETE /api/connections/{relationshipId} endpoint

## Workflow

The typical workflow for testing connection management is:

1. Run `generate-all-role-tokens.js` to generate authentication tokens
2. Run `run-create-test-relationships.bat` or `./run-create-test-relationships.sh` to create test relationships
3. Run `run-test-connection-endpoints.bat` or `./run-test-connection-endpoints.sh` to test all connection endpoints

## Troubleshooting

### Token Generation Issues

If you encounter issues with token generation:
- Check that the API URL in `generate-all-role-tokens.js` is correct
- Verify that the test user credentials in `generate-all-role-tokens.js` are valid
- Ensure that the API server is running and accessible

### Relationship Creation Issues

If you encounter issues with relationship creation:
- Check that the database connection string in `.env` is correct
- Verify that the organizations and users specified in `create-test-relationships.js` exist in the database
- Check the console output for specific error messages

### Endpoint Testing Issues

If you encounter issues with endpoint testing:
- Ensure that tokens were generated successfully
- Verify that test relationships were created successfully
- Check the console output for specific error messages
- Verify that the API server is running and accessible

## Notes

- The test scripts use hardcoded IDs as fallbacks if they can't find appropriate relationships to test with
- The scripts are designed to be idempotent, so you can run them multiple times without issues
- The scripts will log detailed information about each step to help with debugging