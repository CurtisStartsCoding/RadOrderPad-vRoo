# Debug API Endpoints

**Last Updated:** June 15, 2025  
**Required Role:** `super_admin`

## Overview

The debug endpoints provide powerful troubleshooting and data inspection capabilities for super administrators. All endpoints require authentication with a super_admin JWT token.

## Authentication

All debug endpoints require:
- Valid JWT token with `super_admin` role
- Bearer token in Authorization header

Example:
```bash
curl -X GET https://api.radorderpad.com/api/debug/organizations \
  -H "Authorization: Bearer YOUR_SUPER_ADMIN_TOKEN"
```

## Endpoints

### 1. List All Organizations
Get all organizations in the system with their types and status.

```
GET /api/debug/organizations
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": 1,
      "name": "Premier Medical Group",
      "type": "referring_practice",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### 2. List All Users
Get all users with their organization associations.

```
GET /api/debug/users
```

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": [
    {
      "id": 1,
      "email": "dr.smith@premier.com",
      "first_name": "John",
      "last_name": "Smith",
      "role": "physician",
      "organization_id": 1,
      "organization_name": "Premier Medical Group",
      "organization_type": "referring_practice"
    }
  ]
}
```

### 3. Get Recent Orders
Get recent orders with filtering options.

```
GET /api/debug/orders?limit=50
GET /api/debug/orders?orderNumber=ORD-2025-0001
GET /api/debug/orders?physicianId=123
```

**Query Parameters:**
- `limit` - Number of orders to return (default: 50)
- `orderNumber` - Find specific order by number
- `physicianId` - Filter by physician user ID

**Response:**
```json
{
  "success": true,
  "count": 50,
  "data": [
    {
      "id": 1234,
      "order_number": "ORD-2025-0001",
      "status": "pending_admin",
      "created_at": "2025-06-14T15:30:00Z",
      "patient_id": 5678,
      "referring_organization_id": 1,
      "radiology_organization_id": null,
      "created_by_user_id": 123,
      "priority": "routine",
      "target_facility_id": null,
      "patient_name": "Jane Doe"
    }
  ]
}
```

### 4. Get Order Clinical Records
Get all clinical records associated with an order.

```
GET /api/debug/orders/{orderId}/clinical-records
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "orderId": 1234,
  "data": [
    {
      "id": 1,
      "patient_id": 5678,
      "order_id": 1234,
      "record_type": "supplemental_docs_paste",
      "content_preview": "Patient presents with...",
      "content_length": 2500,
      "added_by_user_id": 123,
      "added_at": "2025-06-14T15:35:00Z"
    }
  ]
}
```

### 5. Get Complete Order Details
Get comprehensive order information including patient, insurance, and clinical records.

```
GET /api/debug/orders/{orderId}/complete
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 1234,
    "order_number": "ORD-2025-0001",
    "status": "pending_admin",
    "modality": "MRI",
    "body_part": "Brain",
    "laterality": "bilateral",
    "clinical_summary": "Patient presents with chronic headaches...",
    "final_validation_status": "appropriate",
    "final_compliance_score": 8
  },
  "patient": {
    "id": 5678,
    "mrn": "PAT123456",
    "first_name": "Jane",
    "last_name": "Doe",
    "date_of_birth": "1985-03-15",
    "gender": "female",
    "phone_number": "555-0123",
    "email": "jane.doe@email.com"
  },
  "insurance": [
    {
      "id": 1,
      "patient_id": 5678,
      "is_primary": true,
      "insurer_name": "Blue Cross Blue Shield",
      "policy_number": "BCB123456",
      "group_number": "GRP789",
      "plan_type": "PPO",
      "policy_holder_name": "Jane Doe",
      "policy_holder_relationship": "self",
      "verification_status": "verified"
    }
  ],
  "clinicalRecords": [
    {
      "id": 1,
      "record_type": "supplemental_docs_paste",
      "content": "Full clinical record content...",
      "added_at": "2025-06-14T15:35:00Z"
    }
  ],
  "validationLogs": [
    {
      "id": 1,
      "llm_provider": "openai",
      "model_name": "gpt-4",
      "prompt_tokens": 1500,
      "completion_tokens": 500,
      "total_tokens": 2000,
      "latency_ms": 2500,
      "status": "success",
      "created_at": "2025-06-14T15:32:00Z"
    }
  ]
}
```

