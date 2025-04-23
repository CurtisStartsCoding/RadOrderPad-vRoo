# Health Check

The health check endpoint provides a simple way to verify that the API is running and responding to requests.

## Health Check Endpoint

**Endpoint:** `GET /health`

**Description:** Checks if the API is running and returns basic status information.

**Authentication:** None required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-04-22T13:11:56.390Z"
}
```

**Usage Notes:**
- Use this endpoint to verify that the API is accessible and responding.
- The timestamp can be used to check server time synchronization.
- This endpoint is useful for monitoring systems to check the health of the API.
- Response time is typically under 100ms.
- This endpoint is not protected and does not require authentication.

## Implementation Status

- **Status:** Working
- **Tested With:** All test scripts confirm this endpoint is working correctly
- **Response Time:** Consistently fast (< 100ms)