# Connection Approval API

This document describes the implementation of the connection approval endpoint, which allows an admin of the target organization to approve a pending connection request.

## Endpoint Details

- **URL**: `/api/connections/{relationshipId}/approve`
- **Method**: `POST`
- **Auth Required**: Yes
- **Permissions Required**: `admin_referring` or `admin_radiology`

## Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| relationshipId | number | The ID of the relationship to approve (from URL path) |

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Connection request approved successfully",
  "relationshipId": 123
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid relationship ID |
| 401 | Unauthorized - User not authenticated |
| 403 | Forbidden - User not authorized |
| 404 | Relationship not found, not authorized, or not in pending status |
| 500 | Internal server error |

## Implementation Details

The connection approval process follows these steps:

1. **Authentication & Authorization**: Verify the user is authenticated and has the required admin role.

2. **Validation**: Validate the relationship ID from the request parameters.

3. **Database Transaction**:
   - Begin a transaction
   - Fetch the relationship record, ensuring it's in 'pending' status and the user's organization is the target
   - Update the relationship status to 'active' and set the approved_by_id
   - Commit the transaction

4. **Notification**:
   - Send an email notification to the initiating organization
   - Handle notification errors gracefully (log but don't fail the transaction)

5. **Response**:
   - Return a success response with the relationship ID

## Error Handling

- If the relationship is not found, not in pending status, or the user's organization is not the target, a 404 error is returned.
- Database errors are caught, logged, and a 500 error is returned.
- Notification errors are logged but don't cause the transaction to fail.

## Testing

The endpoint can be tested using the `test-connection-approve.bat` or `test-connection-approve.sh` script, which requires:

1. A valid admin token (admin_referring or admin_radiology)
2. A pending relationship where the user's organization is the target

The test script will:
- Make a POST request to the endpoint
- Verify a 200 OK response
- Display the response data

## Related Endpoints

- `GET /api/connections` - List all connections
- `POST /api/connections` - Request a new connection
- `GET /api/connections/requests` - List pending incoming requests
- `POST /api/connections/{relationshipId}/reject` - Reject a connection request
- `DELETE /api/connections/{relationshipId}` - Terminate an active connection