# Connection Management Details

This section covers endpoints related to managing connections between organizations in the RadOrderPad system.

## Get Connection Requests

**Endpoint:** `GET /api/connections/requests`

**Description:** Retrieves a list of pending incoming connection requests for the authenticated user's organization.

**Authentication:** Required (admin_referring, admin_radiology roles)

**Response:**
```json
{
  "requests": [
    {
      "id": 5,
      "initiatingOrgId": 3,
      "initiatingOrgName": "Test Referring Practice",
      "initiatedBy": "John Smith",
      "initiatorEmail": "john.smith@example.com",
      "notes": "We would like to establish a connection with your radiology group",
      "createdAt": "2025-04-22T14:28:44.148Z"
    }
  ]
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to display a list of pending incoming connection requests for the current organization.
- These are requests initiated by other organizations that are waiting for approval or rejection.
- Use this endpoint when implementing the connection requests management view.
- After retrieving the requests, you can use the approve or reject endpoints to respond to them.

**Implementation Details:**
- The endpoint queries the `organization_relationships` table in the Main database
- It looks for records where:
  - `related_organization_id` matches the authenticated user's organization ID
  - `status` is 'pending'
- The query uses LEFT JOIN with the organizations and users tables to get additional information
- LEFT JOIN is critical here to handle cases where user records might be null

**SQL Implementation Note:**
- Using LEFT JOIN instead of JOIN is important for this endpoint
- JOIN operations fail when there are null values in the joined tables
- LEFT JOIN preserves the main record even when joined tables have no matching records
- This is a common pattern needed when joining multiple tables where some relationships might be optional

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-connection-requests.js
- **Notes:** Successfully tested with production data

## Approve Connection Request

**Endpoint:** `POST /api/connections/{relationshipId}/approve`

**Description:** Approves a pending connection request.

**Authentication:** Required (admin_referring, admin_radiology roles)

**URL Parameters:**
- relationshipId: The ID of the relationship to approve

**Response:**
```json
{
  "success": true,
  "message": "Connection request approved successfully",
  "relationshipId": 1
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_referring or admin_radiology role
- 404 Not Found: If the relationship does not exist, the user is not authorized to approve it, or it is not in pending status
- 500 Internal Server Error: If there is a server error

**Usage Notes:**
- This endpoint is used to approve a pending connection request.
- The relationship must be in the "pending" status.
- The user's organization must be the target organization of the relationship.
- After approval, a notification is sent to the initiating organization.

**Implementation Details:**
- The endpoint uses a transaction to ensure data consistency
- It first checks if the relationship exists, is in pending status, and the user is authorized to approve it
- This is done using a single SQL query with multiple conditions:
  ```sql
  WHERE r.id = $1 AND r.related_organization_id = $2 AND r.status = 'pending'
  ```
- If the relationship is valid, it updates the status to 'active' and sets the approved_by_id
- Then it sends a notification to the initiating organization
- All operations are wrapped in a transaction to ensure atomicity

**Fixed Issues:**
- Previously, the endpoint was returning a 500 error due to improper SQL query implementation
- The issue was that the service was using a custom query to check if the relationship exists, but it wasn't using the imported GET_RELATIONSHIP_FOR_APPROVAL_QUERY constant
- The custom query only checked if the relationship exists by ID, but it didn't check if the related_organization_id matches the approvingOrgId or if the status is 'pending' in the SQL query itself
- Instead, it did these checks after fetching the relationship, which could lead to issues if the relationship doesn't exist or if it's not in the expected state
- The fix was to use the imported GET_RELATIONSHIP_FOR_APPROVAL_QUERY constant, which includes all necessary checks in a single SQL query

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-connection-approve.js
- **Notes:** Fixed 500 error issue and successfully tested with production data

## Reject Connection Request

**Endpoint:** `POST /api/connections/{relationshipId}/reject`

**Description:** Rejects a pending connection request.

**Authentication:** Required (admin_radiology role)

**URL Parameters:**
- relationshipId: The ID of the relationship to reject

**Response:**
```json
{
  "success": true,
  "message": "Connection request rejected",
  "relationship": {
    "id": 1,
    "sourceOrganizationId": 3,
    "sourceOrganizationName": "ABC Medical Group",
    "targetOrganizationId": 2,
    "targetOrganizationName": "XYZ Radiology",
    "status": "rejected",
    "updatedAt": "2025-04-22T12:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_radiology role
- 404 Not Found: If the relationship does not exist
- 500 Internal Server Error: If the relationship is not in pending status or other server error

**Usage Notes:**
- This endpoint is used to reject a pending connection request.
- The relationship must be in the "pending" status.
- The user's organization must be the target organization of the relationship.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-connection-endpoints-production.js
- **Notes:** Successfully tested with production data

## Delete Connection

**Endpoint:** `DELETE /api/connections/{relationshipId}`

**Description:** Deletes an active connection between organizations.

**Authentication:** Required (admin_radiology role)

**URL Parameters:**
- relationshipId: The ID of the relationship to delete

**Response:**
```json
{
  "success": true,
  "message": "Connection deleted successfully"
}
```

**Error Responses:**
- 401 Unauthorized: If the user is not authenticated
- 403 Forbidden: If the user does not have the admin_radiology role
- 404 Not Found: If the relationship does not exist
- 500 Internal Server Error: If the relationship is not in active status or other server error

**Usage Notes:**
- This endpoint is used to delete an active connection between organizations.
- The relationship must be in the "active" status.
- The user's organization must be either the source or target organization of the relationship.

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-connection-endpoints-production.js
- **Notes:** Successfully tested with production data