# Role-Based Tests

This directory contains comprehensive test suites organized by user roles in the RadOrderPad system.

## Available Role Tests

### Physician Role Tests

The physician role tests (`physician-role-tests.js`) verify all functionality available to physician users in the RadOrderPad system. These tests use real API calls to ensure accurate validation of the system's functionality.

For detailed information about the physician role tests, see [Physician Role README](./physician-role-README.md).

### Trial Role Tests

The trial role tests (`trial-role-tests.js`) verify all functionality available to trial users in the RadOrderPad system. These tests are designed to be resilient and can run in both real API mode and simulation mode, ensuring that the tests can complete even when facing authentication or API availability issues.

For detailed information about the trial role tests, see [Trial Role README](./trial-role-README.md).

## Running the Tests

Each role has its own batch file for running the tests:

```
# To run physician role tests
cd all-backend-tests/role-tests
run-physician-role-tests.bat

# To run trial role tests
cd all-backend-tests/role-tests
run-trial-role-tests.bat
```

The tests can be run independently from other test suites.

## Test Coverage

The role-based tests provide comprehensive coverage of all user roles and their associated functionality in the RadOrderPad system. Each test suite is designed to verify the specific capabilities and constraints of its respective role.

For a detailed breakdown of the test coverage for each role, refer to the role-specific README files.