# Admin Finalization API Integration Guide

**Date:** April 21, 2025  
**Author:** Roo  
**Status:** Complete

## Overview

This document provides a comprehensive guide for frontend developers integrating with the Admin Finalization workflow, specifically focusing on the "Send to Radiology" functionality. It includes detailed information about the API endpoints, the database connection issue that was fixed, and how to properly integrate with the fixed implementation.

## Admin Finalization Workflow

The Admin Finalization workflow allows administrative staff to add EMR context and send orders to radiology after they've been signed by physicians. The workflow consists of several steps:

1. **Access the Queue**: Admin staff access the queue of pending admin orders
2. **Add Patient Information**: Update patient demographics (address, city, state, zip code, etc.)
3. **Add Insurance Information**: Update insurance details if applicable
4. **Add Supplemental Documentation**: Paste any supplemental documentation from EMR
5. **Final Review**: Review all information for accuracy
6. **Send to Radiology**: Finalize the order and send it to the radiology group

## Database Architecture

The RadOrderPad system uses a dual-database architecture for HIPAA compliance:

1. **PHI Database**: Contains Protected Health Information (patient data, orders, clinical indications)
2. **Main Database**: Contains non-PHI data (organizations, users, credit balances)

This separation is critical for HIPAA compliance but requires careful handling of database connections in the backend.

## The Database Connection Issue

### Problem Description

The original "Send to Radiology" endpoint (`POST /api/admin/orders/{orderId}/send-to-radiology`) was failing with a 500 error and the message:

```
column "action" of relation "order_history" does not exist
```

This error occurred because:

1. The endpoint needed to interact with both databases:
   - PHI Database: Update order status and add order history
   - Main Database: Decrement organization credit balance

2. The implementation was using a single database connection (PHI) to try to access tables in both databases.

3. Additionally, it was using incorrect column names (`action` and `notes`) instead of the correct ones (`event_type` and `details`) for the order_history table.

### Root Cause

The issue was introduced during the Credit Consumption Refactoring (April 14, 2025):

- **Original Implementation**: Credit consumption occurred during validation, using the Main database connection
- **Refactored Implementation**: Credit consumption was moved to the send-to-radiology endpoint, but it was using the PHI database connection for all operations

## The Fixed Implementation

A new endpoint was created to fix these issues:

```
POST /api/admin/orders/{orderId}/send-to-radiology-fixed
```

### Key Improvements

1. **Dual Database Connections**: The fixed implementation properly uses both database connections:
   - PHI connection for patient/order data
   - Main connection for organization/credit data

2. **Transaction Management**: Both database connections use proper transaction handling:
   - BEGIN/COMMIT/ROLLBACK for both connections
   - Ensures data consistency across databases

3. **Column Name Correction**: Uses the correct column names (`event_type` and `details`) for the order_history table

### Implementation Details

The fixed implementation:

1. Gets separate database clients for PHI and Main databases
2. Begins transactions in both databases
3. Verifies order status and patient information completeness
4. Checks organization credit balance
5. Updates order status to 'pending_radiology'
6. Logs the action in order_history
7. Decrements the organization's credit balance
8. Logs credit usage
9. Commits both transactions (or rolls back both if any step fails)

## API Endpoint Details

### Send to Radiology (Fixed Implementation)

**Endpoint:** `POST /api/admin/orders/{orderId}/send-to-radiology-fixed`

**Authentication:** JWT token required (admin_staff role)

**Path Parameters:**
- `orderId` (number): The ID of the order to send to radiology

**Request Body:** Empty object `{}`

**Success Response:**
- Status Code: 200 OK
- Body:
```json
{
  "success": true,
  "orderId": 607,
  "message": "Order sent to radiology successfully"
}
```

**Error Responses:**

1. Invalid Order ID:
```json
{
  "message": "Invalid order ID"
}
```

2. Order Not Found:
```json
{
  "message": "Order 607 not found"
}
```

3. Invalid Order Status:
```json
{
  "message": "Order 607 is not in pending_admin status"
}
```

4. Incomplete Patient Information:
```json
{
  "message": "Patient information is incomplete. City, state, and zip code are required."
}
```

5. Insufficient Credits:
```json
{
  "message": "Insufficient credits to send order to radiology",
  "code": "INSUFFICIENT_CREDITS",
  "orderId": 607
}
```

## Frontend Integration

### Prerequisites

Before sending an order to radiology, ensure:

1. The order is in 'pending_admin' status
2. Patient information is complete (city, state, zip code at minimum)
3. The user has admin_staff role permissions

### Example Integration Code

