# File Upload Service Tests

This directory contains automated tests for the RadOrderPad File Upload Service.

## Overview

The tests verify the core functionality of the File Upload Service, which uses AWS S3 presigned URLs for secure file uploads. The tests focus on the API endpoints:

- `POST /api/uploads/presigned-url` - Generates presigned URLs for client-side uploads
- `POST /api/uploads/confirm` - Confirms successful uploads and records them in the database

## Test Cases

1. **Get Presigned URL - Success**
   - Verifies that a valid request returns a presigned URL and file key
   - Confirms the response status is 200 and contains the expected data

2. **Get Presigned URL - Invalid File Type**
   - Verifies that requests with disallowed file types are rejected
   - Confirms the response status is 400 and contains an appropriate error message

3. **Get Presigned URL - File Too Large**
   - Verifies that requests for files exceeding size limits are rejected
   - Confirms the response status is 400 and contains an appropriate error message

4. **Confirm Upload - Success** (Skipped in automated tests)
   - This test is skipped because it requires an actual order in the database
   - Documents how the confirmation process would be tested

5. **Process Signature** (Skipped in automated tests)
   - This test is skipped because it requires an actual order in the database
   - Documents how the signature upload process would be tested

## Running the Tests

### Prerequisites

- Node.js and npm installed
- RadOrderPad API server running on `http://localhost:3000`
- Valid JWT token for authentication

### Windows

```
.\run-upload-tests.bat
```

### Unix/Linux/macOS

```
chmod +x run-upload-tests.sh
./run-upload-tests.sh
```

## Test Results

The tests will output detailed results, including:

- Success/failure status for each test
- Response data for debugging
- Skipped tests with explanations

## Notes

- The tests use a valid JWT token generated with the `generate-test-token.js` script
- Some tests are skipped because they require actual data in the database
- The tests verify the API endpoints, not the actual S3 uploads (which would require AWS credentials)