# RadOrderPad Database-Driven Testing Approach

This document describes the new database-driven testing approach for RadOrderPad end-to-end tests.

## Overview

The database-driven testing approach uses a centralized test database with consistent, well-structured test data. This ensures that all tests use the same data and that the data matches the expected API response formats.

## Key Components

### 1. Test Database

The test database (`tests/e2e/test-data/test-database.js`) contains structured data for:

- Organizations (referring and radiology)
- Users (admins, physicians, schedulers)
- Patients with complete demographic information
- Test dictations with expected CPT and ICD-10 codes
- Orders in various states (pending, validated, finalized)
- Connections between organizations
- User invitations
- Document uploads

### 2. Test Helpers

The improved test helpers (`tests/e2e/test-helpers-improved.js`) use the test database to provide consistent mock responses for API requests. This ensures that all tests receive the same data structure, making the tests more reliable and easier to maintain.

### 3. Test Scenarios

The test scenarios use the test helpers to simulate various workflows in the RadOrderPad system. Each scenario focuses on a specific workflow, such as:

- Scenario A: Full physician order with successful validation
- Scenario B: Physician order with validation override
- Scenario C: Admin finalization workflow
- Scenario D: Radiology view and scheduling
- Scenario E: Connection requests between organizations
- Scenario F: User invitation and onboarding
- Scenario G: File upload and document management
- Scenario H: Registration and organization setup

## Benefits of the Database-Driven Approach

1. **Consistency**: All tests use the same data, ensuring consistent results.
2. **Reliability**: Tests are less likely to fail due to inconsistent or missing data.
3. **Maintainability**: Changes to the data structure only need to be made in one place.
4. **Readability**: Tests are easier to understand because they use well-defined data.
5. **Efficiency**: Tests run faster because they don't need to create new data for each test.

## How It Works

1. The test database defines all the data needed for the tests.
2. The test helpers use the test database to provide mock responses for API requests.
3. The test scenarios use the test helpers to simulate workflows.
4. The tests verify that the workflows work as expected.

## Example

Here's a simple example of how to use the database-driven approach:

```javascript
// Import the test database
const testDatabase = require('./test-data/test-database');

// Get a referring organization
const refOrg = testDatabase.organizations.referring_a;

// Get a physician
const physician = testDatabase.users.physician_a;

// Get a patient
const patient = testDatabase.patients.patient_a;

// Get a dictation
const dictation = testDatabase.dictations.lumbar_mri;

// Use these to simulate a workflow
console.log(`Physician ${physician.firstName} ${physician.lastName} is creating an order for patient ${patient.firstName} ${patient.lastName}`);
console.log(`Dictation: "${dictation.text.substring(0, 50)}..."`);
console.log(`Expected CPT code: ${dictation.expectedCptCode}`);
console.log(`Expected ICD-10 codes: ${dictation.expectedIcd10Codes.join(', ')}`);
```

## Implementation

The database-driven approach is implemented in the following files:

- `tests/e2e/test-data/test-database.js`: The centralized test database.
- `tests/e2e/test-helpers-improved.js`: The improved test helpers.
- `tests/e2e/test-database-approach.js`: A simple test that demonstrates the database-driven approach.
- `batch-files/run-database-test.bat`: A batch file to run the database-driven test.

## Next Steps

1. Update all test scenarios to use the database-driven approach.
2. Add more test data to the test database as needed.
3. Implement a proper mock API server that uses the test database.
4. Add more detailed validation in the test scenarios.
5. Create a reporting system that summarizes test results.

## Conclusion

The database-driven testing approach provides a solid foundation for testing the RadOrderPad system. It ensures that all components work together correctly while maintaining a consistent test environment.