```javascript
// Function to send order to radiology
async function sendOrderToRadiology(token, orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/send-to-radiology-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    // Parse response
    const data = await response.json();
    
    // Handle non-200 responses
    if (!response.ok) {
      // Special handling for insufficient credits
      if (response.status === 402) {
        // Show credit purchase UI
        showCreditPurchaseDialog(data.orderId);
        return { success: false, error: data.message, code: data.code };
      }
      
      return { success: false, error: data.message };
    }
    
    // Success case
    return { 
      success: true, 
      orderId: data.orderId,
      message: data.message
    };
  } catch (error) {
    console.error('Error sending order to radiology:', error);
    return { success: false, error: error.message };
  }
}

// Example usage in a React component
function SendToRadiologyButton({ orderId, token, onSuccess, onError }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = async () => {
    setIsLoading(true);
    
    try {
      const result = await sendOrderToRadiology(token, orderId);
      
      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error, result.code);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleClick} 
      disabled={isLoading}
      variant="primary"
    >
      {isLoading ? 'Sending...' : 'Send to Radiology'}
    </Button>
  );
}
```

### Error Handling

Pay special attention to these error cases:

1. **402 Payment Required**: This indicates insufficient credits. Show a UI for purchasing more credits.

2. **400 Bad Request**: Check if patient information is complete. You may need to redirect to the patient information form.

3. **403 Forbidden**: The user doesn't have admin_staff permissions.

4. **500 Server Error**: A server-side issue occurred. Show a generic error message and provide a way to retry.

## Complete Workflow Example

Here's a complete example of the admin finalization workflow:

```javascript
// Step 1: Update patient information
async function updatePatientInfo(token, orderId, patientInfo) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/patient-info`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(patientInfo)
  });
  
  return await response.json();
}

// Step 2: Update insurance information (if needed)
async function updateInsuranceInfo(token, orderId, insuranceInfo) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/insurance-info`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(insuranceInfo)
  });
  
  return await response.json();
}

// Step 3: Add supplemental documentation (if needed)
async function addSupplementalDocs(token, orderId, supplementalText) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/paste-supplemental`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: supplementalText })
  });
  
  return await response.json();
}

// Step 4: Send to radiology
async function sendToRadiology(token, orderId) {
  const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/send-to-radiology-fixed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  
  return await response.json();
}

// Complete workflow function
async function completeAdminFinalization(token, orderId, patientData, insuranceData, supplementalDocs) {
  try {
    // Step 1: Update patient info
    const patientResult = await updatePatientInfo(token, orderId, patientData);
    if (!patientResult.success) {
      throw new Error(`Failed to update patient info: ${patientResult.message}`);
    }
    
    // Step 2: Update insurance info (if provided)
    if (insuranceData) {
      const insuranceResult = await updateInsuranceInfo(token, orderId, insuranceData);
      if (!insuranceResult.success) {
        throw new Error(`Failed to update insurance info: ${insuranceResult.message}`);
      }
    }
    
    // Step 3: Add supplemental docs (if provided)
    if (supplementalDocs) {
      const docsResult = await addSupplementalDocs(token, orderId, supplementalDocs);
      if (!docsResult.success) {
        throw new Error(`Failed to add supplemental docs: ${docsResult.message}`);
      }
    }
    
    // Step 4: Send to radiology
    const radiologyResult = await sendToRadiology(token, orderId);
    if (!radiologyResult.success) {
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

## Testing the API

You can test the fixed implementation using the provided test script:

```javascript
// test-send-to-radiology-fixed.js
const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'https://radorderpad-fftrehu55-capecomas-projects.vercel.app/api';
const ORDER_ID = 607;

// Admin staff credentials
const ADMIN_STAFF_CREDENTIALS = {
  email: 'test.admin_staff@example.com',
  password: 'password123'
};

// Login and get token
async function login() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ADMIN_STAFF_CREDENTIALS)
  });
  
  const data = await response.json();
  return data.token;
}

// Test the fixed implementation
async function testFixedImplementation() {
  const token = await login();
  
  // Update patient info
  await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/patient-info`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      city: 'Springfield',
      state: 'IL',
      zip_code: '62704'
    })
  });
  
  // Send to radiology
  const response = await fetch(`${API_BASE_URL}/admin/orders/${ORDER_ID}/send-to-radiology-fixed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  
  const result = await response.json();
  console.log(result);
}

testFixedImplementation().catch(console.error);
```

## Conclusion

The fixed "Send to Radiology" implementation properly handles the dual-database architecture of the RadOrderPad system. By using separate database connections for PHI and non-PHI data, it maintains HIPAA compliance while ensuring data consistency through proper transaction management.

When integrating with this API, frontend developers should:

1. Ensure patient information is complete before sending to radiology
2. Handle the various error cases appropriately, especially insufficient credits
3. Update the UI to reflect the new order status after successful submission

For any questions or issues with the API integration, contact the RadOrderPad development team.