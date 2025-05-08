# Admin Finalization API Integration Guide

This document provides a comprehensive guide for frontend developers integrating with the Admin Finalization workflow API endpoints. It includes detailed information about request/response formats, error handling, and code examples.

## API Endpoints Overview

The Admin Finalization workflow uses the following key endpoints:

1. **GET /api/admin/orders/queue**: Retrieve the queue of orders awaiting admin finalization
2. **PUT /api/admin/orders/{orderId}/patient-info**: Update patient information
3. **PUT /api/admin/orders/{orderId}/insurance-info**: Update insurance information
4. **POST /api/admin/orders/{orderId}/paste-summary**: Process pasted EMR summary text
5. **POST /api/admin/orders/{orderId}/paste-supplemental**: Process pasted supplemental documentation
6. **POST /api/admin/orders/{orderId}/send-to-radiology-fixed**: Send the order to radiology

## Authentication

All endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer {token}
```

## Detailed Endpoint Documentation

### 1. Get Admin Order Queue

**Endpoint:** `GET /api/admin/orders/queue`

**Description:** Retrieves a list of orders awaiting administrative finalization.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `sortBy` (optional): Field to sort by (default: 'created_at')
- `sortOrder` (optional): Sort direction ('asc' or 'desc', default: 'desc')
- `status` (optional): Filter by status (default: 'pending_admin')
- `search` (optional): Search term for patient name or order ID
- `startDate` (optional): Filter by start date (ISO format)
- `endDate` (optional): Filter by end date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": 123,
        "patientName": "John Doe",
        "patientDateOfBirth": "1980-01-01",
        "patientGender": "male",
        "modalityType": "MRI",
        "cptCode": "70551",
        "cptDescription": "MRI brain without contrast",
        "icd10Codes": ["G43.909", "R51.9"],
        "clinicalIndication": "45-year-old male with chronic headaches...",
        "status": "pending_admin",
        "createdAt": "2025-04-25T10:30:00Z",
        "signedAt": "2025-04-25T10:35:00Z",
        "signedByUser": {
          "id": 456,
          "firstName": "Jane",
          "lastName": "Smith",
          "role": "physician"
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  }
}
```

### 2. Update Patient Information

**Endpoint:** `PUT /api/admin/orders/{orderId}/patient-info`

**Description:** Updates patient information for an order.

