# Missing Endpoints Test Scripts

This directory contains test scripts for verifying and documenting the missing API endpoints identified in our API documentation review.

## Overview

The scripts in this directory are designed to test the API endpoints that were identified in the missing-endpoints-report.md file. These endpoints are part of important workflows but were not fully documented in our API documentation.

## Files

- **test-all-missing-endpoints.js**: The main test script that tests all missing endpoints in sequence.
- **run-missing-endpoints-test.bat**: A batch file to easily run the test script.

## How to Run

1. Make sure you have Node.js installed.
2. Install the required dependencies:
   ```
   npm install axios jsonwebtoken
   ```
3. (Optional) Update the placeholder IDs in the test script with valid values from your environment:
   - USER_ID_ADMIN_STAFF - A real admin_staff user ID
   - USER_ID_PHYSICIAN - A real physician user ID
   - USER_ID_ADMIN_REFERRING - A real admin_referring user ID
   - USER_ID_ADMIN_RADIOLOGY - A real admin_radiology user ID
   - USER_ID_SCHEDULER - A real scheduler user ID
   - ORG_ID_REFERRING - A real referring organization ID
   - ORG_ID_RADIOLOGY - A real radiology organization ID
   - VALID_ORDER_ID_PENDING_ADMIN - An order ID that is in 'pending_admin' state
   - VALID_PATIENT_ID - A real patient ID associated with the above order
   - VALID_LOCATION_ID - A real location ID for the user's organization
   - VALID_RELATIONSHIP_ID_PENDING - A real PENDING relationship ID
   - VALID_RELATIONSHIP_ID_ACTIVE - A real ACTIVE relationship ID

4. Run the batch file:
   ```
   run-missing-endpoints-test.bat
   ```
   
   Or run the script directly:
   ```
   node test-all-missing-endpoints.js
   ```

The script uses a hardcoded JWT_SECRET for testing purposes. In a real production scenario, you would want to use your actual JWT secret.

## Interpreting Results

The script will output the results of each test, indicating whether it passed or failed:

- ✅ PASSED: The endpoint exists and returned a successful response.
- ❌ FAILED: The endpoint returned an error.

For each test, the script will log:
- The HTTP method and path
- The status code
- The response data or error message

## Endpoints Tested

The script tests the following endpoints:

1. **Registration**
   - POST /api/auth/register (skipped by default to avoid creating new data)

2. **Organization Location Management**
   - POST /api/organizations/mine/locations

3. **User Management**
   - POST /api/users/invite (skipped by default to avoid sending emails)
   - POST /api/users/accept-invitation (skipped by default as it requires a valid token)

4. **Upload Management**
   - POST /api/uploads/presigned-url
   - POST /api/uploads/confirm

5. **Admin Order Management**
   - GET /api/admin/orders/queue
   - POST /api/admin/orders/{orderId}/paste-summary
   - POST /api/admin/orders/{orderId}/paste-supplemental
   - PUT /api/admin/orders/{orderId}/patient-info
   - PUT /api/admin/orders/{orderId}/insurance-info

6. **Connection Management**
   - GET /api/connections/requests
   - POST /api/connections/{relationshipId}/approve
   - POST /api/connections/{relationshipId}/reject
   - DELETE /api/connections/{relationshipId}

## Documentation

After running the tests, use the results to update the API documentation in the frontend-explanation/API_IMPLEMENTATION_GUIDE directory. Each endpoint should be documented with:

- HTTP method and path
- Description
- Authentication requirements
- Request parameters/body
- Response format
- Error responses
- Usage notes

## Note on Validation Endpoint

The validation endpoint (/api/orders/validate) is already extensively documented in the order-management.md file, as it's the most critical endpoint for assigning CPT and ICD-10 codes based on clinical indications.