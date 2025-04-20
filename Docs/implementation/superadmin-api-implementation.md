# Super Admin API Implementation

**Date:** 2025-04-19
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
│       ├── users/
│       │   ├── index.ts
│       │   ├── list-all-users.ts
│       │   └── get-user-by-id.ts
│       ├── prompts/
│       │   ├── index.ts
│       │   ├── templates/
│       │   │   ├── index.ts
│       │   │   ├── createPromptTemplate.ts
│       │   │   ├── getPromptTemplateById.ts
│       │   │   ├── listPromptTemplates.ts
│       │   │   ├── updatePromptTemplate.ts
│       │   │   └── deletePromptTemplate.ts
│       │   └── assignments/
│       │       ├── index.ts
│       │       ├── createPromptAssignment.ts
│       │       ├── getPromptAssignmentById.ts
│       │       ├── listPromptAssignments.ts
│       │       ├── updatePromptAssignment.ts
│       │       └── deletePromptAssignment.ts
│       └── logs/
│           ├── index.ts
│           ├── listLlmValidationLogs.ts
│           ├── listCreditUsageLogs.ts
│           └── listPurgatoryEvents.ts
├── controllers/
│   └── superadmin/
│       ├── index.ts
│       ├── organizations/
│       │   ├── index.ts
│       │   ├── list-all-organizations.ts
│       │   └── get-organization-by-id.ts
│       ├── users/
│       │   ├── index.ts
│       │   ├── list-all-users.ts
│       │   └── get-user-by-id.ts
│       ├── prompts/
│       │   ├── index.ts
│       │   ├── templates.ts
│       │   ├── assignments.ts
│       │   └── index.ts
│       └── logs.ts
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
| GET | `/api/superadmin/prompts/templates` | List all prompt templates with optional filtering | `listPromptTemplatesController` |
| GET | `/api/superadmin/prompts/templates/:templateId` | Get a specific prompt template by ID | `getPromptTemplateByIdController` |
| POST | `/api/superadmin/prompts/templates` | Create a new prompt template | `createPromptTemplateController` |
| PUT | `/api/superadmin/prompts/templates/:templateId` | Update an existing prompt template | `updatePromptTemplateController` |
| DELETE | `/api/superadmin/prompts/templates/:templateId` | Delete a prompt template | `deletePromptTemplateController` |
| GET | `/api/superadmin/prompts/assignments` | List all prompt assignments with optional filtering | `listPromptAssignmentsController` |
| GET | `/api/superadmin/prompts/assignments/:assignmentId` | Get a specific prompt assignment by ID | `getPromptAssignmentByIdController` |
| POST | `/api/superadmin/prompts/assignments` | Create a new prompt assignment | `createPromptAssignmentController` |
| PUT | `/api/superadmin/prompts/assignments/:assignmentId` | Update an existing prompt assignment | `updatePromptAssignmentController` |
| DELETE | `/api/superadmin/prompts/assignments/:assignmentId` | Delete a prompt assignment | `deletePromptAssignmentController` |
| GET | `/api/superadmin/logs/validation` | List LLM validation logs with filtering and pagination | `listLlmValidationLogsController` |
| GET | `/api/superadmin/logs/credits` | List credit usage logs with filtering and pagination | `listCreditUsageLogsController` |
| GET | `/api/superadmin/logs/purgatory` | List purgatory events with filtering and pagination | `listPurgatoryEventsController` |

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

#### Prompts

- **createPromptTemplate**: Creates a new prompt template in the `prompt_templates` table
- **getPromptTemplateById**: Retrieves a specific prompt template by ID
- **listPromptTemplates**: Lists prompt templates with optional filtering
- **updatePromptTemplate**: Updates an existing prompt template
- **deletePromptTemplate**: Soft-deletes a prompt template

- **createPromptAssignment**: Creates a new prompt assignment in the `prompt_assignments` table
- **getPromptAssignmentById**: Retrieves a specific prompt assignment by ID with joined data
- **listPromptAssignments**: Lists prompt assignments with optional filtering
- **updatePromptAssignment**: Updates an existing prompt assignment
- **deletePromptAssignment**: Deletes a prompt assignment

#### Logs

- **listLlmValidationLogs**: Queries the `llm_validation_logs` table with comprehensive filtering options (organization_id, user_id, date range, status, llm_provider, model_name) and pagination
- **listCreditUsageLogs**: Queries the `credit_usage_logs` table with filtering (organization_id, user_id, date range, action_type) and pagination
- **listPurgatoryEvents**: Queries the `purgatory_events` table with filtering (organization_id, date range, status, reason) and pagination

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

The test suites include:

- **Authentication Tests**: Verify that endpoints require authentication and the `super_admin` role
- **Organization Endpoints Tests**:
  - List all organizations with and without filters
  - Get organization by ID with success and error cases
- **User Endpoints Tests**:
  - List all users with and without filters
  - Get user by ID with success and error cases
- **Prompt Management Tests**:
  - Create, read, update, and delete prompt templates
  - Create, read, update, and delete prompt assignments
- **Log Viewing Tests**:
  - List LLM validation logs with and without filters
  - List credit usage logs with and without filters
  - List purgatory events with and without filters

### Testing Tools

- **supertest**: For making HTTP requests to the API endpoints
- **chai**: For assertions
- **sinon**: For mocking service functions
- **jsonwebtoken**: For creating test tokens

### Running Tests

Multiple test scripts are provided to run the tests:

- `test-superadmin-prompts.bat`/`.sh`: Tests for prompt template and assignment endpoints
- `test-superadmin-logs.bat`/`.sh`: Tests for log viewing endpoints
- `tests/batch/test-superadmin-logs.bat`/`.sh`: Batch versions of the log tests

All tests are included in the main test runners:
- `run-all-tests.bat` for Windows
- `run-all-tests.sh` for Unix-based systems

These scripts run the tests with a timeout of 10 seconds to allow for database operations.

## Future Enhancements

Future enhancements to the Super Admin API may include:

1. Write operations (create, update, delete) for organizations and users
2. Additional analytics endpoints for system monitoring
3. Audit logging for Super Admin actions
4. Real-time dashboard data endpoints