**Path Parameters:**
- `orderId`: The ID of the order to update

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "message": "Patient information updated successfully",
  "data": {
    "orderId": 123,
    "patientInfo": {
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
  }
}
```

### 3. Update Insurance Information

**Endpoint:** `PUT /api/admin/orders/{orderId}/insurance-info`

**Description:** Updates insurance information for an order.

**Path Parameters:**
- `orderId`: The ID of the order to update

**Request Body:**
```json
{
  "insurerName": "Blue Cross Blue Shield",
  "policyNumber": "XYZ123456789",
  "groupNumber": "BCBS-GROUP-12345",
  "policyHolderName": "John Doe",
  "policyHolderRelationship": "self",
  "policyHolderDateOfBirth": "1980-01-01",
  "secondaryInsurerName": "Aetna",
  "secondaryPolicyNumber": "ABC987654321",
  "secondaryGroupNumber": "AETNA-GROUP-67890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Insurance information updated successfully",
  "data": {
    "orderId": 123,
    "insuranceInfo": {
      "insurerName": "Blue Cross Blue Shield",
      "policyNumber": "XYZ123456789",
      "groupNumber": "BCBS-GROUP-12345",
      "policyHolderName": "John Doe",
      "policyHolderRelationship": "self",
      "policyHolderDateOfBirth": "1980-01-01",
      "secondaryInsurerName": "Aetna",
      "secondaryPolicyNumber": "ABC987654321",
      "secondaryGroupNumber": "AETNA-GROUP-67890"
    }
  }
}
```

### 4. Process EMR Summary

**Endpoint:** `POST /api/admin/orders/{orderId}/paste-summary`

**Description:** Processes pasted EMR summary text to extract patient and insurance information.

**Path Parameters:**
- `orderId`: The ID of the order to update

**Request Body:**
```json
{
  "pastedText": "PATIENT INFORMATION\n------------------\nName: John Smith\nDOB: 01/15/1975\nGender: Male\nAddress: 123 Main Street, Apt 4B\nCity: Boston\nState: MA\nZip: 02115\nPhone: (617) 555-1234\nEmail: john.smith@example.com\n\nINSURANCE INFORMATION\n-------------------\nPrimary Insurance: Blue Cross Blue Shield\nPolicy Number: XYZ123456789\nGroup Number: BCBS-GROUP-12345\nPolicy Holder: John Smith\nRelationship to Patient: Self\n\nMEDICAL HISTORY\n-------------\nAllergies: Penicillin, Sulfa drugs\nCurrent Medications: Lisinopril 10mg daily, Metformin 500mg twice daily\nPast Medical History: Hypertension (diagnosed 2018), Type 2 Diabetes (diagnosed 2019)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "EMR summary processed successfully",
  "data": {
    "orderId": 123,
    "extractedData": {
      "patientInfo": {
        "firstName": "John",
        "lastName": "Smith",
        "addressLine1": "123 Main Street, Apt 4B",
        "city": "Boston",
        "state": "MA",
        "zipCode": "02115",
        "phoneNumber": "(617) 555-1234",
        "email": "john.smith@example.com"
      },
      "insuranceInfo": {
        "insurerName": "Blue Cross Blue Shield",
        "policyNumber": "XYZ123456789",
        "groupNumber": "BCBS-GROUP-12345",
        "policyHolderName": "John Smith",
        "policyHolderRelationship": "self"
      }
    }
  }
}
```

### 5. Process Supplemental Documentation

**Endpoint:** `POST /api/admin/orders/{orderId}/paste-supplemental`

**Description:** Processes pasted supplemental documentation.

**Path Parameters:**
- `orderId`: The ID of the order to update

**Request Body:**
```json
{
  "pastedText": "Lab Results:\nCreatinine: 0.9 mg/dL (Normal)\nGFR: 95 mL/min (Normal)\nPrior Imaging: MRI Brain 2024-01-15 - No acute findings"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Supplemental documentation processed successfully",
  "data": {
    "orderId": 123,
    "recordId": 456
  }
}
```

### 6. Send to Radiology

**Endpoint:** `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`

**Description:** Finalizes an order and sends it to the connected radiology organization. This operation consumes one credit from the organization's balance.

**Path Parameters:**
- `orderId`: The ID of the order to send to radiology

**Request Body:** Empty object `{}`

**Response:**
```json
{
  "success": true,
  "message": "Order sent to radiology successfully",
  "order": {
    "id": 607,
    "status": "pending_radiology",
    "updated_at": "2025-04-22T16:30:45.123Z"
  }
}
```

**Implementation Status:**
- **Status:** Working
- **Tested With:** test-send-to-radiology.js

**Error Responses:**

1. Invalid Order ID:
```json
{
  "success": false,
  "message": "Invalid order ID"
}
```

2. Order Not Found:
```json
{
  "success": false,
  "message": "Order 123 not found"
}
```

3. Invalid Order Status:
```json
{
  "success": false,
  "message": "Order 123 is not in pending_admin status"
}
```

4. Incomplete Patient Information:
```json
{
  "success": false,
  "message": "Patient information is incomplete. City, state, and zip code are required."
}
```

5. Insufficient Credits:
```json
{
  "success": false,
  "message": "Insufficient credits to send order to radiology",
  "code": "INSUFFICIENT_CREDITS",
  "orderId": 123,
  "currentBalance": 0,
  "requiredCredits": 1,
  "billingUrl": "/billing"
}
```

## The Database Connection Issue

The original "Send to Radiology" endpoint (`POST /api/admin/orders/{orderId}/send-to-radiology`) had an issue with database connections. The system uses a dual-database architecture for HIPAA compliance:

1. **PHI Database**: Contains Protected Health Information (patient data, orders, clinical indications)
2. **Main Database**: Contains non-PHI data (organizations, users, credit balances)

The issue was that the endpoint was using a single database connection (PHI) to try to access tables in both databases. This resulted in errors like:

```
relation "organizations" does not exist
```

A new endpoint was created to fix this issue: `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`. This endpoint properly uses both database connections and maintains the same request/response format as the original endpoint.

## Code Examples

### Complete Workflow Example

```javascript
// Step 1: Get admin queue
async function getAdminQueue(token, page = 1, limit = 20) {
  try {
    const response = await fetch(`/api/admin/orders/queue?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch admin queue:', error);
    throw error;
  }
}

// Step 2: Process EMR summary
async function processEmrSummary(token, orderId, emrText) {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/paste-summary`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pastedText: emrText })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to process EMR summary:', error);
    throw error;
  }
}

