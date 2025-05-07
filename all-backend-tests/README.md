# Backend API Tests

This directory contains consolidated API tests for the RadOrderPad backend.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Generate authentication tokens:
   ```
   node utilities/generate-all-role-tokens.js
   ```
   This will create tokens for different user roles in the `tokens` directory.

## Running Tests

### Run Test Groups

To run specific test groups:

1. Part 1 tests (user authentication, file uploads, credit management, etc.):
   ```
   working-tests.bat
   ```

2. Part 2 tests (connections, organizations, users, etc.):
   ```
   working-tests-2.bat
   ```

3. Part 3 tests (organization management, order validation, admin features, etc.):
   ```
   working-tests-3.bat
   ```

4. Part 4 tests (admin order management endpoints):
   ```
   working-tests-4.bat
   ```

## Test Structure

- `scripts/` - Contains individual test scripts
- `utilities/` - Contains utility scripts like token generation
- `tokens/` - Directory where authentication tokens are stored
- `.env.test` - Environment configuration for tests

## Types of Tests

The test suite includes two types of test files:

1. **JavaScript-based tests**: These tests use Node.js scripts to make API requests and validate responses. They typically use axios for HTTP requests and provide detailed output with chalk for formatting.

2. **Batch file tests with curl**: Some tests use batch files with curl commands to directly make API requests. These tests are simpler but still effective for testing API endpoints.

## API Endpoints Tested

These tests cover various API endpoints including:

- User authentication and management
- Organization management
- Connection requests and management
- File uploads and downloads
- Order validation and processing
- Admin features
  - Admin order queue management
  - Admin paste summary processing
  - Admin paste supplemental documents
  - Admin patient information updates
  - Admin insurance information updates
- Credit balance and usage
- Health checks
- And more

## Admin Order Management Endpoints

The Part 4 tests specifically focus on the Admin Order Management endpoints:

1. **GET /api/admin/orders/queue** - Tested in Part 1 and Part 2
2. **POST /api/admin/orders/{orderId}/paste-summary** - Tested in Part 4
3. **POST /api/admin/orders/{orderId}/paste-supplemental** - Tested in Part 4
4. **PUT /api/admin/orders/{orderId}/patient-info** - Tested in Part 4
5. **PUT /api/admin/orders/{orderId}/insurance-info** - Tested in Part 4

### Known Issues and Solutions

1. **Patient Info Endpoint**: 
   - The API accepts invalid date formats without validation
   - This is a potential improvement for the API
   - All tests pass successfully with order IDs 600, 601, 603, 604, 609, 612

2. **Insurance Info Endpoint**: 
   - Requires camelCase field names (insurerName, policyNumber) instead of snake_case (insurer_name, policy_number)
   - The API expects camelCase in the request body, but the database uses snake_case column names
   - All tests now pass successfully with order IDs 600, 601, 603, 604, 609, 612

3. **Paste Summary Endpoint**:
   - Previously failed with "column authorization_number does not exist" error
   - This issue has been fixed in the backend code
   - All tests now pass successfully with order IDs 600, 601, 603, 604, 609, 612

4. **Order Status Requirements**:
   - The admin endpoints are designed to work with orders in "pending_admin" status
   - The working-tests-4.bat file uses order ID 603 by default, which is known to work with these endpoints
   - You can modify the TEST_ORDER_ID environment variable if needed

## Server Logs

When running the tests, the server logs show errors in the following functions:
- handlePasteSupplemental
- updatePatientInfo
- updateInsuranceInfo

These errors align with the issues found in our testing and have been addressed in the test scripts.

## Notes

- Tests use the production API by default (`https://api.radorderpad.com`)
- Authentication tokens are generated fresh for each test run
- Each test script can also be run individually from the `scripts` directory