### 6. Get Order Update History
Track when order components were last updated.

```
GET /api/debug/orders/{orderId}/update-history
```

**Response:**
```json
{
  "success": true,
  "orderId": 1234,
  "updateHistory": [
    {
      "table_name": "patient",
      "timestamp": "2025-06-14T16:45:00Z",
      "action": "Patient info updated"
    },
    {
      "table_name": "insurance",
      "timestamp": "2025-06-14T16:44:00Z",
      "action": "Insurance updated"
    },
    {
      "table_name": "order",
      "timestamp": "2025-06-14T16:43:00Z",
      "action": "Order updated"
    }
  ]
}
```

### 7. Get Patient Insurance Records
Get all insurance records for a patient.

```
GET /api/debug/patients/{patientId}/insurance
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "patientId": 5678,
  "data": [
    {
      "id": 1,
      "patient_id": 5678,
      "is_primary": true,
      "insurer_name": "Blue Cross Blue Shield",
      "policy_number": "BCB123456",
      "group_number": "GRP789",
      "plan_type": "PPO",
      "policy_holder_name": "Jane Doe",
      "policy_holder_relationship": "self",
      "policy_holder_date_of_birth": "1985-03-15",
      "verification_status": "verified",
      "created_at": "2025-06-14T16:44:00Z",
      "updated_at": "2025-06-14T16:44:00Z"
    }
  ]
}
```

### 8. Get Organization Connections
Get all active organization relationships.

```
GET /api/debug/connections
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "organization_id": 1,
      "related_organization_id": 2,
      "relationship_type": "partner",
      "status": "active",
      "created_at": "2025-01-20T10:00:00Z",
      "organization_name": "Premier Medical Group",
      "organization_type": "referring_practice",
      "related_organization_name": "Advanced Imaging Center",
      "related_organization_type": "radiology_group"
    }
  ]
}
```

### 9. Get Organization Connections with Locations
Get connected organizations and their locations for a specific organization.

```
GET /api/debug/organizations/{orgId}/connections
```

**Response:**
```json
{
  "success": true,
  "organizationId": 1,
  "connections": [
    {
      "organizationId": 2,
      "organizationName": "Advanced Imaging Center",
      "organizationType": "radiology_group",
      "locations": [
        {
          "locationId": 10,
          "locationName": "Main Campus"
        },
        {
          "locationId": 11,
          "locationName": "North Branch"
        }
      ]
    }
  ]
}
```

### 10. Get Trial User Statistics
Get comprehensive statistics about trial users.

```
GET /api/debug/trial-users/stats
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_trial_users": 250,
    "active_users": 180,
    "maxed_out_users": 45,
    "total_validations": 3500,
    "avg_validations_per_user": 14.0,
    "max_validations_by_user": 25
  },
  "topUsers": [
    {
      "id": 1,
      "email": "trial.user@example.com",
      "first_name": "John",
      "last_name": "Trial",
      "specialty": "Internal Medicine",
      "validation_count": 25,
      "max_validations": 25,
      "created_at": "2025-05-01T10:00:00Z",
      "last_validation_at": "2025-06-14T15:00:00Z"
    }
  ]
}
```

### 11. Get Trial User Activity
Get detailed activity for a specific trial user.

