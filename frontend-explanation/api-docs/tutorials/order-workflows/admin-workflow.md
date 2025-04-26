# Admin Finalization Workflow

This guide covers the administrative finalization workflow in RadOrderPad, which allows administrative staff to add EMR context and send orders to radiology after they've been signed by physicians.

## Overview

The Admin Finalization workflow is a critical part of the RadOrderPad system that bridges the gap between physician order creation and radiology processing. After a physician validates and signs an order, it enters the admin queue where administrative staff can:

1. Add or update patient demographic information
2. Add or update insurance information
3. Add supplemental documentation from the EMR
4. Review all information for accuracy
5. Send the order to the connected radiology organization

## Prerequisites

- You must have an `admin_staff` or `admin_referring` role
- Your organization must be active
- Your organization must have sufficient credits
- Your organization must have an active connection with at least one radiology organization

## Workflow Steps

### Step 1: Access the Admin Queue

First, retrieve the list of orders awaiting administrative finalization:

```javascript
const getAdminQueue = async (token) => {
  try {
    const response = await fetch('/api/admin/orders/queue', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to fetch admin queue:', error);
    throw error;
  }
};
```

#### Request Parameters

The queue endpoint supports pagination and filtering:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 20) |
| sortBy | string | No | Field to sort by (default: 'created_at') |
| sortOrder | string | No | Sort direction ('asc' or 'desc', default: 'desc') |
| status | string | No | Filter by status (default: 'pending_admin') |

#### Response Structure

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "12345",
        "patientFirstName": "Jane",
        "patientLastName": "Doe",
        "patientDateOfBirth": "1980-01-01",
        "patientGender": "female",
        "modalityType": "MRI",
        "cptCode": "70551",
        "cptDescription": "MRI brain without contrast",
        "icd10Codes": ["G43.909", "R51.9"],
        "icd10Descriptions": ["Migraine, unspecified, not intractable, without status migrainosus", "Headache, unspecified"],
        "clinicalIndication": "45-year-old female with chronic headaches...",
        "status": "pending_admin",
        "createdAt": "2025-04-25T10:30:00Z",
        "signedAt": "2025-04-25T10:35:00Z",
        "signedByUser": {
          "id": "67890",
          "firstName": "John",
          "lastName": "Smith",
          "role": "physician"
        }
      }
      // Additional orders...
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

### Step 2: Update Patient Information

Update the patient's demographic information:

```javascript
const updatePatientInfo = async (orderId, patientInfo, token) => {
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
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update patient info:', error);
    throw error;
  }
};
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| firstName | string | Yes | Patient's first name |
| lastName | string | Yes | Patient's last name |
| dateOfBirth | string | Yes | Patient's date of birth (YYYY-MM-DD) |
| gender | string | Yes | Patient's gender (male, female, other) |
| addressLine1 | string | No | Patient's address line 1 |
| addressLine2 | string | No | Patient's address line 2 |
| city | string | No | Patient's city |
| state | string | No | Patient's state |
| zipCode | string | No | Patient's ZIP code |
| phoneNumber | string | No | Patient's phone number |
| email | string | No | Patient's email address |
| mrn | string | No | Medical Record Number |

### Step 3: Update Insurance Information

Update the patient's insurance information:

```javascript
const updateInsuranceInfo = async (orderId, insuranceInfo, token) => {
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
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to update insurance info:', error);
    throw error;
  }
};
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| insurerName | string | No | Name of the insurance company |
| policyNumber | string | No | Insurance policy number |
| groupNumber | string | No | Insurance group number |
| policyHolderName | string | No | Name of the policy holder |
| policyHolderRelationship | string | No | Relationship to the patient (self, spouse, child, other) |
| policyHolderDateOfBirth | string | No | Policy holder's date of birth (YYYY-MM-DD) |
| secondaryInsurerName | string | No | Name of the secondary insurance company |
| secondaryPolicyNumber | string | No | Secondary insurance policy number |
| secondaryGroupNumber | string | No | Secondary insurance group number |

