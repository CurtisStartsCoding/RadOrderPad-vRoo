# RadOrderPad Test Runner

This directory contains scripts for running automated tests to verify the functionality of the RadOrderPad backend API.

## Available Test Suites

1. **Validation Tests** (`run-validation-tests.bat`/`.sh`)
   - Tests the order validation functionality with real LLM integration
   - Verifies draft creation, clarification, and override validation

2. **Upload Tests** (`run-upload-tests.bat`/`.sh`)
   - Tests the file upload service
   - Verifies presigned URL generation and upload confirmation

3. **Order Finalization Tests** (`run-order-finalization-tests.bat`/`.sh`)
   - Tests the physician order finalization endpoint
   - Verifies standard order finalization and temporary patient creation
   - Ensures proper status updates and database records

4. **Admin Finalization Tests** (`test-admin-finalization.bat`/`.sh`)
   - Tests the admin staff workflow after an order is finalized
   - Verifies pasting EMR summary, supplemental documents, and sending to radiology

5. **Connection Management Tests** (`run-connection-tests.bat`/`.sh`)
   - Tests organization connection management
   - Verifies requesting, approving, rejecting, and listing connections

6. **Location Management Tests** (`test-location-management.bat`/`.sh`)
   - Tests organization location management
   - Verifies creating, updating, deleting, and listing locations

7. **Radiology Workflow Tests** (`test-radiology-workflow.bat`/`.sh`)
   - Tests radiology group order management
   - Verifies order queue, details retrieval, and status updates

## Running All Tests

To run all test suites sequentially and generate a consolidated report:

### Windows

```
cd tests/batch
.\run-all-tests.bat
.\generate-test-summary.bat
```

### Unix/Linux/macOS

```
cd tests/batch
./run-all-tests.sh
./generate-test-summary.sh
```

## Test Results

Test results are saved to the `test-results` directory:

- Individual test logs: `test-results/*.log`
- Consolidated summary report: `test-results/test-summary.md`

The summary report includes:
- Pass/fail status for each test suite
- Detailed status of core functionality
- Links to individual test logs for failed tests

## Prerequisites

Before running the tests, ensure:

1. The RadOrderPad API server is running (`npm run dev`)
2. The database is properly set up and accessible
3. Environment variables are configured correctly in `.env`
4. Required API keys (LLM, AWS) are valid

## Troubleshooting

If tests fail, check:

1. **Database Connection**: Ensure the database is running and accessible
2. **API Server**: Verify the API server is running on the expected port
3. **Environment Variables**: Check that all required environment variables are set
4. **API Keys**: Verify that API keys for external services are valid
5. **Test Data**: Some tests may require specific test data to be present in the database

## Adding New Tests

To add a new test suite:

1. Create a new test script in the appropriate format
2. Update `run-all-tests.bat`/`.sh` to include the new test
3. Update `generate-test-summary.bat`/`.sh` to process the new test results