```
GET /api/debug/trial-users/{userId}/activity
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "trial.user@example.com",
    "first_name": "John",
    "last_name": "Trial",
    "validation_count": 25,
    "max_validations": 25,
    "created_at": "2025-05-01T10:00:00Z"
  },
  "recentValidations": [
    {
      "id": 100,
      "created_at": "2025-06-14T15:00:00Z",
      "llm_provider": "openai",
      "model_name": "gpt-4",
      "prompt_tokens": 1200,
      "completion_tokens": 400,
      "total_tokens": 1600,
      "latency_ms": 2000,
      "status": "success"
    }
  ],
  "dailyActivity": [
    {
      "date": "2025-06-14",
      "validations": 5,
      "avg_latency": 2100,
      "tokens_used": 8000
    }
  ]
}
```

### 12. Get Physician Orders
Get order history and statistics for a specific physician.

```
GET /api/debug/physicians/{physicianId}/orders?limit=100
```

**Response:**
```json
{
  "success": true,
  "physician": {
    "id": 123,
    "email": "dr.smith@premier.com",
    "first_name": "John",
    "last_name": "Smith",
    "organization_id": 1,
    "role": "physician"
  },
  "statistics": {
    "total_orders": 150,
    "completed_orders": 120,
    "overridden_orders": 5,
    "appropriate_orders": 145,
    "inappropriate_orders": 5,
    "avg_compliance_score": 8.5
  },
  "recentOrders": [
    {
      "id": 1234,
      "order_number": "ORD-2025-0001",
      "status": "completed",
      "created_at": "2025-06-14T15:30:00Z",
      "modality": "MRI",
      "body_part": "Brain",
      "laterality": "bilateral",
      "final_validation_status": "appropriate",
      "final_compliance_score": 9,
      "overridden": false,
      "patient_name": "Jane Doe"
    }
  ]
}
```

### 13. Execute Custom Query
Execute SELECT queries on either database (with safety restrictions).

```
POST /api/debug/query
```

**Request Body:**
```json
{
  "query": "SELECT id, name, type FROM organizations WHERE type = 'radiology_group'",
  "database": "main"
}
```

**Parameters:**
- `query` - SQL SELECT query (must start with SELECT)
- `database` - Either "main" (non-PHI) or "phi" (PHI database)

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 2,
      "name": "Advanced Imaging Center",
      "type": "radiology_group"
    }
  ]
}
```

**Restrictions:**
- Only SELECT queries allowed
- No INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, or TRUNCATE
- Queries are logged for audit purposes

## Usage Examples

### Example 1: Find Order by Number
```bash
curl -X GET "https://api.radorderpad.com/api/debug/orders?orderNumber=ORD-2025-0001" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 2: Get Complete Order Details
```bash
curl -X GET "https://api.radorderpad.com/api/debug/orders/1234/complete" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 3: Check Trial User Stats
```bash
curl -X GET "https://api.radorderpad.com/api/debug/trial-users/stats" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 4: Custom Database Query
```bash
curl -X POST "https://api.radorderpad.com/api/debug/query" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "SELECT COUNT(*) as order_count, status FROM orders GROUP BY status",
    "database": "phi"
  }'
```

## Security Notes

1. **Authentication Required**: All endpoints require super_admin role
2. **Audit Logging**: All debug endpoint access is logged
3. **Read-Only**: No data modification allowed (except through custom queries which are restricted)
4. **PHI Access**: Some endpoints access PHI data - use responsibly
5. **Rate Limiting**: Debug endpoints are subject to standard API rate limits

## Common Troubleshooting Scenarios

### Check Order Data Persistence
1. Get order by number: `/api/debug/orders?orderNumber=ORD-XXX`
2. Get complete details: `/api/debug/orders/{id}/complete`
3. Check update history: `/api/debug/orders/{id}/update-history`

### Verify Organization Connections
1. List all connections: `/api/debug/connections`
2. Get specific org connections: `/api/debug/organizations/{id}/connections`

### Monitor Trial User Usage
1. Get overall stats: `/api/debug/trial-users/stats`
2. Check specific user: `/api/debug/trial-users/{id}/activity`

### Database Inspection
Use the custom query endpoint to run SELECT queries for specific troubleshooting needs.