### Step 4: Add Supplemental Documentation

Add supplemental documentation from the EMR:

```javascript
const addSupplementalDocumentation = async (orderId, supplementalText, token) => {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/paste-supplemental`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        supplementalText
      })
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to add supplemental documentation:', error);
    throw error;
  }
};
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| supplementalText | string | Yes | Supplemental documentation text from EMR |

### Step 5: Send to Radiology

Finally, send the order to the connected radiology organization:

```javascript
const sendToRadiology = async (orderId, token) => {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/send-to-radiology-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to send to radiology:', error);
    throw error;
  }
};
```

#### Response Structure

```json
{
  "success": true,
  "data": {
    "orderId": "12345",
    "status": "sent_to_radiology",
    "sentAt": "2025-04-25T11:00:00Z",
    "sentByUserId": "54321",
    "radiologyOrganizationId": "98765",
    "radiologyOrganizationName": "City Radiology Center",
    "creditsUsed": 1,
    "remainingCredits": 42
  }
}
```

## Database Interactions

The admin finalization process interacts with both databases:

### PHI Database
- Updates patient information in the `patients` table
- Updates insurance information in the `patient_insurance` table
- Stores supplemental documentation in the `patient_clinical_records` table
- Updates order status in the `orders` table
- Logs order history in the `order_history` table

### Main Database
- Checks and decrements the organization's credit balance in the `organizations` table
- Logs credit usage in the `credit_usage_logs` table

## Credit Management

The "Send to Radiology" operation consumes one credit from the organization's balance:

1. The system checks if the organization has sufficient credits
2. If sufficient, one credit is deducted from the balance
3. The credit usage is logged for billing transparency
4. If insufficient, a 402 Payment Required error is returned

## Error Handling

When working with admin finalization endpoints, be prepared to handle these common errors:

- **400 Bad Request**: Invalid input (e.g., missing required fields)
- **401 Unauthorized**: Missing or invalid authentication token
- **402 Payment Required**: Insufficient credits to send to radiology
- **403 Forbidden**: Insufficient permissions (non-admin role)
- **404 Not Found**: Order not found or not in expected state
- **500 Internal Server Error**: Server-side error

### Handling Insufficient Credits

```javascript
const sendToRadiologyWithCreditCheck = async (orderId, token) => {
  try {
    const response = await fetch(`/api/admin/orders/${orderId}/send-to-radiology-fixed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 402) {
      // Handle insufficient credits
      const errorData = await response.json();
      console.error('Insufficient credits:', errorData.message);
      // Redirect to billing page or show purchase credits dialog
      return { success: false, needCredits: true };
    }
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Failed to send to radiology:', error);
    throw error;
  }
};
```

## Best Practices

1. **Complete All Information**: Ensure all required patient and insurance information is complete
2. **Verify Accuracy**: Double-check all information before sending to radiology
3. **Include Relevant EMR Context**: Add all relevant supplemental documentation from the EMR
4. **Monitor Credit Balance**: Regularly check your organization's credit balance
5. **Process Orders Promptly**: Process orders in a timely manner to avoid delays in patient care

## Implementation Considerations

When implementing the admin finalization workflow, consider these technical aspects:

1. **Transaction Management**: The "Send to Radiology" operation involves both databases and requires careful transaction management
2. **Error Handling**: Implement robust error handling, especially for credit-related errors
3. **User Experience**: Provide clear feedback to users about the status of each step
4. **Performance**: The queue can potentially contain many orders, so implement efficient pagination and filtering
5. **Audit Trail**: Maintain a comprehensive audit trail of all actions for compliance purposes

## Conclusion

The Admin Finalization workflow is a critical bridge between physician order creation and radiology processing. By following the steps outlined in this guide, administrative staff can efficiently process orders and ensure they reach the appropriate radiology organization with all necessary information.