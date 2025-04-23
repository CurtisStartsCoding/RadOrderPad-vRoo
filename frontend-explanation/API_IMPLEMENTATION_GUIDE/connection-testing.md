# Connection Management Testing

This document provides instructions for testing the connection management functionality of the RadOrderPad API. These scripts allow you to create test data and test all connection-related endpoints.

## Overview

The connection management functionality allows organizations to establish relationships with each other. The following endpoints are available:

- `GET /api/connections`: List connections for the admin's organization
- `GET /api/connections/requests`: List pending incoming connection requests
- `POST /api/connections`: Request a connection to another organization
- `POST /api/connections/{relationshipId}/approve`: Approve a pending incoming request
- `POST /api/connections/{relationshipId}/reject`: Reject a pending incoming request
- `DELETE /api/connections/{relationshipId}`: Terminate an active connection

## Scripts

### 1. Create Test Data

To test the connection endpoints, you need to create test data (organizations, users, and relationships):

```bash
# Windows
run-insert-test-data.bat

# Unix/Linux/macOS
./run-insert-test-data.sh
```

This script will:
- Create two new organizations (referring and radiology)
- Create admin users for each organization
- Create a relationship between these organizations
- Output the IDs and credentials for the created entities

### 2. Test Connection Endpoints

After creating test data, you can test all connection endpoints:

```bash
# Windows
run-test-connection-endpoints-production.bat

# Unix/Linux/macOS
./run-test-connection-endpoints-production.sh
```

This script will:
- Get JWT tokens for the admin_referring and admin_radiology users
- Test the GET /api/connections endpoint
- Test the GET /api/connections/requests endpoint
- Test the POST /api/connections endpoint (request a connection)
- Test the POST /api/connections/{relationshipId}/approve endpoint
- Test the DELETE /api/connections/{relationshipId} endpoint (terminate a connection)

## Workflow

The typical workflow for testing connection management is:

1. Run `run-insert-test-data.bat` or `./run-insert-test-data.sh` to create test data
2. Run `run-test-connection-endpoints-production.bat` or `./run-test-connection-endpoints-production.sh` to test all connection endpoints

## Important Notes

### API URL

The API URL must include the `/api` prefix. For example:
- Correct: `https://api.radorderpad.com/api`
- Incorrect: `https://api.radorderpad.com`

### Request Connection Endpoint

When requesting a connection, use the following format:

```javascript
// Correct
axios.post(`${API_URL}/connections`, {
  targetOrgId: targetOrgId,
  notes: "Test connection request"
}, {
  headers: { Authorization: `Bearer ${token}` }
});

// Incorrect
axios.post(`${API_URL}/connections/request`, {
  targetOrganizationId: targetOrgId
}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

The key differences are:
1. The endpoint is `/connections`, not `/connections/request`
2. The parameter name is `targetOrgId`, not `targetOrganizationId`

## Troubleshooting

### Token Generation Issues

If you encounter issues with token generation:
- Check that the API URL in the script is correct (should include `/api` prefix)
- Verify that the test user credentials are valid
- Ensure that the API server is running and accessible

### Endpoint Testing Issues

If you encounter issues with endpoint testing:
- Ensure that tokens were generated successfully
- Verify that test data was created successfully
- Check the console output for specific error messages
- Verify that the API server is running and accessible

## Connection Lifecycle

The connection lifecycle is as follows:

1. **Request**: Organization A requests a connection to Organization B (status: pending)
2. **Approve/Reject**: Organization B approves or rejects the request (status: active or rejected)
3. **Terminate**: Either organization can terminate an active connection (status: terminated)
4. **Re-request**: Organization A can request a connection again after it has been rejected or terminated (status: pending)