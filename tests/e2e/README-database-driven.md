# RadOrderPad Database-Driven E2E Testing

## Overview

This directory contains end-to-end (E2E) tests for RadOrderPad that use a database-driven approach. Instead of connecting to a real database, these tests use mock data and simulated API responses to test the application's functionality.

## Key Files

- `test-helpers-simple.js`: The main helper file that provides mock API responses and test utilities
- `test-data/test-database.js`: Contains mock data used by the tests
- `run-database-e2e-tests.bat`: Script to run all database-driven E2E tests
- `setup-database-tests.bat`: Script to set up the database-driven testing environment

## Test Scenarios

The following test scenarios are available:

1. **Scenario A**: Full Physician Order - Successful Validation
2. **Scenario B**: Full Physician Order - Override
3. **Scenario C**: Admin Finalization
4. **Scenario D**: Radiology View/Update
5. **Scenario E**: Connection Request
6. **Scenario F**: User Invite
7. **Scenario G**: File Upload
8. **Scenario H**: Registration and Onboarding

## Running Tests

To run all database-driven E2E tests:

```bash
batch-files\run-database-e2e-tests.bat
```

To run a specific test scenario:

```bash
node tests\e2e\scenario-a-successful-validation.js
```

## How It Works

The database-driven testing approach works by:

1. **Intercepting API Requests**: All API requests are intercepted by the `apiRequest` function in `test-helpers-simple.js`.
2. **Returning Mock Responses**: Based on the request method, endpoint, and data, appropriate mock responses are returned.
3. **Maintaining State**: An in-memory store tracks the state of entities (like orders) across different API calls.
4. **Simulating Delays**: Small delays are added to simulate network latency for more realistic testing.

## In-Memory State Management

The key innovation in this approach is the use of an in-memory Map to track entity states:

```javascript
// In-memory store for order statuses
const orderStatuses = new Map();
```

This allows tests to:
- Track the status of each order independently
- Update statuses based on actions (validation, finalization, sending to radiology)
- Retrieve the correct status for each order in subsequent API calls

## Adding New Tests

To add a new test scenario:

1. Create a new file in the `tests/e2e` directory (e.g., `scenario-i-new-feature.js`)
2. Import the test helpers: `const helpers = require('./test-helpers');`
3. Define a main test function that uses the helper functions to simulate API calls
4. Export the test function: `module.exports = { runTest };`
5. Add the new scenario to the `run-database-e2e-tests.bat` script

## Extending the Test Helpers

To add support for new API endpoints:

1. Open `test-helpers-simple.js`
2. Find the `apiRequest` function
3. Add a new condition for your endpoint:

```javascript
// Check if this is a request for your new endpoint
if (method.toLowerCase() === 'get' && endpoint === '/your-new-endpoint') {
  return {
    success: true,
    // Add your mock response data here
  };
}
```

## Adding New Mock Data

To add new mock data:

1. Open `test-data/test-database.js`
2. Add your data to the appropriate section
3. Export the updated data

## Troubleshooting

If tests are failing, check:

1. **Console Output**: Look for error messages in the console
2. **Log Files**: Check the log files in `test-results/e2e` for detailed logs
3. **Mock Data**: Ensure the mock data matches what the tests expect
4. **API Responses**: Verify the mock API responses match the expected structure

## Best Practices

1. **Keep Tests Independent**: Each test should be able to run independently
2. **Use Unique IDs**: Generate unique IDs for entities to avoid conflicts
3. **Log Extensively**: Use the `log` function to log test actions for easier debugging
4. **Verify State Changes**: After each action, verify the state has changed as expected
5. **Handle Edge Cases**: Test both success and failure scenarios

## Further Documentation

For more detailed information about the database-driven testing approach, see:

- [Database-Driven Testing Implementation](../../Docs/database-driven-testing.md)
- [E2E Testing Strategy](../../Docs/test-documentation.md)