// Step 3: Update patient information (if needed)
async function updatePatientInfo(token, orderId, patientInfo) {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/patient-info`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patientInfo)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to update patient info:', error);
    throw error;
  }
}

// Step 4: Update insurance information (if needed)
async function updateInsuranceInfo(token, orderId, insuranceInfo) {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/insurance-info`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(insuranceInfo)
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to update insurance info:', error);
    throw error;
  }
}

// Step 5: Add supplemental documentation (if needed)
async function addSupplementalDocs(token, orderId, supplementalText) {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/paste-supplemental`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pastedText: supplementalText })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to add supplemental docs:', error);
    throw error;
  }
}

// Step 6: Send to radiology with credit check
async function sendToRadiologyWithCreditCheck(token, orderId) {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/send-to-radiology-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.status === 402) {
      // Handle insufficient credits
      const errorData = await response.json();
      console.error('Insufficient credits:', errorData.message);
      // Show purchase credits dialog
      return { 
        success: false, 
        needCredits: true,
        currentBalance: errorData.currentBalance,
        requiredCredits: errorData.requiredCredits,
        billingUrl: errorData.billingUrl
      };
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to send to radiology:', error);
    throw error;
  }
}

// Complete workflow function
async function completeAdminFinalization(token, orderId, emrText, supplementalText) {
  try {
    // Step 1: Process EMR summary
    const summaryResult = await processEmrSummary(token, orderId, emrText);
    if (!summaryResult.success) {
      throw new Error(`Failed to process EMR summary: ${summaryResult.message}`);
    }
    
    // Step 2: Add supplemental docs (if provided)
    if (supplementalText) {
      const docsResult = await addSupplementalDocs(token, orderId, supplementalText);
      if (!docsResult.success) {
        throw new Error(`Failed to add supplemental docs: ${docsResult.message}`);
      }
    }
    
    // Step 3: Send to radiology
    const radiologyResult = await sendToRadiologyWithCreditCheck(token, orderId);
    if (!radiologyResult.success) {
      if (radiologyResult.needCredits) {
        // Show purchase credits dialog
        showPurchaseCreditsDialog(radiologyResult.currentBalance, radiologyResult.requiredCredits, radiologyResult.billingUrl);
        return { success: false, needCredits: true };
      }
      throw new Error(`Failed to send to radiology: ${radiologyResult.message}`);
    }
    
    return {
      success: true,
      orderId,
      message: 'Order successfully finalized and sent to radiology'
    };
  } catch (error) {
    console.error('Admin finalization failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
```

## Implementation Considerations

1. **Error Handling**: Implement robust error handling, especially for credit-related errors
2. **User Experience**: Provide clear feedback to users about the status of each step
3. **Validation**: Validate input data before sending to the API
4. **Credit Management**: Handle insufficient credits gracefully
5. **Performance**: Consider implementing caching for the queue data

## Related Documentation

- [Workflow Guide](./workflow-guide.md): Comprehensive end-to-end workflow guide
- [Implementation Details](./implementation-details.md): Backend implementation details
- [Database Architecture](./database-architecture.md): Details on the dual-database architecture
- [Testing Reference](./testing-reference.md): References to test files and testing guidelines