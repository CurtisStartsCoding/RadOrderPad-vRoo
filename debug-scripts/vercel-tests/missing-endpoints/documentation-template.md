# API Endpoint Documentation Template

Use this template to document each endpoint after running the tests. Copy this template for each endpoint and fill in the details based on the test results.

## Endpoint: [METHOD] [PATH]

**Description:** [Brief description of what the endpoint does]

**Authentication:** Required ([roles that can access this endpoint])

**Request Parameters:**
- `[paramName]` ([type], [required/optional]): [description]
- ...

**Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2",
  ...
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    ...
  }
}
```

**Error Responses:**
- [status code] [error name]: [description]
- ...

**Usage Notes:**
- [Important information about using this endpoint]
- ...

**Implementation Status:**
- **Status:** [Working/Not Working/Partially Working]
- **Tested With:** [test script name]
- **Issues:** [any issues encountered during testing]

---

## Example: POST /api/organizations/mine/locations

**Description:** Adds a new location to the current user's organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Request Body:**
```json
{
  "name": "Test Location",
  "address_line1": "123 Test St",
  "city": "Testville",
  "state": "TS",
  "zip_code": "12345"
}
```

**Response:**
```json
{
  "success": true,
  "location": {
    "id": 5,
    "name": "Test Location",
    "address_line1": "123 Test St",
    "city": "Testville",
    "state": "TS",
    "zip_code": "12345",
    "organization_id": 1,
    "created_at": "2025-04-22T14:01:54.123Z",
    "updated_at": "2025-04-22T14:01:54.123Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 400 Bad Request: If the request body is missing required fields
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to add a new location to the organization.
- The location will be associated with the organization ID from the user's token.
- All locations for an organization can be retrieved using the GET /api/organizations/mine/locations endpoint.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-all-missing-endpoints.js
- **Issues:** None