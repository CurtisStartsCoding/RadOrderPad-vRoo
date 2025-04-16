# Quick Guide: Database-Driven Testing for RadOrderPad

This guide provides a quick reference for using the database-driven testing approach implemented for RadOrderPad.

## Running Tests

### Running All Tests

To run all database-driven E2E tests:

```bash
# Windows
batch-files\run-database-e2e-tests.bat

# Linux/macOS
bash batch-files/run-database-e2e-tests.sh
```

### Running Individual Test Scenarios

To run a specific test scenario:

```bash
# Windows
node tests\e2e\scenario-a-successful-validation.js

# Linux/macOS
node tests/e2e/scenario-a-successful-validation.js
```

Available test scenarios:
- `scenario-a-successful-validation.js`: Full Physician Order - Successful Validation
- `scenario-b-validation-override.js`: Full Physician Order - Override
- `scenario-c-admin-finalization.js`: Admin Finalization
- `scenario-d-radiology-workflow.js`: Radiology View/Update
- `scenario-e-connection-request.js`: Connection Request
- `scenario-f-user-invite.js`: User Invite
- `scenario-g-file-upload.js`: File Upload
- `scenario-h-registration-onboarding.js`: Registration and Onboarding

### Testing Individual Components

For testing specific components or fixes:

```bash
# Test Scenario A fix
node tests\e2e\test-scenario-a-fix.js

# Test Scenario C fix
node tests\e2e\test-scenario-c-fix.js
```

## Key Files

- `test-helpers-simple.js`: Main helper file with mock API responses
- `test-data/test-database.js`: Mock data used by tests
- `tests/e2e/README-database-driven.md`: Detailed documentation

## How It Works

The database-driven testing approach uses:

1. **In-Memory State Tracking**: Each entity (order, user, etc.) maintains its state independently
2. **Mock API Responses**: All API requests return predefined responses
3. **Scenario-Specific Logic**: Different test scenarios get appropriate responses

## Adding New Tests

1. Create a new file in `tests/e2e/` directory
2. Import the test helpers:
   ```javascript
   const helpers = require('./test-helpers');
   ```
3. Define a test function that uses the helper functions
4. Run your test with Node.js

## Extending the Framework

### Adding New API Endpoints

To support new API endpoints, modify `test-helpers-simple.js`:

```javascript
// Check if this is a request for your new endpoint
if (method.toLowerCase() === 'get' && endpoint === '/your-new-endpoint') {
  return {
    success: true,
    // Add your mock response data here
  };
}
```

### Adding New Mock Data

To add new mock data, modify `test-data/test-database.js`.

## Troubleshooting

If tests are failing:

1. Check console output for error messages
2. Verify mock data matches what tests expect
3. Ensure in-memory state is being updated correctly
4. Check for conflicts between test scenarios

## Best Practices

1. Keep tests independent
2. Use unique IDs for entities
3. Log extensively for easier debugging
4. Verify state changes after each action
5. Test both success and failure scenarios

## Further Documentation

For more detailed information:

- [Database-Driven Testing Implementation](./database-driven-testing.md)
- [Testing Improvements Summary](./testing-improvements-summary.md)