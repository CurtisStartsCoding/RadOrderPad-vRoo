# Batch Test Scripts

This directory contains batch scripts for testing various components of the RadOrderPad application.

## Available Test Scripts

### Core Test Suites

#### Main Test Scripts

### test-admin-finalization.bat

Tests the Admin Staff Finalization Workflow API endpoints:

1. **Paste EMR Summary**: Tests the `/api/admin/orders/:orderId/paste-summary` endpoint
   - Parses patient and insurance information from pasted EMR summary text
   - Verifies the information is stored correctly in the database

2. **Paste Supplemental Documents**: Tests the `/api/admin/orders/:orderId/paste-supplemental` endpoint
   - Saves supplemental documents to the database
   - Verifies the documents are stored correctly

3. **Send to Radiology**: Tests the `/api/admin/orders/:orderId/send-to-radiology` endpoint
   - Updates order status to 'pending_radiology'
   - Verifies the status change is logged in the order history

### test-radiology-workflow.bat

Tests the Radiology Group Workflow API endpoints:

1. **Get Incoming Orders**: Tests the `/api/radiology/orders` endpoint
   - Retrieves orders for the radiology group
   - Verifies filtering and pagination

2. **Get Order Details**: Tests the `/api/radiology/orders/:orderId` endpoint
   - Retrieves comprehensive order information
   - Verifies the radiology group has access to the order

3. **Export Order as JSON**: Tests the `/api/radiology/orders/:orderId/export/json` endpoint
   - Exports order data in JSON format
   - Verifies the exported data is complete

4. **Export Order as CSV**: Tests the `/api/radiology/orders/:orderId/export/csv` endpoint
   - Exports order data in CSV format
   - Verifies the exported data is properly formatted

5. **Update Order Status**: Tests the `/api/radiology/orders/:orderId/update-status` endpoint
   - Updates order status to 'scheduled'
   - Verifies the status change is logged in the order history

6. **Request Additional Information**: Tests the `/api/radiology/orders/:orderId/request-info` endpoint
   - Creates an information request
   - Verifies the request is stored in the database

### test-location-management.bat

Tests the Location Management API endpoints:

1. **List Locations**: Tests the `/api/organizations/mine/locations` endpoint
  - Retrieves locations for the user's organization
  - Verifies the response format

### test-connection-management.bat

Tests the Connection Management API endpoints:

1. **List Connections**: Tests the `/api/connections` endpoint
  - Retrieves connections for the user's organization
  - Verifies the response format

2. **Request Connection**: Tests the `/api/connections` endpoint
  - Creates a new connection request to another organization
  - Verifies the request is created successfully

3. **List Incoming Requests**: Tests the `/api/connections/requests` endpoint
  - Retrieves pending incoming connection requests
  - Verifies the response format

4. **Approve Connection**: Tests the `/api/connections/{relationshipId}/approve` endpoint
  - Approves a pending connection request
  - Verifies the connection status is updated to 'active'

5. **Terminate Connection**: Tests the `/api/connections/{relationshipId}` endpoint
  - Terminates an active connection
  - Verifies the connection status is updated to 'terminated'

6. **Reject Connection**: Tests the `/api/connections/{relationshipId}/reject` endpoint
  - Rejects a pending connection request
  - Verifies the connection status is updated to 'rejected'

#### JavaScript Test Files

1. **test-order-finalization.js**: JavaScript implementation of order finalization tests
   - Used by the run-order-finalization-tests.bat/.sh scripts
   - Provides more detailed testing capabilities than batch scripts alone

2. **Create Location**: Tests the `/api/organizations/mine/locations` endpoint
  - Creates a new location with test data
  - Verifies the location is created successfully

3. **Get Location Details**: Tests the `/api/organizations/mine/locations/:locationId` endpoint
  - Retrieves details of a specific location
  - Verifies the response format

4. **Update Location**: Tests the `/api/organizations/mine/locations/:locationId` endpoint
  - Updates a location with new data
  - Verifies the location is updated successfully

5. **Assign User to Location**: Tests the `/api/users/:userId/locations/:locationId` endpoint
  - Assigns a user to a location
  - Verifies the assignment is created successfully

6. **List User Locations**: Tests the `/api/users/:userId/locations` endpoint
  - Retrieves locations assigned to a specific user
  - Verifies the response format

7. **Unassign User from Location**: Tests the `/api/users/:userId/locations/:locationId` endpoint
  - Removes a user-location assignment
  - Verifies the assignment is removed successfully

8. **Deactivate Location**: Tests the `/api/organizations/mine/locations/:locationId` endpoint
  - Deactivates a location (soft delete)
  - Verifies the location is deactivated successfully

## Running Tests

### Running Individual Test Suites

To run individual test suites, navigate to the `tests/batch` directory and execute the desired script:

```bash
cd tests/batch
.\test-admin-finalization.bat
.\test-radiology-workflow.bat
.\test-location-management.bat
.\test-connection-management.bat
```

