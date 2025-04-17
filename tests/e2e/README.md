# Comprehensive Workflow Testing Suite

This directory contains end-to-end test cases and tools for testing the complete workflow of the RadOrderPad system, with particular focus on validation failures, physician overrides, admin updates, and radiology group handoffs.

## Overview

The testing suite consists of:

1. **Test Cases**: Detailed scenarios that test specific aspects of the system
2. **Test Runner**: JavaScript code to automate the execution of test cases
3. **Execution Scripts**: Batch and shell scripts to run the tests easily

## Test Cases

The test cases are defined in `comprehensive_workflow_test_cases.md` and cover a wide range of scenarios:

- Insufficient clinical information with physician override
- Inappropriate modality selection with physician override
- Missing laterality information with admin correction
- Contrast contraindication with protocol modification
- Rare disease scenarios with specialized protocols
- Pediatric cases with radiation concerns
- Pregnant patients with critical findings
- Duplicate study requests
- Complex multi-system disorders
- Emergent situations with ongoing updates
- Registration and onboarding for physician and radiology groups

Each test case includes:
- Initial order details
- Expected validation results
- Physician override information
- Admin processing steps
- Expected radiology outcome

## Test Scenarios

The following test scenarios are implemented:

1. **Scenario A**: Full Physician Order (Successful Validation)
2. **Scenario B**: Full Physician Order (Override)
3. **Scenario C**: Admin Finalization
4. **Scenario D**: Radiology View/Update
5. **Scenario E**: Connection Request
6. **Scenario F**: User Invite
7. **Scenario G**: File Upload
8. **Scenario H**: Comprehensive Registration and Onboarding

## Running the Tests

### Prerequisites

1. Ensure the RadOrderPad application is running
2. Set up the required environment variables in your `.env` file:
   - `API_BASE_URL` (default: http://localhost:3000)
   - `API_PATH` (default: /api)
   - `TEST_PHYSICIAN_TOKEN` - JWT token for a physician user
   - `TEST_ADMIN_TOKEN` - JWT token for an admin user
   - `TEST_RADIOLOGIST_TOKEN` - JWT token for a radiologist user

### Running All Tests

#### Windows
```
.\run-e2e-tests.bat
```

#### Unix/Mac
```
./run-e2e-tests.sh
```

### Running a Specific Test

To run a specific test case (e.g., test case #3):

#### Windows
```
.\run-e2e-tests.bat 3
```

#### Unix/Mac
```
./run-e2e-tests.sh 3
```

### Running Registration and Onboarding Tests

To run only the registration and onboarding tests:

#### Windows
```
.\run-registration-onboarding-tests.bat
```

#### Unix/Mac
```
./run-registration-onboarding-tests.sh
```

## Test Results

Test results are saved in the `test-results` directory with timestamps in the filename. Each result file contains:

- Overall test status (pass/fail)
- Detailed information about each step
- Any errors encountered
- Validation results
- Radiology outcomes

## Manual Testing

For manual testing, follow these steps for each test case:

1. **Initial Order Entry:**
   - Enter the dictation exactly as written
   - Submit for validation

2. **Validation Review:**
   - Verify the validation status matches expected result
   - Check that feedback and suggested codes match expectations

3. **Physician Override:**
   - Enter the override reason and notes
   - Submit the override

4. **Admin Processing:**
   - As admin user, access the overridden order
   - Add the specified additional information
   - Process the order according to standard workflow

5. **Radiology Verification:**
   - Login as radiologist
   - Verify the order appears in the correct queue
   - Confirm the override label is clearly visible
   - Verify all clinical context is available (original dictation + override + admin notes)
   - Check that any attached documents or prior results are accessible

## Adding New Test Cases

To add new test cases:

1. Add the test case description to `comprehensive_workflow_test_cases.md`
2. Add the test case definition to the `TEST_CASES` array in `run_comprehensive_tests.js`

## Troubleshooting

If tests are failing, check:

1. Application is running and accessible
2. JWT tokens are valid and have appropriate permissions
3. API endpoints are correctly configured
4. Database has necessary test data

For detailed error information, check the console output and the test results JSON files.