# RadOrderPad Production Tests

This document describes how to run end-to-end tests against the production environment to verify that all components of the RadOrderPad system are working correctly.

## Overview

The production tests are designed to test the entire workflow of the RadOrderPad system, including:

1. User registration and authentication
2. Organization creation and management
3. Connection requests between organizations
4. Order validation using the LLM-based validation engine
5. Order creation and submission
6. Order status tracking

These tests make real API calls to the production environment, so they should be used carefully and only when necessary.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Internet connection
- Access to the production environment

## Running the Tests

### Windows

```
run-production-tests.bat
```

### macOS/Linux

```
chmod +x run-production-tests.sh
./run-production-tests.sh
```

## Test Scenarios

### Scenario A: Full Physician Order (Successful Validation)

This test scenario covers:
1. Register Referring Organization and Admin
2. Register Physician
3. Login as Physician
4. Validate Dictation (passes first time)
5. Finalize/Sign Order
6. Verify Order Status, order_history, validation_attempts

### Scenario E: Connection Request

This test scenario covers:
1. Register two organizations (Referring and Radiology)
2. Login as Referring Admin
3. Call /connections (POST to request connection to Radiology Org)
4. Login as Radiology Admin
5. Call /connections/requests (GET to see request)
6. Call /connections/{reqId}/approve
7. Login as Referring Admin
8. Call /connections (GET to verify status 'active')

## Test Results

Test results are stored in the `test-results/e2e-production` directory. Each test scenario creates its own log file and JSON data file.

## Adding New Test Scenarios

To add a new test scenario:

1. Create a new test file in the `tests/e2e` directory with the naming convention `scenario-X-description-production.js`
2. Use the `test-helpers-production.js` module for making API calls
3. Add the new scenario to the `scenarios` array in `tests/e2e/run-production-tests.js`

## Troubleshooting

If a test fails, check the log files in the `test-results/e2e-production` directory for more information. Common issues include:

- Network connectivity problems
- API changes in the production environment
- Authentication issues
- Rate limiting
- Data validation errors

## Important Notes

- These tests create real data in the production environment, including organizations, users, and orders.
- Each test run uses unique email addresses and identifiers to avoid conflicts.
- The tests are designed to be idempotent, meaning they can be run multiple times without causing issues.
- However, running the tests frequently may create a lot of test data in the production environment.