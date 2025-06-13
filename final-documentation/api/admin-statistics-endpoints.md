# Admin Statistics and Export Endpoints

**Version:** 1.0  
**Last Updated:** June 13, 2025

## Overview

These endpoints provide order statistics and export functionality for both `admin_referring` and `admin_radiology` roles. The data returned is automatically filtered based on the user's role and organization.

## Endpoints

### 1. Get Order Statistics

Retrieves aggregated order statistics for the admin's organization.

**Endpoint:** `GET /api/admin/statistics/orders`

**Authorization:** Required - JWT token with role `admin_referring` or `admin_radiology`

**Response Filtering:**
- `admin_referring`: Shows orders created by their organization
- `admin_radiology`: Shows orders assigned to their organization

#### Request

```http
GET /api/admin/statistics/orders
Authorization: Bearer <admin_token>
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "total": 156,
    "byStatus": {
      "draft": 5,
      "pending_physician_signature": 3,
      "pending_admin": 12,
      "pending_radiology": 45,
      "scheduled": 38,
      "completed": 48,
      "cancelled": 5
    },
    "last7Days": 42,
    "last30Days": 156
  }
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Organization ID not found"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Access denied. This endpoint is only for admin users."
}
```

### 2. Export Orders to CSV

Exports orders to CSV format with optional filtering.

**Endpoint:** `POST /api/admin/orders/export`

**Authorization:** Required - JWT token with role `admin_referring` or `admin_radiology`

**Data Filtering:**
- `admin_referring`: Exports orders from their organization
- `admin_radiology`: Exports orders assigned to them

#### Request

```http
POST /api/admin/orders/export
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "all",              // Optional: Filter by status
  "dateFrom": "2025-05-01",     // Optional: Start date (YYYY-MM-DD)
  "dateTo": "2025-06-13",       // Optional: End date (YYYY-MM-DD)
  "limit": 1000                 // Optional: Max records (default 1000)
}
```

#### Success Response (200 OK)

Returns CSV file with headers:
- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="orders-export-2025-06-13.csv"`

CSV columns include:
- order_number
- status
- patient_name
- patient_dob
- patient_gender
- referring_physician_name
- referring_physician_npi
- modality
- body_part
- laterality
- clinical_indication
- final_cpt_code
- final_cpt_code_description
- icd10_codes
- icd10_descriptions
- created_at
- updated_at

#### Example CSV Output

```csv
order_number,status,patient_name,patient_dob,patient_gender,referring_physician_name,referring_physician_npi,modality,body_part,laterality,clinical_indication,final_cpt_code,final_cpt_code_description,icd10_codes,icd10_descriptions,created_at,updated_at
ORD-2025-00123,completed,"Doe, John",1970-05-15,M,"Dr. Smith",1234567890,CT,Chest,Bilateral,"Chest pain, rule out PE",71275,"CT angiography chest with contrast","R06.02, I26.99","Shortness of breath, Other pulmonary embolism",2025-06-10T14:30:00Z,2025-06-11T09:45:00Z
```

#### Error Responses

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Organization ID not found"
}
```

**403 Forbidden**
```json
{
  "success": false,
  "error": "Access denied. This endpoint is only for admin users."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to export orders"
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get order statistics
async function getOrderStats(token: string) {
  const response = await fetch('https://api.radorderpad.com/api/admin/statistics/orders', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  
  return response.json();
}

// Export orders for last 30 days
async function exportOrders(token: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const response = await fetch('https://api.radorderpad.com/api/admin/orders/export', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
      status: 'completed'
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to export orders');
  }
  
  // Handle CSV download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
```

### cURL Examples

```bash
# Get order statistics
curl -X GET https://api.radorderpad.com/api/admin/statistics/orders \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Export all orders
curl -X POST https://api.radorderpad.com/api/admin/orders/export \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "all", "limit": 500}' \
  -o orders-export.csv

# Export completed orders from last 7 days
curl -X POST https://api.radorderpad.com/api/admin/orders/export \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "dateFrom": "2025-06-06",
    "dateTo": "2025-06-13"
  }' \
  -o completed-orders.csv
```

## Notes

1. **Performance**: Large exports may take several seconds. Consider implementing pagination for very large datasets.

2. **Data Privacy**: Exported data contains PHI. Ensure proper handling and storage of downloaded files.

3. **Rate Limiting**: These endpoints may be subject to rate limiting to prevent abuse.

4. **Future Enhancements**:
   - Additional export formats (Excel, JSON)
   - More granular statistics (by physician, by modality)
   - Scheduled/automated exports
   - Email delivery of exports