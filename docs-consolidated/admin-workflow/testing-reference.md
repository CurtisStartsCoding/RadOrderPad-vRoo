# Admin Finalization Testing Reference

This document provides a reference guide to the test files and testing approach for the Admin Finalization workflow. It includes information about test scripts, test data, and testing guidelines.

## Test Files Location

The test files for the Admin Finalization workflow are located in the following directories:

1. **Main Test Scripts**: `all-backend-tests/scripts/`
2. **Batch Files**: `all-backend-tests/`
3. **Test Data**: `all-backend-tests/test-data/`

## Key Test Files

### 1. Test Admin Paste Summary

**File**: `all-backend-tests/scripts/test-admin-paste-summary.js`

This script tests the `POST /api/admin/orders/{orderId}/paste-summary` endpoint, which processes pasted EMR text and extracts patient and insurance information.

**Key Test Cases**:
- Test with valid order ID and EMR text
- Test with invalid order ID
- Test with missing pasted text

**Sample EMR Text**:
```
PATIENT INFORMATION
------------------
Name: John Smith
DOB: 01/15/1975
Gender: Male
Address: 123 Main Street, Apt 4B
City: Boston
State: MA
Zip: 02115
Phone: (617) 555-1234
Email: john.smith@example.com

INSURANCE INFORMATION
-------------------
Primary Insurance: Blue Cross Blue Shield
Policy Number: XYZ123456789
Group Number: BCBS-GROUP-12345
Policy Holder: John Smith
Relationship to Patient: Self

MEDICAL HISTORY
-------------
Allergies: Penicillin, Sulfa drugs
Current Medications: Lisinopril 10mg daily, Metformin 500mg twice daily
Past Medical History: Hypertension (diagnosed 2018), Type 2 Diabetes (diagnosed 2019)
```

### 2. Test Admin Paste Supplemental

**File**: `all-backend-tests/scripts/test-admin-paste-supplemental.js`

This script tests the `POST /api/admin/orders/{orderId}/paste-supplemental` endpoint, which processes pasted supplemental documentation.

**Key Test Cases**:
- Test with valid order ID and supplemental text
- Test with invalid order ID
- Test with missing pasted text

**Sample Supplemental Text**:
```
Lab Results:
Creatinine: 0.9 mg/dL (Normal)
GFR: 95 mL/min (Normal)
Prior Imaging: MRI Brain 2024-01-15 - No acute findings
```

### 3. Test Admin Patient Info

**File**: `all-backend-tests/scripts/test-admin-patient-info.js`

This script tests the `PUT /api/admin/orders/{orderId}/patient-info` endpoint, which updates patient information.

**Key Test Cases**:
- Test with valid order ID and patient information
- Test with invalid order ID
- Test with missing required fields

**Sample Patient Information**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-01",
  "gender": "male",
  "addressLine1": "123 Main St",
  "addressLine2": "Apt 4B",
  "city": "Boston",
  "state": "MA",
  "zipCode": "02115",
  "phoneNumber": "(617) 555-1234",
  "email": "john.doe@example.com",
  "mrn": "MRN12345"
}
```

### 4. Test Admin Insurance Info

**File**: `all-backend-tests/scripts/test-admin-insurance-info.js`

This script tests the `PUT /api/admin/orders/{orderId}/insurance-info` endpoint, which updates insurance information.

**Key Test Cases**:
- Test with valid order ID and insurance information
- Test with invalid order ID
- Test with missing required fields

**Sample Insurance Information**:
```json
{
  "insurerName": "Blue Cross Blue Shield",
  "policyNumber": "XYZ123456789",
  "groupNumber": "BCBS-GROUP-12345",
  "policyHolderName": "John Doe",
  "policyHolderRelationship": "self",
  "policyHolderDateOfBirth": "1980-01-01"
}
```

### 5. Test Admin Send to Radiology

**File**: `all-backend-tests/scripts/test-admin-send-to-radiology.js`

This script tests the `POST /api/admin/orders/{orderId}/send-to-radiology-fixed` endpoint, which finalizes an order and sends it to the radiology organization.

**Key Test Cases**:
- Test with valid order ID
- Test with invalid order ID
- Test with order in wrong status
- Test with incomplete patient information
- Test with insufficient credits

### 6. Comprehensive Test Script

**File**: `all-backend-tests/working-tests-4.bat`

This batch file runs all the admin finalization tests in sequence, providing a comprehensive test of the entire workflow.

**Test Sequence**:
1. Generate admin staff token
2. Test paste summary endpoint
3. Test paste supplemental endpoint
4. Test patient info endpoint
5. Test insurance info endpoint
6. Test send to radiology endpoint

## Working Order IDs

Based on testing, the following order IDs work with the admin finalization endpoints:

- 600
- 601
- 603
- 604
- 609
- 612

These IDs are known to work with the paste-supplemental, patient-info, and insurance-info endpoints, even though they may not be in pending_admin status.

## Test Data

The test data for the Admin Finalization workflow includes:

1. **Sample EMR Text**: Located in the test scripts
2. **Sample Supplemental Text**: Located in the test scripts
3. **Sample Patient Information**: Located in the test scripts
4. **Sample Insurance Information**: Located in the test scripts

## Testing Guidelines

### 1. Prerequisites

Before running the tests, ensure that:

1. The backend server is running
2. The database is properly set up
3. The test user tokens are available in the `tokens` directory

### 2. Running Individual Tests

To run an individual test, use the following command:

```bash
node all-backend-tests/scripts/test-admin-paste-summary.js
```

### 3. Running All Tests

To run all admin finalization tests, use the following command:

```bash
cd all-backend-tests
working-tests-4.bat
```

### 4. Interpreting Test Results

The test scripts output detailed information about each test case, including:

1. Request details
2. Response status
3. Response data
4. Success or failure indication

A successful test will show:

```
✅ Test passed: EMR summary processed successfully
```

A failed test will show:

```
❌ Test failed: Unexpected response
```

### 5. Common Issues

1. **Token Expiration**: If the token has expired, generate a new one using the token generation script
2. **Database Connection**: Ensure that both PHI and Main databases are accessible
3. **Order Status**: Some endpoints require the order to be in a specific status
4. **Credit Balance**: The send-to-radiology endpoint requires the organization to have sufficient credits

### 6. Writing New Tests

When writing new tests for the Admin Finalization workflow, follow these guidelines:

1. **Use the Existing Structure**: Follow the structure of the existing test scripts
2. **Test Both Success and Error Cases**: Include tests for both valid and invalid inputs
3. **Use Descriptive Names**: Use descriptive names for test functions and variables
4. **Include Detailed Logging**: Log request and response details for debugging
5. **Handle Errors Gracefully**: Catch and log errors properly

## Test Coverage

The current test suite covers the following aspects of the Admin Finalization workflow:

1. **API Endpoints**: All endpoints are tested
2. **Input Validation**: Various input scenarios are tested
3. **Error Handling**: Error cases are tested
4. **Database Interactions**: Database operations are verified
5. **Credit Consumption**: Credit consumption is tested

## Related Documentation

- [Workflow Guide](./workflow-guide.md): Comprehensive end-to-end workflow guide
- [API Integration](./api-integration.md): API details and integration guide
- [Implementation Details](./implementation-details.md): Backend implementation details
- [Database Architecture](./database-architecture.md): Details on the dual-database architecture