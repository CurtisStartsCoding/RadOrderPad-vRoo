# RadOrderPad End-to-End Testing

This document describes the end-to-end testing framework for the RadOrderPad system, which verifies the core workflows and integrations of the application.

## Overview

The end-to-end tests are designed to validate the complete user journeys through the system, ensuring that all components work together correctly. These tests interact with the API endpoints just as a real client would, making them valuable for verifying the system's behavior from a user's perspective.

## Test Scenarios

The following test scenarios are implemented:

### Scenario A: Full Physician Order (Successful Validation)

Tests the happy path of a physician creating and finalizing an order with successful validation:

1. Register Referring Organization and Admin
2. Register Physician
3. Login as Physician
4. Validate Dictation (passes first time)
5. Finalize/Sign Order
6. Verify Order Status, order_history, validation_attempts

### Scenario B: Full Physician Order (Override)

Tests the validation override workflow when automatic validation fails:

1. Register Referring Organization and Admin
2. Register Physician
3. Login as Physician
4. Validate Dictation (fails 3 times)
5. Override with Justification
6. Finalize/Sign Order
7. Verify Order Status, overridden=true, override_justification, order_history, validation_attempts

### Scenario C: Admin Finalization

Tests the admin processing of a finalized order:

1. Using an orderId from Scenario A (status 'pending_admin')
2. Login as Admin Staff
3. Call /paste-summary
4. Call /paste-supplemental
5. Call /send-to-radiology
6. Verify Order Status ('pending_radiology'), credit_usage_logs, order_history, patient_clinical_records

### Scenario D: Radiology View/Update

Tests the radiology workflow for processing orders:

1. Using an orderId from Scenario C (status 'pending_radiology')
2. Register Radiology Organization and Admin
3. Create Radiology Scheduler
4. Create Connection Between Organizations
5. Login as Radiology Scheduler
6. Call /radiology/orders (queue)
7. Call /radiology/orders/{orderId} (details)
8. Call /radiology/orders/{orderId}/update-status (set to 'scheduled')
9. Verify response data and final order status

### Scenario E: Connection Request

Tests the organization connection workflow:

1. Register two organizations (Referring and Radiology)
2. Login as Referring Admin
3. Call /connections (POST to request connection to Radiology Org)
4. Login as Radiology Admin
5. Call /connections/requests (GET to see request)
6. Call /connections/{reqId}/approve
7. Login as Referring Admin
8. Call /connections (GET to verify status 'active')

### Scenario F: User Invite

Tests the user invitation workflow:

1. Register Organization and Admin
2. Login as Admin
3. Call /users/invite to invite a new user
4. Check for invite token (simulated)
5. Call /users/accept-invitation to accept the invitation
6. Verify new user can login
7. Verify user details
8. Verify user appears in organization users list

### Scenario G: File Upload

Tests the file upload workflow:

1. Register Organization and Admin
2. Login as Admin
3. Call /uploads/presigned-url to get an S3 upload URL
4. Use external tool to upload file to S3 (simulated)
5. Call /uploads/confirm to confirm the upload
6. Verify document_uploads record
7. Verify document appears in organization uploads list

## Running the Tests

### Prerequisites

1. Node.js installed (v14 or higher)
2. RadOrderPad API server running locally on port 3000
3. Database initialized with required tables
4. Required environment variables set (see `.env.example`)

### Running All Tests

#### Using npm

```
npm run test:e2e
```

#### Using Batch/Shell Scripts

**Windows:**
```
.\run-e2e-tests.bat
```

**Unix/Mac:**
```
chmod +x run-e2e-tests.sh
./run-e2e-tests.sh
```

### Running Individual Scenarios

#### Using npm

```
npm run test:e2e:scenario-a  # Run Scenario A
npm run test:e2e:scenario-b  # Run Scenario B
npm run test:e2e:scenario-c  # Run Scenario C
npm run test:e2e:scenario-d  # Run Scenario D
npm run test:e2e:scenario-e  # Run Scenario E
npm run test:e2e:scenario-f  # Run Scenario F
npm run test:e2e:scenario-g  # Run Scenario G
```

#### Using Node.js directly

```
node tests/e2e/scenario-a-successful-validation.js
```

## Test Results

Test results are stored in the `test-results/e2e/` directory:

- `e2e-test-results.log`: Overall test execution log
- `scenario-[a-g].log`: Individual scenario logs
- `scenario-[a-g].json`: Test data for each scenario

## Test Architecture

The tests are built using the following components:

1. **test-helpers.js**: Common utility functions for API requests, logging, and data management
2. **run-all-e2e-tests.js**: Main script that orchestrates running all scenarios
3. **scenario-[a-g].js**: Individual test scenario implementations

## Dependencies Between Scenarios

Some scenarios depend on the successful completion of previous scenarios:

- Scenario C depends on Scenario A (uses the order created in A)
- Scenario D depends on Scenario C (uses the order processed in C)

When running individual scenarios, ensure that their dependencies have been run successfully first.

## Extending the Tests

To add a new test scenario:

1. Create a new file `tests/e2e/scenario-[x].js` following the pattern of existing scenarios
2. Add the scenario to the list in `run-all-e2e-tests.js`
3. Update this documentation to include the new scenario

## Troubleshooting

If tests fail, check the following:

1. Ensure the API server is running and accessible
2. Check the test logs in `test-results/e2e/` for specific error messages
3. Verify that the database is properly initialized
4. Check that all required environment variables are set
5. For scenarios with dependencies, ensure the dependent scenarios have run successfully

## Limitations

1. These tests use simulated file uploads for S3 integration
2. Email notifications are not verified (tokens are extracted directly from the database)
3. The tests assume a clean database state when started