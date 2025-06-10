# Order Finalization Testing

This document provides a comprehensive guide to testing the order finalization process in the RadOrderPad API backend.

## Overview

The order finalization process is a critical workflow in the RadOrderPad system that involves:
1. Validating dictation text
2. Creating an order
3. Finalizing the order with signature data
4. Storing the order in the database

Testing this process thoroughly is essential to ensure the system functions correctly and handles edge cases appropriately.

## Test File Locations

The test files for order finalization are organized in the following locations:

### Main Test Files
- `tests/test-order-finalization.js` - Primary test for the new combined order creation and finalization endpoint
- `tests/batch/test-order-finalization.js` - Batch version with more comprehensive test cases

### Batch Scripts
- `run-order-test.bat` - Simple script to run the main order finalization test
- `tests/batch/run-order-finalization-tests.bat` - Script to run the batch version of tests
- `all-backend-tests/working-tests-4.bat` - Comprehensive test suite that includes order finalization tests

## How to Run the Tests

### Prerequisites
Before running the tests, you need to:
1. Ensure the API server is running
2. Generate authentication tokens for the test users

### Running Individual Tests

To run the main order finalization test:

```bash
# From the project root
run-order-test.bat
```

To run the batch version with more test cases:

```bash
# From the project root
cd tests/batch
run-order-finalization-tests.bat
```

### Running as Part of the Test Suite

The order finalization tests are included in the comprehensive test suite:

```bash
# From the project root
cd all-backend-tests
working-tests-4.bat
```

## Test Dependencies and Setup

### Token Generation

The tests require a valid JWT token for authentication. The token is generated using:
- `all-backend-tests/utilities/generate-all-role-tokens.js`

The token is stored in:
- `all-backend-tests/tokens/physician-token.txt`

And loaded as an environment variable:
```javascript
const jwtToken = process.env.PHYSICIAN_TOKEN;
```

### API Configuration

The tests are configured to use the production API by default:
```javascript
const API_BASE_URL = 'https://api.radorderpad.com/api';
```

To test against a different environment, modify the API_URL environment variable in the batch files.

## Test Cases

### Main Test File (`tests/test-order-finalization.js`)

This file tests the new combined order creation and finalization endpoint (`POST /api/orders`).

Test case:
1. Validate dictation (stateless)
2. Create and finalize order in one step
3. Verify the response contains a valid order ID

### Batch Test File (`tests/batch/test-order-finalization.js`)

This file contains more comprehensive test cases:

1. **Standard Finalization**:
   - Validate dictation (stateless)
   - Create an order with "pending_admin" status
   - Finalize the order with signature data
   - Verify the response

2. **Temporary Patient Creation**:
   - Validate dictation (stateless)
   - Create an order with "pending_admin" status
   - Finalize with temporary patient data
   - Verify the response and patient creation

## Database Interactions

The tests interact with several database tables:

1. `orders` - Stores the main order information
2. `order_history` - Tracks events in the order lifecycle
3. `validation_attempts` - Records validation attempts
4. `document_uploads` - Stores signature data

The `signature-handling.ts` file handles the insertion of signature data into the `document_uploads` table:

```typescript
const uploadResult = await client.query(
  `INSERT INTO document_uploads (
    order_id,
    patient_id,
    user_id,
    file_path,
    filename,
    file_size,
    mime_type,
    document_type,
    uploaded_at
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, NOW()
  ) RETURNING id`,
  [
    orderId,
    patientId,
    userId,
    filePath,
    'signature.png',
    1024, // Default file size for signature (1KB)
    'image/png',
    'signature',
  ]
);
```

## Common Issues and Troubleshooting

### Token Expiration

If tests fail with authentication errors, the JWT token may have expired. Regenerate the tokens:

```bash
cd all-backend-tests
node utilities/generate-all-role-tokens.js
```

### Database Column Mismatches

A common issue is mismatches between code and database schema. If you encounter errors like:

```
column "uploaded_by_user_id" of relation "document_uploads" does not exist
```

Check the actual database schema and update the code to match the correct column names.

### API Endpoint Changes

If the API endpoints change, update the endpoint URLs in the test files:

```javascript
const VALIDATION_ENDPOINT = `${API_BASE_URL}/orders/validate`;
const ORDER_CREATION_ENDPOINT = `${API_BASE_URL}/orders`;
```

## Manual Verification Steps

After running the tests, you may want to manually verify:

1. Check that the order status in the database is "pending_admin"
2. Check that order_history has 'order_created' and 'order_signed' events for the order
3. Check that validation_attempts has a record for the final validation
4. Check that document_uploads has a record for the signature

## Integration with CI/CD

These tests can be integrated into a CI/CD pipeline by:

1. Setting up the necessary environment variables
2. Running the tests as part of the build process
3. Failing the build if any tests fail

Example GitHub Actions workflow:

```yaml
name: API Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: windows-latest
    
    steps:
    - uses: actions/checkout@v2
    - name: Set up Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '14'
    - name: Install dependencies
      run: npm install
    - name: Generate tokens
      run: cd all-backend-tests && node utilities/generate-all-role-tokens.js
    - name: Run order finalization tests
      run: run-order-test.bat
```

## Conclusion

Thorough testing of the order finalization process is critical to ensure the RadOrderPad system functions correctly. By following the procedures outlined in this document, you can verify that the order creation, validation, and finalization processes work as expected.