### Running All Tests

To run all test suites sequentially and generate a consolidated report:

#### Windows

```
cd tests/batch
.\run-all-tests.bat
.\generate-test-summary.bat
```

#### Unix/Linux/macOS

```
cd tests/batch
./run-all-tests.sh
./generate-test-summary.sh
```

### Running Specific Test Groups

#### Connection Management Tests with Test Data Setup

The connection management tests require specific test data to be present in the database. To simplify this process, use the provided setup script:

```bash
# Windows
.\run-connection-tests.bat

# Unix/Linux/macOS
bash run-connection-tests.sh
```

This will:
1. Set up the required test organizations and users in the database
2. Run the connection management tests

#### Validation Tests

The validation tests verify the order validation functionality with real LLM integration:

```bash
# Windows
.\run-validation-tests.bat

# Unix/Linux/macOS
./run-validation-tests.sh
```

#### Upload Tests

The upload tests verify the file upload service functionality:

```bash
# Windows
.\run-upload-tests.bat

# Unix/Linux/macOS
./run-upload-tests.sh
```

#### Order Finalization Tests

The order finalization tests verify the physician order finalization endpoint:

```bash
# Windows
.\run-order-finalization-tests.bat

# Unix/Linux/macOS
./run-order-finalization-tests.sh
```

## Code Quality Tools

### File Length Checker

This tool helps identify files that may need refactoring based on their line count:

```bash
# Windows
.\check-file-lengths.bat [path] [extension]

# Unix/Linux/macOS
./check-file-lengths.sh [path] [extension]
```

For more details, see [README-file-length-checker.md](./README-file-length-checker.md).

## Prerequisites

- The RadOrderPad server must be running
- The database must be properly set up with test data
- The JWT_SECRET environment variable must be set correctly

## Test Data

The tests assume the following test data exists in the database:

- An order with ID 4
- A patient with ID 1 associated with the order
- The order has status 'pending_admin' for the admin finalization tests
- The order has status 'pending_radiology' for the radiology workflow tests
- The order has radiology_organization_id set to 2 for the radiology workflow tests

If the test data does not exist, the tests will create or update it as needed.

## Test Audit Log

This section tracks when each test was last run, its status, and any relevant notes. This provides an audit trail for test execution and helps identify tests that need to be run.

| Test Name | Last Run Date | Status | Notes |
|-----------|---------------|--------|-------|
| **Connection Management Tests** | April 14, 2025 6:29 PM | PASS | All tests passing after connection service refactoring |
| **Location Management Tests** | April 14, 2025 6:29 PM | PASS | No issues reported |
| **Admin Finalization Tests** | April 14, 2025 6:29 PM | PASS | All endpoints working correctly |
| **Radiology Workflow Tests** | April 14, 2025 6:29 PM | PASS | Export functionality verified |
| **Order Finalization Tests** | April 14, 2025 6:29 PM | PASS | Temporary patient creation working |
| **Validation Tests** | April 14, 2025 6:29 PM | PASS | LLM integration functioning correctly |
| **Upload Tests** | April 14, 2025 6:29 PM | PASS | Presigned URL generation working |
| **File Length Checker** | April 14, 2025 6:30 PM | PASS | Identified files for refactoring |
| **Stripe Webhook Tests** | April 14, 2025 6:30 PM | FAIL | Check test-results\stripe-webhook-tests.log for details |
| **Super Admin API Tests** | April 14, 2025 6:30 PM | PASS | All endpoints working correctly |
| **File Upload Tests** | April 14, 2025 6:30 PM | PASS | S3 presigned URL flow working correctly |
| **Admin Send-to-Radiology Tests** | April 14, 2025 6:30 PM | PASS | Credit consumption on order submission working correctly |
| **Billing Subscriptions Tests** | April 14, 2025 6:30 PM | PASS | Stripe subscription creation API working correctly |

### How to Update the Audit Log

#### Automatic Update

Use the provided scripts to automatically update the audit log after running tests:
##### Windows
```powershell
# PowerShell
.\update-test-audit-log.ps1 -TestName "Connection Management Tests" -Status "PASS" -Notes "All tests passing after refactoring"

# Batch (Command Prompt)
update-test-audit-log.bat "Connection Management Tests" "PASS" "All tests passing after refactoring"
```
```

##### Unix/Linux/macOS
```bash
./update-test-audit-log.sh "Connection Management Tests" "PASS" "All tests passing after refactoring"
```

#### Manual Update

If you prefer to update the log manually, follow these steps:
1. Update the date to the current date
2. Set the status to PASS or FAIL
3. Add any relevant notes about the test execution

This provides a historical record of test execution and helps identify when tests were last verified.

## Additional Resources

- [Test Runner Documentation](./README-test-runner.md) - Detailed information about the test runner
- [File Length Checker Documentation](./README-file-length-checker.md) - Documentation for the file length checker tool




































































































































































































































































































































































































































































































