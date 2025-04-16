# Super Admin API Implementation

**Date:** 2025-04-14
**Author:** Roo

## Overview

This document describes the implementation of the Super Admin API, which provides platform administrators with the ability to view and manage organizations and users across the entire RadOrderPad platform.

## Architecture

The Super Admin API follows the "one function per file" principle and is structured in three layers:

1. **Service Layer**: Contains business logic and database interactions
2. **Controller Layer**: Handles HTTP requests and responses
3. **Routes Layer**: Defines API endpoints and applies middleware

### Directory Structure

```
src/
├── services/
│   └── superadmin/
│       ├── index.ts
│       ├── organizations/
│       │   ├── index.ts
│       │   ├── list-all-organizations.ts
│       │   └── get-organization-by-id.ts
│       └── users/
│           ├── index.ts
│           ├── list-all-users.ts
│           └── get-user-by-id.ts
├── controllers/
│   └── superadmin/
│       ├── index.ts
│       ├── organizations/
│       │   ├── index.ts
│       │   ├── list-all-organizations.ts
│       │   └── get-organization-by-id.ts
│       └── users/
│           ├── index.ts
│           ├── list-all-users.ts
│           └── get-user-by-id.ts
└── routes/
    ├── index.ts
    └── superadmin.routes.ts
```

## Endpoints

The Super Admin API provides the following endpoints:

| Method | Endpoint | Description | Controller |
|--------|----------|-------------|------------|
| GET | `/api/superadmin/organizations` | List all organizations with optional filtering | `listAllOrganizationsController` |
| GET | `/api/superadmin/organizations/:orgId` | Get detailed information about a specific organization | `getOrganizationByIdController` |
| GET | `/api/superadmin/users` | List all users with optional filtering | `listAllUsersController` |
| GET | `/api/superadmin/users/:userId` | Get detailed information about a specific user | `getUserByIdController` |

## Security

All Super Admin API endpoints are protected by:

1. **Authentication**: Using the `authenticateJWT` middleware to verify the user's JWT token
2. **Authorization**: Using the `authorizeRole(['super_admin'])` middleware to ensure only users with the `super_admin` role can access the endpoints

## Implementation Details

### Service Functions

#### Organizations

- **listAllOrganizations**: Queries the `organizations` table with optional filtering by name, type, and status
- **getOrganizationById**: Queries the `organizations` table by ID and includes related data (users, connections, billing history, purgatory history)

#### Users

- **listAllUsers**: Queries the `users` table with optional filtering by organization ID, email, role, and status
- **getUserById**: Queries the `users` table by ID and includes related data (location assignments)

### Controller Functions

Each controller function:
1. Extracts parameters from the request
2. Calls the corresponding service function
3. Formats the response
4. Handles errors

### Routes

The routes are defined in `src/routes/superadmin.routes.ts` and mounted at `/api/superadmin` in `src/routes/index.ts`.

## Testing

The Super Admin API is thoroughly tested using the following:

### Test Suite

The test suite is located in `tests/superadmin-api.test.js` and includes:

- **Authentication Tests**: Verify that endpoints require authentication and the `super_admin` role
- **Organization Endpoints Tests**:
  - List all organizations with and without filters
  - Get organization by ID with success and error cases
- **User Endpoints Tests**:
  - List all users with and without filters
  - Get user by ID with success and error cases

### Testing Tools

- **supertest**: For making HTTP requests to the API endpoints
- **chai**: For assertions
- **sinon**: For mocking service functions
- **jsonwebtoken**: For creating test tokens

### Running Tests

Two scripts are provided to run the tests:

- `run-superadmin-tests.bat` for Windows
- `run-superadmin-tests.sh` for Unix-based systems

These scripts run the tests with a timeout of 10 seconds to allow for database operations.

## Future Enhancements

Future enhancements to the Super Admin API may include:

1. Write operations (create, update, delete) for organizations and users
2. Endpoints for managing billing, credits, and purgatory status
3. Endpoints for system monitoring and analytics
4. Audit logging for Super Admin actions